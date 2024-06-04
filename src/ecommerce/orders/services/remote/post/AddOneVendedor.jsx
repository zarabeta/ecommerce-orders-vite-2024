import axios from "axios";

export function AddOneVendedor(vendedor) {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_API_PERSONS_URL, vendedor)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecuto la API <<AddOneVendedor>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<AddOneVendedor>>", error);
                reject(error);
            });
    });
}