export interface IUser {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}

export interface ITask {
    id: string;
    company: string;
    createdDate: number;
    endDate: number;
    project: string;
    name: string;
    priority: IPriority;
    status: IStatus;
    description?: string;
}

export interface ICompany {
    name: string;
    id: string;
    projects: IProject[];
}

export interface IProject {
    name: string;
    id: string;
}

export enum IStatus {
    NEW = 'New',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed'
}

export enum IPriority {
    VERY_HIGH = 'Very High',
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    VERY_LOW = 'Very Low',
}

export enum IListType {
    TODO = 'TODO',
    IN_PROGRESS = 'IN PROGRESS',
    DONE = 'DONE'
}