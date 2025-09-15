export interface ScheduleDay {
    date: Date;
    jobs: string[];
    groupName?: string;
}

export type GroupedSchedule = Record<string, ScheduleDay[]>;
