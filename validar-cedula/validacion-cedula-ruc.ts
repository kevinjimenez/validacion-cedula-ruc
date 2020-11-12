import {TipoIdentificacionEnum} from "./enums/tipo-identificacion.enum";
import {
    validarInicioCiRuc,
    iniciarValidacionesCedulaRuc,
} from "./funciones/validaciones-cedula-ruc";
import {ConfiguracionValidacionCiRuc} from "./interfaces/configuracion-validacion-ci-ruc.interface";

export function validarCedulaRuc(cedulaRuc: string) {
    const rucCedula = cedulaRuc ? cedulaRuc.trim() : '';
    const datosValidacionCedulaRuc: ConfiguracionValidacionCiRuc = {};
    datosValidacionCedulaRuc.numeroCedulaORuc = rucCedula;
    datosValidacionCedulaRuc.numeroCaracteresCedulaORuc = rucCedula.length;
    const existeCedula = validarInicioCiRuc(datosValidacionCedulaRuc);
    if (existeCedula) {
        const arregloDigitosCedula = datosValidacionCedulaRuc.numeroCedulaORuc.split(
            ""
        );
        const dosPrimerosDigitos = +(
            arregloDigitosCedula[0] + arregloDigitosCedula[1]
        );
        const tercerDigito = arregloDigitosCedula[2];
        const esCiRucNatural = +tercerDigito >= 0 || +tercerDigito <= 5;
        const esRucPrivado = +tercerDigito === 9;
        const esRucPublico = +tercerDigito === 6;
        const digitosCedulaRuc: string[] = datosValidacionCedulaRuc
            .numeroCedulaORuc
            .split("")
            .slice(0, 9);
        datosValidacionCedulaRuc.digitoVerificador = +arregloDigitosCedula[9];
        datosValidacionCedulaRuc.dosPrimerosDigitos = dosPrimerosDigitos;
        datosValidacionCedulaRuc.arregloDigitosCedulaORuc = digitosCedulaRuc;
        if (esCiRucNatural) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            if (datosValidacionCedulaRuc.numeroCaracteresCedulaORuc === 13) {
                datosValidacionCedulaRuc.tipoCedulaORuc = TipoIdentificacionEnum.RucNatural;
                return iniciarValidacionesCedulaRuc(datosValidacionCedulaRuc);
            } else {
                datosValidacionCedulaRuc.tipoCedulaORuc = TipoIdentificacionEnum.CI;
                return iniciarValidacionesCedulaRuc(datosValidacionCedulaRuc);
            }
        } else if (esRucPrivado) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            datosValidacionCedulaRuc.tipoCedulaORuc = TipoIdentificacionEnum.RucPrivado;
            return iniciarValidacionesCedulaRuc(datosValidacionCedulaRuc);
        } else if (esRucPublico) {
            datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
            datosValidacionCedulaRuc.tipoCedulaORuc = TipoIdentificacionEnum.RucPublico;
            return iniciarValidacionesCedulaRuc(datosValidacionCedulaRuc);
        } else {
            return false;
        }
    } else {
        console.log("No existe cedula o ruc !");
        return false;
    }
}

console.log(validarCedulaRuc(undefined));
