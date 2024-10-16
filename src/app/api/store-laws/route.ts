import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

/*
 Currently, this endpoint is not used in the app. It is only used to store laws in the database.
 Ideally, it could be triggered by a cron job/calculator, webhook or a button in the app (admin panel).
 curl -X POST http://localhost:3000/api/store-laws
 */

export async function POST() {
    const endpoint = "https://oda.ft.dk/api/Sag?$filter=(typeid eq 3 or typeid eq 5 or typeid eq 9) and periodeid eq 160&$select=id,statusid,titel,titelkort,resume";

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

       const createLaws = data.value.map((law: any) => {
            return prisma.law.create({
                data: {
                    id: law.id,
                    statusId: law.statusid,
                    title: law.titel,
                    titleCard: law.titelkort || null,
                    desc: law.resume,
                },
            });
       });

       await Promise.all(createLaws);

       return NextResponse.json({ message: "Laws stored", data });
    } catch (error) {
        return NextResponse.json({ status: 500, body: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}