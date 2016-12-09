export interface GridScale {
    Height: number;
    LineHeight: number;
    Width: number;
}

export interface Bar {
    Height: number;
    LineHeight: number
}

export interface Cell {
    Height: number;
    Width: number;
}

export interface Row {
    Height: number;
}

export interface Options {
    Scale: Scale
}

export interface Project {
    Id: string;
    Name: string;
    Tasks: Task[] 
}

export interface Task {
    Id: string;
    Name: string;
    Resource: string;
    Start: Date;
    End: Date;
}

export interface Scale {
    Start: Date,
    End: Date
}