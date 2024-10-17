export type Law = {
    id: number;
    statusId: number;
    title: string;
    desc: string;
};

// meant to be an abstraction for the KanbanBoard component
export type KanbanItem = {
    id: number;
    columnId: number // same as statusId for our case
    title: string;
    desc: string;
};

export type ColumnTitle = string | number;