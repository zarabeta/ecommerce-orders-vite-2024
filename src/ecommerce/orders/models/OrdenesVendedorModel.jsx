import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesVendedorModel() {
    return {
        IdUsuarioOK: {type: String},
        IdPersonaOK: {type: String},
        Usuario: {type: String},
        Alias: {type: String},
        Nombre: {type: String},
        ApParterno: {type: String},
        ApMaterno: {type: String},
        FullUserName: {type: String},
        RFC: {type: String},
        CURP: {type: String},
        Sexo: {type: String},
        IdTipoPersonaOK: {type: String},
        FechaNac: {type: String},
        IdTipoEstatusOK: {type: String},
        IdRolActualOK: {type: String},
        IdRolPrincipalOK: {type: String},
        FotoPerfil: {type: String},
        Email: {type: String},
        TelMovil: {type: String},
        detail_row: getDetailRow(),
    }
}

