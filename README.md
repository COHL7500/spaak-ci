## Getting Started

1. First, run the development server:

```bash
npm run dev
```

2. Run ``npx prisma generate`` to generate the prisma client.


3. Run the following command (also shown in ``src/app/api/store-laws/route.ts``):

`` curl -X POST http://localhost:3000/api/store-laws ``

This will store all the laws in the psql database.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


