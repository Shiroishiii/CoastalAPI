# ENTREGA 08 — TESTES DE SOFTWARE
## CoastalAPI — Guia de Praias de Florianópolis

**Disciplina:** Engenharia de Software / Qualidade e Testes  
**Projeto:** CoastalAPI — Guia de Praias  
**Repositório:** CoastalAPI-main  
**Data de Geração:** 2025  

---

## Sumário

1. [8.1 Casos de Teste](#81-casos-de-teste)
2. [8.2 Ferramentas e Ambientes de Teste](#82-ferramentas-e-ambientes-de-teste)
3. [8.3 Requisitos Funcionais](#83-requisitos-funcionais)
4. [Execução dos Testes Unitários](#execução-dos-testes-unitários)
5. [Relatório de Execução e Validação](#relatório-de-execução-e-validação)

---

## 8.1 Casos de Teste

A tabela a seguir apresenta os casos de teste definidos para a aplicação CoastalAPI, organizados por operação CRUD e cobrindo cenários positivos e negativos.

| ID Caso de Teste | ID Requisito | Descrição | Pré-condições | Passos para Execução | Resultado Esperado |
|---|---|---|---|---|---|
| CT-001 | RF-001 | Cadastro de usuário com dados válidos | Backend rodando em localhost:3000 | 1. Acessar /cadastro; 2. Preencher nome, e-mail e senha válidos; 3. Clicar em "Cadastrar" | Usuário criado, toast de sucesso exibido e redirecionamento para /home |
| CT-002 | RF-001 | Cadastro com e-mail em formato inválido | Nenhuma | 1. Acessar /cadastro; 2. Informar e-mail sem "@"; 3. Clicar em "Cadastrar" | Validação HTML5 impede envio do formulário; API não é chamada |
| CT-003 | RF-001 | Cadastro com e-mail já existente | Usuário com mesmo e-mail já cadastrado | 1. Acessar /cadastro; 2. Preencher e-mail duplicado; 3. Clicar em "Cadastrar" | API retorna erro; toast de erro "Erro ao cadastrar usuário." exibido |
| CT-004 | RF-005 | Envio de avaliação com nota e comentário válidos | Usuário logado (usuarioId no localStorage) | 1. Acessar detalhe de uma praia; 2. Selecionar nota; 3. Digitar comentário; 4. Clicar em "Enviar Avaliação" | POST enviado para /api/avaliacoes; lista de avaliações atualizada |
| CT-005 | RF-005 | Tentativa de avaliação sem autenticação | Usuário não logado | 1. Acessar detalhe de uma praia sem fazer login; 2. Clicar em "Enviar Avaliação" | Alerta "Faça login para avaliar." exibido; POST não realizado |
| CT-006 | RF-006 | Adicionar praia aos favoritos | Usuário logado; praia ainda não favoritada | 1. Acessar detalhe de uma praia; 2. Clicar em "Favoritar" | POST enviado para /api/favoritos; botão muda para "Favoritada" |
| CT-007 | RF-001 | Erro de rede ao cadastrar usuário | Servidor fora do ar | 1. Acessar /cadastro; 2. Preencher formulário; 3. Clicar em "Cadastrar" | Toast de erro "Erro ao cadastrar usuário." exibido |
| CT-008 | RF-003 | Listagem de praias retorna registros | Backend com praias cadastradas | 1. Acessar /praias | Todos os cards de praias renderizados; contador de resultados exibido |
| CT-009 | RF-003 | Listagem de praias com array vazio | Backend sem praias cadastradas | 1. Acessar /praias | Mensagem "Nenhuma praia encontrada." exibida |
| CT-010 | RF-003 | Erro ao carregar praias da API | Backend offline | 1. Acessar /praias | Mensagem de erro exibida com dica sobre o backend |
| CT-011 | RF-004 | Filtragem de praias por nome | Praias listadas na tela | 1. Acessar /praias; 2. Digitar "cam" no campo de busca | Apenas "Campeche" exibido; demais praias ocultas |
| CT-012 | RF-009 | Dashboard exibe totais de praias e usuários | Backend com dados | 1. Acessar /dashboard | Totais de praias, usuários e regiões exibidos corretamente |
| CT-013 | RF-003 | Detalhe de praia exibe informações completas | Praia cadastrada | 1. Acessar /praias/:id | Nome, região, nível de perigo e avaliações exibidos |
| CT-014 | RF-007 | Listagem de favoritos do usuário logado | Usuário logado com praias favoritadas | 1. Acessar /favoritos | Praias favoritas exibidas em cards |
| CT-015 | RF-008 | Atualização de dados do usuário com sucesso | Usuário logado | 1. Acessar /configuracoes; 2. Alterar nome; 3. Preencher senha; 4. Clicar em "Salvar" | PUT enviado; toast de sucesso; campo senha limpo |
| CT-016 | RF-008 | Acesso a configurações sem autenticação | Usuário não logado | 1. Acessar /configuracoes | Mensagem de acesso negado e link para /login exibidos |
| CT-017 | RF-008 | Erro de API ao salvar configurações | Backend retorna erro | 1. Acessar /configuracoes; 2. Preencher senha; 3. Clicar em "Salvar" | Toast de erro exibido; dados não atualizados |
| CT-018 | RF-008 | Campo senha obrigatório nas configurações | Usuário logado | 1. Acessar /configuracoes; 2. Não preencher senha; 3. Tentar salvar | Input com atributo `required`; formulário não enviado sem senha |
| CT-019 | RF-008 | Campos pré-preenchidos com dados do usuário | Usuário logado | 1. Acessar /configuracoes | Campos nome e e-mail preenchidos com dados atuais do usuário |
| CT-020 | RF-008 | Botão desabilitado durante salvamento | Usuário logado | 1. Acessar /configuracoes; 2. Preencher senha; 3. Clicar em "Salvar" | Botão mostra "Salvando..." e fica desabilitado durante a requisição |
| CT-021 | RF-006 | Remoção de favorito com sucesso | Usuário logado; praia já favoritada | 1. Acessar detalhe de praia favoritada; 2. Clicar em "Favoritada" | DELETE enviado para /api/favoritos com usuario_id e praia_id corretos |
| CT-022 | RF-006 | Tentativa de desfavoritar sem login | Usuário não logado | 1. Acessar detalhe de praia; 2. Clicar em "Favoritar" | Alerta "Faça login para favoritar." exibido |
| CT-023 | RF-006 | Erro de API ao remover favorito | Backend offline | 1. Acessar detalhe de praia favoritada; 2. Clicar em "Favoritada" | Erro capturado; aplicação não quebra; console.error chamado |
| CT-024 | RF-006 | Toggle favorito: favoritado → não-favoritado | Praia favoritada; usuário logado | 1. Clicar em "Favoritada" | Botão muda para "Favoritar" após o click |
| CT-025 | RF-006 | Toggle favorito: não-favoritado → favoritado | Praia não favoritada; usuário logado | 1. Clicar em "Favoritar" | Botão muda para "Favoritada" após o click |

---

## 8.2 Ferramentas e Ambientes de Teste

### Ferramentas Utilizadas

| Ferramenta | Versão | Finalidade |
|---|---|---|
| **Jest** | ^30.3.0 | Framework principal de testes unitários |
| **React Testing Library** | ^16.3.2 | Renderização e interação com componentes React |
| **@testing-library/user-event** | ^14.6.1 | Simulação de eventos de usuário |
| **@testing-library/jest-dom** | ^6.9.1 | Matchers customizados para o DOM |
| **babel-jest** | ^30.3.0 | Transpilação de JSX/ES Modules para Jest |
| **jest-environment-jsdom** | ^30.3.0 | Ambiente DOM virtual para testes no browser |
| **identity-obj-proxy** | ^3.0.0 | Mock de módulos CSS |

### Ambiente de Teste

| Item | Valor |
|---|---|
| **Ambiente** | Desenvolvimento Local |
| **Servidor de Teste** | Node.js (versão LTS recomendada: 20.x) |
| **Banco de Dados** | PostgreSQL 15+ |
| **Browser Utilizado** | Google Chrome (versão mais recente) |
| **Sistema Operacional** | Windows / macOS / Linux |
| **Gerenciador de Pacotes** | npm |

### Configuração do Jest

O projeto possui arquivo `jest.config.cjs` com as seguintes configurações:

```js
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
};
```

### Configuração do Babel

```js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
```

---

## 8.3 Requisitos Funcionais

A tabela a seguir lista os requisitos funcionais identificados na análise do código-fonte do projeto CoastalAPI.

| ID do Requisito | Nome do Requisito | Descrição |
|---|---|---|
| RF-001 | Cadastrar Usuário | Permite que um novo usuário crie uma conta fornecendo nome, e-mail e senha. Endpoint: `POST /usuarios`. |
| RF-002 | Autenticar Usuário (Login) | Permite que um usuário existente faça login com e-mail, buscando o registro via `GET /usuarios` e armazenando os dados no localStorage. |
| RF-003 | Listar e Visualizar Praias | Permite listar todas as praias cadastradas (`GET /praias`) e consultar o detalhe de uma praia específica (`GET /praias/:id`), incluindo nome, região, descrição, nível de perigo e disponibilidade de surf. |
| RF-004 | Filtrar Praias por Nome | Permite filtrar as praias exibidas na listagem por meio de um campo de busca textual, filtrando pelo campo `nome`. |
| RF-005 | Avaliar Praia | Permite que um usuário autenticado envie uma avaliação (nota de 1 a 5 e comentário) para uma praia. Endpoint: `POST /avaliacoes`. |
| RF-006 | Favoritar / Desfavoritar Praia | Permite que um usuário autenticado adicione (`POST /favoritos`) ou remova (`DELETE /favoritos`) uma praia dos seus favoritos. O estado de "favoritado" é verificado via `GET /favoritos/verificar/:usuarioId/:praiaId`. |
| RF-007 | Listar Praias Favoritas | Permite ao usuário logado visualizar todas as suas praias favoritas. Endpoint: `GET /favoritos/usuario/:id`. |
| RF-008 | Atualizar Dados do Usuário | Permite que o usuário logado atualize seu nome, e-mail e senha. Endpoint: `PUT /usuarios/:id`. O campo senha é obrigatório. |
| RF-009 | Exibir Dashboard com Estatísticas | Exibe para o administrador o total de praias, usuários cadastrados e número de regiões mapeadas, consumindo `GET /praias` e `GET /usuarios`. |
| RF-010 | Logout | Permite ao usuário encerrar a sessão removendo os dados do localStorage. Implementado na função `logout()` em `utils/auth.js`. |

---

## Execução dos Testes Unitários

### Objetivo dos Testes

Verificar o comportamento individual dos componentes e páginas do frontend React, garantindo que cada funcionalidade do CRUD responde corretamente tanto em cenários de sucesso quanto em cenários de falha (campos inválidos, erros de API, ausência de autenticação).

### Escopo

Os testes cobrem o frontend React da aplicação CoastalAPI, especificamente:

- **Páginas:** `Register`, `Login`, `PraiasPage`, `DetalhePraia`, `Favoritos`, `Dashboard`, `Configuracoes`
- **Utilitários:** `utils/api.js`, `utils/auth.js`
- **Operações CRUD:** Create (cadastro de usuário, avaliação, favorito), Read (listagem de praias, detalhe, favoritos, dashboard), Update (configurações do usuário), Delete (remoção de favorito)

Os testes de backend (Express + PostgreSQL) e testes de integração E2E estão fora do escopo desta entrega.

### Tipos de Teste Aplicados

- **Testes Unitários** — Componentes React isolados com mocks de dependências externas (fetch, react-router-dom, react-toastify, localStorage)

### Ambiente de Testes

- **Runtime:** Node.js com ambiente JSDOM (simulação de browser)
- **Mocking de API:** `jest.fn()` e `global.fetch` mockado
- **Isolamento:** Cada suite reseta módulos via `jest.resetModules()` e limpa mocks via `jest.clearAllMocks()`

### Ferramentas Utilizadas

- **Jest** v30.3.0 — Orquestrador de testes, assertions, mocks e cobertura
- **React Testing Library** v16.3.2 — Renderização de componentes e queries por elementos acessíveis
- **@testing-library/user-event** v14.6.1 — Simulação realista de eventos do usuário
- **Node.js** — Ambiente de execução

---

## Relatório de Execução e Validação dos Testes

### Registro dos Resultados Obtidos

| Caso de Teste | Descrição Resumida | Arquivo | Resultado Esperado |
|---|---|---|---|
| CT-001 | Cadastro válido redireciona para /home | create.test.js | ✅ Aprovado |
| CT-002 | Formulário com e-mail inválido não chama API | create.test.js | ✅ Aprovado |
| CT-003 | E-mail duplicado exibe toast de erro | create.test.js | ✅ Aprovado |
| CT-004 | POST avaliação com dados corretos | create.test.js | ✅ Aprovado |
| CT-005 | Alert ao avaliar sem login | create.test.js | ✅ Aprovado |
| CT-006 | POST favorito ao clicar em Favoritar | create.test.js | ✅ Aprovado |
| CT-007 | Erro de rede exibe toast.error no cadastro | create.test.js | ✅ Aprovado |
| CT-008 | Cards de praias renderizados com sucesso | read.test.js | ✅ Aprovado |
| CT-009 | Mensagem "Nenhuma praia encontrada" | read.test.js | ✅ Aprovado |
| CT-010 | Mensagem de erro de API exibida | read.test.js | ✅ Aprovado |
| CT-011 | Filtragem por nome funciona corretamente | read.test.js | ✅ Aprovado |
| CT-012 | Dashboard exibe totais corretos | read.test.js | ✅ Aprovado |
| CT-013 | Detalhe de praia com avaliações exibido | read.test.js | ✅ Aprovado |
| CT-014 | Lista de favoritos do usuário logado | read.test.js | ✅ Aprovado |
| CT-015 | PUT configurações com sucesso | update.test.js | ✅ Aprovado |
| CT-016 | Acesso negado sem login em configurações | update.test.js | ✅ Aprovado |
| CT-017 | Erro de API ao salvar configurações | update.test.js | ✅ Aprovado |
| CT-018 | Campo senha tem atributo required | update.test.js | ✅ Aprovado |
| CT-019 | Campos pré-preenchidos com dados do usuário | update.test.js | ✅ Aprovado |
| CT-020 | Botão desabilitado durante salvamento | update.test.js | ✅ Aprovado |
| CT-021 | DELETE favorito com dados corretos | delete.test.js | ✅ Aprovado |
| CT-022 | Alert ao desfavoritar sem login | delete.test.js | ✅ Aprovado |
| CT-023 | Erro de API ao remover favorito tratado | delete.test.js | ✅ Aprovado |
| CT-024 | Toggle: favoritado → não-favoritado | delete.test.js | ✅ Aprovado |
| CT-025 | Toggle: não-favoritado → favoritado | delete.test.js | ✅ Aprovado |

**Total: 25 casos de teste | 25 aprovados | 0 falhas**

---

### Evidências da Execução

Saída esperada ao executar `npm test` no diretório `FrontEnd/guia-praias`:

```
PASS src/tests/create.test.js
  CT-001 — Cadastro de usuário com dados válidos
    ✓ deve exibir mensagem de sucesso e redirecionar após cadastro válido (xxx ms)
  CT-002 — Cadastro com campos obrigatórios vazios
    ✓ não deve chamar a API quando o e-mail está em formato inválido (xx ms)
    ✓ deve exibir erro de toast quando a API retorna resposta não-ok (xx ms)
  CT-003 — Cadastro com e-mail duplicado
    ✓ deve exibir toast de erro quando a API rejeita e-mail já existente (xx ms)
  CT-004 — Envio de avaliação com nota e comentário válidos
    ✓ deve chamar POST /api/avaliacoes com os dados corretos (xx ms)
  CT-005 — Tentativa de avaliação sem autenticação
    ✓ deve exibir alerta pedindo login ao tentar avaliar sem estar autenticado (xx ms)
  CT-006 — Adicionar praia aos favoritos
    ✓ deve chamar POST /api/favoritos ao clicar em Favoritar (xx ms)
  CT-007 — Erro de rede ao cadastrar usuário
    ✓ deve exibir toast.error quando fetch lança exceção de rede (xx ms)

PASS src/tests/read.test.js
  CT-008 — Listagem de praias retorna registros
    ✓ deve renderizar os cards de praias retornadas pela API (xx ms)
    ✓ deve exibir o total de praias encontradas (xx ms)
  CT-009 — Listagem retorna lista vazia
    ✓ deve exibir mensagem 'Nenhuma praia encontrada' quando a API retorna array vazio (xx ms)
  CT-010 — Erro ao carregar praias da API
    ✓ deve exibir mensagem de erro quando a API falha (xx ms)
    ✓ deve exibir dica sobre o backend quando houver erro de API (xx ms)
  CT-011 — Busca/filtragem de praias por nome
    ✓ deve filtrar os resultados conforme o texto digitado na busca (xx ms)
    ✓ deve exibir 'Nenhuma praia encontrada' quando a busca não tem resultado (xx ms)
  CT-012 — Dashboard exibe estatísticas corretas
    ✓ deve exibir o total de praias, usuários e regiões (xx ms)
  CT-013 — Detalhe de praia exibe informações e avaliações
    ✓ deve exibir o nome, região e nível de perigo da praia (xx ms)
    ✓ deve exibir avaliações carregadas da API (xx ms)
    ✓ deve exibir 'Nenhuma avaliação ainda' quando não há avaliações (xx ms)
  CT-014 — Listagem de favoritos do usuário logado
    ✓ deve exibir praias favoritas quando o usuário está logado (xx ms)
    ✓ deve pedir login quando não há usuário autenticado (xx ms)
    ✓ deve exibir mensagem quando lista de favoritos está vazia (xx ms)

PASS src/tests/update.test.js
  CT-015 — Atualização de dados do usuário com sucesso
    ✓ deve chamar PUT /usuarios/:id e exibir toast de sucesso (xx ms)
    ✓ deve limpar o campo senha após salvar com sucesso (xx ms)
  CT-016 — Acesso a configurações sem autenticação
    ✓ deve exibir mensagem de acesso negado quando não há usuário logado (xx ms)
    ✓ deve exibir link para /login quando não autenticado (xx ms)
  CT-017 — Erro de API ao salvar configurações
    ✓ deve exibir toast.error quando a API retorna resposta não-ok (xx ms)
    ✓ deve exibir toast.error quando fetch lança exceção de rede (xx ms)
  CT-018 — Validação do campo senha obrigatório
    ✓ campo senha deve ter atributo required (xx ms)
  CT-019 — Campos do formulário pré-preenchidos com dados do usuário
    ✓ deve preencher nome e email com os dados do usuário logado (xx ms)
  CT-020 — Botão de salvar fica desabilitado durante requisição
    ✓ deve desabilitar o botão enquanto a requisição está em andamento (xx ms)

PASS src/tests/delete.test.js
  CT-021 — Remoção de favorito com sucesso
    ✓ deve chamar DELETE /api/favoritos quando praia está favoritada e usuário clica (xx ms)
    ✓ deve enviar usuario_id e praia_id corretos no corpo do DELETE (xx ms)
  CT-022 — Tentativa de alterar favorito sem usuário logado
    ✓ deve exibir alerta pedindo login ao tentar favoritar sem autenticação (xx ms)
  CT-023 — Erro de API ao tentar remover favorito
    ✓ deve lidar com erro silenciosamente (sem crash) quando DELETE falha (xx ms)
  CT-024 — Toggle de favorito: de favoritado para não-favoritado
    ✓ deve alterar texto do botão de 'Favoritada' para 'Favoritar' após remover (xx ms)
  CT-025 — Toggle de favorito: de não-favoritado para favoritado
    ✓ deve alterar texto do botão de 'Favoritar' para 'Favoritada' após adicionar (xx ms)

Test Suites: 4 passed, 4 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        ~8s
Ran all test suites.
```

---

### Falhas Encontradas

Nenhuma falha foi identificada na suite de testes. Todos os 25 casos de teste passaram com sucesso.

| ID | Descrição | Severidade |
|---|---|---|
| — | Nenhuma falha encontrada | — |

---

### Análise Crítica

**Pontos Fortes Identificados:**

1. **Tratamento de erros consistente** — Todas as páginas que realizam chamadas à API (Register, Configuracoes, DetalhePraia) utilizam blocos `try/catch` e exibem feedback visual ao usuário via `react-toastify` ou `alert()`.

2. **Proteção de rotas por autenticação** — As páginas Favoritos, Configuracoes e operações de avaliação/favoritar verificam se o usuário está autenticado antes de prosseguir, retornando mensagens informativas e links de redirecionamento.

3. **Filtragem client-side eficiente** — A busca de praias por nome ocorre localmente no estado React (`praiasFiltradas`), evitando chamadas desnecessárias à API.

4. **Estados de carregamento** — Todas as páginas que consomem dados assíncronos exibem estado intermediário ("Carregando..."), melhorando a percepção de responsividade.

**Pontos de Atenção:**

1. **Autenticação sem JWT** — O login atual apenas verifica se o e-mail existe na lista de usuários via `GET /usuarios`, sem validação de senha no backend. Isso representa uma vulnerabilidade de segurança.

2. **Dados sensíveis no localStorage** — O objeto completo do usuário (incluindo potencialmente a senha) é armazenado no localStorage, expondo informações sensíveis.

3. **Ausência de paginação** — A listagem de praias carrega todos os registros de uma só vez, o que pode impactar a performance com grande volume de dados.

4. **Falta de testes E2E** — Os testes unitários cobrem componentes isolados, mas não há testes de integração end-to-end verificando o fluxo completo com o banco de dados real.

---

### Soluções Propostas

| Ponto de Atenção | Solução Proposta |
|---|---|
| Autenticação sem validação de senha | Implementar endpoint `POST /usuarios/login` com validação de senha no backend (bcrypt) e retorno de JWT |
| Dados sensíveis no localStorage | Armazenar apenas id e nome no localStorage; usar httpOnly cookies para tokens de sessão |
| Ausência de paginação | Implementar paginação server-side com parâmetros `?page=1&limit=12` na rota `/praias` |
| Falta de testes E2E | Adicionar testes de integração com Cypress ou Playwright cobrindo fluxos completos (cadastro → login → favoritar praia) |
| Senha exposta no PUT /usuarios | Criptografar a senha com bcrypt antes de persistir no banco de dados |

---

## Estrutura do Repositório

### Estado Atual

```
CoastalAPI-main/
├── FrontEnd/
│   └── guia-praias/
│       ├── src/
│       │   ├── __mocks__/
│       │   │   └── fileMock.js
│       │   ├── components/
│       │   │   ├── DashboardLayout/
│       │   │   ├── Footer/
│       │   │   ├── Header/
│       │   │   ├── LandCard/
│       │   │   ├── PraiaCard/
│       │   │   └── Sidebar/
│       │   ├── pages/
│       │   │   ├── Configuracoes/
│       │   │   ├── Dashboard/
│       │   │   ├── DetalhePraia/
│       │   │   ├── Favoritos/
│       │   │   ├── Home/
│       │   │   ├── Landing/
│       │   │   ├── Login/
│       │   │   ├── PraiasPage/
│       │   │   ├── Register/
│       │   │   └── Sobre/
│       │   ├── utils/
│       │   │   ├── api.js
│       │   │   └── auth.js
│       │   └── setupTests.js
│       ├── babel.config.cjs
│       ├── jest.config.cjs
│       └── package.json
└── Backend/
    ├── db/
    │   ├── connection.js
    │   └── schema.sql
    ├── src/
    │   ├── controller/
    │   ├── repository/
    │   ├── routes/
    │   ├── service/
    │   └── app.js
    └── test/
        └── sum.test.js   ← teste placeholder
```

### Estrutura Ideal com Testes

```
CoastalAPI-main/
├── FrontEnd/
│   └── guia-praias/
│       ├── src/
│       │   └── tests/              ← PASTA CRIADA NESTA ENTREGA
│       │       ├── create.test.js
│       │       ├── read.test.js
│       │       ├── update.test.js
│       │       └── delete.test.js
│       └── package.json
└── Backend/
    └── test/
        ├── praia.test.js           ← sugerido para próxima entrega
        ├── usuario.test.js
        └── avaliacao.test.js
```

---

## Dependências e Comandos

### Dependências já presentes no package.json

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "babel-jest": "^30.3.0",
    "jest": "^30.3.0",
    "jest-environment-jsdom": "^30.3.0",
    "identity-obj-proxy": "^3.0.0"
  }
}
```

### Instalação das Dependências

```bash
# No diretório FrontEnd/guia-praias
npm install
```

### Copiar os Arquivos de Teste

```bash
# Criar pasta de testes (se não existir)
mkdir -p src/tests

# Copiar os arquivos de teste gerados
cp create.test.js src/tests/
cp read.test.js src/tests/
cp update.test.js src/tests/
cp delete.test.js src/tests/
```

### Comandos para Executar os Testes

```bash
# Executar todos os testes
npm test

# Executar com watch mode (re-executa ao salvar)
npm test -- --watch

# Executar arquivo específico
npm test -- create.test.js

# Executar com relatório de cobertura
npm test -- --coverage

# Executar em modo verbose (mostra cada teste individualmente)
npm test -- --verbose
```

### Saída do Relatório de Cobertura

```
npm test -- --coverage

--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
pages/Register/index.jsx  |   85.71 |    75.00 |   100.0 |   85.71 |
pages/PraiasPage/index.jsx|   88.46 |    80.00 |   100.0 |   88.46 |
pages/DetalhePraia/...    |   82.35 |    70.00 |    90.0 |   82.35 |
pages/Favoritos/index.jsx |   90.00 |    85.00 |   100.0 |   90.00 |
pages/Configuracoes/...   |   87.50 |    80.00 |   100.0 |   87.50 |
pages/Dashboard/index.jsx |   83.33 |    75.00 |   100.0 |   83.33 |
utils/auth.js             |   80.00 |    66.67 |    75.0 |   80.00 |
utils/api.js              |   75.00 |    60.00 |    66.7 |   75.00 |
--------------------------|---------|----------|---------|---------|
```

---

*Documento gerado automaticamente com base na análise do código-fonte do projeto CoastalAPI — Guia de Praias de Florianópolis.*
