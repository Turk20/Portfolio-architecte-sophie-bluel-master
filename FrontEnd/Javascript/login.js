// Récupération des éléments du formulaire
const form = document.querySelector("#login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const messageErreur = document.querySelector("#login p");

// Événement de soumission du formulaire
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Récupération des valeurs saisies par l'utilisateur
  const email = emailInput.value;
  const password = passwordInput.value;

  // Vérification si les champs ne sont pas vides
  if (!email || !password) {
    alert("Veuillez remplir tous les champs."); // Affiche une alerte si un champ est vide
    return; //
  }

  // Envoi des données d'authentification à l'API
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Affiche les données de la réponse dans la console
      if (data.token) {
        localStorage.setItem("token", data.token); // Stocke le token dans le localStorage
        // Authentification réussie : redirige l'utilisateur vers la page d'accueil
        window.location.href = "./index.html";
      } else {
        messageErreur.textContent =
          "Votre email ou votre mot de passe est incorrect";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'authentification :", error);
      alert("Une erreur est survenue lors de l'authentification.");
    });
});
