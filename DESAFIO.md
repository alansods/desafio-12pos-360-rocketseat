# Descrição do Desafio — Financy | Pós 360 Rocketseat

Vamos desenvolver uma aplicação FullStack de gerenciamento de finanças: o Financy!

O objetivo é criar uma aplicação que permita a organização de finanças, com gestão de transações e categorias.

> Acesse o [Figma do projeto](https://www.figma.com/community/file/1580994817007013257)

---

## Entrega

Esse desafio deve ser entregue na plataforma da Rocketseat. Para o envio, é necessário criar um repositório no GitHub e enviar o link com a sua resolução.

Padrões obrigatórios para correção:

- O repositório deve estar público
- O repositório deve conter a resolução do desafio
- O repositório deve ter duas subpastas:
  - `backend` — resolução completa do desafio Back-end
  - `frontend` — resolução completa do desafio Front-end
- O repositório deve conter o código referente às regras e funcionalidades obrigatórias. Caso queira se desafiar com funcionalidades extras, crie o código em uma nova `branch`, preservando o código original.

---

## Back-end

Nesse projeto back-end será desenvolvida uma API para gerenciar a organização das finanças.

### Funcionalidades e Regras

> Para esse desafio é esperado que você utilize o banco de dados SQLite. Caso prefira, pode usar o Postgres como opção.

- [ ] O usuário pode criar uma conta e fazer login
- [ ] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ] Deve ser possível criar uma transação
- [ ] Deve ser possível deletar uma transação
- [ ] Deve ser possível editar uma transação
- [ ] Deve ser possível listar todas as transações
- [ ] Deve ser possível criar uma categoria
- [ ] Deve ser possível deletar uma categoria
- [ ] Deve ser possível editar uma categoria
- [ ] Deve ser possível listar todas as categorias

### Ferramentas obrigatórias

- TypeScript
- GraphQL
- Prisma
- SQLite

### Variáveis de ambiente

```
JWT_SECRET=
DATABASE_URL=
```

---

## Front-end

Nesse projeto front-end será desenvolvida uma aplicação React que, em conjunto com a API, permite o gerenciamento de transações e categorias.

### Funcionalidades e Regras

- [ ] O usuário pode criar uma conta e fazer login
- [ ] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ] Deve ser possível criar uma transação
- [ ] Deve ser possível deletar uma transação
- [ ] Deve ser possível editar uma transação
- [ ] Deve ser possível listar todas as transações
- [ ] Deve ser possível criar uma categoria
- [ ] Deve ser possível deletar uma categoria
- [ ] Deve ser possível editar uma categoria
- [ ] Deve ser possível listar todas as categorias
- [ ] É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como bundler
- [ ] Siga o mais fielmente possível o layout do Figma

### Páginas

A aplicação possui 6 páginas e dois modais com formulários (Dialog):

- A página raiz (`/`) que exibe:
  - Tela de login caso o usuário esteja deslogado
  - Tela dashboard caso o usuário esteja logado

### Ferramentas obrigatórias

- TypeScript
- React
- Vite (sem framework)
- GraphQL

### Ferramentas flexíveis

- TailwindCSS
- Shadcn
- React Query
- React Hook Form
- Zod

### Variáveis de ambiente

```
VITE_BACKEND_URL=
```

---

## Dicas

- Comece pela aba `Style Guide` no Figma para preparar o tema, fontes e componentes antes de criar as páginas
- Utilize bibliotecas que facilitem tanto o desenvolvimento inicial quanto a manutenção do código
- Em caso de dúvidas, utilize o espaço da comunidade e do fórum para interagir com outros alunos/instrutores
