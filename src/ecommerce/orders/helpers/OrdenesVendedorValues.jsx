import {OrdenesVendedorModel} from "../models/OrdenesVendedorModel.jsx";
// Importar el generador de ID
import {v4 as genID} from "uuid";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesVendedorValues = (values, ordenesEstatus) => {
    let OrdenesEstatus = ordenesEstatus || OrdenesVendedorModel();

    // generar un id aleatorio y concatenarlo al final de IdEtiquetaOK

    // Crear un nuevo objeto de estatus
    let nuevoVendedor = {
        IdUsuarioOK: values.IdUsuarioOK,
        IdPersonaOK: values.IdPersonaOK,
        Usuario: values.Usuario,
        Alias: values.Alias,
        Nombre: values.Nombre,
        ApParterno: values.ApParterno,
        ApMaterno: values.ApMaterno,
        FullUserName: values.FullUserName,
        RFC: values.RFC,
        CURP: values.CURP,
        Sexo: values.Sexo,
        IdTipoPersonaOK: values.IdTipoPersonaOK,
        FechaNac: values.FechaNac,
        IdTipoEstatusOK: values.IdTipoEstatusOK,
        IdRolActualOK: values.IdRolActualOK,
        IdRolPrincipalOK: values.IdRolPrincipalOK,
        FotoPerfil: values.FotoPerfil,
        Email: values.Email,
        TelMovil: values.TelMovil,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEstatus.vendedor.push(nuevoVendedor);

    return OrdenesEstatus;
}