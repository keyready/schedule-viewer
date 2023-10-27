export interface Subject {
    title: string;
    abbr: string;
    kaf: number;
    prepod: string;
}

export interface SubjectSchema {
    data?: Subject;
    error?: string;
    isLoading?: boolean;
}
