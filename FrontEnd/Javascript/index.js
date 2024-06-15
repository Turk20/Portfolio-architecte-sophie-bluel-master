const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

// Fonction pour récupérer des données depuis l'API
async function getData(endpoint) {
  const response = await fetch(`http://localhost:5678/api/${endpoint}`);
  if (response.ok) {
    return await response.json();
  } else {
    console.error(`Error fetching ${endpoint}:`, response.status);
    return [];
  }
}

// Afficher les œuvres dans la galerie
async function affichageWorks() {
  const arrayWorks = await getData("works");
  arrayWorks.forEach(createWorks);
}

// Créer et insérer les éléments HTML pour chaque œuvre
function createWorks(work) {
  const workHTML = `
        <figure data-id="${work.id}">
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>
    `;
  gallery.insertAdjacentHTML("beforeend", workHTML);
}

// Afficher les boutons de catégories
async function displayCategorysButtons() {
  // Vérifier si l'utilisateur est connecté
  const loged = JSON.parse(window.sessionStorage.getItem("loged"));
  if (!loged) {
    // Afficher les catégories uniquement si l'utilisateur n'est pas connecté
    const categorys = await getData("categories");
    const allBtn = createButton("Tous", "0");
    filters.appendChild(allBtn);
    categorys.forEach((category) => {
      const btn = createButton(category.name, category.id);
      filters.appendChild(btn);
    });
  }
}

// Créer un bouton de catégorie
function createButton(text, id) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.id = id;
  btn.classList.add("btn");
  return btn;
}

// Filtrer les œuvres par catégorie
async function filterCategory() {
  const categories = await getData("works");
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const categoriesTriCategory = categories.filter(
          (work) => work.categoryId == btnId
        );
        categoriesTriCategory.forEach(createWorks);
      } else {
        affichageWorks();
      }
    });
  });
}

// Appeler les fonctions pour afficher les œuvres, les catégories et ajouter les filtres
affichageWorks();
displayCategorysButtons();
filterCategory();

// Gérer l'état de connexion de l'utilisateur
const loged = JSON.parse(window.sessionStorage.getItem("loged"));
const logout = document.querySelector("header nav li .logout");
const Banner = document.querySelector(".banner");
const Modif = document.querySelector(".modify");

if (loged) {
  // Si l'utilisateur est connecté
  // Afficher le banner de connexion
  Banner.style.display = "flex";

  // Mettre à jour le texte du bouton de déconnexion
  logout.textContent = "Logout";

  // Gérer la déconnexion de l'utilisateur
  logout.addEventListener("click", () => {
    window.sessionStorage.setItem("loged", false);
  });

  // Ajuster les styles si nécessaire (par exemple, le décalage du header)
  const header = document.querySelector("header");
  header.style.marginTop = "75px";

  // Afficher l'élément ".modify"
  Modif.style.display = "flex";
}
