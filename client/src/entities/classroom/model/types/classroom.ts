export interface Classroom {
    _id: string;
    title: string;
    kafTitle: string;
}

export interface CreateClassroomAPI {
    audsTitles?: string[];
    parentKafId?: string;
}
