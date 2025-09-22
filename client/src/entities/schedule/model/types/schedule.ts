import { DateValue } from '@internationalized/date';

export interface ScheduleState {
    data: Record<string, any[]>;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

export interface ScheduleGroupDay {
    date: Date;
    jobs: string[];
    groupName: string;
    lectern?: string;
}

export interface ScheduleDay {
    type: string;
    title: string;
    classroom: string;
}

export type GroupedSchedule = Record<string, ScheduleGroupDay[]>;

export interface ScheduleApiParams {
    workDir: string;
    day?: DateValue | null;
}

export interface GroupScheduleApiParams {
    groupName: string;
}

export interface ScheduleApiResponse {
    data: ScheduleGroupDay[];
}

export interface ScheduleFilters {
    workDir: string;
    day?: string;
}
