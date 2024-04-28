# Visão Geral do Projeto
O projeto questions é uma aplicação backend construída com Node.js e TypeScript, projetada para gerenciar perguntas e respostas em uma plataforma onde usuários podem se registrar, fazer login, postar perguntas e fornecer respostas. A aplicação utiliza o Express para configuração do servidor e roteamento, Prisma como ORM para manipulação das operações de banco de dados e JWT para autenticação e autorização.

# Tecnologias Chave Utilizadas

Node.js e TypeScript: Tecnologias principais para lógica do servidor e segurança de tipos.
Express: Framework de aplicação web para roteamento e middleware.
Prisma: ORM usado para interagir com o banco de dados PostgreSQL, gerenciar migrações e executar consultas de forma segura.
JWT (jsonwebtoken): Utilizado para gerar e validar tokens de acesso para proteger rotas.
bcrypt: Para hashing e salting de senhas de forma segura.
dotenv: Para gerenciar variáveis de ambiente.

## Rotas da API e Funcionalidades

# Gerenciamento de Usuários

POST /register: Registra um novo usuário com nome de usuário, senha e tipo. Utiliza bcrypt para hashing de senha.
POST /login: Autentica um usuário e retorna um JWT se bem-sucedido.

# Gerenciamento de Perguntas

POST /question (seguro): Permite que organizadores autenticados criem uma nova pergunta.
GET /question (seguro): Recupera perguntas com base nas configurações de paginação. Apenas usuários autenticados podem acessar.

# Gerenciamento de Respostas

POST /answer (seguro): Permite que usuários autenticados respondam a uma pergunta. Usuários não podem responder suas próprias perguntas.
GET /answer (seguro): Recupera respostas para uma pergunta específica com base na paginação, acessível apenas por organizadores.

# Middleware

authenticate: Verifica a presença de um JWT válido no cabeçalho de autorização. Se o token for inválido ou estiver ausente, o acesso é negado.

# Serviços

UserService
registerUser: Registra um novo usuário, verificando a validade do tipo de usuário e fazendo o hashing seguro da senha.
authenticateUser: Autentica um usuário comparando a senha hash e, se válida, retorna um JWT.

QuestionService
createQuestion: Cria uma nova pergunta vinculada ao usuário.
getQuestions: Busca perguntas com paginação e verifica se elas foram respondidas pelo usuário.

AnswerService
addAnswer: Adiciona uma resposta a uma pergunta, garantindo que a pergunta exista e que o usuário ainda não tenha respondido.
getAnswers: Busca respostas para uma pergunta com paginação.

# Executando o Projeto

Use npm start para executar o projeto normalmente.
Use npm run dev para o modo de desenvolvimento com recarregamento automático (nodemon).
Use npm test para executar testes configurados com Jest.

# Desenvolvimento e Testes
Jest é usado para testes unitários.
Prisma Studio: Para inspeção de banco de dados e consulta manual durante o desenvolvimento.