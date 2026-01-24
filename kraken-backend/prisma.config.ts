import { defineConfig } from 'prisma/config';
//TODO: cambiar la URL de la BD para que use la variable de entorno DATABASE_URL
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: "postgresql://postgres:postgres@localhost:5432/uni_jira?schema=public",
  },
});
