"use strict";
exports.__esModule = true;
exports.verificarCedulaRuc = void 0;
var tipo_identificacion_enum_1 = require("../enums/tipo-identificacion.enum");
var arreglo_constantes_cedula_ruc_1 = require("../constantes/arreglo-constantes-cedula-ruc");
function validarInicioCiRuc(parametos) {
    var noExisteCiRuc = parametos.identificacion === undefined || parametos.identificacion === '';
    if (noExisteCiRuc) {
        return false;
    }
    var soloDigitos = parametos.identificacion.match(/[0-9]+/g);
    var noSonDigitos = soloDigitos === null;
    if (noSonDigitos) {
        return false;
    }
    var numeroCaracteresIgualCIRUC = parametos.identificacion.length !== parametos.numeroCaracteres;
    if (numeroCaracteresIgualCIRUC) {
        return false;
    }
    return true;
}
// Validación de código de provincia (dos primeros dígitos de CI/RUC)
function validarCodigoProvincia(parametos) {
    var valoresEntre0Y24 = parametos.dosPrimerosDigitos <= 0 || parametos.dosPrimerosDigitos >= 24;
    if (valoresEntre0Y24) {
        return false;
    }
    return true;
}
// Validación de tercer dígito
function validarTercerDigito(parametos) {
    switch (parametos.tipo) {
        case tipo_identificacion_enum_1.TipoIdentificacionEnum.CI:
        case tipo_identificacion_enum_1.TipoIdentificacionEnum.RucNatural:
            if (parametos.tercerDigito < 0 || parametos.tercerDigito >= 5) {
                return false;
            }
            break;
        case tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPrivado:
            if (parametos.tercerDigito != 9) {
                return false;
            }
            break;
        case tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPublico:
            if (parametos.tercerDigito != 6) {
                return false;
            }
            break;
        default:
            return false;
    }
    return true;
}
// validacion codigo establecimiento tercer digito
function validarCodigoEstablecimiento(parametos) {
    var tercerDigitoMenorAUno = parametos.tercerDigito < 1;
    if (tercerDigitoMenorAUno) {
        return false;
    }
    return true;
}
// validar cedula y ruc perosna natural
function algoritmoModulo10(parametros) {
    var arregloCoeficientesPersonaNatural = arreglo_constantes_cedula_ruc_1.ARREGLO_COEFICIENTES_PERSONA_NATURAL;
    var total;
    total = 0;
    var valorPosicion;
    parametros.digitosCedulaORuc.forEach(function (item, indice) {
        var digito;
        digito = +item;
        valorPosicion = digito * arregloCoeficientesPersonaNatural[indice];
        if (valorPosicion >= 10) {
            valorPosicion = valorPosicion.toString().split('');
            valorPosicion = +valorPosicion[0] + +valorPosicion[1];
        }
        total = total + valorPosicion;
    });
    var residuo;
    residuo = total % 10;
    var resultado;
    if (residuo === 0) {
        resultado = 0;
    }
    else {
        resultado = 10 - residuo;
    }
    if (resultado !== parametros.digitoVerificador) {
        console.error('Dígitos iniciales no validan contra Dígito Idenficador');
        return false;
    }
    console.log('valido papu');
    return true;
}
// funcion Dios
function verificarCedulaRuc(parametros) {
    var esRuc = parametros.numeroCaracteres === 13;
    if (esRuc) {
        validacionesPreviasCedulaRuc(parametros);
        console.log('ES RUC :V');
    }
    else {
        console.log('ES cedula', parametros);
        validacionesPreviasCedulaRuc(parametros);
    }
}
exports.verificarCedulaRuc = verificarCedulaRuc;
function validacionesPreviasCedulaRuc(parametros) {
    var validacionInicial = validarInicioCiRuc(parametros);
    if (validacionInicial) {
        var validacionProvincia = validarCodigoProvincia(parametros);
        if (validacionProvincia) {
            var validacionTercerDigito = validarTercerDigito(parametros);
            if (validacionTercerDigito) {
                var validacionCodigoEstablecimiento = validarCodigoEstablecimiento(parametros);
                if (validacionCodigoEstablecimiento) {
                    var esCiORucNatural = parametros.tipo === tipo_identificacion_enum_1.TipoIdentificacionEnum.CI ||
                        tipo_identificacion_enum_1.TipoIdentificacionEnum.RucNatural;
                    var esRucPrivado = parametros.tipo === tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPrivado;
                    var esRucPublico = parametros.tipo === tipo_identificacion_enum_1.TipoIdentificacionEnum.RucPublico;
                    if (esCiORucNatural) {
                        return algoritmoModulo10(parametros);
                    }
                    else if (esRucPrivado) {
                        console.log('no es privado');
                    }
                    else if (esRucPublico) {
                        console.log('no es publico');
                    }
                }
            }
        }
    }
}