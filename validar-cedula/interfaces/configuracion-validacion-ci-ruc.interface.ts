import {TipoIdentificacionEnum} from '../enums/tipo-identificacion.enum';

export interface ConfiguracionValidacionCiRuc {
    tipoCedulaORuc?:
        | TipoIdentificacionEnum.CI
        | TipoIdentificacionEnum.RucNatural
        | TipoIdentificacionEnum.RucPrivado
        | TipoIdentificacionEnum.RucPublico;
    numeroCaracteresCedulaORuc?: number;
    numeroCedulaORuc?: string;
    digitoVerificador?: number,
    dosPrimerosDigitos?: number,
    tercerDigito?: number,
    arregloDigitosCedulaORuc?: string[]
}
