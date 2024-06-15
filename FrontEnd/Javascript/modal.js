// Sélectionne l'élément avec la classe "modif" dans la balise <main>
const modif = document.querySelector("main .modif");
// Sélectionne l'élément avec la classe "containerModals"
const containerModals = document.querySelector(".containerModals");

// Ajoute un écouteur d'événements pour le clic sur l'élément "modif"
modif.addEventListener("click", () => {
  // Change le style d'affichage de "containerModals" pour le rendre visible (flex)
  containerModals.style.display = "flex";
});

// Sélectionne l'élément avec la classe "fa-xmark" à l'intérieur de "containerModals"
const xmark = document.querySelector(".containerModals .fa-xmark");

// Ajoute un écouteur d'événements pour le clic sur l'élément "xmark"
xmark.addEventListener("click", () => {
  // Change le style d'affichage de "containerModals" pour le rendre invisible (none)
  containerModals.style.display = "none";
});

// Fonction asynchrone pour récupérer les photos
async function getPhotos() {
  // Appelle la fonction getData avec l'argument "works" et attend la réponse
  return await getData("works");
}

// Fonction asynchrone pour afficher la galerie modale
async function displayGalleryModal() {
  // Sélectionne l'élément avec la classe "GalleryModal"
  const galleryModal = document.querySelector(".GalleryModal");
  // Vide le contenu de la galerie modale
  galleryModal.innerHTML = "";
  // Récupère la liste des photos
  const gallery = await getPhotos();
  // Pour chaque photo dans la liste
  gallery.forEach((photo) => {
    // Crée un élément figure
    const figure = document.createElement("figure");
    // Ajoute la classe "modalFigure" à l'élément figure
    figure.classList.add("modalFigure");
    // Définit l'attribut data-id de l'élément figure avec l'identifiant de la photo
    figure.dataset.id = photo.id;
    // Crée un élément img
    const img = document.createElement("img");
    // Crée un élément span contenant une icône de corbeille (fa-trash-can)
    const span = document.createElement("span");
    span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    // Définit l'identifiant de l'élément span avec l'identifiant de la photo
    span.id = photo.id;
    // Ajoute la classe "deleteIcon" à l'élément span
    span.classList.add("deleteIcon");
    // Définit la source de l'image avec l'URL de l'image de la photo
    img.src = photo.imageUrl;
    // Ajoute l'élément img à l'élément figure
    figure.appendChild(img);
    // Ajoute l'élément span à l'élément figure
    figure.appendChild(span);
    // Ajoute l'élément figure à la galerie modale
    galleryModal.appendChild(figure);
  });
  // Appelle la fonction deletePhoto pour gérer la suppression de photos
  deletePhoto();
}

// Appelle la fonction displayGalleryModal pour afficher la galerie modale
displayGalleryModal();

// Fonction pour supprimer une photo de la galerie
function deletePhoto() {
  // Sélectionne tous les éléments avec la classe "deleteIcon" dans la galerie modale
  const trashAll = document.querySelectorAll(".GalleryModal .deleteIcon");
  // Pour chaque icône de corbeille
  trashAll.forEach((trash) => {
    // Ajoute un écouteur d'événements pour le clic
    trash.addEventListener("click", (e) => {
      // Récupère l'identifiant de la photo à partir de l'attribut id de l'icône de corbeille
      const id = trash.id;
      // Initialise les options de la requête fetch pour la méthode DELETE
      const init = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      // Envoie une requête DELETE pour supprimer la photo avec l'identifiant spécifié
      fetch(`http://localhost:5678/api/works/${id}`, init)
        .then((response) => {
          // Si la réponse n'est pas "ok", affiche un message dans la console
          if (!response.ok) {
            console.log("Le delete n'a pas marché !");
          }
          // Renvoie les données de la réponse au format JSON
          return response.json();
        })
        .then((data) => {
          // Affiche un message dans la console avec les données de la réponse
          console.log("La delete a réussi, voici la data :", data);
          // Appelle les fonctions pour supprimer la photo de la galerie et de la modale
          removePhotoFromGallery(id);
          removePhotoFromModal(id);
        });
    });
  });
}

// Fonction pour supprimer une photo de la galerie
function removePhotoFromGallery(id) {
  // Sélectionne l'élément figure correspondant à l'identifiant de la photo dans la galerie principale
  const figure = document.querySelector(`.gallery figure[data-id="${id}"]`);
  // Si l'élément figure existe, le supprime de la galerie principale
  if (figure) {
    figure.remove();
  }
}

// Fonction pour supprimer une photo de la galerie modale
function removePhotoFromModal(id) {
  // Sélectionne l'élément figure correspondant à l'identifiant de la photo dans la galerie modale
  const figure = document.querySelector(
    `.GalleryModal figure[data-id="${id}"]`
  );
  // Si l'élément figure existe, le supprime de la galerie modale
  if (figure) {
    figure.remove();
  }
}
