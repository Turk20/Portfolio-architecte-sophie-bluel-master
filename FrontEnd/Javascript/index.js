const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getData(endpoint) {
  try {
    const response = await fetch(`http://localhost:5678/api/${endpoint}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Error fetching ${endpoint}:`, response.status);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

async function afficherOeuvres() {
  const oeuvres = await getData("works");
  gallery.innerHTML = ""; // Vide la galerie avant d'afficher les œuvres
  oeuvres.forEach(createOeuvre);
}

// Créer et insérer les éléments HTML pour chaque œuvre
function createOeuvre(oeuvre) {
  const oeuvreHTML = `
    <figure data-id="${oeuvre.id}">
      <img src="${oeuvre.imageUrl}" alt="${oeuvre.title}">
      <figcaption>${oeuvre.title}</figcaption>
    </figure>
  `;
  gallery.insertAdjacentHTML("beforeend", oeuvreHTML);
}

async function afficherBoutonsCategories() {
  const loged = JSON.parse(window.sessionStorage.getItem("loged"));
  if (!loged) {
    const categories = await getData("categories");
    const allBtn = createButton("Tous", "0");
    filters.appendChild(allBtn);
    categories.forEach((category) => {
      const btn = createButton(category.name, category.id);
      filters.appendChild(btn);
    });
    filtrerParCategorie();
  }
}

// Créer un bouton de catégorie
function createButton(text, id) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.id = id;
  btn.classList.add("btn");
  btn.addEventListener("click", function (e) {
    document.querySelectorAll(".btn").forEach((button) => {
      button.classList.remove("btn-active");
    });
    e.currentTarget.classList.add("btn-active");
    filtrerParCategorie(e);
  });
  return btn;
}

// Filtrer les œuvres par catégorie
async function filtrerParCategorie(e) {
  const categoryId = e ? e.target.id : "0";
  const oeuvres = await getData("works");
  gallery.innerHTML = "";
  if (categoryId !== "0") {
    const oeuvresFiltrees = oeuvres.filter(
      (oeuvre) => oeuvre.categoryId == categoryId
    );
    oeuvresFiltrees.forEach(createOeuvre);
  } else {
    afficherOeuvres();
  }
}

afficherOeuvres();
afficherBoutonsCategories();

const loged = JSON.parse(window.sessionStorage.getItem("loged"));
const logout = document.querySelector("header nav li .logout");
const banner = document.querySelector(".banner");
const modify = document.querySelector(".modify");

if (loged) {
  banner.style.display = "flex";
  logout.textContent = "Logout";

  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.sessionStorage.setItem("loged", false);
      window.location.href = "./login.html";
    });
  }

  const header = document.querySelector("header");
  if (header) {
    header.style.marginTop = "75px";
  }

  if (modify) {
    modify.style.display = "flex";
  }
}
