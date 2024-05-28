const gallery = document.querySelector(".gallery"); // Sélectionne l'élément avec la classe "gallery"
const filters = document.querySelector(".filters"); // Sélectionne l'élément avec la classe "filters"

async function getData(endpoint) {
  const response = await fetch(`http://localhost:5678/api/${endpoint}`); // Effectue une requête HTTP GET vers l'endpoint spécifié
  if (response.ok) {
    return await response.json(); // Si la réponse est OK, renvoie les données au format JSON
  } else {
    console.error(`Error fetching ${endpoint}:`, response.status); // Sinon, affiche une erreur dans la console
    return [];
  }
}

async function affichageWorks() {
  const arrayWorks = await getData("works"); // Récupère les données des "works"
  arrayWorks.forEach(createWorks); // Pour chaque élément dans le tableau, appelle la fonction createWorks
}

function createWorks(work) {
  const workHTML = `
    <figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    </figure>
  `;
  gallery.insertAdjacentHTML("beforeend", workHTML); // Insère le contenu HTML généré dans l'élément "gallery"
}

async function displayCategorysButtons() {
  const categorys = await getData("categories"); // Récupère les données des "categories"
  const allBtn = createButton("Tous", "0"); // Crée un bouton pour afficher toutes les catégories
  filters.appendChild(allBtn); // Ajoute le bouton à l'élément "filters"
  categorys.forEach((category) => {
    const btn = createButton(category.name, category.id); // Crée un bouton pour chaque catégorie
    filters.appendChild(btn); // Ajoute le bouton à l'élément "filters"
  });
}

function createButton(text, id) {
  const btn = document.createElement("button"); // Crée un élément de bouton
  btn.textContent = text; // Définit le texte du bouton
  btn.id = id; // Définit l'ID du bouton
  btn.classList.add("btn"); // Ajoute la classe "btn" au bouton
  return btn; // Renvoie le bouton créé
}

async function filterCategory() {
  const categories = await getData("works"); // Récupère les données des "works"
  const buttons = document.querySelectorAll(".filters button"); // Sélectionne tous les boutons dans l'élément "filters"
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Ajoute un écouteur d'événements "click" à chaque bouton
      const btnId = e.target.id; // Récupère l'ID du bouton cliqué
      gallery.innerHTML = ""; // Vide le contenu de l'élément "gallery"
      if (btnId !== "0") {
        const categoriesTriCategory = categories.filter(
          (work) => work.categoryId == btnId
        ); // Filtre les "works" en fonction de l'ID de la catégorie sélectionnée
        categoriesTriCategory.forEach(createWorks); // Pour chaque élément dans le tableau filtré, appelle la fonction createWorks
      } else {
        affichageWorks(); // Si le bouton "Tous" est cliqué, affiche tous les "works"
      }
    });
  });
}

affichageWorks(); // Appelle la fonction pour afficher les "works"
displayCategorysButtons(); // Appelle la fonction pour afficher les boutons de catégorie
filterCategory(); // Appelle la fonction pour filtrer les "works" en fonction de la catégorie sélectionnée
