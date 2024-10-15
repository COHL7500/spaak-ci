export type Law = {
    id: number;
    typeId: number;
    statusId: number;
    periodId: number;
    title: string;
    titleCard: string | null;
    desc: string;
};

export type ColumnTitle = string | number;