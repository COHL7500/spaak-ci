import React from 'react';
import KanbanBoard from '@/app/components/kanban/KanbanBoard';
import {KanbanItem, Law} from './types';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {GET_ALL_LAWS} from "@/graphql/queries";

interface ApiResponse {
    allLaws: Law[];
}

export default async function KanbanPage() {
    const session = await getServerSession(authOptions);
    const username = session?.user?.name || 'Guest';


    const client = new ApolloClient({
        uri: 'http://localhost:4000',
        cache: new InMemoryCache(),
    });

    const { data }: {data: ApiResponse} = await client.query({
        query: GET_ALL_LAWS
    })

    //const FirstLaw = data?.allLaws[0];

    /*
    const res = await fetch(`${process.env.NEXT_API_URL}/get-laws`,
        { next: { revalidate: 600 }
        });
     */

    //const data: ApiResponse = await res.json();


    const laws: KanbanItem[] = data?.allLaws.map((law: Law) => ({
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
