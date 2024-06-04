import {Box} from "@mui/material";
import {useState} from "react";
import OrdersNavTab from "../components/tabs/OrdersNavTab.jsx";
import OrdenesEstatusTab from "../components/tabs/OrdenesEstatusTab.jsx";
import OrdenesTab from "../components/tabs/OrdenesTab.jsx";
import OrdenesInfo from "../components/tabs/OrdenesInfo.jsx";
import OrdenesDetallesTab from "../components/tabs/OrdenesDetallesTab.jsx";
import OrdenesFormaPagoTab from "../components/tabs/OrdenesFormaPagoTab.jsx";
import OrdenesFacturaTab from "../components/tabs/shippingsTabs/OrdenesFacturaTab.jsx";
import OrdenesClientes from "../components/tabs/shippingsTabs/OrdenesClientes.jsx";
import OrdenesVendedor from "../components/tabs/OrdenesVendedor.jsx";
import OrdenesEnviosTab from "../components/tabs/shippingsTabs/OrdenesEnviosTab.jsx";

export default function Orders() {

    // Indicamos que al iniciar no hay ninguna tab seleccionada
    const [currentRowInOrdersTab, setCurrentRowInOrdersTab] = useState(0);

    // Indicamos que el estado inicial del tab page principal por default sera ORDENES
    const [currentNameTabInPrincipalTab, setCurrentNameTabInPrincipalTab] = useState("ORDENES");

    // useState para guardar los ids seleccionados y compartirlos entre tabs.
    const [datosSeleccionados, setDatosSeleccionados] = useState({
        IdInstitutoOK: "0",
        IdNegocioOK: "0",
        IdOrdenOK: "0",
    });
    
    return (
        <Box>
            <OrdersNavTab
                setCurrentRowInOrdersTab={setCurrentRowInOrdersTab}
                setCurrentNameTabInPrincipalTab={setCurrentNameTabInPrincipalTab}
            />

            {currentNameTabInPrincipalTab == "ORDENES" &&
                <OrdenesTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "ESTATUS" &&
                <OrdenesEstatusTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "INFO" &&
                <OrdenesInfo
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "DETALLES" &&
                <OrdenesDetallesTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "FORMA PAGO" &&
                <OrdenesFormaPagoTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }

            {
                ///////////////////////////////////////////////////////////
                // **** Aqui se agregan las demas tabs de shippings **** //
                ///////////////////////////////////////////////////////////
            }
            {currentNameTabInPrincipalTab == "FACTURA" &&
                <OrdenesFacturaTab
                    datosSeleccionados={datosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "CLIENTE" &&
                <OrdenesClientes
                    datosSeleccionados={datosSeleccionados}
                />
            }
        </Box>
    );
} 