import React from 'react';
import KanbanBoard from '@/app/components/kanban/KanbanBoard';
import {KanbanItem, Law} from './types';

interface ApiResponse {
    data: Law[];
}

export default async function KanbanPage() {

    const res = await fetch(`${process.env.NEXT_API_URL}/get-laws`,
        { next: { revalidate: 600 }
        });

    const data: ApiResponse = await res.json();

    const laws: KanbanItem[] = data.data.map((law: Law) => ({
        id: law.id,
        columnId: law.statusId,
        title: law.title,
        desc: law.desc,
    }));


    return (
        <KanbanBoard
            items={laws}
            boardTitle="Lovforslag"
        />
    );
}
