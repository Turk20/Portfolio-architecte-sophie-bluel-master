
/*Variable*/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters")

/*fonction qui retourne tableau des works*/
async function getWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  if (response.ok) {
    return await response.json();
  } else {
    console.error('Error fetching works:', response.status);
    return [];
  }
}

/*affichage des works*/

async function affichageWorks() {
  const arrayWorks = await getWorks()
  
  arrayWorks.forEach(work => {
    createWorks(work);
  });
}

function createWorks(work) {
  const workHTML = `
    <figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    </figure>
  `;
  gallery.insertAdjacentHTML('beforeend', workHTML);
}

affichageWorks();

/////*  Affichage boutons par catégories   *//////

//récupérer le tableau des catégories 

async function getCategorys() {
 const response = await fetch ("http://localhost:5678/api/categories");
 return await response.json();
}


async function displayCategorysButtons() {
 const categorys = await getCategorys();
 console.log(categorys);

  // Créez le bouton "Tous" et ajoutez-le en premier
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.id = "0";
  allBtn.classList.add("btn"); ///Style css pour btn
  filters.appendChild(allBtn);

 categorys.forEach(category => { 
  const btn = document.createElement("button")
  btn.textContent = category.name;
  btn.id = category.id;
  btn.classList.add("btn");
  filters.appendChild(btn)
})
}

displayCategorysButtons();

// filtrer au click qur le bouton par catégorie

async function filterCategory () {
const categories = await getWorks();
console.log(categories);
const buttons = document.querySelectorAll(".filters button");
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let btnId = e.target.id;
    gallery.innerHTML="";
    if (btnId !== "0") {
      const categoriesTriCategory = categories.filter((work)=>{
        return work.categoryId == btnId;
      });
      categoriesTriCategory.forEach(work => {
        createWorks(work);
      });
    } else {
      affichageWorks();
    }
    console.log(btnId);
  });
});
}

filterCategory();
