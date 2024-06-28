const form = document.querySelector("#login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const messageErreur = document.querySelector("#login p");

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // Stocke le token dans le localStorage
      window.sessionStorage.loged = "true";
      window.location.href = "./index.html"; // Redirection vers la page d'accueil
    } else {
      messageErreur.textContent =
        "Votre email ou votre mot de passe est incorrect";
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    alert("Une erreur est survenue lors de l'authentification.");
  }
};

form.addEventListener("submit", handleFormSubmit);
