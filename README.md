# TaskManager API 🚀

API para gestão de equipes e tarefas, com controle de administradores, membros, históricos de atividades e priorização de tasks.

## ✨ Funcionalidades

- **Controle de acesso**: Administradores vs Membros
- **Gestão de equipes**: Criação, atualização e exclusão de times
- **Atribuição de tarefas**: Prioridades (high/medium/low) e membros responsáveis
- **Histórico de atividades**: Rastreamento de mudanças nas tasks
- **Autenticação segura**: JWT para proteção de endpoints
- **Validação rigorosa**: Zod para schemas de dados

## 🛠 Tecnologias

- **Core**: Node.js, Express, TypeScript
- **ORM**: Prisma
- **Validação**: Zod
- **Autenticação**: JWT
- **Testes**: Jest, Supertest
- **Outros**: ESLint, Prettier

## 🔑 Endpoints Principais

### Autenticação
| Método | Caminho       | Descrição          |
|--------|---------------|--------------------|
| POST   | `/sessions`   | Login de usuário   |

### Usuários
| Método | Caminho       | Descrição          |
|--------|---------------|--------------------|
| POST   | `/users`      | Cria novo usuário  |

### Tarefas
| Método | Caminho                     | Descrição                     |
|--------|-----------------------------|-------------------------------|
| POST   | `/tasks`                    | Cria nova task               |
| GET    | `/tasks/:user_id`           | Lista tasks do usuário       |
| PATCH  | `/tasks/status/:task_id`    | Atualiza status da task      |
| PATCH  | `/tasks/update/:task_id`    | Edita detalhes da task       |
| DELETE | `/tasks/delete/:task_id`    | Remove task                  |

### Equipes
| Método | Caminho                     | Descrição                     |
|--------|-----------------------------|-------------------------------|
| POST   | `/teams/create`             | Cria novo time (apenas admin) |
| PATCH  | `/teams/:team_id`           | Atualiza time                |
| DELETE | `/teams/delete/:team_id`    | Exclui time                  |
| POST   | `/teams/associate`          | Associa usuário a time       |

## 🚀 Começando

### Pré-requisitos
- Node.js v18+
- PostgreSQL
- Yarn/NPM

### Instalação
```bash
git clone https://github.com/seu-usuario/task-manager-api.git
cd task-manager-api
npm install

# Configurar .env
cp .env.example .env
```

### Variáveis de Ambiente (.env)
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
PORT="3000"
```

### Executando
```bash
# Desenvolvimento
npm run dev

# Migrações do Prisma
npx prisma migrate dev

# Build produção
npm run build

# Testes
npm run test
```

## 📝 Detalhes das Requisições

### Autenticação

#### Login de Usuário
```json
POST /sessions
Body: {
  "email": "usuario@email.com",
  "password": "senha123"
}

Response: {
  "token": "jwt_token",
  "user": {
    "id": "user-uuid",
    "name": "Nome Usuario",
    "email": "usuario@email.com",
    "role": "admin"
  }
}
```

### Usuários

#### Criar Usuário
```json
POST /users
Body: {
  "name": "Nome Usuario",
  "email": "usuario@email.com",
  "password": "senha123"
}

Response: {
  "id": "user-uuid",
  "name": "Nome Usuario",
  "email": "usuario@email.com",
  "role": "member"
}
```

### Tarefas

#### Criar Task
```json
POST /tasks
Headers: { Authorization: Bearer {token} }
Body: {
  "title": "Design Landing Page",
  "description": "Criar versão mobile",
  "priority": "high", // "high" | "medium" | "low"
  "assigned_to": "user-uuid",
  "team_id": "team-uuid"
}

Response: {
  "id": "task-uuid",
  "title": "Design Landing Page",
  "description": "Criar versão mobile",
  "priority": "high",
  "status": "pending",
  "assigned_to": "user-uuid",
  "team_id": "team-uuid",
  "created_at": "2025-01-30T14:45:29.494Z"
}
```

#### Listar Tasks do Usuário
```json
GET /tasks/:user_id
Headers: { Authorization: Bearer {token} }

Response: {
  "tasks": [
    {
      "id": "task-uuid",
      "title": "Design Landing Page",
      "description": "Criar versão mobile",
      "priority": "high",
      "status": "pending",
      "assigned_to": "user-uuid",
      "team_id": "team-uuid",
      "created_at": "2025-01-30T14:45:29.494Z"
    }
  ]
}
```

#### Atualizar Status da Task
```json
PATCH /tasks/status/:task_id
Headers: { Authorization: Bearer {token} }
Body: {
  "status": "in_progress" // "pending" | "in_progress" | "completed"
}

Response: {
  "id": "task-uuid",
  "status": "in_progress",
  "updated_at": "2025-01-30T14:45:29.494Z"
}
```

#### Atualizar Detalhes da Task
```json
PATCH /tasks/update/:task_id
Headers: { Authorization: Bearer {token} }
Body: {
  "title": "Novo título", // opcional
  "description": "Nova descrição", // opcional
  "priority": "low", // opcional
  "assigned_to": "new-user-uuid" // opcional
}

Response: {
  "id": "task-uuid",
  "title": "Novo título",
  "description": "Nova descrição",
  "priority": "low",
  "status": "in_progress",
  "assigned_to": "new-user-uuid",
  "updated_at": "2025-01-30T14:45:29.494Z"
}
```

### Equipes

#### Criar Time (Admin)
```json
POST /teams/create
Headers: { Authorization: Bearer {token} }
Body: {
  "name": "Design Team",
  "description": "Equipe de design UI/UX"
}

Response: {
  "id": "team-uuid",
  "name": "Design Team",
  "description": "Equipe de design UI/UX",
  "created_at": "2025-01-30T14:45:29.494Z"
}
```

#### Atualizar Time
```json
PATCH /teams/:team_id
Headers: { Authorization: Bearer {token} }
Body: {
  "name": "Novo nome", // opcional
  "description": "Nova descrição" // opcional
}

Response: {
  "id": "team-uuid",
  "name": "Novo nome",
  "description": "Nova descrição",
  "updated_at": "2025-01-30T14:45:29.494Z"
}
```

#### Associar Usuário ao Time
```json
POST /teams/associate
Headers: { Authorization: Bearer {token} }
Body: {
  "user_id": "user-uuid",
  "team_id": "team-uuid"
}

Response: {
  "id": "association-uuid",
  "user_id": "user-uuid",
  "team_id": "team-uuid",
  "created_at": "2025-01-30T14:45:29.494Z"
}
```

## 🔒 Autenticação

Todos endpoints (exceto /users e /sessions) requerem:
```http
Authorization: Bearer {token_jwt}
```

## 🤝 Contribuição

1. Fork o repositório
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
