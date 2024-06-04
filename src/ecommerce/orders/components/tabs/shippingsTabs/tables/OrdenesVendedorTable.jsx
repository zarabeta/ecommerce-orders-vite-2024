import {useEffect, useState} from "react";

//Material UI
import {MaterialReactTable} from 'material-react-table';
import {Box, Stack, Tooltip, IconButton, Dialog} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import {GetOnePersons} from "../../../../services/remote/get/GetOnePersons.jsx";

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

// Table - FrontEnd.
const OrdenesVendedorTable = ({setDatosSeleccionados, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [factsData, setfactsData] = useState([]);
    
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
            const {IdPersonaOK} = datosSeleccionados;

            // Verificar si fueron seleccionados los id's; de lo contrario, no hacer nada.
            if (IdPersonaOK === "0" ) {
                setLoadingTable(false);
                return;
            }
            // Obtener los datos
            console.log(IdPersonaOK);
            const factsData = await GetOnePersons(IdPersonaOK);
            
            setfactsData([factsData.vendedor]);

            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <Box>
                <MaterialReactTable
                    columns={columns}
                    initialState={{density: "compact", showGlobalFilter: true}}
                    data={factsData}
                    state={{isLoading: loadingTable}}
                    enableMultiRowSelection={false}
                    enableRowSelection={true}
                    muiTableBodyRowProps={({row}) => ({
                        onClick: row.getToggleSelectedHandler(),
                        onClickCapture: () => sendDataRow(row),
                        sx: {cursor: 'pointer'},
                    })}
                    renderTopToolbarCustomActions={() => (
                        <>
                            {/* ------- BARRA DE ACCIONES ------ */}
                            <Stack direction="row" sx={{m: 1}}>
                                <Box>
                                    <Tooltip title="Agregar">
                                        <IconButton
                                            onClick={() => setAddVendedorShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            //onClick={() => setOrdenesUpdateInfoAdShowModal(true)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            //onClick={() => handleDelete()}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Detalles ">
                                        <IconButton>
                                            <InfoIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Refrescar">
                                        <IconButton
                                            onClick={fetchData}>
                                            <RefreshIcon/>
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