

/*Variable*/
const gallery = document.querySelector(".gallery");

/*fonction qui retourne tableau des works*/
async function getWorks() { 
  try {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
}
getWorks();

/*affichage des works*/
async function affichageWorks() {
  const arrayWorks = await getWorks()
  console.log(arrayWorks);
  
    arrayWorks.forEach(work => {
      const workHTML = `
          <figure>
              <img src="${work.imageUrl}" alt="${work.title}">
              <figcaption>${work.title}</figcaption>
          </figure>
      `;
      gallery.insertAdjacentHTML('beforeend', workHTML);
  });
}

affichageWorks();

