document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar Autenticação
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('dashboardBody').classList.remove('hidden');

    // 2. Preencher Dados do Usuário e Config de Plano
    const userEmail = localStorage.getItem('userEmail') || 'usuario@exemplo.com';
    let userPlan = localStorage.getItem('specforge_plan');
    if (!userPlan) {
        const isPremium = localStorage.getItem('specforge_premium') === 'true';
        userPlan = isPremium ? 'premium' : 'free';
        localStorage.setItem('specforge_plan', userPlan);
    }

    let usageCount = parseInt(localStorage.getItem('specforge_usage') || '0');
    const MAX_FREE_USES = 2;

    document.getElementById('userEmailDisplay').textContent = userEmail;

    // In-App Upgrade Modal
    window.openUpgradeModal = () => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center fade-in p-4 backdrop-blur-sm overflow-y-auto';
        
        let premiumBtn = userPlan === 'premium' || userPlan === 'pro'
            ? `<button disabled class="w-full py-3 bg-gray-200 text-emerald-600 font-bold rounded-xl cursor-not-allowed">Seu Plano Atual</button>` 
            : `<button onclick="window.openCheckoutModal('pro', 49)" class="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg">Começar Premium</button>`;
        
        modal.innerHTML = `
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-[pulse_0.2s_ease-out_1_forwards] my-8 relative flex flex-col md:flex-row">
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20 modal-close-btn bg-white/80 rounded-full p-1"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                
                <!-- Premium -->
                <div class="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 flex flex-col justify-between">
                    <div>
                        <div class="text-emerald-500 font-bold tracking-wider text-sm uppercase mb-2">Architect Tier</div>
                        <h3 class="text-3xl font-extrabold text-primary mb-2">Premium</h3>
                        <p class="text-gray-500 text-sm mb-6">Perfeito para moldar o escopo inicial e visualizar schemas relacionais completos.</p>
                        <div class="text-4xl font-extrabold text-gray-900 mb-8">R$ 49<span class="text-lg font-medium text-gray-400">/mês</span></div>
                        
                        <ul class="space-y-4 mb-8 text-sm text-gray-600">
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Gerações Ilimitadas</li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Histórico Completo de Specs</li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Aba de Banco de Dados (Schema & DB Diagram)</li>
                        </ul>
                    </div>
                    ${premiumBtn}
                </div>
                
                <!-- Master -->
                <div class="flex-1 p-8 md:p-10 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 opacity-10"><svg class="w-40 h-40 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                    
                    <div class="relative z-10">
                        <div class="text-accent font-bold tracking-wider text-sm uppercase mb-2 flex items-center gap-2">Engineering Elite <span class="bg-accent/20 text-accent px-2 py-0.5 rounded text-[10px]">RECOMENDADO</span></div>
                        <h3 class="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-accent">Master Pro</h3>
                        <p class="text-slate-400 text-sm mb-6">A suíte absoluta. Testes E2E, UI, DevOps e cálculos de esforço em milissegundos.</p>
                        <div class="text-4xl font-extrabold mb-8">R$ 149<span class="text-lg font-medium text-slate-500">/mês</span></div>
                        
                        <ul class="space-y-4 mb-8 text-sm text-slate-300">
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <strong class="text-white">Tudo do Premium, e mais:</strong></li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Aba de Interface / UX (Wireframes)</li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Aba Executiva de Negócios & Estimativas Ágeis</li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Aba DevOps, Pipeline e Project Tree ASCII</li>
                            <li class="flex items-center gap-3"><svg class="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <strong class="text-white">Exportador ".cursorrules" Injetável em IDEs AI</strong></li>
                        </ul>
                    </div>
                    <button onclick="window.openCheckoutModal('master', 149)" class="relative z-10 w-full py-3 bg-gradient-to-r from-purple-600 to-accent text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-400 transition shadow-xl shadow-accent/20">Desbloquear Poder Elite</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
    };

    // setPlan kept for backward compatibility if needed, but using finalizeUpgrade instead
    window.setPlan = (planName) => {
        localStorage.setItem('specforge_plan', planName);
        localStorage.setItem('specforge_premium', 'true');
        window.location.reload();
    };

    // Override generic anchor links to pricing
    document.querySelectorAll('a[href="index.html#precos"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            openUpgradeModal();
        });
    });

    const updatePlanUI = () => {
        const userPlanBadge = document.getElementById('userPlanBadge');
        const planDisplay = document.getElementById('planDisplay');
        const usageStats = document.getElementById('usageStats');
        const upgradeSidebarBtn = document.getElementById('upgradeSidebarBtn');
        const dashUsageCounter = document.getElementById('dashUsageCounter');

        if (userPlan === 'master' || userPlan === 'premium' || userPlan === 'pro') {
            const planLabel = userPlan === 'master' ? 'Master' : 'Pro';
            userPlanBadge.textContent = planLabel;
            planDisplay.textContent = planLabel;
            
            if (userPlan === 'master') {
                userPlanBadge.className = 'text-xs font-bold px-3 py-0.5 rounded-full mt-0.5 inline-block w-max ml-auto text-white bg-gradient-to-r from-purple-500 to-accent uppercase shadow-sm border border-purple-400/30';
                planDisplay.className = 'text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-accent mb-1 uppercase drop-shadow-sm';
            } else {
                userPlanBadge.className = 'text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block w-max ml-auto bg-emerald-100 text-emerald-700 uppercase';
                planDisplay.className = 'text-2xl font-extrabold text-emerald-600 mb-1 uppercase';
            }
            
            usageStats.innerHTML = '<span class="text-emerald-600 font-medium">Uso ilimitado</span>';
            if (upgradeSidebarBtn && userPlan === 'master') {
                upgradeSidebarBtn.style.display = 'none';
            } else if (upgradeSidebarBtn && (userPlan === 'premium' || userPlan === 'pro')) {
                upgradeSidebarBtn.textContent = 'Fazer upgrade (Master)';
                upgradeSidebarBtn.href = '#';
                upgradeSidebarBtn.onclick = (e) => { e.preventDefault(); openUpgradeModal(); };
            }
            
            if (dashUsageCounter) {
                dashUsageCounter.innerHTML = `<span class="text-emerald-600 flex items-center gap-1 font-bold"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ${planLabel} Ativado</span>`;
                dashUsageCounter.classList.remove('text-gray-500', 'text-red-500');
            }
        } else {
            userPlanBadge.textContent = 'Free';
            userPlanBadge.className = 'text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block w-max ml-auto bg-gray-100 text-gray-600';
            planDisplay.textContent = 'Free';
            
            const restantes = Math.max(0, MAX_FREE_USES - usageCount);
            usageStats.textContent = `Você usou ${usageCount} de ${MAX_FREE_USES} gratuitos.`;
            if (dashUsageCounter) {
                dashUsageCounter.textContent = `Você tem ${restantes} uso${restantes !== 1 ? 's' : ''} gratuito${restantes !== 1 ? 's' : ''}`;
                if (restantes === 0) {
                    dashUsageCounter.classList.replace('text-gray-500', 'text-red-500');
                }
            }
        }
    };

    updatePlanUI();

    // 3. Gerador de Spec - Modificado para suportar Objetos Complexos (Mermaid, JSON, YAML)
    const btn = document.getElementById('generateBtn');
    const prompt = document.getElementById('prompt');
    const resultArea = document.getElementById('resultArea');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    const parseUserIntentTiered = (text, plan) => {
        const shortUserText = text.length > 50 ? text.substring(0, 50) + "..." : text;
        const lowerText = text.toLowerCase();
        
        let title = "Módulo de Funcionalidade Customizada";
        let desc = `Especificação estruturada para: "${shortUserText}".`;
        let reqs = [
            "Validar inputs de usuário com base na regra de negócio",
            "Garantir consistência na persistência das informações",
            "Criar as interfaces respeitando a estrutura já definida"
        ];
        let ac = [
            "Dado que o usuário avança no fluxo, Quando finaliza a tarefa, Então deve receber feedback visual claro."
        ];
        
        let stack = [];
        let schema = "";
        let mermaid = "";
        let tests = "";
        let security = "";
        let infra = "";
        let performance = "";
        let business = "";
        let ui = "";
        let tree = "";

        // AUTH
        if (lowerText.includes('login') || lowerText.includes('auth') || lowerText.includes('autentica') || lowerText.includes('jwt') || lowerText.includes('senha')) {
            title = "Sistema de Autenticação Centralizado";
            reqs = ["Implementar controle de acesso seguro e baseado em Sessão/JWT", "Validar payload de credenciais", "Retornar token de autorização"];
            
            stack = [
                { name: "PostgreSQL", reason: "Garante ACID e integridade relacional para contas de usuário" },
                { name: "Redis", reason: "Cache de sessão em memória, essencial para invalidar JWT e Rate Limiting" },
                { name: "Bcrypt/Argon2", reason: "Hashing unidirecional impossível de reverter" }
            ];
            
            schema = `CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password_hash VARCHAR(255) NOT NULL,\n  status ENUM('active', 'suspended') DEFAULT 'active',\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`;
            mermaid = `graph TD\n  A[Client] -->|POST /login| B(API)\n  B --> C{Verify Hash}\n  C -->|Match| D[Sign JWT]\n  D --> E[Save session in Redis]\n  E --> F[Return 200 OK]\n  C -->|No Match| G[Return 401]`;
            tests = `describe('Authentication Flow', () => {\n  it('should return 401 for invalid credentials', () => {\n    cy.request({ method: 'POST', url: '/auth/login', failOnStatusCode: false, body: { email: 'wrong@test.com' } })\n      .its('status').should('eq', 401);\n  });\n\n  it('should return token for valid identity', () => {\n    cy.request('POST', '/auth/login', { email: 'valid@test.com', pass: '1234' }).then(res => {\n      expect(res.status).to.eq(200);\n      expect(res.body).to.have.property('token');\n    });\n  });\n});`;
            security = "Risco Constatado: Brute Force Attacks.\\nMitigação: Implementar Token/IP Rate Limiting no Ingress (Ex: Nginx). Bloquear email temporariamente (15m) após 5 tentativas falhas consecutivas. Cookies de Sessão devem obrigar HttpOnly e Secure.";
            infra = `name: Identity-Service-Pipeline\non: [push]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - run: docker build -t myapp/auth-service .\n      - run: kubectl apply -f k8s/auth-deployment.yaml`;
            performance = "A validação (Hashing) com bcrypt é propositalmente lenta (intensiva para CPU). Você precisará escalar os Pods (horizontalmente) da API se houver pico severo de acessos simultâneos.";
            business = `**Esforço (Story Points)**: 8 SP\n**Sprints Agéis**: 1 Sprint completa (2 semanas)\n**Alocação da Squad**: 1 Sênior/Pleno (Backend) + 1 Pleno/Júnior (Frontend)\n**Custo Médio de Mercado**: ~R$ 3.500 a R$ 5.200 (Homem-hora base SP)`;
            ui = `<!-- Draft estrutural (HTML Base) -->\n<div class="max-w-sm mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">\n  <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Acesso Protegido</h2>\n  <form class="flex flex-col gap-4">\n    <input type="email" placeholder="email@empresa.com" class="border p-3 rounded-lg focus:ring-2 focus:ring-accent outline-none" />\n    <input type="password" placeholder="••••••••" class="border p-3 rounded-lg focus:ring-2 focus:ring-accent outline-none" />\n    <button class="bg-accent hover:bg-blue-600 text-white font-bold p-3 rounded-lg transition shadow">Fazer Login Seguro</button>\n  </form>\n</div>`;
            tree = `src/\n├── controllers/\n│   └── auth.controller.ts\n├── middlewares/\n│   ├── requireAuth.ts\n│   └── authRateLimiter.ts\n├── dtos/\n│   └── login-payload.dto.ts\n├── services/\n│   ├── auth.service.ts\n│   ├── redisSession.ts\n│   └── jwtToken.ts\n└── tests/\n    └── auth.e2e.spec.ts`;
        }
        
        // PAYMENT
        else if (lowerText.includes('pagamento') || lowerText.includes('compra')) {
            title = "Módulo de Processamento de Pagamentos";
            reqs = ["Integrar com provedor de pagamentos primário", "Processamento assíncrono para prevenir interrupção da venda", "Sincronizar webhooks de confirmação"];
            
            stack = [
                { name: "Stripe API / Pagar.me", reason: "Gateways maduros com excelente taxa de conversão" },
                { name: "RabbitMQ / SQS", reason: "Filas distribuídas para reprocessar webhooks em caso de falhas da API principal" }
            ];
            
            schema = `CREATE TABLE transactions (\n  id UUID PRIMARY KEY,\n  user_id UUID REFERENCES users(id),\n  amount DECIMAL(10,2) NOT NULL,\n  status VARCHAR(20) DEFAULT 'PENDING',\n  stripe_intent_id VARCHAR(100),\n  created_at TIMESTAMP DEFAULT NOW()\n);`;
            mermaid = `sequenceDiagram\n  Client->>API: POST /checkout\n  API->>Stripe: Create Intent\n  Stripe-->>API: Intent ID\n  API-->>Client: 200 OK + Intent\n  Note over Client,API: After User pays...\n  Stripe->>API: Webhook (Charge Succeeded)\n  API->>Database: Update Status = APPROVED`;
            tests = `test('Idempotency Key blocks double charge', async () => {\n  const payload = { amount: 100, user_id: '123' };\n  const headers = { 'Idempotency-Key': 'key-456' };\n  \n  const res1 = await api.post('/charge', payload, headers);\n  const res2 = await api.post('/charge', payload, headers);\n  \n  expect(res1.status).toBe(200);\n  expect(res2.status).toBe(200);\n  expect(res1.data.transaction_id).toBe(res2.data.transaction_id);\n});`;
            security = "Risco: Captura intercontinental de cartões.\\nMitigação: A plataforma NUNCA armazenará dados do cartão puro/CVV de clientes em nossos bancos de dados (PCI-DSS Scope Reduction). Usaremos tokens criptografados do Gateway.";
            infra = `// k8s/worker-deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-workers\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: webhook-consumer\n          image: myapp/webhook-worker:latest`;
            performance = "Webhooks do Gateway devem ter Resposta IMEDIATA (HTTP 200) para o provedor não enfileirar requisições. O consumo real deve ser offloaded (jogado pra fila/worker em background).";
            business = `**Esforço (Story Points)**: 13 SP (Alta Complexidade Financeira)\n**Sprints Agéis**: 2 Sprints (Levando Setup, Homologação Contábil e Testes em Stage)\n**Alocação da Squad**: 1 Arquiteto/Sênior (Backend) + 1 Pleno/Sênior (Frontend) + 1 Analista Financeiro (Revisão)\n**Custo Médio de Mercado**: ~R$ 8.000 a R$ 12.000 (Risco crítico)`;
            ui = `<!-- Draft Módulo de Checkout -->\n<div class="bg-gray-50 p-6 rounded-xl border flex flex-col gap-4 max-w-md">\n  <h3 class="font-bold text-gray-800 text-lg border-b pb-2">Resumo da Ordem</h3>\n  <div class="flex justify-between text-gray-600"><span>Plano Elite</span><span>$ 99.00</span></div>\n  <div class="flex justify-between font-bold text-lg mb-2 text-gray-800"><span>Total</span><span>$ 99.00</span></div>\n  \n  <div class="bg-white p-4 rounded-lg shadow-inner border">\n    <div class="h-10 bg-gray-100 rounded animate-pulse mb-2"></div>\n    <p class="text-xs text-center text-gray-400 mt-2 flex justify-center gap-1"><svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Transação Criptografada Ponto-a-Ponto</p>\n  </div>\n  <button class="bg-primary text-white w-full py-3 rounded-lg font-bold hover:bg-slate-800 transition">Pagar com Segurança</button>\n</div>`;
            tree = `payment-service/\n├── src/\n│   ├── application/\n│   │   ├── useCases/\n│   │   │   ├── processCheckout.ts\n│   │   │   └── handleStripeWebhook.ts\n│   ├── domain/\n│   │   └── Transaction.entity.ts\n│   └── infrastructure/\n│       ├── stripeAdapter.ts\n│       └── rabbitMQPublisher.ts\n├── docker-compose.yml\n└── .env.example`;
        }
        
        // CRUD default
        else if (lowerText.includes('crud') || lowerText.includes('cadastro')) {
            title = "Engine de Manipulação de Dados (CRUD)";
            stack = [
                { name: "Prisma ORM", reason: "Type-safety absoluto nas chamadas do banco previne Runtime Errors" },
                { name: "Zod / Yup", reason: "Validação estrita do payload (Schema Validation) antes de atingir o controller" }
            ];
            schema = `CREATE TABLE entities (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(255) NOT NULL,\n  details JSONB, -- Schemaless metadata\n  deleted_at TIMESTAMP NULL\n);`;
            tests = `describe('Entity CRUD', () => {\n  it('creates safely', () => {\n    cy.request('POST', '/api/v1/entities', { title: 'Test' })\n      .its('status').should('eq', 201);\n  });\n});`;
            infra = `Dockerfile:\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "start"]`;
            business = `**Esforço (Story Points)**: 5 SP\n**Sprints Agéis**: 1 Sprint\n**Alocação da Squad**: 1 Full-Stack ou 1 Backend (Pleno)\n**Custo Médio de Mercado**: ~R$ 1.200 a R$ 2.400 (Trabalho padronizado)`;
            ui = `<!-- Draft Tela de Dashboard Base -->\n<div class="flex flex-col gap-4">\n  <div class="flex justify-between items-center">\n      <h2 class="text-xl font-bold">Listagem de Entidades</h2>\n      <button class="bg-accent text-white px-4 py-2 rounded-lg font-bold">+ Novo Registro</button>\n  </div>\n  <div class="bg-white border rounded-xl shadow-sm overflow-hidden">\n      <table class="w-full text-left border-collapse">\n         <thead class="bg-gray-50 border-b"><tr><th class="p-4 py-3">ID</th><th class="p-4 py-3">Título</th><th class="p-4 py-3">Ações</th></tr></thead>\n         <tbody><tr class="border-b hover:bg-gray-50 cursor-pointer"><td class="p-4">#1204</td><td class="p-4 font-medium text-gray-800">Primeiro Cadastro</td><td class="p-4 flex gap-2"><button class="text-accent underline">Editar</button><button class="text-red-500 underline">Excluir</button></td></tr></tbody>\n      </table>\n  </div>\n</div>`;
            tree = `admin-dashboard/\n├── pages/\n│   └── entities/\n│       ├── [id].tsx\n│       └── index.tsx\n├── components/\n│   ├── DataTable.tsx\n│   ├── CreateEntityModal.tsx\n│   └── Forms/\n└── lib/\n    ├── apiHandler.ts\n    └── prismaClient.ts`;
        }
        // Default / Generic fallback se não achar categoria
        else {
            stack = [
                { name: "Node.js (Express/Nest)", reason: "Velocidade na prototipação e ecossistema assíncrono maduro" },
                { name: "PostgreSQL", reason: "Confiabilidade relacional padrão de mercado" },
                { name: "React / Vue", reason: "SPA reativo para o lado do cliente" }
            ];
            schema = `CREATE TABLE custom_entity (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  name VARCHAR(255) NOT NULL,\n  payload JSONB,\n  created_at TIMESTAMP DEFAULT NOW()\n);`;
            mermaid = `graph TD\n  Client --> API\n  API --> DB[(Database)]\n  API -.-> Cache[(Cache)]`;
            tests = `describe('Custom Feature Flow', () => {\n  it('handles generic requests securely', () => {\n    cy.request('GET', '/api/v1/custom')\n      .its('status').should('eq', 200);\n  });\n});`;
            security = "Risco Genérico: Falhas de Autorização (BOLA/IDOR) e XSS em payloads abertos.\\nMitigação: Validar inputs nas bordas, não confiar no JSON injetado pelo client sem schema-parsing estrito.";
            infra = `name: Generic-CI\non: [push]\njobs:\n  test-and-build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - run: npm run lint\n      - run: npm run test`;
            performance = "Sempre utilizar paginação nos endpoints listados e índices nas colunas filtradas pelo client.";
            business = `**Esforço Geral Estimado**: 3 a 5 SP\n**Sprints Agéis**: Menos de 1 Sprint\n**Alocação da Squad**: Time Multidisciplinar / Contexto Neutro\n**Custo Médio de Mercado**: Relevável via Discovery Posterior`;
            ui = `<!-- Wireframe Genérico Neutro -->\n<div class="grid grid-cols-1 md:grid-cols-3 gap-6">\n  <div class="md:col-span-2 bg-slate-50 p-6 pt-16 rounded-xl border flex flex-col items-center justify-center min-h-[250px]">\n       <p class="text-gray-400 font-bold mb-2">Painel Interativo Dinâmico</p>\n       <div class="w-24 h-2 bg-gray-200 rounded animate-pulse"></div>\n  </div>\n  <div class="bg-white p-6 rounded-xl shadow border">\n       <h4 class="font-bold border-b pb-2 mb-4">Configurações</h4>\n       <div class="space-y-3">\n          <div class="h-8 bg-gray-100 rounded w-full"></div>\n          <div class="h-8 bg-gray-100 rounded w-full"></div>\n          <button class="w-full bg-accent text-white rounded p-2 mt-4 font-bold">Aplicar View</button>\n       </div>\n  </div>\n</div>`;
            tree = `project-root/\n├── src/\n│   ├── api/\n│   │   ├── routes.ts\n│   │   └── handlers.ts\n│   ├── core/\n│   │   └── custom.entities.ts\n│   └── shared/\n│       └── utils.ts\n└── docker-compose.yml`;
        }

        let result = { title, desc, reqs, ac, schema, mermaid, stack, tests, security, infra, performance, business, ui, tree };

        if (plan === 'master') {
            // Requisitos avançados TDD Frontend/Backend
            result.reqs = [
                "<b>[Frontend]</b> Implementar componentes reativos usando Local State, previnindo prop-drilling",
                "<b>[Frontend]</b> Garantir feedback visual otimista (Optimistic UI) ao apertar os botões",
                "<b>[Backend]</b> Construir DTOs validados via schema estrito (ex: Zod/Yup) rejeitando fields não mapeados",
                "<b>[Backend]</b> Configurar transactions no DB para garantir atomicidade no processo completo",
                "<b>[DevOps]</b> Assinar commits e containerizar o ambiente p/ prevenir drift de ambiente ('Funciona na minha máquina')"
            ];
            
            // Gherkin estrito
            result.ac = [
                "Dado que o payload contém formato HTML no campo de entrada, Quando enviado, Então um sanitizador bloqueia injeção e retorna HTTP 400 Bad Request",
                "Dado que uma falha de rede ocorra durante o POST, Quando ultrapassar 5s de latência, Então o frontend lança um alerta gracioso sem travar a tela branca",
                "Dado que a criação obteve sucesso atômico, Quando finalizado, Então despacha evento para RabbitMQ atualizar as métricas globais"
            ];
            
            result.tests = tests;
            result.security = security;
            result.infra = infra;
            result.performance = performance || "Manter as consultas ao DB com índices perfeitamente otimizados e evitar N+1 queries utilizando Dataloader.";
            result.business = business;
            result.ui = ui;
            result.tree = tree;
        }

        return result;
    };

    const renderTabsUI = (data) => {
        outputContent.innerHTML = '';
        
        // 1. Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between border-b border-slate-700 pb-4 mb-6';
        
        let exportBtnHtml = '';
        if (userPlan === 'master') {
            exportBtnHtml = `
            <button id="exportCursorBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition ml-auto shadow-md border border-indigo-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Exportar .cursorrules
            </button>`;
        }

        header.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 class="text-xl font-bold text-white">Especificação Técnica</h3>
            </div>
            ${exportBtnHtml}
        `;
        outputContent.appendChild(header);

        // 2. Tabs Navigation
        const tabsNav = document.createElement('div');
        tabsNav.className = 'flex border-b border-slate-700 mb-6 gap-6 overflow-x-auto';
        
        const createTabBtn = (id, text, isActive) => {
            return `<button class="tab-btn whitespace-nowrap font-medium text-sm pb-3 border-b-2 transition-colors duration-200 ${isActive ? 'active text-accent border-accent' : 'text-gray-400 border-transparent hover:text-gray-200'}" data-target="${id}">${text}</button>`;
        };

        const lockIcon = `<svg class="w-3 h-3 inline pb-0.5 opacity-70 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>`;
        
        const isDbLocked = userPlan === 'free';
        const isTestLocked = userPlan === 'free' || userPlan === 'pro' || userPlan === 'premium';
        const isInfraLocked = userPlan === 'free' || userPlan === 'pro' || userPlan === 'premium';
        const isUiLocked = userPlan === 'free' || userPlan === 'pro' || userPlan === 'premium';
        const isBusinessLocked = userPlan === 'free' || userPlan === 'pro' || userPlan === 'premium';

        let tabsHtml = createTabBtn('tab-spec', 'Especificação', true);
        if (data.schema) tabsHtml += createTabBtn('tab-db', `Banco de Dados ${isDbLocked ? lockIcon : ''}`, false);
        if (data.tests) tabsHtml += createTabBtn('tab-test', `QA / Testes ${isTestLocked ? lockIcon : ''}`, false);
        if (data.infra) tabsHtml += createTabBtn('tab-infra', `Infra & DevOps ${isInfraLocked ? lockIcon : ''}`, false);
        if (data.ui) tabsHtml += createTabBtn('tab-ui', `Interface (UI) ${isUiLocked ? lockIcon : ''}`, false);
        if (data.business) tabsHtml += createTabBtn('tab-business', `Negócios ${isBusinessLocked ? lockIcon : ''}`, false);
        
        tabsNav.innerHTML = tabsHtml;
        outputContent.appendChild(tabsNav);

        // 3. Tab Contents Container
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'tabsContainer';
        tabsContainer.className = 'flex-col space-y-6';

        const getLockedHtml = (title, requiredPlan) => `
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg border border-slate-700/50 p-6 text-center h-full">
                <div class="bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm border border-slate-700 w-full animate-[pulse_0.2s_ease-out_1_forwards]">
                    <div class="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-inner">
                        <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                    </div>
                    <h4 class="text-white font-bold text-lg mb-2">Acesso Restrito: ${title}</h4>
                    <p class="text-sm text-gray-400 mb-6">Assine o plano <strong class="text-accent">${requiredPlan}</strong> para acessar arquitetura profunda, estimativas de negócio e acelerar sua entrega.</p>
                    <button class="w-full bg-accent hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg transition" onclick="window.openUpgradeModal()">Abrir Planos</button>
                </div>
            </div>
        `;

        const formatAC = (acArray) => {
             return acArray.map(ac => {
                let formatted = ac
                    .replace(/(Dado que|Given)/g, '<span class="text-secondary font-bold">$1</span>')
                    .replace(/(Quando|When)/g, '<span class="text-accent font-bold">$1</span>')
                    .replace(/(Então|Then)/g, '<span class="text-blue-400 font-bold">$1</span>');
                return `<li class="flex gap-2 items-start mt-2"><svg class="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><span>${formatted}</span></li>`;
             }).join('');
        };

        const copyBtnHtml = (textId) => {
             if (userPlan === 'free') return '';
             return `<button class="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 transition copy-block-btn" data-target-id="${textId}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>`;
        };

        // TAB 1: SPEC
        let techHtml = '';
        if (data.stack && data.stack.length > 0) {
            techHtml = `
            <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 mt-6 pt-5">
                <h4 class="text-blue-400 font-semibold mb-3 uppercase text-sm tracking-wider">Stack Recomendada</h4>
                <div class="space-y-3">
                   ${data.stack.map(t => `
                      <div class="flex flex-col gap-1.5">
                          <span class="inline-block px-2.5 py-0.5 bg-slate-900 border border-slate-600 rounded text-blue-300 font-mono text-xs w-max">${t.name}</span>
                          <span class="text-xs text-gray-400 ml-1 border-l-2 border-slate-600 pl-2 py-0.5 leading-snug">${t.reason}</span>
                      </div>
                   `).join('')}
                </div>
            </div>`;
        }

        tabsContainer.innerHTML += `
            <div id="tab-spec" class="tab-pane block space-y-6">
                <div>
                    <h4 class="text-accent font-semibold mb-1 uppercase text-sm tracking-wider">Título</h4>
                    <p class="text-lg text-white font-medium">${data.title}</p>
                </div>
                <div>
                    <h4 class="text-accent font-semibold mb-1 uppercase text-sm tracking-wider">Descrição</h4>
                    <p class="leading-relaxed text-gray-300 text-sm">${data.desc}</p>
                </div>
                <div>
                    <h4 class="text-accent font-semibold mb-2 uppercase text-sm tracking-wider">Requisitos</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-400 marker:text-slate-600 text-sm">${data.reqs.map(r=>`<li>${r}</li>`).join('')}</ul>
                </div>
                <div class="bg-black/20 p-4 rounded-lg border border-slate-800">
                    <h4 class="text-secondary font-semibold mb-2 uppercase text-sm tracking-wider">Critérios de Aceitação</h4>
                    <ul class="space-y-2 text-sm text-gray-300 w-full">${formatAC(data.ac)}</ul>
                </div>
                ${techHtml}
            </div>
        `;

        // TAB 2: DB (Pro/Master)
        if (data.schema !== undefined) {
            tabsContainer.innerHTML += `
            <div id="tab-db" class="tab-pane hidden space-y-6 relative rounded-lg overflow-hidden min-h-[300px]">
                ${isDbLocked ? getLockedHtml('Banco de Dados', 'Pro') : ''}
                <div class="${isDbLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}">
                    <div>
                        <h4 class="text-blue-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">Schema Sugerido</h4>
                        <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                            ${copyBtnHtml('code-schema')}
                            <pre id="code-schema" class="text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">${data.schema || '-- Schema autogerado não disponivel --'}</pre>
                        </div>
                    </div>
                ${data.mermaid ? `
                <div class="mt-6 border-t border-slate-800 pt-6">
                    <h4 class="text-blue-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">Diagrama de Fluxo (Mermaid.js)</h4>
                    <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                        ${copyBtnHtml('code-mermaid')}
                        <pre id="code-mermaid" class="text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">${data.mermaid}</pre>
                    </div>
                </div>
                ` : ''}
                </div>
            </div>`;
        }

        // TAB 3: TEST (Master)
        if (data.tests !== undefined) {
            tabsContainer.innerHTML += `
            <div id="tab-test" class="tab-pane hidden space-y-6 relative rounded-lg overflow-hidden min-h-[200px]">
                ${isTestLocked ? getLockedHtml('QA & Testes', 'Master') : ''}
                <div class="${isTestLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}">
                    <div>
                        <h4 class="text-purple-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">QA & Testes Automatizados (Cypress/Jest)</h4>
                    <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                        ${copyBtnHtml('code-tests')}
                        <pre id="code-tests" class="text-sm font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">${data.tests || '// Stubs não gerados.'}</pre>
                    </div>
                </div>
                </div>
            </div>`;
        }

        // TAB 4: INFRA (Master)
        if (data.infra !== undefined) {
            tabsContainer.innerHTML += `
            <div id="tab-infra" class="tab-pane hidden space-y-6 relative rounded-lg overflow-hidden min-h-[300px]">
                ${isInfraLocked ? getLockedHtml('Infra & DevOps', 'Master') : ''}
                <div class="${isInfraLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}">
                    ${data.security ? `
                <div class="bg-red-900/10 border border-red-900/30 p-5 rounded-lg">
                    <h4 class="text-red-400 font-semibold mb-2 uppercase text-sm tracking-wider flex items-center gap-2">Riscos e Segurança (Security First)</h4>
                    <p class="text-sm text-gray-300 leading-relaxed">${data.security}</p>
                </div>
                ` : ''}
                
                <div class="mt-6 border-t border-slate-800 pt-6">
                    <h4 class="text-amber-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">Infra & Pipeline (CI/CD)</h4>
                    <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                        ${copyBtnHtml('code-infra')}
                        <pre id="code-infra" class="text-sm font-mono text-amber-300 overflow-x-auto whitespace-pre-wrap">${data.infra || '# Scripts YAML de Build e Deploy pipeline'}</pre>
                    </div>
                </div>

                ${data.tree ? `
                <div class="mt-6 border-t border-slate-800 pt-6">
                    <h4 class="text-green-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">Estrutura de Diretórios Recomendada</h4>
                    <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                        ${copyBtnHtml('code-tree')}
                        <pre id="code-tree" class="text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">${data.tree}</pre>
                    </div>
                </div>
                ` : ''}

                ${data.performance ? `
                <div class="bg-blue-900/10 border border-blue-900/30 p-5 rounded-lg mt-6">
                    <h4 class="text-blue-400 font-semibold mb-2 uppercase text-sm tracking-wider flex items-center gap-2">Métricas e Performance</h4>
                    <p class="text-sm text-gray-300 leading-relaxed">${data.performance}</p>
                </div>
                ` : ''}
                </div>
            </div>`;
        }

        // TAB 5: UI (Master)
        if (data.ui !== undefined) {
            tabsContainer.innerHTML += `
            <div id="tab-ui" class="tab-pane hidden space-y-6 relative rounded-lg overflow-hidden min-h-[200px]">
                ${isUiLocked ? getLockedHtml('Interface (UI)', 'Master') : ''}
                <div class="${isUiLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}">
                    <div>
                        <h4 class="text-pink-400 font-semibold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">Wireframing Clássico (HTML/Tailwind)</h4>
                    <div class="relative group bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10">
                        ${copyBtnHtml('code-ui')}
                        <pre id="code-ui" class="text-sm font-mono text-pink-300 overflow-x-auto whitespace-pre-wrap">${data.ui.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                    </div>
                </div>
                </div>
            </div>`;
        }

        // TAB 6: BUSINESS (Master)
        if (data.business !== undefined) {
            const htmlBusiness = data.business.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').split('\\n').map(l => l.trim()).filter(l=>l).map(line => `<p class="text-gray-300 text-sm mb-2 leading-relaxed flex gap-2 items-center"><svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> <span>${line}</span></p>`).join('');
            tabsContainer.innerHTML += `
            <div id="tab-business" class="tab-pane hidden space-y-6 relative rounded-lg overflow-hidden min-h-[200px]">
                ${isBusinessLocked ? getLockedHtml('Negócios & Custos', 'Master') : ''}
                <div class="${isBusinessLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}">
                    <div class="bg-slate-800 border border-slate-700 p-8 rounded-xl relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 opacity-5"><svg class="w-40 h-40 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
                    <h4 class="text-emerald-400 font-bold mb-6 uppercase text-sm tracking-wider flex items-center gap-2">Esforço Operacional (Estimativas)</h4>
                    ${htmlBusiness}
                </div>
                </div>
            </div>`;
        }

        outputContent.appendChild(tabsContainer);

        // Bind Tabs Logic
        const tabBtns = tabsNav.querySelectorAll('.tab-btn');
        tabBtns.forEach(b => {
            b.addEventListener('click', (e) => {
                tabBtns.forEach(tb => { tb.classList.remove('active', 'text-accent', 'border-accent'); tb.classList.add('text-gray-400', 'border-transparent'); });
                tabsContainer.querySelectorAll('.tab-pane').forEach(p => { p.classList.remove('block'); p.classList.add('hidden'); });
                
                const targetId = e.target.getAttribute('data-target');
                e.target.classList.add('active', 'text-accent', 'border-accent');
                e.target.classList.remove('text-gray-400', 'border-transparent');
                document.getElementById(targetId).classList.remove('hidden');
                document.getElementById(targetId).classList.add('block');
            });
        });

        // Copy button binder
        const copyBtns = outputContent.querySelectorAll('.copy-block-btn');
        copyBtns.forEach(cb => {
            cb.addEventListener('click', (e) => {
                e.preventDefault();
                const textTarget = document.getElementById(cb.getAttribute('data-target-id')).innerText;
                navigator.clipboard.writeText(textTarget);
                const originalSvg = cb.innerHTML;
                cb.innerHTML = '<span class="text-xs font-bold font-sans text-emerald-400">Copiado!</span>';
                setTimeout(() => { cb.innerHTML = originalSvg; }, 2000);
            });
        });

        // Export Cursorrules logic
        const exportBtn = document.getElementById('exportCursorBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                let rules = `# SpecForge Auto-Generated .cursorrules\n\n`;
                rules += `## Context\n${data.title}\n${data.desc.replace(/<[^>]*>?/gm, '')}\n\n`;
                rules += `## Requirements\n${data.reqs.map(r=>'- '+r.replace(/<[^>]*>?/gm, '')).join('\n')}\n\n`;
                if(data.ac) rules += `## Acceptance Criteria\n${data.ac.map(a=>'- '+a.replace(/<[^>]*>?/gm, '')).join('\n')}\n\n`;
                if(data.stack) rules += `## Architecture Stack\n${data.stack.map(s=>'- '+s.name+': '+s.reason).join('\n')}\n\n`;
                if(data.schema) rules += `## Database Schema\n\`\`\`sql\n${data.schema}\n\`\`\`\n\n`;
                if(data.tree) rules += `## Component/Folder Tree\n\`\`\`text\n${data.tree}\n\`\`\`\n\n`;
                if(data.tests) rules += `## Verification Tests\n\`\`\`javascript\n${data.tests}\n\`\`\`\n\n`;
                if(data.ui) rules += `## Base HTML UI Structure\n\`\`\`html\n${data.ui}\n\`\`\`\n\n`;
                
                const blob = new Blob([rules], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '.cursorrules';
                a.click();
                URL.revokeObjectURL(url);
                
                exportBtn.innerHTML = '<span class="text-white">Exportado 🎉</span>';
                setTimeout(() => { exportBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exportar .cursorrules'; }, 3000);
            });
        }
    };

    // Renderizar Histórico
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyState');
    const freemiumState = document.getElementById('freemiumState');
    const premiumOnlyBadge = document.getElementById('premiumOnlyBadge');

    const updateHistoryList = () => {
        if (userPlan === 'free') {
            historyList.classList.add('hidden');
            emptyState.classList.add('hidden');
            freemiumState.classList.remove('hidden');
            return;
        }

        premiumOnlyBadge.classList.add('hidden');
        freemiumState.classList.add('hidden');
        
        const historyRaw = localStorage.getItem('specHistory');
        let historyData = [];
        if (historyRaw) {
            try { historyData = JSON.parse(historyRaw); } catch(e) {}
        }

        if (historyData.length === 0) {
            emptyState.classList.remove('hidden');
            historyList.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            historyList.classList.remove('hidden');
            historyList.innerHTML = ''; 

            historyData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition relative';
                
                const dateStr = item.date ? item.date : 'Recentemente';

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="text-lg font-bold text-primary">${item.output.title}</h4>
                        <span class="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">${dateStr}</span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                        <p class="text-xs text-gray-500 font-mono italic truncate">Input: "${item.input}"</p>
                    </div>
                    <button class="load-spec-btn text-sm font-semibold text-accent hover:text-blue-700 transition flex items-center gap-1" data-id="${item.id}">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         Ver Resultado Completo
                    </button>
                `;
                historyList.appendChild(card);
            });

            const loadBtns = document.querySelectorAll('.load-spec-btn');
            loadBtns.forEach(b => {
                b.addEventListener('click', (e) => {
                    const btnId = e.currentTarget.getAttribute('data-id');
                    const origHistory = JSON.parse(localStorage.getItem('specHistory') || "[]");
                    const found = origHistory.find(i => i.id === btnId);
                    if (found) {
                        prompt.value = found.input;
                        renderTabsUI(found.output);
                        resultArea.classList.remove('hidden');
                        outputContent.classList.remove('hidden');
                        window.scrollTo({ top: document.getElementById('generatorSection').offsetTop - 20, behavior: 'smooth' });
                    }
                });
            });
        }
    };

    updateHistoryList();

    // Trigger de Geração
    btn.addEventListener('click', () => {
        const text = prompt.value.trim();

        if (!text) {
            prompt.focus();
            prompt.classList.add('ring-2', 'ring-red-400');
            setTimeout(() => prompt.classList.remove('ring-2', 'ring-red-400'), 1000);
            return;
        }

        if (userPlan === 'free' && usageCount >= MAX_FREE_USES) {
            openUpgradeModal(); 
            return;
        }

        if (userPlan === 'free') {
            usageCount++;
            localStorage.setItem('specforge_usage', usageCount);
            updatePlanUI();
        }

        btn.disabled = true;
        btn.innerHTML = 'Processando...';

        resultArea.classList.remove('hidden');
        outputContent.classList.add('hidden');
        loading.classList.remove('hidden');
        loading.style.display = 'flex';

        setTimeout(() => {
            const data = parseUserIntentTiered(text, userPlan);

            renderTabsUI(data);

            if (userPlan !== 'free') {
                const historyRaw = localStorage.getItem('specHistory');
                let historyData = [];
                if (historyRaw) {
                   try { historyData = JSON.parse(historyRaw); } catch(e){}
                }
                const newSpec = {
                    id: Date.now().toString(),
                    input: text,
                    output: data, // Stores the FULL rich object (schema, tests, infra)
                    date: new Date().toLocaleString()
                };
                historyData.unshift(newSpec); 
                localStorage.setItem('specHistory', JSON.stringify(historyData));
                updateHistoryList();
            }

            loading.style.display = 'none';
            loading.classList.add('hidden');
            outputContent.classList.remove('hidden');

            btn.disabled = false;
            btn.innerHTML = `
                <span>Regerar especificação</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            `;

        }, 1500); 
    });

    const handleNewSpec = (e) => {
        e.preventDefault();
        prompt.value = '';
        resultArea.classList.add('hidden');
        btn.innerHTML = `<span>Gerar spec estruturada</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`;
        prompt.focus();
        window.scrollTo({ top: document.getElementById('generatorSection').offsetTop - 20, behavior: 'smooth' });
    };

    const newSpecSidebarBtn = document.getElementById('newSpecSidebarBtn');
    if (newSpecSidebarBtn) newSpecSidebarBtn.addEventListener('click', handleNewSpec);

    const generateFirstBtn = document.getElementById('generateFirstBtn');
    if (generateFirstBtn) generateFirstBtn.addEventListener('click', handleNewSpec);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('isLogged');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    // Novas Funções (Sidebar)
    const templatesBtn = document.getElementById('templatesBtn');
    if (templatesBtn) {
        templatesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in p-4 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-[pulse_0.2s_ease-out_1_forwards]">
                    <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="text-xl font-bold text-primary flex items-center gap-2"><svg class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"></path></svg> Templates Prontos</h3>
                        <button class="text-gray-400 hover:text-red-500 transition modal-close-btn"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>
                    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button class="text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition template-card group" data-prompt="Criar um sistema de login com autenticação JWT, recuperação de senha e rate limiting.">
                            <h4 class="font-bold text-primary mb-1 group-hover:text-accent transition">SSO & Autenticação</h4>
                            <p class="text-xs text-gray-500 leading-relaxed">Fluxo completo de login, validação de tokens e camada de segurança.</p>
                        </button>
                        <button class="text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition template-card group" data-prompt="Criar um módulo de pagamento com carrinho de compras, integração Stripe e webhooks.">
                            <h4 class="font-bold text-primary mb-1 group-hover:text-accent transition">Checkout & Pagamento</h4>
                            <p class="text-xs text-gray-500 leading-relaxed">E-commerce, integrações com gateway de pagamento e idempotência.</p>
                        </button>
                        <button class="text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition template-card group" data-prompt="Motor de manipulação de dados CRUD para um painel admin de gestão de usuários e permissoes RBAC.">
                            <h4 class="font-bold text-primary mb-1 group-hover:text-accent transition">Painel Admin (CRUD)</h4>
                            <p class="text-xs text-gray-500 leading-relaxed">Geração de endpoints complexos e back-office com roles.</p>
                        </button>
                        <button class="text-left p-4 border border-gray-100 rounded-xl opacity-60 cursor-not-allowed bg-gray-50">
                            <h4 class="font-bold text-gray-600 mb-1">Upload de Arquivos <span class="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-1 font-bold">EM BREVE</span></h4>
                            <p class="text-xs text-gray-400 leading-relaxed">Especificações para Uploading usando S3 Multipart.</p>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
            
            modal.querySelectorAll('.template-card').forEach(card => {
                card.addEventListener('click', () => {
                    const text = card.getAttribute('data-prompt');
                    prompt.value = text;
                    modal.remove();
                    window.scrollTo({ top: document.getElementById('generatorSection').offsetTop - 20, behavior: 'smooth' });
                    // Optional: auto blur the prompt so it's not sticking with blue borders if we auto click
                    btn.click(); // Auto-gerar para causar efeito WOW!
                });
            });
        });
    }

    const integrationsBtn = document.getElementById('integrationsBtn');
    if (integrationsBtn) {
        integrationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in p-4 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-[pulse_0.2s_ease-out_1_forwards]">
                    <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-accent shadow-inner">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    </div>
                    <h3 class="text-xl font-extrabold text-primary mb-2">Integrações Nativas</h3>
                    <p class="text-sm text-gray-500 mb-6 leading-relaxed">Em breve você poderá exportar suas especificações maravilhosas com 1 clique direto para o <strong class="text-blue-600">Jira</strong> ou transformar os requisitos em <strong class="text-slate-800">GitHub Issues</strong> prontas para a esteira CI/CD!</p>
                    <button class="w-full py-2.5 bg-accent text-white rounded-lg font-bold hover:bg-blue-600 transition shadow-md modal-close-btn">Entendi, perfeito!</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
        });
    }

    const aiModelsBtn = document.getElementById('aiModelsBtn');
    if (aiModelsBtn) {
        aiModelsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in p-4 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-[pulse_0.2s_ease-out_1_forwards] relative">
                    <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="text-xl font-bold text-primary flex items-center gap-2">Modelos de Inteligência</h3>
                        <button class="text-gray-400 hover:text-red-500 transition modal-close-btn"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>
                    <div class="p-6 space-y-4">
                        <label class="flex items-center gap-4 p-4 border-2 border-accent bg-blue-50/50 rounded-xl cursor-pointer">
                            <input type="radio" name="model" checked class="w-5 h-5 text-accent focus:ring-accent" />
                            <div>
                                <h4 class="font-bold text-gray-800">SpecForge Architect v2 <span class="text-xs bg-accent text-white px-2 py-0.5 rounded-full ml-2">Padrão</span></h4>
                                <p class="text-sm text-gray-500 mt-1">Otimizado para arquitetura de software e design de bancos de dados estritos.</p>
                            </div>
                        </label>
                        <label class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-accent transition opacity-60">
                            <input type="radio" name="model" disabled class="w-5 h-5" />
                            <div>
                                <h4 class="font-bold text-gray-800">Claude 3.5 Sonnet <span class="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded flex-shrink-0 ml-2">MASTER PRO</span></h4>
                                <p class="text-sm text-gray-500 mt-1">Disponível em breve para processamento analítico de Front-end extenso.</p>
                            </div>
                        </label>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
        });
    }

    const teamBtn = document.getElementById('teamBtn');
    if (teamBtn) {
        teamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in p-4 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[pulse_0.2s_ease-out_1_forwards] relative">
                    <div class="p-6 text-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Workspace Colaborativo</h3>
                        <p class="text-sm text-gray-500 mb-6">Convide engenheiros para o seu app SpecForge.</p>
                        <div class="flex gap-2">
                           <input type="email" placeholder="dev@empresa.com" class="border flex-1 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent" />
                           <button class="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800">Convidar</button>
                        </div>
                    </div>
                    <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 modal-close-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
        });
    }

    const brandKitBtn = document.getElementById('brandKitBtn');
    if (brandKitBtn) {
        brandKitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in p-4 backdrop-blur-sm';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-[pulse_0.2s_ease-out_1_forwards]">
                    <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-500 shadow-inner">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-primary mb-2">Base de Conhecimento</h3>
                    <p class="text-sm text-gray-500 mb-6">Faça upload de PDFs com regras de negócio. A IA vai ler seus documentos via matriz RAG nativa.</p>
                    <button class="w-full py-2.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg font-bold cursor-not-allowed">Habilitado na V2 (Beta)</button>
                    <button class="mt-4 text-xs font-bold text-gray-400 underline modal-close-btn">Voltar ao painel</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
        });
    }
});
