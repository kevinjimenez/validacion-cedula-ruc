import { TipoIdentificacionEnum } from '../enums/tipo-identificacion.enum';
export interface ConfiguracionValidacionCiRuc {
  tipo?:
    | TipoIdentificacionEnum.CI
    | TipoIdentificacionEnum.RucNatural
    | TipoIdentificacionEnum.RucPrivado
    | TipoIdentificacionEnum.RucPublico;
  numeroCaracteres?: number;
  identificacion?: string;
  digitoVerificador?: number,
  dosPrimerosDigitos?: number,
  tercerDigito?: number,
  digitosCedulaORuc?: string[]
}