import React from 'react';
import KanbanBoard from '@/app/components/KanbanBoard';
import { Law } from './types';

export default async function KanbanPage() {

    const res = await fetch(`${process.env.NEXT_API_URL}/get-laws`,
        { cache: "no-store"});


    const data = await res.json();

    const laws: Law[] = data.data.map((law: Law) => ({
        id: law.id,
        statusId: law.statusId,
        title: law.title,
        // TODO: Potentially remove titleCard if item wont have page
        titleCard: law.titleCard ?? law.title,
        desc: law.desc,
    }));


    return (
        <KanbanBoard
            items={laws}
            groupBy="statusId"
        />
    );
}
