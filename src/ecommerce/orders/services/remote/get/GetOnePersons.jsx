import axios from "axios";

export function GetOnePersons(IdPersonaOK) {
    return new Promise((resolve, reject) => {

        axios.get(import.meta.env.VITE_API_ORDERS_URL + '/one?IdPersonaOK=' + IdPersonaOK)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    //console.error("No se pudo realizar correctamente la petición <<GetOnePerson - Services>>", data);
                    reject(data); // Rechaza la promesa con la respuesta si no fue exitosa
                } else if (data.data.length === 0) {
                    //console.info("🛈 No se encontraron documentos en <<cat_orders>>");
                    resolve([]);
                } else if (data.success) {
                    const orderData = data.data[0].dataRes;
                    resolve(JSON.parse(JSON.stringify(orderData))); // Resuelve la promesa y hace una copia profunda
                }
            })
            .catch((error) => {
                //console.error("Error en <<GetOnePerson - Services>>", error);
                reject(error); // Rechaza la promesa en caso de error
            });
    });

}