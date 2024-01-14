function submitLoginForm() {
    const username = document.getElementById('mail').value;
    const password = document.getElementById('mdp').value;

    // Simuler une requête fetch vers un serveur
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:username, password }),
    })
    .then(response => {
        return response.json();
    })
    .then(response => {
        console.log(response);
            if (response.token) {
                // Stocke les informations d'identification dans localStorage
                localStorage.setItem('token', response.token);

                // Redirige vers la page d'accueil en cas d'authentification réussie
                window.location.href = 'index.html';
            } else {
                // Affiche un message d'erreur en cas d'échec d'authentification
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
    })
    .catch(error => {
        console.error('Erreur lors de la requête fetch:', error);
    });
}