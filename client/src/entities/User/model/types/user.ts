import { UserRoles } from '../consts/consts';

export type TariffType = 'start' | 'medium' | 'extended';

export interface User {
    id: string;
    login: string;
    firstname: string;
    lastname: string;
    sex: 'male' | 'female';
    avatar?: string;
    roles?: UserRoles[];
    tariff: TariffType;
}

export interface UserSchema {
    authData?: User;

    _inited?: boolean;
}
