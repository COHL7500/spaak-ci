import React from 'react';
import KanbanBoard from '@/app/components/kanban/KanbanBoard';
import {KanbanItem, Law} from './types';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

interface ApiResponse {
    data: Law[];
}

export default async function KanbanPage() {
    const session = await getServerSession(authOptions);
    const username = session?.user?.name || 'Guest';

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
        <div>
            <h2>Welcome {username}!</h2>
            <KanbanBoard
                items={laws}
                boardTitle="Lovforslag"
            />
        </div>
    );
}
