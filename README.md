# 🌊 CoastalAPI

Sistema completo para consulta de praias de Florianópolis, permitindo cadastro de usuários, gerenciamento de favoritos e avaliações das praias.

O projeto é dividido em:

- **Backend:** API REST desenvolvida com Node.js, Express e PostgreSQL.
- **Frontend:** Aplicação React com Vite para interação com os usuários.
- **Banco de Dados:** PostgreSQL com estrutura relacional e dados iniciais das praias.

---

# 📋 Funcionalidades

## Usuários
- Cadastro de usuários
- Login/autenticação
- Consulta de usuários

## Praias
- Listagem de praias
- Consulta por ID
- Informações sobre:
  - Região
  - Nível de perigo
  - Descrição
  - Possibilidade de surf

## Favoritos
- Adicionar praias aos favoritos
- Remover favoritos
- Listar favoritos do usuário

## Avaliações
- Criar avaliações
- Consultar avaliações
- Associar avaliações a usuários e praias

---

# 🛠️ Tecnologias Utilizadas

## Backend
- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Jest
- Supertest

## Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
- Jest
- Testing Library

---

# 📂 Estrutura do Projeto

```text
CoastalAPI/
│
├── Backend/
│   ├── db/
│   ├── src/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── routes/
│   │   └── config/
│   └── test/
│
├── FrontEnd/
│   └── guia-praias/
│
└── Documents/
```

---

# ⚙️ Configuração do Banco

Crie um banco PostgreSQL e execute o arquivo:

```sql
Backend/db/schema.sql
```

O script cria:

- Tabela `usuario`
- Tabela `praia`
- Tabela `favorito`
- Tabela `avaliacao`
- Tipos ENUM para regiões e níveis de perigo
- Dados iniciais das praias de Florianópolis

---

# 🔧 Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `Backend`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=coastalapi
```

---

# 🚀 Executando o Backend

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

Servidor padrão:

```text
http://localhost:3000
```

Endpoint inicial:

```text
GET /
```

Resposta:

```text
API Guia de Praias 🌊
```

---

# 💻 Executando o Frontend

Acesse:

```bash
cd FrontEnd/guia-praias
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:5173
```

---

# 🧪 Testes

## Backend

```bash
npm test
```

Utiliza:

- Jest
- Supertest

## Frontend

```bash
cd FrontEnd/guia-praias
npm test
```

Utiliza:

- Jest
- React Testing Library

---

# 📡 Principais Rotas

## Praias

```http
GET /praias
GET /praias/:id
POST /praias
PUT /praias/:id
DELETE /praias/:id
```

## Usuários

```http
GET /usuarios
GET /usuarios/:id
POST /usuarios
PUT /usuarios/:id
DELETE /usuarios/:id
```

## Favoritos

```http
GET /favoritos
POST /favoritos
DELETE /favoritos
```

## Avaliações

```http
GET /avaliacoes
POST /avaliacoes
PUT /avaliacoes/:id
DELETE /avaliacoes/:id
```

---

# 🎯 Objetivo Acadêmico

Projeto desenvolvido para praticar:

- Arquitetura em camadas
- Desenvolvimento de APIs REST
- Integração Frontend + Backend
- PostgreSQL
- Testes automatizados
- Organização de projetos JavaScript modernos

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.
