import { useEffect, useState } from "react";

//Material UI
import { MaterialReactTable } from 'material-react-table';
import { Box, Stack, Tooltip, IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import { GetOneOrder } from "../../../../services/remote/get/GetOneOrder.jsx";

import AddVendedorModal from '../../../modals/addModals/AddVendedorModal.jsx';
// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdUsuarioOK",
        header: "IdUsuarioOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdPersonaOK",
        header: "IdPersonaOK",
        size: 30, //small column
    },
    {
        accessorKey: "Usuario",
        header: "Usuario",
        size: 150, //small column
    },
    {
        accessorKey: "Alias",
        header: "Alias",
        size: 150, //small column
    },
    {
        accessorKey: "Nombre",
        header: "Nombre",
        size: 150, //small column
    },
    {
        accessorKey: "ApParterno",
        header: "ApParterno",
        size: 150, //small column
    },
    {
        accessorKey: "ApMaterno",
        header: "ApMaterno",
        size: 150, //small column
    },
    {
        accessorKey: "FullUserName",
        header: "FullUserName",
        size: 150, //small column
    },
    {
        accessorKey: "RFC",
        header: "RFC",
        size: 150, //small column
    },
    {
        accessorKey: "CURP",
        header: "CURP",
        size: 150, //small column
    },
    {
        accessorKey: "Sexo",
        header: "Sexo",
        size: 150, //small column
    },
    {
        accessorKey: "FechaNac",
        header: "FechaNac",
        size: 150, //small column
    },
    {
        accessorKey: "FotoPerfil",
        header: "FotoPerfil",
        size: 150, //small column
    },
    {
        accessorKey: "Email",
        header: "Email",
        size: 150, //small column
    },
    {
        accessorKey: "TelMovil",
        header: "TelMovil",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdPersonaOK === datosSecSubdocumentoPresenta.IdPersonaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].vendedor
        : null;
}

// Table - FrontEnd.
const OrdenesVendedorTable = ({ datosSeleccionados, datosSecSubdoc }) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(false);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [AddVendedorShowModal, setAddVendedorShowModal] = useState(false);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);
    };
    async function fetchData() {
        try {
            // Obtener los id's seleccionados
            const { IdInstitutoOK, IdNegocioOK, IdOrdenOK } = datosSeleccionados;

            // Verificar si fueron seleccionados los id's; de lo contrario, no hacer nada.
            if (IdInstitutoOK === "0" || IdNegocioOK === "0" || IdOrdenOK === "0") {
                setLoadingTable(false);
                return;
            }

            // Obtener los datos
            const ordersData = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

            const datosFiltrados = getDatosFiltrados(ordersData.factura, datosSecSubdoc);
            if (datosFiltrados) {
                setOrdersData(datosFiltrados);
            } else {
                setOrdersData([]); // que no sea null
            }

            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }


    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El vendedor con el ID: ${(dataRow.IdPersonaOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let { IdInstitutoOK, IdNegocioOK, IdOrdenOK } = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Encuentra el índice del subdocumento factura que quieres actualizar
                const facturaPsIndex = ordenExistente.factura.findIndex(factura => {
                    // Encuentra el índice del subdocumento vendedor que debemos actualizar
                    const facturaDomicilioIndex = factura.vendedor.findIndex(vendedor => vendedor.IdDomicilioOK === dataRow.IdDomicilioOK);

                    // Si se encontró el subdocumento vendedor, devuelve true para detener la búsqueda
                    return facturaDomicilioIndex !== -1;
                });

                // Verifica si se encontró el subdocumento factura
                if (facturaPsIndex !== -1) {
                    // Encuentra el índice del subdocumento vendedor dentro del subdocumento factura encontrado
                    const infoAdIndex = ordenExistente.factura[facturaPsIndex].vendedor.findIndex(infoAd => infoAd.IdDomicilioOK === dataRow.IdDomicilioOK);

                    // Ahora ya tenemos los índices de factura e vendedor
                    console.log("facturaPsIndex: ", facturaPsIndex);
                    console.log("infoAdIndex: ", infoAdIndex);

                    // Elimina el subdocumento vendedor
                    ordenExistente.factura[facturaPsIndex].vendedor.splice(infoAdIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Vendedor eliminada con exito");

                    // Actualizar la data
                    await fetchData();
                }
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError("No se pudo eliminar la InfoAd");
            }
        }
    };

    return (
        <Box>
            <Box>
                <MaterialReactTable
                    columns={columns}
                    initialState={{ density: "compact", showGlobalFilter: true }}
                    data={ordersData}
                    state={{ isLoading: loadingTable }}
                    enableMultiRowSelection={false}
                    enableRowSelection={true}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: row.getToggleSelectedHandler(),
                        onClickCapture: () => sendDataRow(row),
                        sx: { cursor: 'pointer' },
                    })}
                    renderTopToolbarCustomActions={() => (
                        <>
                            {/* ------- BARRA DE ACCIONES ------ */}
                            <Stack direction="row" sx={{ m: 1 }}>
                                <Box>
                                    <Tooltip title="Agregar">
                                        <IconButton
                                            onClick={() => setAddVendedorShowModal(true)}
                                        >
                                            <AddCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                        //onClick={() => setOrdenesUpdateInfoAdShowModal(true)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            onClick={() => handleDelete()}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Detalles ">
                                        <IconButton>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Refrescar">
                                        <IconButton
                                            onClick={fetchData}>
                                            <RefreshIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>
                            {/* ------- BARRA DE ACCIONES FIN ------ */}
                            {/* M O D A L E S */}
                            {/*<Dialog open={OrdenesInfoAdShowModal}>*/}

                            {/*</Dialog>*/}
                            {/*<Dialog open={OrdenesUpdateInfoAdShowModal}>*/}

                            {/*</Dialog>*/}
                        </>
                    )}
                />
                {/* M O D A L E S */}

                <Dialog open={AddVendedorShowModal}>
                    <AddVendedorModal
                        AddVendedorShowModal={AddVendedorShowModal}
                        setAddVendedorShowModal={setAddVendedorShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdoc}
                        fetchData={fetchData}z
                        onClose={() => {
                            setAddVendedorShowModal(false)
                        }}
                    />
                </Dialog>

            </Box>
        </Box>
    );
};

export default OrdenesVendedorTable;