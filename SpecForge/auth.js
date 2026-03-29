document.addEventListener('DOMContentLoaded', () => {
    // Se o usuário já estiver logado, redireciona para o dashboard
    if (localStorage.getItem('isLogged') === 'true') {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (emailInput && emailInput.value) {
                // Simulação de Login
                localStorage.setItem('isLogged', 'true');
                localStorage.setItem('userEmail', emailInput.value);
                
                // Define the correct plan using the test credentials
                const email = emailInput.value.toLowerCase();
                const pass = passwordInput ? passwordInput.value : '';
                
                if (email === 'master@specforge.com' && pass === 'master123') {
                    localStorage.setItem('specforge_plan', 'master');
                    localStorage.setItem('specforge_premium', 'true');
                } else if (email === 'pro@specforge.com' && pass === 'pro123') {
                    localStorage.setItem('specforge_plan', 'pro');
                    localStorage.setItem('specforge_premium', 'true');
                } else if (email === 'free@specforge.com' && pass === 'free123') {
                    localStorage.setItem('specforge_plan', 'free');
                    localStorage.setItem('specforge_premium', 'false');
                } else {
                    // Default behavior for other emails
                    localStorage.setItem('specforge_plan', 'free');
                    localStorage.setItem('specforge_premium', 'false');
                }
                
                // Redirecionar para Dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }
});
