import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export async function POST() {
    const endpoint = "https://oda.ft.dk/api/Sag?$filter=(typeid eq 3 or typeid eq 5 or typeid eq 9) and periodeid eq 160&$select=id,periodeid,kategoriid,typeid,statusid,titel,titelkort,resume";


    try {
        const response = await fetch(endpoint);
        const data = await response.json();

       const createLaws = data.value.map((law: any) => {
            return prisma.law.create({
                data: {
                    typeId: law.typeid,
                    statusId: law.statusid,
                    periodId: law.periodeid,
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