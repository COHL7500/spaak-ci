import React from 'react';
import KanbanBoard from '@/app/components/KanbanBoard';
import {KanbanItem, Law} from './types';

export default async function KanbanPage() {

    const res = await fetch(`${process.env.NEXT_API_URL}/get-laws`,
        { next: { revalidate: 600 }
        });

    const data = await res.json();

    const laws: KanbanItem[] = data.data.map((law: Law) => ({
        columnId: law.statusId,
        title: law.titleCard ?? law.title,
        desc: law.desc,
    }));


    return (
        <KanbanBoard
            items={laws}
            groupBy="columnId"
        />
    );
}
