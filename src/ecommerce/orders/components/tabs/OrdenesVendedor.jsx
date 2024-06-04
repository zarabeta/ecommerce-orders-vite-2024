import {Box} from "@mui/material";
import OrdenesVendedorTable from "./shippingsTabs/tables/OrdenesVendedorTable.jsx";

export default function OrdenesVendedor({datosSeleccionados, setDatosSecSubdoc}) {
    return (
        <Box>
            <OrdenesVendedorTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdoc={setDatosSecSubdoc}
            />
        </Box>
    );
}