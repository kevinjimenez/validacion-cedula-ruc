import { TipoIdentificacionEnum } from '../enums/tipo-identificacion.enum';
import { ARREGLO_COEFICIENTES_PERSONA_NATURAL } from '../constantes/arreglo-constantes-cedula-ruc';
import { ConfiguracionValidacionCiRuc } from '../interfaces/configuracion-validacion-ci-ruc.interface';
// validacion inicial
function validarInicioCiRuc(parametos: ConfiguracionValidacionCiRuc) {
  const noExisteCiRuc =
    parametos.identificacion === undefined || parametos.identificacion === '';

  if (noExisteCiRuc) {
    return false;
  }

  const soloDigitos = parametos.identificacion.match(/[0-9]+/g);
  const noSonDigitos = soloDigitos === null;
  if (noSonDigitos) {
    return false;
  }

  const numeroCaracteresIgualCIRUC =
    parametos.identificacion.length !== parametos.numeroCaracteres;
  if (numeroCaracteresIgualCIRUC) {
    return false;
  }

  return true;
}
// Validación de código de provincia (dos primeros dígitos de CI/RUC)
function validarCodigoProvincia(parametos: ConfiguracionValidacionCiRuc) {
  const valoresEntre0Y24 =
    parametos.dosPrimerosDigitos <= 0 || parametos.dosPrimerosDigitos >= 24;
  if (valoresEntre0Y24) {
    return false;
  }

  return true;
}
// Validación de tercer dígito
function validarTercerDigito(parametos: ConfiguracionValidacionCiRuc) {
  switch (parametos.tipo) {
    case TipoIdentificacionEnum.CI:
    case TipoIdentificacionEnum.RucNatural:
      if (parametos.tercerDigito < 0 || parametos.tercerDigito >= 5) {
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
// validacion codigo establecimiento tercer digito
function validarCodigoEstablecimiento(parametos: ConfiguracionValidacionCiRuc) {
  const tercerDigitoMenorAUno = parametos.tercerDigito < 1;
  if (tercerDigitoMenorAUno) {
    return false;
  }

  return true;
}
// validar cedula y ruc perosna natural
function algoritmoModulo10(parametros: ConfiguracionValidacionCiRuc) {
  const arregloCoeficientesPersonaNatural = ARREGLO_COEFICIENTES_PERSONA_NATURAL;
  let total;
  total = 0;
  let valorPosicion;
  parametros.digitosCedulaORuc.forEach((item, indice) => {
    let digito;
    digito = +item;
    valorPosicion = digito * arregloCoeficientesPersonaNatural[indice];
    if (valorPosicion >= 10) {
      valorPosicion = valorPosicion.toString().split('');
      valorPosicion = +valorPosicion[0] + +valorPosicion[1];
    }
    total = total + valorPosicion;
  });
  let residuo;
  residuo = total % 10;
  let resultado;
  if (residuo === 0) {
    resultado = 0;
  } else {
    resultado = 10 - residuo;
  }

  if (resultado !== parametros.digitoVerificador) {
    console.error('Dígitos iniciales no validan contra Dígito Idenficador');
    return false;
  }
  return true;
}

// funcion Dios
export function verificarCedulaRuc(parametros: ConfiguracionValidacionCiRuc) {
    console.log('ES cedula', parametros);
  const esRuc = parametros.numeroCaracteres === 13;
  if (esRuc) {
    validacionesPreviasCedulaRuc(parametros);
    console.log('ES RUC :V');
  } else {
    
    validacionesPreviasCedulaRuc(parametros);
  }
}

function validacionesPreviasCedulaRuc(parametros) {
  const validacionInicial = validarInicioCiRuc(parametros);
  if (validacionInicial) {
    const validacionProvincia = validarCodigoProvincia(parametros);
    if (validacionProvincia) {
      const validacionTercerDigito = validarTercerDigito(parametros);
      if (validacionTercerDigito) {
        const validacionCodigoEstablecimiento = validarCodigoEstablecimiento(
          parametros
        );
        if (validacionCodigoEstablecimiento) {
          const esCiORucNatural =
            parametros.tipo === TipoIdentificacionEnum.CI ||
            TipoIdentificacionEnum.RucNatural;
          const esRucPrivado =
            parametros.tipo === TipoIdentificacionEnum.RucPrivado;
          const esRucPublico =
            parametros.tipo === TipoIdentificacionEnum.RucPublico;
          if (esCiORucNatural) {
            return algoritmoModulo10(parametros);
          } else if (esRucPrivado) {
            console.log('no es privado');
          } else if (esRucPublico) {
            console.log('no es publico');
          } else {
            console.error('Error numero ruc o cedula');
            return false;
          }
        } else {
          console.error('Error cuarta validaacion');
          return false;
        }
      } else {
        console.error('Error tercera validacion');
        return false;
      }
    } else {
      console.error('No existe provinvicia');
      return false;
    }
  } else {
    console.error('Error validacion incial');
    return false;
  }
}
