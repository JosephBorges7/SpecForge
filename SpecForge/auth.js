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
            
            if (emailInput && emailInput.value) {
                // Simulação de Login
                localStorage.setItem('isLogged', 'true');
                localStorage.setItem('userEmail', emailInput.value);
                
                // Redirecionar para Dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }
});
