# Guia rápido: Prisma ORM + NestJS + PostgreSQL

## O que é o Prisma?

Prisma é um ORM (Object-Relational Mapping) moderno para Node.js e TypeScript, que facilita o acesso ao banco de dados de forma segura, tipada e produtiva.

## Instalação

1. **Instale as dependências:**

   ```sh
   npm install
   ```

2. **Configure o banco de dados:**

   - Edite o arquivo `.env` com sua string de conexão PostgreSQL:
     ```
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
     ```

3. **Crie o primeiro model no arquivo `prisma/schema.prisma`:**

   ```prisma
   model User {
     id    Int    @id @default(autoincrement())
     email String @unique
     name  String?
   }
   ```

4. **Rode as migrações e gere o client:**

   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Inicie o projeto:**
   ```sh
   npm run start:dev
   ```

---

## Comandos úteis do Prisma

- **Abrir o Studio (interface visual):**

  ```sh
  npx prisma studio
  ```

- **Gerar client após alterar models:**

  ```sh
  npx prisma generate
  ```

- **Criar nova migration após alterar models:**

  ```sh
  npx prisma migrate dev --name nome_da_migration
  ```

- **Ver status das migrations:**
  ```sh
  npx prisma migrate status
  ```

---

## Passo a passo para alterar models

1. **Edite o arquivo `prisma/schema.prisma` e salve.**
2. **Rode:**
   ```sh
   npx prisma migrate dev --name sua_mudanca
   npx prisma generate
   ```
3. **Pronto! O Prisma Client estará atualizado para usar os novos campos/tabelas.**

---

## Estrutura recomendada

- `prisma/schema.prisma`: Models do banco.
- `src/user/user.repository.ts`: Acesso ao banco via Prisma.
- `src/user/user.service.ts`: Lógica de negócio.
- `src/user/user.controller.ts`: Rotas HTTP.

---

## Dicas

- Use o Prisma Studio para visualizar e editar dados facilmente.
- Sempre gere o client e rode as migrations após mudar os models.
- Consulte a [documentação oficial do Prisma](https://www.prisma.io/docs) para mais exemplos.

---

## Recursos

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)

---

**Dúvidas? Pergunte ao time ou consulte este README!**
