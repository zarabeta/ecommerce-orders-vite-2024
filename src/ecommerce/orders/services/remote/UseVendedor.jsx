import {useState, useEffect} from 'react';
import {GetAllPersons} from './get/GetAllPersons';

function UseVendedor({IdPersonaOK}) {
    const [vendedor, setVendedor] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const vendedorData = await GetAllPersons();
                //console.log("vendedorData", vendedorData)
                setVendedor(vendedorData);
            } catch (error) {
                //console.error("useVendedor():", error);
            }
        }

        fetchData();
    }, []);

    let personaEspecifica = null
    if (IdPersonaOK) { //Si recibe IdPersonaOK
        personaEspecifica = vendedor.find(persona => persona.IdPersonaOK === IdPersonaOK);
    } else if (!IdPersonaOK) {//Si NO recibe IdPersonaOK
        personaEspecifica = vendedor.find(persona => persona.IdPersonaOK === IdPersonaOK)
    }

    return {vendedor, personaEspecifica};
}
 
export default UseVendedor;