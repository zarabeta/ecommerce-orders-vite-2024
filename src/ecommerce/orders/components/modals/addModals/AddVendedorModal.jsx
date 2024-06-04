// Importar react components
import { useEffect, useState } from "react";
// Importar material ui components
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert,
    FormHelperText, Select, FormControl, InputLabel
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
// Formik - Yup
import { useFormik } from "formik";
import * as Yup from "yup";
// Importar Services
import { AddOneVendedor } from "../../../services/remote/post/AddOneVendedor.jsx";
import { GetAllLabels } from "../../../services/remote/get/GetAllLabels.jsx";
import { GetAllPersons } from "../../../services/remote/get/GetAllPersons.jsx";
import UseVendedor from "../../../services/remote/UseVendedor.jsx";
// Importar Helpers
import { ordersValues } from "../../../helpers/ordersValues.jsx";
import {OrdenesVendedorValues} from "../../../helpers/OrdenesVendedorValues.jsx"
// Importar el generador de ID
import { v4 as genID } from "uuid";
// Importar custom Hook
import MyAutoComplete from "../../../../../share/components/elements/atomos/MyAutoComplete.jsx";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";

const AddVendedorModal = ({ AddVendedorShowModal, setAddVendedorShowModal }) => {

    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [IdGen, setIdGen] = useState(genID().replace(/-/g, "").substring(0, 12));
    const [TipoVendedorValuesLabel, setTipoVendedorValuesLabel] = useState([]);
    const [RolValuesLabel, setRolValuesLabel] = useState([]);
    const [PersonaValuesLabel, setPersonaValuesLabel] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Creamos un useEffect para que se ejecute cada vez que cambie el valor de IdInstitutoOK
    useEffect(() => {
       //getLabelsByTipoVendedor();
        //getLabelsByRol();
        //getPersonsByTipo();
    }, []);


    // Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdUsuarioOK: "",
            IdPersonaOK: "",
            Usuario: "",
            Alias: "",
            Nombre: "",
            ApParterno: "",
            ApMaterno: "",
            FullUserName: "",
            RFC: "",
            CURP: "",
            Sexo: "",
            FechaNac:  "",
            Email:  "",
            TelMovil:  "",
        },
        validationSchema: Yup.object({
            IdOrdenOK: Yup.string()
                .required("Campo requerido")
                .matches(
                    /^[a-zA-Z0-9-]+$/,
                    "Solo se permiten caracteres alfanuméricos"
                ),
            IdOrdenBK: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            // Mostramos el Loading.
            setLoading(true);

            // Reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            // Try-catch para manejar errores.
            try {
                // Extraer los datos de los campos de la ventana modal que ya tiene Formik.
                const vendedor = OrdenesVendedorValues(values);
                // Llamamos al servicio para agregar una nueva orden
                await AddOneVendedor(vendedor);
                // Si no hubo errores, mostramos el mensaje de exito.
                setMensajeExitoAlert("Vendedor creado y guardada correctamente");
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo crear el vendedor");
            }

            // Ocultamos el Loading.
            setLoading(false);
        },
    });

    // props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    //const { vendedor, vendedorEspecifico } = UseVendedor({ IdPersonaOK: formik.values.IdPersonaOK || "", });

    useEffect(() => {
        if (formik.values.IdPersonaOK) {
            updateIdPersonaOK(); // Actualizar IdEntregaOK al cambiar IdInstitutoOK o IdNegocioOK
        }
    }, [formik.values.IdPersonaOK]);

    const updateIdPersonaOK = () => {
        formik.setFieldValue(
            "IdPersonaOK",
            `${formik.values.IdPersonaOK}`
        );
    };

    return (
        <Dialog
            open={AddVendedorShowModal}
            onClose={() => setAddVendedorShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>Agregar nuevo vendedor</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    dividers
                >
                    {/* Aqui van los campos de la ventana modal */}


                    <TextField
                        id="IdUsuarioOK"
                        label="IdUsuarioOK*"
                        value={formik.values.IdUsuarioOK}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.IdUsuarioOK && Boolean(formik.errors.IdUsuarioOK)}
                        helperText={formik.touched.IdUsuarioOK && formik.errors.IdUsuarioOK}
                    />

                    <TextField
                        id="IdPersonaOK"
                        label="IdPersonaOK*"
                        value={formik.values.IdPersonaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPersonaOK && Boolean(formik.errors.IdPersonaOK)}
                        helperText={formik.touched.IdPersonaOK && formik.errors.IdPersonaOK}
                    />
                    <TextField
                        id="Usuario"
                        label="Usuario*"
                        value={formik.values.Usuario}
                        {...commonTextFieldProps}
                        error={formik.touched.Usuario && Boolean(formik.errors.Usuario)}
                        helperText={formik.touched.Usuario && formik.errors.Usuario}
                    />

                    <TextField
                        id="Alias"
                        label="Alias*"
                        value={formik.values.Alias}
                        {...commonTextFieldProps}
                        error={formik.touched.Alias && Boolean(formik.errors.Alias)}
                        helperText={formik.touched.Alias && formik.errors.Alias}
                    />

                    <TextField
                        id="Nombre"
                        label="Nombre*"
                        value={formik.values.Nombre}
                        {...commonTextFieldProps}
                        error={formik.touched.Nombre && Boolean(formik.errors.Nombre)}
                        helperText={formik.touched.Nombre && formik.errors.Nombre}
                    />
                    <TextField
                        id="ApPaterno"
                        label="ApPaterno*"
                        value={formik.values.ApPaterno}
                        {...commonTextFieldProps}
                        error={formik.touched.ApPaterno && Boolean(formik.errors.ApPaterno)}
                        helperText={formik.touched.ApPaterno && formik.errors.ApPaterno}
                    />
                    <TextField
                        id="ApMaterno"
                        label="ApMaterno*"
                        value={formik.values.ApMaterno}
                        {...commonTextFieldProps}
                        error={formik.touched.ApMaterno && Boolean(formik.errors.ApMaterno)}
                        helperText={formik.touched.ApMaterno && formik.errors.ApMaterno}
                    />
                    <TextField
                        id="FullUserName"
                        label="FullUserName*"
                        value={formik.values.FullUserName}
                        {...commonTextFieldProps}
                        error={formik.touched.FullUserName && Boolean(formik.errors.FullUserName)}
                        helperText={formik.touched.FullUserName && formik.errors.FullUserName}
                    />
                    <TextField
                        id="RFC"
                        label="RFC*"
                        value={formik.values.RFC}
                        {...commonTextFieldProps}
                        error={formik.touched.RFC && Boolean(formik.errors.RFC)}
                        helperText={formik.touched.RFC && formik.errors.RFC}
                    />
                    <TextField
                        id="CURP"
                        label="CURP*"
                        value={formik.values.CURP}
                        {...commonTextFieldProps}
                        error={formik.touched.CURP && Boolean(formik.errors.CURP)}
                        helperText={formik.touched.CURP && formik.errors.CURP}
                    />
                    <TextField
                        id="Sexo"
                        label="Sexo*"
                        value={formik.values.Sexo}
                        {...commonTextFieldProps}
                        error={formik.touched.Sexo && Boolean(formik.errors.Sexo)}
                        helperText={formik.touched.Sexo && formik.errors.Sexo}
                    />
                    <TextField
                        id="FechaNac"
                        label="FechaNac*"
                        value={formik.values.FechaNac}
                        {...commonTextFieldProps}
                        error={formik.touched.FechaNac && Boolean(formik.errors.FechaNac)}
                        helperText={formik.touched.FechaNac && formik.errors.FechaNac}
                    />
                    <TextField
                        id="Email"
                        label="Email*"
                        value={formik.values.Email}
                        {...commonTextFieldProps}
                        error={formik.touched.Email && Boolean(formik.errors.Email)}
                        helperText={formik.touched.Email && formik.errors.Email}
                    />
                    <TextField
                        id="TelMovil"
                        label="TelMovil*"
                        value={formik.values.TelMovil}
                        {...commonTextFieldProps}
                        error={formik.touched.TelMovil && Boolean(formik.errors.TelMovil)}
                        helperText={formik.touched.TelMovil && formik.errors.TelMovil}
                    />


                </DialogContent>
                {/* Aqui van las acciones del usuario como son las alertas o botones */}
                <DialogActions
                    sx={{ display: 'flex', flexDirection: 'row' }}
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
                    {/* Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon />}
                        variant="outlined"
                        onClick={() => setAddVendedorShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* Boton de Guardar. */}
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                        //onClick={() => useFormik()}
                        type="submit"
                        disabled={!!mensajeExitoAlert}

                        loading={Loading}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default AddVendedorModal;