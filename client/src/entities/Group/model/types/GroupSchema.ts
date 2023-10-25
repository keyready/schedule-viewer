import { Group } from './Group';

export interface GroupSchema {
    data?: Group;
    isLoading: boolean;
    error?: string;
}
