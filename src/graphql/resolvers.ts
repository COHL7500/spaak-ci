import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        law: async (_: any, {id}: {id: number}) => {
            const law = await prisma.law.findUnique({ where: { id } });

            if (!law) {
                throw new Error(`Law with ID ${id} not found`);
            }

            return {
                ...law,
                title: law.title ?? "Undefined"
            }
        },
        allLaws: async () => {
            const laws = await prisma.law.findMany();

            return laws.map(law => ({
                ...law,
                title: law.title ?? "Undefined"
            }));
        },
    }
}