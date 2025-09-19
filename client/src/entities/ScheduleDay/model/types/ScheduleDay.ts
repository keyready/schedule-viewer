export interface ScheduleDay {
    date: Date;
    jobs: string[];
    groupName?: string;
    kaf?: string;
}

export type GroupedSchedule = Record<string, ScheduleDay[]>;
