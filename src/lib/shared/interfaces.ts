export interface Project {
    id: string;
    name: string;
    tasks: Task[] 
}

export interface Task {
    id: string;
    name: string;
    resource?: string;
    start: Date;
    end?: Date; 
    percentComplete?: number;
    color?: string;
}

export interface IGanttOptions {
    scale: IScale;
}

export interface IScale {
    start?: Date;
    end?: Date;
}