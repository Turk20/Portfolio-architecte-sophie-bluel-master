const modif = document.querySelector("main .modif");
const containerModals = document.querySelector(".containerModals");
const modalGallery = document.querySelector(".modalGallery");
const modalAddPhoto = document.querySelector(".modalAddPhoto");

modif.addEventListener("click", () => {
  containerModals.style.display = "flex";
  modalGallery.style.display = "flex";
  modalAddPhoto.style.display = "none";
});

const xmark = document.querySelector(".containerModals .fa-xmark");

xmark.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  containerModals.style.display = "none";
  resetAddPhotoForm();
});

async function getPhotos() {
  return await getData("works");
}

async function displayGalleryModal() {
  const galleryModal = document.querySelector(".GalleryModal");
  galleryModal.innerHTML = "";
  const gallery = await getPhotos();
  gallery.forEach((photo) => {
    const figure = document.createElement("figure");
    figure.classList.add("modalFigure");
    figure.dataset.id = photo.id;
    const img = document.createElement("img");
    const span = document.createElement("span");
    span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    span.id = photo.id;
    span.classList.add("deleteIcon");
    img.src = photo.imageUrl;
    figure.appendChild(img);
    figure.appendChild(span);
    galleryModal.appendChild(figure);
  });

  deletePhoto();
}

async function displayMainGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const photos = await getPhotos();
  photos.forEach((photo) => {
    const figure = document.createElement("figure");
    figure.dataset.id = photo.id;
    const img = document.createElement("img");
    img.src = photo.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = photo.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

displayGalleryModal();
displayMainGallery();

function deletePhoto() {
  const trashAll = document.querySelectorAll(".GalleryModal .deleteIcon");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Suppression de la photo...");

      const id = trash.id;
      const token = localStorage.getItem("token");

      try {
        const init = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `http://localhost:5678/api/works/${id}`,
          init
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Photo supprimée avec succès");

        displayGalleryModal();
        displayMainGallery();
      } catch (error) {
        console.error("Erreur lors de la suppression de la photo :", error);
      }
    });
  });
}

function removePhotoFromGallery(id) {
  const figure = document.querySelector(`.gallery figure[data-id="${id}"]`);
  if (figure) {
    figure.remove();
  }
}

function removePhotoFromModal(id) {
  const figure = document.querySelector(
    `.GalleryModal figure[data-id="${id}"]`
  );
  if (figure) {
    figure.remove();
  }
}

const btnAddModal = document.querySelector(".modalGallery button");
const arrowleft = document.querySelector(".modalAddPhoto .fa-arrow-left");
const markAdd = document.querySelector(".modalAddPhoto .fa-xmark");

async function displayCategories() {
  const categories = await getData("categories");
  const categorySelect = document.getElementById("category");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

displayCategories();

function displayAddModal() {
  btnAddModal.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    modalAddPhoto.style.display = "flex";
    modalGallery.style.display = "none";
  });
  arrowleft.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    modalAddPhoto.style.display = "none";
    modalGallery.style.display = "flex";
    resetAddPhotoForm();
  });
  markAdd.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    containerModals.style.display = "none";
    resetAddPhotoForm();
  });
}
displayAddModal();

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.classList.add("visible");
      previewImg.style.display = "block";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

function resetAddPhotoForm() {
  inputFile.value = "";
  previewImg.src = "";
  previewImg.style.display = "none";
  previewImg.classList.remove("visible");
  labelFile.style.display = "flex";
  iconFile.style.display = "flex";
  pFile.style.display = "flex";
  titleInput.value = "";
  categoryInput.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector("#addPhotoForm .button");

  function validateForm() {
    const isPhotoSelected = fileInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (isPhotoSelected && isTitleFilled && isCategorySelected) {
      submitButton.style.background = "#1D6154";
    } else {
      submitButton.style.background = "";
    }
  }

  fileInput.addEventListener("change", validateForm);
  titleInput.addEventListener("input", validateForm);
  categorySelect.addEventListener("change", validateForm);
});

const addPhotoForm = document.getElementById("addPhotoForm");

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);
  formData.append("image", inputFile.files[0]);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Photo ajoutée avec succès :", data);

    resetAddPhotoForm();

    displayGalleryModal();
    displayMainGallery();

    modalAddPhoto.style.display = "none";
    modalGallery.style.display = "flex";
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo :", error);
  }
});
