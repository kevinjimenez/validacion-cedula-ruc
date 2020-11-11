"use strict";
exports.__esModule = true;
exports.validarCedulaRuc = void 0;
var tipo_identificacion_enum_1 = require("./enums/tipo-identificacion.enum");
var validaciones_cedula_ruc_1 = require("./funciones/validaciones-cedula-ruc");
function validarCedulaRuc(cedulaRuc) {
    var rucCedula = cedulaRuc ? cedulaRuc.trim() : '';
    var datosValidacionCedulaRuc = {};
    datosValidacionCedulaRuc.identificacion = rucCedula;
    datosValidacionCedulaRuc.numeroCaracteres = rucCedula.length;
    var existeCedula = validaciones_cedula_ruc_1.validarInicioCiRuc(datosValidacionCedulaRuc);
    if (existeCedula) {
        var rucCedula_1 = cedulaRuc.trim();
        var arregloDigitosCedula = datosValidacionCedulaRuc.identificacion.split("");
        var dosPrimerosDigitos = +(arregloDigitosCedula[0] + arregloDigitosCedula[1]);
        var tercerDigito = arregloDigitosCedula[2];
        var esCiRucNatural = +tercerDigito >= 0 || +tercerDigito <= 5;
        var esRucPrivado = +tercerDigito === 9;
        var esRucPublico = +tercerDigito === 6;
        var digitosCedulaRuc = datosValidacionCedulaRuc.identificacion
            .split("")
            .slice(0, 9);
        datosValidacionCedulaRuc.digitoVerificador = +arregloDigitosCedula[9];
        datosValidacionCedulaRuc.dosPrimerosDigitos = dosPrimerosDigitos;
        datosValidacionCedulaRuc.digitosCedulaORuc = digitosCedulaRuc;
        if (esCiRucNatural) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            if (datosValidacionCedulaRuc.numeroCaracteres === 13) {
                console.log(datosValidacionCedulaRuc);
                datosValidacionCedulaRuc.tipo = tipo_identificacion_enum_1.TipoIdentificacionEnum.RucNatural;
                return validaciones_cedula_ruc_1.verificarCedulaRuc(datosValidacionCedulaRuc);
            }
            else {
                datosValidacionCedulaRuc.tipo = tipo_identificacion_enum_1.TipoIdentificacionEnum.CI;
                return validaciones_cedula_ruc_1.verificarCedulaRuc(datosValidacionCedulaRuc);
            }
        }
        else if (esRucPrivado) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            datosValidacionCedulaRuc.tipo = tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPrivado;
            return validaciones_cedula_ruc_1.verificarCedulaRuc(datosValidacionCedulaRuc);
        }
        else if (esRucPublico) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            datosValidacionCedulaRuc.tipo = tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPublico;
            return validaciones_cedula_ruc_1.verificarCedulaRuc(datosValidacionCedulaRuc);
        }
        else {
            return false;
        }
    }
    else {
        console.log("Sin cedula");
        return false;
    }
}
exports.validarCedulaRuc = validarCedulaRuc;
console.log(validarCedulaRuc(undefined));
