document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('generateBtn');
    const prompt = document.getElementById('prompt');
    const resultArea = document.getElementById('resultArea');
    const loading = document.getElementById('loading');
    const outputContent = document.getElementById('outputContent');

    const outTitle = document.getElementById('outTitle');
    const outDesc = document.getElementById('outDesc');
    const outReqs = document.getElementById('outReqs');
    const outTech = document.getElementById('outTech');

    // Paywall Elements & State
    const usageCounter = document.getElementById('usageCounter');
    const paywallModal = document.getElementById('paywallModal');
    const paywallBackdrop = document.getElementById('paywallBackdrop');
    const paywallContent = document.getElementById('paywallContent');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const toastSuccess = document.getElementById('toastSuccess');
    const closeToastBtn = document.getElementById('closeToastBtn');

    const MAX_FREE_USES = 2;
    let usageCount = parseInt(localStorage.getItem('specforge_usage') || '0');
    let isPremium = localStorage.getItem('specforge_premium') === 'true';

    const updateCounterDisplay = () => {
        if (!usageCounter) return;
        if (isPremium) {
            usageCounter.innerHTML = '<span class="text-emerald-600 flex items-center gap-1 font-bold"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Premium Ativado</span>';
            usageCounter.classList.remove('text-gray-500', 'text-red-500');
        } else {
            const left = Math.max(0, MAX_FREE_USES - usageCount);
            usageCounter.textContent = `Você tem ${left} uso${left !== 1 ? 's' : ''} gratuito${left !== 1 ? 's' : ''}`;
            if (left === 0) {
                usageCounter.classList.replace('text-gray-500', 'text-red-500');
            }
        }
    };

    updateCounterDisplay();

    const openPaywall = () => {
        if(!paywallModal) return;
        paywallModal.classList.remove('hidden');
        setTimeout(() => {
            paywallBackdrop.classList.remove('opacity-0');
            paywallContent.classList.remove('opacity-0', 'translate-y-8', 'sm:translate-y-0', 'sm:scale-95');
        }, 10);
    };

    const closePaywall = () => {
        paywallBackdrop.classList.add('opacity-0');
        paywallContent.classList.add('opacity-0', 'translate-y-8', 'sm:translate-y-0', 'sm:scale-95');
        setTimeout(() => {
            paywallModal.classList.add('hidden');
        }, 300);
    };

    const showToast = () => {
        toastSuccess.classList.remove('translate-x-full', 'opacity-0');
        setTimeout(() => {
            closeToast();
        }, 4000);
    };

    const closeToast = () => {
        toastSuccess.classList.add('translate-x-full', 'opacity-0');
    };

    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            isPremium = true;
            localStorage.setItem('specforge_premium', 'true');
            updateCounterDisplay();
            closePaywall();
            setTimeout(() => {
                showToast();
            }, 300);
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closePaywall);
    if (closeToastBtn) closeToastBtn.addEventListener('click', closeToast);

    const parseUserIntent = (text) => {
        const lowerText = text.toLowerCase();

        // 1. Dicionário de intenções com palavras-chaves
        const intentKeywords = {
            auth: ['login', 'autenticação', 'autenticacao', 'jwt', 'senha', 'usuário', 'usuario', 'auth', 'logar'],
            payment: ['pagamento', 'checkout', 'carrinho', 'stripe', 'compra', 'cartão', 'cartao', 'pix'],
            crud: ['cadastro', 'criar', 'editar', 'deletar', 'listar', 'crud', 'gerenciar', 'banco de dados'],
            api: ['api', 'endpoint', 'integração', 'integracao', 'backend', 'rota', 'webhook', 'serviço', 'servico']
        };

        // Função auxiliar para detectar intenção
        const detectIntent = (text) => {
            for (const [intent, keywords] of Object.entries(intentKeywords)) {
                if (keywords.some(kw => text.includes(kw))) {
                    return intent;
                }
            }
            return 'default';
        };

        const intent = detectIntent(lowerText);

        // 2 & 3. Gerar título e descrição espertos
        let title = "";
        let desc = "";
        let reqs = [];
        let ac = [];
        let tech = [];

        // Extrai o core da ideia do usuário para deixar a descrição contextual
        const shortUserText = text.length > 50 ? text.substring(0, 50) + "..." : text;

        switch (intent) {
            case 'auth':
                title = "Sistema de Autenticação e Gestão de Usuários";
                desc = `Módulo de segurança focado em controle de acesso para a demanda: "${shortUserText}". O objetivo é proteger rotas privadas e garantir a verificação da identidade do usuário final de maneira resiliente.`;
                reqs = [
                    "Implementar autenticação baseada em tokens JWT",
                    "Criar endpoint seguro de login (/auth/login)",
                    "Validar credenciais e aplicar hash unidirecional na senha (ex: bcrypt, argon2)",
                    "Armazenar token com segurança no cliente (HttpOnly Cookies preferencialmente)",
                    "Implementar proteção contra ataques de brute-force e rate limiting"
                ];
                ac = [
                    "Dado que o usuário fornece credenciais válidas, Quando realizar o envio, Então deve receber um token HTTP e ser autorizado",
                    "Dado que o usuário tenta logar com senha errada, Quando confirmar o envio, Então deve receber uma mensagem genérica 'Credenciais inválidas'",
                    "Dado que o token expirou, Quando o usuário tentar acessar uma rota protegida, Então deve ser deslogado automaticamente"
                ];
                tech = ["Node.js + Express / NestJS", "JWT", "Bcrypt", "PostgreSQL", "Redis (Rate Limit)"];
                break;

            case 'payment':
                title = "Módulo de Pagamentos e Checkout";
                desc = `Fluxo financeiro automatizado para: "${shortUserText}". O objetivo principal é processar valores com segurança, evitar cobranças indevidas e acompanhar o gerenciamento de estados do pedido com total assertividade.`;
                reqs = [
                    "Integração segura com gateway de pagamento (Checkout transparente ou mantido pelo provider)",
                    "Processamento assíncrono rigoroso de transações financeiras",
                    "Controle imutável de status de pedido (ex: Pendente, Aprovado, Recusado, Estornado)",
                    "Implementar webhooks em Background Worker para atualização de status confirmada",
                    "Monitoramento de falhas e tratamento rígido de idempotência"
                ];
                ac = [
                    "Dado que o usuário finaliza a compra, Quando o pagamento é aprovado no gateway, Então o status do pedido deve atualizar para 'Aprovado'",
                    "Dado que ocorre uma falha na rede ou timeout, Quando o webhook for processado novamente, Então o sistema não deve duplicar o lançamento",
                    "Dado que existe um cupom atrelado ao carrinho, Quando aplicar o desconto, Então o backend deve recalcular e validar fortemente os totais"
                ];
                tech = ["Stripe / Pagar.me API", "Node.js Worker", "Webhooks", "RabbitMQ / SQS", "PostgreSQL"];
                break;

            case 'crud':
                title = "Sistema de Gerenciamento de Dados (CRUD)";
                desc = `Interface e camada de persistência focados em: "${shortUserText}". O objetivo principal é permitir a manipulação de entidades de forma segura, estritamente validada no backend e altamente rastreável.`;
                reqs = [
                    "Criar controllers RESTful (GET, POST, PUT, DELETE) para a entidade principal mapeada",
                    "Persistência atômica garantida em banco de dados relacional",
                    "Validação de dados rigorosa na camada de input da API (ex: Zod, Joi, class-validator)",
                    "Implementação de paginação dinâmica baseada em cursor/offset e filtros variados",
                    "Adoção de Soft-Delete (exclusão lógica) para preservar a integridade histórica"
                ];
                ac = [
                    "Dado que o usuário submete um formulário válido, Quando confirmar a solicitação, Então o novo dado deve persistir e refletir em tempo real",
                    "Dado que o payload excede os limites definidos, Quando acionar o endpoint, Então deve receber HTTP 400 com os erros detalhados",
                    "Dado que um registro possui dependências relacionais ativas, Quando solicitarem sua exclusão, Então o sistema deve bloquear a deleção física"
                ];
                tech = ["React.js", "Zod / Yup", "Node.js", "TypeORM / Prisma", "PostgreSQL"];
                break;

            case 'api':
                title = "Integração e Engenharia de API REST";
                desc = `Desenvolvimento de backend escalável abordando o core: "${shortUserText}". O serviço será estritamente focado em performance, documentação cristalina e desacoplamento.`;
                reqs = [
                    "Modelagem arquitetural das rotas respeitando pragmatismos do REST",
                    "Integração de autenticação padronizada via API Key ou tokens OAuth 2.0",
                    "Documentação atualizada e interativa de endpoints via Swagger / OpenAPI 3.0",
                    "Adoção antecipada de versionamento de chamadas (ex: /api/v1/resource)",
                    "Padronização imutável do formato das respostas de Erro de uso global"
                ];
                ac = [
                    "Dado que se consome a rota com Content-Type inesperado, Quando houver a requisição, Então a API deve rejeitar por Unsupported Media Type",
                    "Dado que o cliente ultrapassa a cota estipulada, Quando a API for chamada excessivamente, Então o retorno deve ser um HTTP 429 Too Many Requests",
                    "Dado que ocorra um crash ou memory leak interno, Quando o Probe de saúde consultar /health, Então os alarmes de infra devem notificar as equipes"
                ];
                tech = ["FastAPI ou NestJS", "PostgreSQL", "Swagger / OpenAPI", "Docker", "Nginx"];
                break;

            default:
                // Título dinâmico limpo usando as primeiras palavras relevantes
                const titleWords = text.split(' ').filter(w => w.length > 2 && !['para', 'com', 'que', 'uma', 'um'].includes(w)).slice(0, 3).join(' ');
                title = "Módulo Especializado de " + (titleWords ? titleWords.charAt(0).toUpperCase() + titleWords.slice(1) : "Funcionalidade Customizada");
                desc = `Especificação técnica sob demanda e adaptativa gerada a partir da instrução: "${shortUserText}". Focada nos princípios de desenvolvimento limpo e fácil testabilidade.`;
                reqs = [
                    "Segregação de responsabilidades alinhada à Clean Architecture",
                    "Criação de cobertura de testes unitários e de integração para os fluxos felizes e de exceção",
                    "Atendimento total aos critérios de acessibilidade e performance da interface ou serviço",
                    "Tratamento de exceções robusto evitando crash total ou exposição de stacktrace em produção"
                ];
                ac = [
                    "Dado que a funcionalidade principal é acionada, Quando o processamento culminar em sucesso, Então o fluxo deve se auto-completar perfeitamente guiando o ator principal",
                    "Dado que ocorra uma desestabilização de serviço parceiro, Quando a feature tentar executar, Então o sistema aplicará um fallback amigável",
                    "Dado que a ação modifique estados cruciais do sistema, Quando houver finalização indesejada, Então deverá manter integridade sem dados corrompidos"
                ];
                tech = ["TypeScript", "Node.js Environment", "React ou Vue.js", "TailwindCSS", "Jest / Vitest"];
                break;
        }

        return { title, desc, reqs, ac, tech };
    };

    btn.addEventListener('click', () => {
        const text = prompt.value.trim();

        if (!text) {
            prompt.focus();
            prompt.classList.add('ring-2', 'ring-red-400');
            setTimeout(() => prompt.classList.remove('ring-2', 'ring-red-400'), 1000);
            return;
        }

        // Paywall Check
        if (!isPremium && usageCount >= MAX_FREE_USES) {
            openPaywall();
            return;
        }

        // Incrementar uso se gratuito
        if (!isPremium) {
            usageCount++;
            localStorage.setItem('specforge_usage', usageCount);
            updateCounterDisplay();
        }

        btn.disabled = true;
        btn.innerHTML = 'Processando...';

        resultArea.classList.remove('hidden');
        outputContent.classList.add('hidden');
        loading.classList.remove('hidden');
        loading.style.display = 'flex';

        // Simular delay do processamento da IA
        setTimeout(() => {
            const data = parseUserIntent(text);

            outTitle.textContent = data.title;
            outDesc.textContent = data.desc;

            // Render Requisitos
            outReqs.innerHTML = '';
            data.reqs.forEach(req => {
                outReqs.innerHTML += `<li>${req}</li>`;
            });

            // Render Acceptance Criteria
            outAc.innerHTML = '';
            data.ac.forEach(ac => {
                // Highlight de palavras-chave Gherkin
                let formatted = ac
                    .replace(/(Dado que|Given)/g, '<span class="text-secondary font-bold">$1</span>')
                    .replace(/(Quando|When)/g, '<span class="text-accent font-bold">$1</span>')
                    .replace(/(Então|Then)/g, '<span class="text-blue-400 font-bold">$1</span>');

                outAc.innerHTML += `<li class="flex gap-2 items-start mt-2">
                    <svg class="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    <span>${formatted}</span>
                </li>`;
            });

            // Render Suggested Techs
            if (outTech) {
                outTech.innerHTML = '';
                data.tech.forEach(t => {
                    outTech.innerHTML += `<li class="px-3 py-1 bg-slate-800 text-blue-300 font-medium font-mono border border-slate-600 hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-default shadow-sm rounded-md">${t}</li>`;
                });
            }

            loading.style.display = 'none';
            loading.classList.add('hidden');
            outputContent.classList.remove('hidden');

            btn.disabled = false;
            btn.innerHTML = `
                <span>Regerar especificação</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            `;

        }, 1800); // 1.8s
    });

    // Tratamento form inscrição CTA
    document.getElementById('waitlistForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Interesse registrado! 🎉';
        btn.classList.replace('bg-secondary', 'bg-accent');
        e.target.reset();
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('bg-accent', 'bg-secondary');
        }, 3000);
    });
});
