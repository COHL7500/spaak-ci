import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {lawQuery} from "@/app/types";

const prisma = new PrismaClient();

/*
 Currently, this endpoint is not used in the app. It is only used to store laws in the database.
 Ideally, it could be triggered by a cron job/calculator, webhook or a button in the app (admin panel).
 curl -X POST http://localhost:3000/api/store-laws
 */

interface ApiResponse {
    value: lawQuery[];
}

export async function POST() {
    const endpoint = "https://oda.ft.dk/api/Sag?$filter=(typeid eq 3 or typeid eq 5 or typeid eq 9) and periodeid eq 160&$select=id,statusid,titel,titelkort,resume";
    let allLaws: lawQuery[] = [];
    let skip = 0;
    const limit = 100;

    try {
        while (true) {
            const res = await fetch(`${endpoint}&$skip=${skip}`);
            const data: ApiResponse = await res.json();

            if (data.value.length === 0) {
                break;
            }

            allLaws = allLaws.concat(data.value);
            skip += limit;
        }

       const createLaws = allLaws.map((law: lawQuery) => {
            return prisma.law.create({
                data: {
                    id: law.id,
                    statusId: law.statusid,
                    title: law.titel || law.titelkort,
                    desc: law.resume || "", // could also just be law.resume ?? ""
                },
            });
       });

       await Promise.all(createLaws);

       return NextResponse.json({ message: "Laws stored", data: allLaws });
    } catch (error) {
        return NextResponse.json({ status: 500, body: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}