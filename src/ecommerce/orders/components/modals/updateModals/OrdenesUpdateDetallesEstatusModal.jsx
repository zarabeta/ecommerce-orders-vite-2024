// Importar de material-ui
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel, FormHelperText, FormControl, Switch, Stack
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

// Importar React
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {OrdenesDetallesEstatusValues} from "../../../helpers/OrdenesDetallesEstatusValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";

const OrdenesUpdateDetallesEstatusModal = ({
                                               OrdenesUpdateDetallesEstatusShowModal,
                                               setOrdenesUpdateDetallesEstatusShowModal,
                                               datosSeleccionados,
                                               datosSecSubdocDetalles,
                                               dataRow
                                           }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Hook para refrescar el componente
    const [refresh, setRefresh] = useState(false);

    // Hook para valores de labels y etiquetas
    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdTipoEstatusOK: dataRow?.IdTipoEstatusOK || "",
            Actual: dataRow?.Actual === "S" ? true : false,
            Observacion: dataRow?.Observacion || "",
        },
        validationSchema: Yup.object({
            IdTipoEstatusOK: Yup.string().required("Campo requerido"),
            Actual: Yup.boolean().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            //FIC: mostramos el Loading.
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {
                // Desestructurar datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                //Actualizar la informacion del subdocumento
                for (let i = 0; i < ordenExistente.detalle_ps.length; i++) {
                    if (ordenExistente.detalle_ps[i].IdProdServOK === datosSecSubdocDetalles.IdProdServOK && ordenExistente.detalle_ps[i].IdPresentaOK === datosSecSubdocDetalles.IdPresentaOK) {

                        for (let j = 0; j < ordenExistente.detalle_ps[i].estatus.length; j++) {
                            if (ordenExistente.detalle_ps[i].estatus[j].IdTipoEstatusOK === dataRow.IdTipoEstatusOK) {
                                ordenExistente.detalle_ps[i].estatus[j].Actual = values.Actual ? "S" : "N";
                                ordenExistente.detalle_ps[i].estatus[j].Observacion = values.Observacion;
                            }
                        }
                    }
                }

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion actualizada exitosamente");
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("Ocurrio un error al actualizar la informacion. Intente de nuevo.");
            }
            //FIC: ocultamos el Loading.
            setLoading(false);
        },
    });

    //FIC: props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    async function getDataSelectOrdenesType2() {
        try {
            const Labels = await GetAllLabels();
            const OrdenesTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdTipoEstatusFisicoProdServ"
            );
            const valores = OrdenesTypes.valores; // Obtenemos el array de valores
            const IdValoresOK = valores.map((valor, index) => ({
                IdValorOK: valor.Valor,
                key: valor.IdValorOK, // Asignar el índice como clave temporal
            }));
            setOrdenesValuesLabel(IdValoresOK);
            //console.log(OrdenesValuesLabel)
        } catch (e) {
            console.error("Error al obtener Etiquetas para Tipos Giros de Institutos:", e);
        }
    }

    useEffect(() => {
        getDataSelectOrdenesType2();
    }, []);

    return (
        <Dialog
            open={OrdenesUpdateDetallesEstatusShowModal}
            onClose={() => setOrdenesUpdateDetallesEstatusShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar Detalle-Estatus de la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <InputLabel htmlFor="dynamic-select-tipo-orden">Estatus Fisico del Producto/Servicio</InputLabel>
                    <Select
                        id="dynamic-select-tipo-orden"
                        value={formik.values.IdTipoEstatusOK}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="IdTipoEstatusOK"
                        aria-label="IdTipoEstatusOK"
                    >
                        {OrdenesValuesLabel.map((option, index) => (
                            <MenuItem key={option.IdValorOK} value={`IdTipoEstatusFisicoProdServ-${option.key}`}>
                                {option.IdValorOK}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="Actual"
                                checked={formik.values.Actual}  // Suponiendo que formik.values.Actual es un booleano
                                onChange={(event) => {
                                    formik.setFieldValue('Actual', event.target.checked);
                                }}
                                disabled={!!mensajeExitoAlert}
                            />
                        }
                        label="Actual*"
                        error={formik.touched.Actual && Boolean(formik.errors.Actual)}
                        helperText={formik.touched.Actual && formik.errors.Actual}
                    />
                    <TextField
                        id="Observacion"
                        label="Observacion*"
                        multiline
                        rows={4}
                        maxRows={10}
                        value={formik.values.Observacion}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Observacion &&
                            Boolean(formik.errors.Observacion)
                        }
                        helperText={
                            formik.touched.Observacion && formik.errors.Observacion
                        }
                    />
                </DialogContent>
                {/* FIC: Aqui van las acciones del usuario como son las alertas o botones */}
                <DialogActions
                    sx={{display: 'flex', flexDirection: 'row'}}
                >
                    <Box m="auto">
                        {mensajeErrorAlert && (
                            <Alert severity="error">
                                <b>¡ERROR!</b> ─ {mensajeErrorAlert}
                            </Alert>
                        )}
                        {mensajeExitoAlert && (
                            <Alert severity="success">
                                <b>¡ÉXITO!</b> ─ {mensajeExitoAlert}
                            </Alert>
                        )}
                    </Box>
                    {/* FIC: Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => {
                            setOrdenesUpdateDetallesEstatusShowModal(false);
                            // reestablecer los valores de mensajes de exito y error
                            setMensajeErrorAlert(null);
                            setMensajeExitoAlert(null);

                            // Limpiar los valores del formulario
                            formik.resetForm();
                        }}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar. */}
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                        variant="contained"
                        type="submit"
                        disabled={formik.isSubmitting || !!mensajeExitoAlert || Loading}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default OrdenesUpdateDetallesEstatusModal;