import { TipoIdentificacionEnum } from './enums/tipo-identificacion.enum';
import { verificarCedulaRuc } from './funciones/validaciones-cedula-ruc';
import { ConfiguracionValidacionCiRuc } from './interfaces/configuracion-validacion-ci-ruc.interface';
export function validarCedulaRuc(cedulaRuc: string) {
    const rucCedula = cedulaRuc.trim();
  const existeCedula = rucCedula !== undefined || rucCedula !== '';
  const datosValidacionCedulaRuc: ConfiguracionValidacionCiRuc = {};
  if (existeCedula) {
    const arregloDigitosCedula = rucCedula.split('');
    const dosPrimerosDigitos = +(
      arregloDigitosCedula[0] + arregloDigitosCedula[1]
    );
    const tercerDigito = arregloDigitosCedula[2];
    const esCiRucNatural = +tercerDigito >= 0 || +tercerDigito <= 5;
    const esRucPrivado = +tercerDigito === 9;
    const esRucPublico = +tercerDigito === 6;
    const digitosCedulaRuc: string[] = rucCedula.split('').slice(0, 9);;
    datosValidacionCedulaRuc.identificacion = rucCedula;
    datosValidacionCedulaRuc.numeroCaracteres = rucCedula.length;
    datosValidacionCedulaRuc.digitoVerificador = +arregloDigitosCedula[9];
    datosValidacionCedulaRuc.dosPrimerosDigitos = dosPrimerosDigitos;
    datosValidacionCedulaRuc.digitosCedulaORuc = digitosCedulaRuc
    if (esCiRucNatural) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      if (datosValidacionCedulaRuc.numeroCaracteres === 13) {
          console.log(datosValidacionCedulaRuc);
        datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucNatural;
      } else {
        datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.CI;
        verificarCedulaRuc(datosValidacionCedulaRuc);
      }
    } else if (esRucPrivado) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucPrivado;
      verificarCedulaRuc(datosValidacionCedulaRuc);
    } else if (esRucPublico) {
      datosValidacionCedulaRuc.tercerDigito = +tercerDigito;
      datosValidacionCedulaRuc.tipo = TipoIdentificacionEnum.RucPublico;
      verificarCedulaRuc(datosValidacionCedulaRuc);
    }
  } else {
    console.log('Sin cedula');
  }
}

validarCedulaRuc('   1723945380001    ')

