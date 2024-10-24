export type Law = {
    id: number;
    statusId: number;
    title: string;
    desc: string;
};

// meant to be an abstraction for the KanbanBoard component
export type KanbanItem = Omit<Law, 'statusId'> & {
    columnId: number; // same as statusId for our case
};

// can always add more types if expansion is needed
export type lawQuery = {
    id: number;
    statusid: number;
    titel: string;
    titelkort: string;
    resume: string;
}

export type ColumnTitle = string | number;