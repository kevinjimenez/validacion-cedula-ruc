import { TipoIdentificacionEnum } from "./enums/tipo-identificacion.enum";
import {
  validarInicioCiRuc,
  verificarCedulaRuc,
} from "./funciones/validaciones-cedula-ruc";
import { ConfiguracionValidacionCiRuc } from "./interfaces/configuracion-validacion-ci-ruc.interface";

export function validarCedulaRuc(cedulaRuc: string) {
  const rucCedula = cedulaRuc ? cedulaRuc.trim() : '';
  const datosValidacionCedulaRuc: ConfiguracionValidacionCiRuc = {};
  datosValidacionCedulaRuc.identificacion = rucCedula;
  datosValidacionCedulaRuc.numeroCaracteres = rucCedula.length;
  const existeCedula = validarInicioCiRuc(datosValidacionCedulaRuc);
  if (existeCedula) {
    const rucCedula = cedulaRuc.trim();
    const arregloDigitosCedula = datosValidacionCedulaRuc.identificacion.split(
      ""
    );
    const dosPrimerosDigitos = +(
      arregloDigitosCedula[0] + arregloDigitosCedula[1]
    );
    const tercerDigito = arregloDigitosCedula[2];
    const esCiRucNatural = +tercerDigito >= 0 || +tercerDigito <= 5;
    const esRucPrivado = +tercerDigito === 9;
    const esRucPublico = +tercerDigito === 6;
    const digitosCedulaRuc: string[] = datosValidacionCedulaRuc.identificacion
      .split("")
      .slice(0, 9);
    datosValidacionCedulaRuc.digitoVerificador = +arregloDigitosCedula[9];
    datosValidacionCedulaRuc.dosPrimerosDigitos = dosPrimerosDigitos;
    datosValidacionCedulaRuc.digitosCedulaORuc = digitosCedulaRuc;
    if (esCiRucNatural) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      if (datosValidacionCedulaRuc.numeroCaracteres === 13) {
        console.log(datosValidacionCedulaRuc);
        datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucNatural;
        return verificarCedulaRuc(datosValidacionCedulaRuc);
      } else {
        datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.CI;
        return verificarCedulaRuc(datosValidacionCedulaRuc);
      }
    } else if (esRucPrivado) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucPrivado;
      return verificarCedulaRuc(datosValidacionCedulaRuc);
    } else if (esRucPublico) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucPublico;
      return verificarCedulaRuc(datosValidacionCedulaRuc);
    } else {
      return false;
    }
  } else {
    console.log("Sin cedula");
    return false;
  }
}

console.log(validarCedulaRuc(undefined));
