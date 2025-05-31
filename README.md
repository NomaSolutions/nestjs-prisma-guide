# Guia rápido: Prisma ORM + NestJS + PostgreSQL

## O que é o Prisma?

Prisma é um ORM (Object-Relational Mapping) moderno para Node.js e TypeScript, que facilita o acesso ao banco de dados de forma segura, tipada e produtiva.

---

## Por que usar Docker Compose?

O arquivo `docker-compose.yml` permite subir facilmente um banco PostgreSQL local para desenvolvimento, sem precisar instalar nada manualmente. Ele garante que todos da equipe usem a mesma versão/configuração do banco, facilitando o onboarding e evitando problemas de ambiente.

**Vantagens:**

- Sobe o banco de dados com um comando.
- Facilita testes e desenvolvimento local.
- Evita conflitos de versões/configurações.

**Como usar:**

```sh
docker compose up -d
```

Isso criará um container PostgreSQL acessível em `localhost:5432`.

---

## Cenário 1: Primeira inicialização e execução

1. **Clone o repositório e instale as dependências:**

   ```sh
   git clone <repo>
   cd nestjs-prisma-guide
   npm install
   ```

2. **Suba o banco de dados com Docker Compose:**

   ```sh
   docker compose up -d
   ```

3. **Configure o arquivo `.env`:**

   - Copie `.env.example` para `.env` e ajuste a variável `DATABASE_URL` se necessário.

4. **Rode as migrações iniciais e gere o Prisma Client:**

   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Inicie o projeto:**

   ```sh
   npm run start:dev
   ```

6. **(Opcional) Abra o Prisma Studio para visualizar o banco:**
   ```sh
   npx prisma studio
   ```

---

## Cenário 2: Alterei os models, o que fazer?

Sempre que alterar o arquivo `prisma/schema.prisma` (adicionar/remover campos, models, relacionamentos):

1. **Salve o arquivo `schema.prisma`.**
2. **Crie uma nova migration e atualize o banco:**
   ```sh
   npx prisma migrate dev --name <nome_da_mudanca>
   ```
3. **Gere novamente o Prisma Client:**
   ```sh
   npx prisma generate
   ```
4. **Reinicie a aplicação se necessário.**

**Comandos úteis:**

- Ver status das migrations:
  ```sh
  npx prisma migrate status
  ```
- Resetar o banco (apaga tudo e recria):
  ```sh
  npx prisma migrate reset
  ```
- Abrir o Prisma Studio:
  ```sh
  npx prisma studio
  ```

---

## Funcionalidades mais usadas do Prisma

### **CRUD:**  
Permite criar, ler, atualizar e deletar registros.

- **Exemplo:**
  ```ts
  // Criar
  await prisma.user.create({ data: { email: 'a@b.com', name: 'Ana' } });

  // Buscar todos
  await prisma.user.findMany();

  // Buscar por ID
  await prisma.user.findUnique({ where: { id: 1 } });

  // Atualizar
  await prisma.user.update({ where: { id: 1 }, data: { name: 'Novo Nome' } });

  // Deletar
  await prisma.user.delete({ where: { id: 1 } });
  ```
- **Por que usar:** Operações básicas de qualquer aplicação.
- **Vantagens:** Simples, tipado, seguro.
- **Desvantagens:** Para operações complexas, pode ser necessário combinar com outros recursos.

---

### **Filtros avançados:**  
Permite buscar dados com condições, ordenação e distinção.

- **Exemplo:**
  ```ts
  // Buscar usuários com email do gmail, ordenados por nome
  await prisma.user.findMany({
    where: { email: { contains: '@gmail.com' } },
    orderBy: { name: 'asc' },
    distinct: ['email'],
  });
  ```
- **Por que usar:** Para consultas refinadas e segmentadas.
- **Vantagens:** Flexibilidade, evita múltiplas queries.
- **Desvantagens:** Consultas muito complexas podem ficar difíceis de ler.

---

### **Relacionamentos (include, select, relations):**  
Permite buscar dados relacionados em uma única consulta.

- **Exemplo:**
  ```ts
  // Buscar usuário e seus posts
  await prisma.user.findMany({
    include: { posts: true },
  });

  // Buscar apenas o nome do usuário
  await prisma.user.findMany({
    select: { name: true },
  });
  ```
- **Por que usar:** Evita múltiplas queries, traz dados completos.
- **Vantagens:** Performance, menos código.
- **Desvantagens:** Pode trazer dados desnecessários se não filtrar bem.

---

### **Paginação (skip, take):**  
Permite buscar dados em partes (páginas).

- **Exemplo:**
  ```ts
  // Buscar 10 usuários a partir do 20º
  await prisma.user.findMany({
    skip: 20,
    take: 10,
  });
  ```
- **Por que usar:** Para listas grandes, melhorar performance e UX.
- **Vantagens:** Evita sobrecarga de dados.
- **Desvantagens:** Paginação baseada em skip/take pode ser ineficiente em tabelas muito grandes.

---

### **Transações ($transaction):**  
Executa múltiplas operações de banco de dados de forma atômica.

- **Exemplo:**
  ```ts
  await prisma.$transaction([
    prisma.user.create({ data: { email: 'a@b.com' } }),
    prisma.post.create({ data: { title: 'Post', userId: 1 } }),
  ]);
  ```
- **Por que usar:** Garantir que várias operações sejam feitas juntas ou nenhuma.
- **Vantagens:** Consistência dos dados.
- **Desvantagens:** Pode aumentar o tempo de bloqueio no banco.

---

### **Raw SQL ($queryRaw, $executeRaw):**  
Permite executar comandos SQL diretamente.

- **Exemplo:**
  ```ts
  await prisma.$queryRaw`SELECT * FROM "User" WHERE email LIKE '%@gmail.com%'`;
  ```
- **Por que usar:** Para consultas muito específicas ou não suportadas pelo Prisma.
- **Vantagens:** Flexibilidade total.
- **Desvantagens:** Perde tipagem, risco de SQL Injection se não usar template string.

---

### **Middlewares:**  
Intercepta queries para adicionar lógica extra (ex: logging, validação).

- **Exemplo:**
  ```ts
  prisma.$use(async (params, next) => {
    console.log('Query:', params);
    return next(params);
  });
  ```
- **Por que usar:** Auditar, validar ou modificar queries.
- **Vantagens:** Centraliza lógica comum.
- **Desvantagens:** Pode impactar performance se mal utilizado.

---

### **Migration:**  
Versiona e aplica mudanças no banco via código.

- **Exemplo:**
  ```sh
  npx prisma migrate dev --name add_user_table
  ```
- **Por que usar:** Sincronizar estrutura do banco entre ambientes.
- **Vantagens:** Histórico, controle, automação.
- **Desvantagens:** Migrations mal feitas podem causar perda de dados.

---

### **Seed:**  
Popular o banco com dados iniciais.

- **Exemplo:**
  ```ts
  // prisma/seed.ts
  await prisma.user.create({ data: { email: 'admin@admin.com' } });
  ```
  ```sh
  npx prisma db seed
  ```
- **Por que usar:** Testes, ambientes de desenvolvimento.
- **Vantagens:** Facilita setup do ambiente.
- **Desvantagens:** Não deve ser usado para dados reais em produção.

---

### **Validação de tipos:**  
Prisma gera tipos TypeScript baseados no schema.

- **Exemplo:**
  ```ts
  import { User } from '@prisma/client';
  ```
- **Por que usar:** Segurança e produtividade no desenvolvimento.
- **Vantagens:** Menos bugs, autocomplete.
- **Desvantagens:** Depende de rodar `prisma generate` após mudanças.

---

### **Omit/Partial (TypeScript):**  
Manipula tipos para criar DTOs ou inputs.

- **Exemplo:**
  ```ts
  type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  ```
- **Por que usar:** Para inputs de criação/atualização.
- **Vantagens:** Reutilização de tipos.
- **Desvantagens:** Pode esconder campos importantes se não usado com atenção.

---

### **Conexão (pool):**  
Prisma gerencia automaticamente as conexões com o banco.

- **Exemplo:**  
  Não precisa configurar manualmente, mas pode ajustar no `.env`:
  ```
  DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=10"
  ```
- **Por que usar:** Performance e estabilidade.
- **Vantagens:** Menos preocupação com leaks de conexão.
- **Desvantagens:** Em ambientes serverless, pode ser necessário ajustar configs.

---

### **Soft delete:**  
Implementa exclusão lógica usando um campo (ex: `deletedAt`).

- **Exemplo:**
  ```prisma
  model User {
    id        Int
    deletedAt DateTime?
  }
  ```
  ```ts
  // Para "deletar"
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  // Para buscar só ativos
  await prisma.user.findMany({ where: { deletedAt: null } });
  ```
- **Por que usar:** Não perder dados, histórico.
- **Vantagens:** Recuperação fácil.
- **Desvantagens:** Consultas precisam sempre filtrar por `deletedAt: null`.

---

### **Aggregation:**  
Operações de contagem, soma, média, etc.

- **Exemplo:**
  ```ts
  await prisma.user.aggregate({
    _count: { id: true },
    _avg: { id: true },
  });
  ```
- **Por que usar:** Relatórios, dashboards.
- **Vantagens:** Consulta eficiente direto no banco.
- **Desvantagens:** Para agregações muito complexas, pode ser melhor usar SQL puro.

---

**Exemplo de uso de include:**

```ts
prisma.user.findMany({
  include: { posts: true },
});
```

**Exemplo de uso de filtros:**

```ts
prisma.user.findMany({
  where: { email: { contains: '@gmail.com' } },
});
```

---

## O que é Migration? Para que serve e quando usar?

Migration é o processo de versionar e aplicar mudanças no banco de dados de forma controlada e automatizada. Cada migration representa uma alteração (criação de tabela, adição de campo, etc).

**Quando usar:**

- Sempre que alterar o schema do banco (models, campos, relacionamentos).
- Para garantir que todos os ambientes (dev, prod, CI) estejam sincronizados.

**Vantagens:**

- Histórico de mudanças do banco.
- Facilidade para atualizar ambientes.
- Evita erros manuais.

**Comando principal:**

```sh
npx prisma migrate dev --name <nome_da_mudanca>
```

---

## Boas práticas e coisas a evitar

### Boas práticas:

- Sempre use migrations para alterar o banco.
- Gere o Prisma Client após cada alteração no schema.
- Use Docker Compose para garantir ambiente consistente.
- Use o Prisma Studio para inspecionar dados.
- Separe lógica de acesso ao banco em repositórios.
- Use tipagem do Prisma para evitar erros.

### Evite:

- Alterar o banco manualmente (via SQL) sem migration.
- Esquecer de rodar `prisma generate` após mudar o schema.
- Deixar migrations fora do versionamento (adicione ao git).
- Usar migrations em produção sem testar em dev/staging.
- Expor dados sensíveis no código ou no schema.

---

## Recursos

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)

---

**Dúvidas? Pergunte ao time ou consulte este README!**
