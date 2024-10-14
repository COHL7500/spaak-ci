import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
      const laws = await prisma.law.findMany();
      return NextResponse.json({ data: laws });
  } catch (error) {
        return NextResponse.json({ status: 500, body: "Internal Server Error" });
  } finally {
        await prisma.$disconnect();
  }
}