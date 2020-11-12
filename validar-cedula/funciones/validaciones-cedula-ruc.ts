import {TipoIdentificacionEnum} from "../enums/tipo-identificacion.enum";
import {
    ARREGLO_COEFICIENTES_PERSONA_NATURAL,
    ARREGLO_COEFICIENTES_RUC_PRIVADO,
    ARREGLO_COEFICIENTES_RUC_PUBLICO,
} from "../constantes/arreglo-constantes-cedula-ruc";
import {ConfiguracionValidacionCiRuc} from "../interfaces/configuracion-validacion-ci-ruc.interface";

// validacion inicial
export function validarInicioCiRuc(parametos: ConfiguracionValidacionCiRuc) {
    const noExisteCiRuc =
        parametos.numeroCedulaORuc === undefined || parametos.numeroCedulaORuc === "";
    if (noExisteCiRuc) {
        return false;
    }
    const soloDigitos = parametos.numeroCedulaORuc.match(/[0-9]+/g);
    const noSonDigitos = soloDigitos === null;
    if (noSonDigitos) {
        return false;
    }
    const numeroCaracteresIgualCIRUC =
        parametos.numeroCedulaORuc.length !== parametos.numeroCaracteresCedulaORuc;
    if (numeroCaracteresIgualCIRUC) {
        return false;
    }
    return true;
}

// Validación de código de provincia (dos primeros dígitos de CI/RUC)
function validarCodigoProvincia(parametos: ConfiguracionValidacionCiRuc) {
    const valoresEntre0Y24 =
        parametos.dosPrimerosDigitos < 0 || parametos.dosPrimerosDigitos > 24;
    if (valoresEntre0Y24) {
        return false;
    }
    return true;
}

// Validación de tercer dígito
function validarTercerDigito(parametos: ConfiguracionValidacionCiRuc) {
    switch (parametos.tipoCedulaORuc) {
        case TipoIdentificacionEnum.CI:
        case TipoIdentificacionEnum.RucNatural:
            if (parametos.tercerDigito < 0 || parametos.tercerDigito > 5) {
                return false;
            }
            break;
        case TipoIdentificacionEnum.RucPrivado:
            if (parametos.tercerDigito != 9) {
                return false;
            }
            break;

        case TipoIdentificacionEnum.RucPublico:
            if (parametos.tercerDigito != 6) {
                return false;
            }
            break;
        default:
            return false;
    }
    return true;
}

// validar cedula y ruc persona natural
function algoritmoModulo10(parametros: ConfiguracionValidacionCiRuc): boolean {
    const arregloCoeficientesPersonaNatural = ARREGLO_COEFICIENTES_PERSONA_NATURAL;
    let total: number;
    total = 0;
    let valorPosicion;
    parametros
        .arregloDigitosCedulaORuc
        .forEach(
            (item: string, indice: number) => {
                let digito: number;
                digito = +item;
                valorPosicion = digito * arregloCoeficientesPersonaNatural[indice];
                if (valorPosicion >= 10) {
                    valorPosicion = valorPosicion
                        .toString()
                        .split("");
                    valorPosicion = +valorPosicion[0] + +valorPosicion[1];
                }
                total = total + valorPosicion;
            });
    let residuo: number;
    residuo = total % 10;
    let resultado;
    if (residuo === 0) {
        resultado = 0;
    } else {
        resultado = 10 - residuo;
    }

    if (resultado !== parametros.digitoVerificador) {
        console.error("Dígitos iniciales no validan contra Dígito Idenficador");
        return false;
    }
    return true;
}

// validar ruc privado y publico
function algoritmoModulo11(parametros: ConfiguracionValidacionCiRuc) {
    let arregloCoeficientes: number[];
    let digitosCedulaORuc: string[];
    switch (parametros.tipoCedulaORuc) {
        case TipoIdentificacionEnum.RucPrivado:
            arregloCoeficientes = ARREGLO_COEFICIENTES_RUC_PRIVADO;
            digitosCedulaORuc = parametros.arregloDigitosCedulaORuc;
            break;
        case TipoIdentificacionEnum.RucPublico:
            arregloCoeficientes = ARREGLO_COEFICIENTES_RUC_PUBLICO;
            digitosCedulaORuc = parametros
                .numeroCedulaORuc
                .split("")
                .slice(0, 8);
            break;
        default:
            return false;
    }
    let total;
    total = 0;
    let valorPosicion;
    digitosCedulaORuc
        .forEach(
            (item: string, indice: number) => {
                let digito: number;
                digito = +item;
                valorPosicion = digito * arregloCoeficientes[indice];
                total = total + valorPosicion;
            });
    let residuo: number;
    residuo = total % 11;
    let resultado;
    if (residuo === 0) {
        resultado = 0;
    } else {
        resultado = 11 - residuo;
    }
    if (resultado !== parametros.digitoVerificador) {
        console.error("Dígitos iniciales no validan contra Dígito Idenficador");
        return false;
    }
    return true;
}

// funcion Dios
export function iniciarValidacionesCedulaRuc(parametros: ConfiguracionValidacionCiRuc): boolean {
    const esRuc = parametros.numeroCaracteresCedulaORuc === 13;
    if (esRuc) {
        return aplicarValidacionesCedulaRuc(parametros);
    } else {
        return aplicarValidacionesCedulaRuc(parametros);
    }
}

// validaciones
function aplicarValidacionesCedulaRuc(parametros: ConfiguracionValidacionCiRuc): boolean {
    const validacionProvincia = validarCodigoProvincia(parametros);
    if (validacionProvincia) {
        const validacionTercerDigito = validarTercerDigito(parametros);
        if (validacionTercerDigito) {
            const esCiORucNatural =
                parametros.tipoCedulaORuc === TipoIdentificacionEnum.CI ||
                TipoIdentificacionEnum.RucNatural;
            const esRucPrivado =
                parametros.tipoCedulaORuc === TipoIdentificacionEnum.RucPrivado;
            const esRucPublico =
                parametros.tipoCedulaORuc === TipoIdentificacionEnum.RucPublico;
            if (esCiORucNatural) {
                return algoritmoModulo10(parametros);
            } else if (esRucPrivado) {
                return algoritmoModulo11(parametros);
            } else if (esRucPublico) {
                return algoritmoModulo11(parametros);
            } else {
                console.error("No es cedula o tuc!");
                return false;
            }
        } else {
            console.error("Error tercera validacion!");
            return false;
        }
    } else {
        console.error("No existe provincia!");
        return false;
    }
}
