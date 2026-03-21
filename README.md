# Financy — Desafio Fullstack | Pós 360 Rocketseat

## Como rodar o projeto localmente

### Pré-requisitos

- Node.js 18+
- npm

---

### Backend

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e defina um valor para JWT_SECRET (ex: minha-chave-secreta)

# 3. Rodar as migrations
npm run db:migrate

# 4. (Opcional) Popular o banco com dados de exemplo
npm run db:seed

# 5. Iniciar o servidor
npm run dev
```

O servidor GraphQL estará disponível em: `http://localhost:4000/graphql`

---

### Frontend

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# O .env já vem configurado com: VITE_BACKEND_URL=http://localhost:4000

# 3. Iniciar a aplicação
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

---

## Descrição do desafio

Vamos desenvolver uma aplicação FullStack de gerenciamento de finanças: o Financy! 

O objetivo é criar uma aplicação que permita a organização de finanças, com gestão de transações e categorias.

<aside>
💜 Acesse o [**link**](https://www.figma.com/community/file/1580994817007013257) do Figma aqui.

</aside>

Para facilitar a leitura, a documentação com a descrição mais detalhada de cada área estão separadas nas subpáginas abaixo:

---

## Entrega

Esse desafio deve ser entregue na nossa plataforma.
Para o envio, é necessário criar um repositório no GitHub e enviar o link  do seu repositório na nossa plataforma com a sua resolução!

Porém, é **importante seguir alguns padrões** para que possamos **corrigir** corretamente o seu projeto:

- O repositório deve estar público;
- O repositório deve conter a resolução do desafio;
- O repositório deve ter duas subpastas
    - `backend` vai conter a resolução completa do desafio Back-end;
    - `frontend` vai conter a resolução completa do desafio Front-end.
- O repositório deve conter o código referente as regras e funcionalidades obrigatórias. Caso queira se desafiar com funcionalidades extras, crie o código com essas alterações em uma nova `branch`, preservando o seu código original do desafio.

---

### Back-end

[Descrição e Requisitos](https://www.notion.so/Descri-o-e-Requisitos-2ca395da5770814bb803df3e398cc75a?pvs=21)

Nesse projeto back-end, será desenvolvido uma API para gerenciar a organização das finanças. 

## Funcionalidades e Regras

<aside>
⚠️

Para esse desafio é esperado que você utilize o banco de dados SQLite. Caso prefira pode usar o Postgres como opção.

</aside>

- [ ]  O usuário pode criar uma conta e fazer login
- [ ]  O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ]  Deve ser possível criar uma transação
- [ ]  Deve ser possível deletar uma transação
- [ ]  Deve ser possível editar uma transação
- [ ]  Deve ser possível listar todas as transações
- [ ]  Deve ser possível criar uma categoria
- [ ]  Deve ser possível deletar uma categoria
- [ ]  Deve ser possível editar uma categoria
- [ ]  Deve ser possível listar todas as categorias∏

---

## Ferramentas

É obrigatório o uso de:

- TypeScript
- GraphQL
- Prisma
- SQLite

## Variáveis ambiente

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias.

```
JWT_SECRET=
DATABASE_URL=
```

- Caso adicione variáveis adicionais, lembre-se de incluí-las no `.env.example`. 
- Não se esqueça de habilitar o CORS na aplicação.

---

### Front-end

[Descrição e Requisitos](https://www.notion.so/Descri-o-e-Requisitos-2ca395da5770817eb404e13cb156c0ee?pvs=21)

Nesse projeto front-end será desenvolvido uma aplicação React que, em conjunto com a API, permite o gerenciamento de transações e categorias. 

## Funcionalidades e Regras

Assim como na API, temos as seguintes funcionalidades e regras:

- [ ]  O usuário pode criar uma conta e fazer login
- [ ]  O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ]  Deve ser possível criar uma transação
- [ ]  Deve ser possível deletar uma transação
- [ ]  Deve ser possível editar uma transação
- [ ]  Deve ser possível listar todas as transações
- [ ]  Deve ser possível criar uma categoria
- [ ]  Deve ser possível deletar uma categoria
- [ ]  Deve ser possível editar uma categoria
- [ ]  Deve ser possível listar todas as categorias

Além disso, também temos algumas regras importantes específicas para o front-end:

- [ ]  É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como `bundler`;
- [ ]  Siga o mais fielmente possível o layout do Figma;


## Páginas

Essa aplicação possui 6 páginas e dois modais com os formulários (Dialog):

- A página raiz (`/`) que exibe:
    - Tela de login caso o usuário esteja deslogado
    - Tela dashboard caso usuário esteja logado

## Ferramentas

É obrigatório o uso de:

- Typescript
- React
- Vite sem framework
- GraphQL

É flexível o uso de:

- TailwindCSS
- Shadcn
- React Query
- React Hook Form
- Zod

## Variáveis ambiente

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias:

```
VITE_BACKEND_URL=
```

## Dicas

- Comece o projeto pela aba `Style Guide` no Figma. Dessa forma, você prepara todo o seu tema, fontes e componentes e quando for criar as páginas vai ser bem mais tranquilo;
- Assim com a experiência do usuário é importante (UX), a sua experiência no desenvolvimento (DX) também é muito importante. Por isso, apesar de ser possível criar essa aplicação sem nenhuma biblioteca, recomendamos utilizar algumas bibliotecas que vão facilitar tanto o desenvolvimento inicial quanto a manutenção do código;
- Em caso de dúvidas, utilize o espaço da comunidade e do nosso fórum para interagir com outros alunos/instrutores e encontrar uma solução que funcione para você.