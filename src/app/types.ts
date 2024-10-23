export type Law = {
    id: number;
    statusId: number;
    title: string;
    desc: string;
};

// meant to be an abstraction for the KanbanBoard component
export type KanbanItem = {
    id: number;
    columnId: number; // same as statusId for our case
    title: string;
    desc: string;
};

// can always add more types if expansion is needed
export type lawQuery = {
    id: number;
    statusid: number;
    titel: string;
    titelkort: string;
    resume: string;
}

export interface profile {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export type ColumnTitle = string | number;