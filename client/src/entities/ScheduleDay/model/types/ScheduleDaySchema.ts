import { ScheduleDay } from './ScheduleDay';

export interface ScheduleDaySchema {
    data?: ScheduleDay;
    isLoading: boolean;
    error?: string;
}
