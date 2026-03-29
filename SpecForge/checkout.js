window.openCheckoutModal = (planName, price) => {
    const modalId = 'checkoutModalOverlay';
    if(document.getElementById(modalId)) document.getElementById(modalId).remove();
    
    planName = planName === 'premium' ? 'pro' : planName; // normalize

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-slate-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto fade-in';
    
    const formattedPrice = `R$ ${price},00`;
    
    modal.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-[pulse_0.2s_ease-out_1_forwards] relative my-8">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20 bg-gray-100/50 hover:bg-gray-200 rounded-full p-1 transition" onclick="this.closest('#${modalId}').remove()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <!-- Left Side: Order Summary -->
            <div class="w-full md:w-2/5 bg-gradient-to-br from-slate-50 to-gray-100 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div class="inline-flex items-center gap-2 mb-8">
                        <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">S</div>
                        <span class="font-bold text-xl text-primary tracking-tight">SpecForge</span>
                    </div>
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Resumo do Pedido</p>
                    <h3 class="text-3xl font-extrabold text-primary mb-2 capitalize">Plano ${planName}</h3>
                    <p class="text-gray-600 text-sm mb-8 leading-relaxed">Assinatura mensal para acelerar o desenvolvimento de software com especificações robustas autogeradas pela IA.</p>
                    
                    <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-gray-600 font-medium">Subtotal</span>
                            <span class="text-gray-900 font-bold">${formattedPrice}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm mb-4">
                            <span class="text-gray-500">Cobrado mensalmente</span>
                            <span class="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">BRL</span>
                        </div>
                        <div class="h-px bg-gray-100 mb-4"></div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-900 font-bold text-lg">Total a pagar</span>
                            <span class="text-primary font-extrabold text-2xl">${formattedPrice}</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium bg-gray-200/50 p-3 rounded-xl mt-4">
                    <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Ambiente criptografado (256-bit SSL)
                </div>
            </div>
            
            <!-- Right Side: Payment Form -->
            <div class="w-full md:w-3/5 p-8 md:p-10 bg-white relative">
                <h4 class="text-xl font-bold text-gray-900 mb-6">Como você quer pagar?</h4>
                
                <!-- Payment Method Tabs -->
                <div class="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                    <button class="flex-1 py-2.5 text-sm font-bold bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 transition" id="tabCartaoBtn" onclick="window.togglePaymentTab('cartao')">Cartão de Crédito</button>
                    <button class="flex-1 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-700 hover:bg-gray-50 transition border border-transparent" id="tabPixBtn" onclick="window.togglePaymentTab('pix')">PIX (Imediato)</button>
                </div>
                
                <!-- Credit Card Form -->
                <div id="checkoutCartao" class="space-y-5 transition-opacity duration-300">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 mb-1.5 tracking-wider">NÚMERO DO CARTÃO</label>
                        <div class="relative">
                            <input type="text" class="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none font-mono text-sm shadow-sm placeholder-gray-400 pl-11 transition" placeholder="0000 0000 0000 0000" maxlength="19">
                            <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 mb-1.5 tracking-wider">NOME IMPRESSO NO CARTÃO</label>
                        <input type="text" class="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none text-sm shadow-sm placeholder-gray-400 uppercase transition" placeholder="NOME DO TITULAR">
                    </div>
                    <div class="grid grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[11px] font-bold text-gray-500 mb-1.5 tracking-wider">VALIDADE</label>
                            <input type="text" class="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none font-mono text-sm shadow-sm placeholder-gray-400 text-center transition" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-gray-500 mb-1.5 tracking-wider">CVC/CVV</label>
                            <input type="text" class="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none font-mono text-sm shadow-sm placeholder-gray-400 text-center transition" placeholder="123" maxlength="4">
                        </div>
                    </div>
                    <button class="w-full py-4 mt-8 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group" onclick="window.processCheckout('${planName}')">
                        <span>Pagar ${formattedPrice} agora</span>
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                    <p class="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg> Transação auditada pela Stripe.</p>
                </div>
                
                <!-- Pix Form (Hidden Initially) -->
                <div id="checkoutPix" class="hidden space-y-6 text-center transition-opacity duration-300 h-full flex flex-col justify-center pb-4">
                    <p class="text-sm text-gray-600 mb-2">Escaneie o QR Code abaixo com o aplicativo do seu banco para liberar o acesso instantaneamente.</p>
                    <div class="mx-auto w-48 h-48 bg-white rounded-2xl border-2 border-dashed border-gray-300 p-3 flex items-center justify-center relative overflow-hidden group hover:border-emerald-400 transition shadow-sm">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020126430014BR.GOV.BCB.PIX0121pix@specforge.com.br520400005303986540549.005802BR5910SpecForge6009Sao Paulo62070503***6304E8A5" class="w-full h-full opacity-90 group-hover:opacity-100 transition" alt="PIX QR Code">
                    </div>
                    <div class="w-full max-w-sm mx-auto relative mt-4">
                        <input type="text" readonly value="00020126430014BR.GOV.BCB.PIX0121..." class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-500 pr-28 outline-none focus:border-emerald-400 transition">
                        <button class="absolute top-2 right-2 bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-emerald-600 font-bold transition flex items-center gap-1 shadow-sm" onclick="this.innerHTML='<span class=\\'text-emerald-500\\'>Copiado!</span>'; setTimeout(()=>this.innerHTML='Copiar Cola', 2000)">Copiar Cola</button>
                    </div>
                    <button class="w-full py-4 mt-6 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2" onclick="window.processCheckout('${planName}')">Já escaneei e paguei (Simular)</button>
                </div>
                
            </div>
            
            <!-- Loading/Success State Overlay -->
            <div id="checkoutLoadingOverlay" class="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 hidden flex-col items-center justify-center p-8 text-center transition-all duration-500 opacity-0 rounded-3xl">
                <svg class="animate-spin h-12 w-12 text-accent mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Processando segurança...</h3>
                <p class="text-gray-500 text-sm">Validando transação com a operadora financeira.</p>
            </div>
            
        </div>
    `;
    
    document.body.appendChild(modal);
    
    window.togglePaymentTab = (type) => {
        const btnCartao = document.getElementById('tabCartaoBtn');
        const btnPix = document.getElementById('tabPixBtn');
        const viewCartao = document.getElementById('checkoutCartao');
        const viewPix = document.getElementById('checkoutPix');
        
        if (type === 'cartao') {
            btnCartao.className = 'flex-1 py-2.5 text-sm font-bold bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 transition';
            btnPix.className = 'flex-1 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-700 hover:bg-gray-50 transition border border-transparent';
            viewPix.classList.add('hidden');
            viewCartao.classList.remove('hidden');
            setTimeout(() => viewCartao.classList.remove('opacity-0'), 10);
        } else {
            btnPix.className = 'flex-1 py-2.5 text-sm font-bold bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 transition';
            btnCartao.className = 'flex-1 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-700 hover:bg-gray-50 transition border border-transparent';
            viewCartao.classList.add('hidden');
            viewPix.classList.remove('hidden');
            setTimeout(() => viewPix.classList.remove('opacity-0'), 10);
        }
    };
    
    window.processCheckout = (planName) => {
        const overlay = document.getElementById('checkoutLoadingOverlay');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        
        setTimeout(() => {
            overlay.innerHTML = `
                <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto scale-0 animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1_forwards]">
                    <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-3xl font-extrabold text-emerald-600 mb-3">Pagamento Aprovado!</h3>
                <p class="text-gray-600 mb-8 max-w-sm mx-auto text-lg">Parabéns. Sua conta foi atualizada para o plano <strong>${planName.toUpperCase()}</strong> com sucesso e todos os recursos foram desbloqueados.</p>
                <button class="bg-primary px-8 py-4 rounded-xl font-bold text-white hover:bg-slate-800 transition shadow-xl shadow-slate-900/10" onclick="window.finalizeUpgrade('${planName}')">Começar a Usar Agora</button>
            `;
        }, 2200);
    };
    
    window.finalizeUpgrade = (planName) => {
        localStorage.setItem('specforge_plan', planName);
        localStorage.setItem('specforge_premium', 'true');
        
        if (window.location.href.includes('dashboard')) {
            window.location.reload();
        } else {
            document.getElementById(modalId).remove();
            
            if(localStorage.getItem('isLogged') === 'true') {
                 window.location.href = 'dashboard.html';
            } else {
                 const modal = document.getElementById('paywallModal');
                 if(modal) {
                     document.getElementById('paywallBackdrop').classList.add('opacity-0');
                     document.getElementById('paywallContent').classList.add('opacity-0', 'translate-y-8', 'sm:translate-y-0', 'sm:scale-95');
                     setTimeout(() => modal.classList.add('hidden'), 300);
                 }
                 // Trigger the toast on index
                 const toastSuccess = document.getElementById('toastSuccess');
                 if (toastSuccess) {
                     toastSuccess.classList.remove('translate-x-full', 'opacity-0');
                     setTimeout(() => toastSuccess.classList.add('translate-x-full', 'opacity-0'), 4000);
                 }
                 if(typeof updateCounterDisplay !== 'undefined') updateCounterDisplay();
            }
        }
    };
};
