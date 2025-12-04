import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client';

type AdapterConfig = {
   host: string;
   user: string;
   password: string;
   database: string;
   port: number;
};

const parseFromUrl = (url: string): AdapterConfig => {
   const parsed = new URL(url);
   const database = parsed.pathname.replace(/^\//, '');
   return {
      host: parsed.hostname,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database,
      port: parsed.port ? Number(parsed.port) : 3306,
   };
};

const fromDiscreteEnv = (): AdapterConfig => {
   const {
      DATABASE_HOST,
      DATABASE_USER,
      DATABASE_PASSWORD,
      DATABASE_NAME,
      DATABASE_PORT,
   } = process.env;
   if (
      !DATABASE_HOST ||
      !DATABASE_USER ||
      !DATABASE_PASSWORD ||
      !DATABASE_NAME
   ) {
      throw new Error(
         'Missing database environment variables for Prisma connection.'
      );
   }

   return {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: DATABASE_PORT ? Number(DATABASE_PORT) : 3306,
   };
};

const adapterConfig = process.env.DATABASE_URL
   ? parseFromUrl(process.env.DATABASE_URL)
   : fromDiscreteEnv();

const adapter = new PrismaMariaDb({
   host: adapterConfig.host,
   user: adapterConfig.user,
   password: adapterConfig.password,
   database: adapterConfig.database,
   port: adapterConfig.port,
   connectionLimit: 5,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
   globalForPrisma.prisma = prisma;
}
