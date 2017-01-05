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
    end: Date; //TODO(dale): rename to finish
    percentComplete?: number;
    color?: string;
}

export interface Options {
    scale: Scale;
}

export interface Scale {
    start: Date;
    end: Date;
}