const url = "http://localhost:5678/api/works";  // Lien menant au serveur
const container = document.getElementById("projetImg"); // Récupère la gallerie des projets
const container2 = document.getElementById("modal-gallery"); // Récupère la gallerie de la modale
let projectsData = []; // Sert à stocker toutes les données récupérées plus tard

// RÉCUPÉRATION ET AFFICHAGE DES PROJETS

function getProjets () {
    fetch(url) // Récupère les données
    .then(res => {
        return res.json()
    })
    .then(data => {
        projectsData = data; // Les données récupérées sont stockées dans ce tableau
        displayProjects(projectsData);
    })
    .catch(function (error) {
        console.error('Erreur lors de la récupération des données:', error);
    });
}

function displayProjects(data) {
    container.innerHTML = ''; // Effacer le contenu actuel
    container2.innerHTML = '';

    for (const project of data) {
        // Affiche le tableau qui stocke les données
        container.innerHTML += `<figure data-id="${project.id}" class="big-gallery"> <img src="${project.imageUrl}" alt="Image d'un des projets"> <figcaption>${project.title}</figcaption> </figure>`;
    }

    for (const project of data) {
        container2.innerHTML += `<figure> <i class="fa-solid fa-trash-can" data2-id="${project.id}"></i> <img src="${project.imageUrl}" alt="Image d'un des projets"></figure>`;
    }

    // Ajoute un gestionnaire d'événements à chaque icône trash
    document.querySelectorAll('.modal-gallery figure i').forEach(i => {
        i.addEventListener('click', function() {
            // Récupére l'ID à partir de l'attribut data-id
            let indexModal = i.getAttribute('data2-id');

            // Efface les projets dans la grande gallerie
            const figureBigGallery = document.querySelectorAll('.big-gallery');
            figureBigGallery.forEach(figure => {
                if (figure.getAttribute('data-id') === indexModal) {
                    figure.remove();
                }
            });

            // Efface les projets dans la petite gallerie
            const figure = i.parentElement;
            figure.remove();

            // Fonction qui supprime un projet
            async function deleteWork() {
                const apiUrl = 'http://localhost:5678/api/works/' + indexModal;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        console.log('Work deleted successfully.');
                    } else {
                        console.error('Failed to delete work. Status:', response.status);
                    }
                } catch (error) {
                    console.error('Error during the delete request:', error);
                }
            }

            deleteWork();
        });
    });
}

getProjets();

// FILTRES

// Ajout des écouteurs d'événements pour les boutons de filtre
document.querySelectorAll('.filtres button').forEach(button => {
    button.addEventListener('click', () => {
        const categoryId = button.id; // Récupére l'id du bouton
        filterProjects(categoryId);
    });
});

function filterProjects(categoryId) {
    let filteredData;

    if (categoryId === "0") {
        filteredData = projectsData;
    } else {
        filteredData = projectsData.filter(project => {
            return project.category.id === parseInt(categoryId, 10);
        });
    }

    displayProjects(filteredData);
}

// ADMIN CONNECTÉ

const token = localStorage.getItem('token');

if(token){
    document.querySelectorAll('.filtres button').forEach(button => {
        button.hidden = true;
        // Cache chaque bouton de la barre de filtres si le token existe
    });

    // Écrit "logout" à la place de "login" lorsque que l'admin est connecté
    const loglink = document.getElementById("loglink");
    loglink.innerHTML = '';
    loglink.innerHTML += `<a href="./index.html">logout</a>`;

    // AJoute le bouton modifier
    const modif = document.getElementById("modifier");
    modif.style.display = "flex";

    // Ajoute la barre "mode édition"
    const edit = document.getElementById("edition");
    edit.style.display = 'flex';

    loglink.addEventListener('click', function(){
        localStorage.clear();
    });
}

// FENÊTRE MODALE

var modifier = document.getElementById("modale");

modifier.addEventListener('click', function() {
    // Récupère le bouton modifier, la modale et le bouton fermer
    const openModalBtn = document.getElementById('modale');
    const modal = document.getElementById('windowModal');
    const closeBtn = document.getElementById('close');

    // Ouvre la modal lorsque le bouton est cliqué
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Ferme la modal lorsque le bouton fermer est cliqué
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// MODALE AJOUTER UNE PHOTO

var ajouter = document.getElementById("ajoutImg");
const modal = document.getElementById('windowModal'); // Modale "modifier"
const addImg = document.getElementById('ajoutImg'); // Bouton "ajouter une photo"
const addModal = document.getElementById('addImg'); // Modale "ajouter une photo"
const closeAdd = document.getElementById('close2'); // Bouton fermé de la modale "ajouter une photo"
var arrowLeft = document.getElementById('arrowAdd'); // Flèche gauche

ajouter.addEventListener('click', function(){

    // Ouvre la modale "ajouter une photo" et ferme la modale "modifier"
    addImg.addEventListener('click', function() {
        addModal.style.display = 'block';
        modal.style.display = 'none';
    });

    // Ferme la modale "ajouter une photo"
    closeAdd.addEventListener('click', function() {
        addModal.style.display = 'none';
    });

    //Ferme la modale "ajouter une photo" et ouvre la modale "modifier"
    arrowLeft.addEventListener('click', function(){
        addModal.style.display = 'none';
        modal.style.display = 'block';

    });

    window.addEventListener('click', function (event) {
        if (event.target === addModal) {
            addModal.style.display = 'none';
        }
    });
});

// AFFICHAGE PHOTO DU NOUVEAU PROJET

const uploadButton = document.getElementById('uploadButton'); //Bouton ajouter photo
const fileInput = document.getElementById('fileInput'); // Bouton input file caché servant à parcourir les fichiers
const ajouterPhoto = document.getElementById('ajouterPhoto');   // Div dans laquelle s'affichera l'image sélectionnée
const imagePreview = document.getElementById('imagePreview');

uploadButton.addEventListener('click', function () {
    // Déclenche le clic sur l'élément input lorsque le bouton est cliqué
    fileInput.click();
});

// Ajoute un écouteur d'événement sur l'élément input pour détecter les fichiers sélectionnés
fileInput.addEventListener('change', function (event) {
    // Obtiens le premier fichier sélectionné
    const selectedFile = fileInput.files[0];

    // Rend le bouton valider valide si une image et ensuite un texte ont été rentrés
    const value = event.target.value;
    if(value == ''){
        submitImage.disabled = true;
        submitImage.style.background = 'gray';
    }else if(inputTitle.value !== ''){
        console.log(inputTitle.value)
        submitImage.disabled = false;
        submitImage.style.background ='#1D6154';
    }

    if (selectedFile) {
        // Vérifie la taille du fichier (4 Mo max)
        if (selectedFile.size <= 4 * 1024 * 1024) {
            // Utilise FileReader pour lire le contenu du fichier en tant que URL de données
            const reader = new FileReader();

            reader.onload = function (event) {
                for(const enfant of ajouterPhoto.children){
                    if (enfant.tagName.toLowerCase() !== 'input') {
                        enfant.style.display = 'none'; // Cache les éléments présents dans ajouterPhoto pour laisser place à l'imagePreview 
                    }
                }
               // Crée l'image du nouveau projet dans une div et l'ajoute à ajouterPhoto
               const imagePreviewDiv = document.createElement('div');
               imagePreviewDiv.id = 'imagePreview';
               imagePreviewDiv.innerHTML = `<img src="${event.target.result}" alt="Aperçu de l'image">`;
               ajouterPhoto.appendChild(imagePreviewDiv);
            };

            // Lecture du contenu du fichier en tant que URL de données
            reader.readAsDataURL(selectedFile);
        } else {
            alert('La taille du fichier dépasse la limite de 4 Mo.');
            // Réinitialise l'élément input pour permettre la sélection d'un autre fichier
            fileInput.value = '';
        }
    }
});

// MENU DÉROULANT

document.addEventListener('DOMContentLoaded', function () {
    // Appele la fonction pour récupérer les catégories au chargement de la page
    updateDropdown();
});

function updateDropdown() {

    // Récupére le menu déroulant
    const dropdown = document.getElementById('categorieDropdown');

    // Fonction pour récupérer les catégories depuis l'API
    async function fetchCategories() {
        const response = await fetch('http://localhost:5678/api/categories');
        const data = await response.json();

        // Ajoute chaque catégorie au menu déroulant
        data.forEach(category => {
            const option = document.createElement('option');
            option.text = category.name;
            option.id = category.id;
            dropdown.add(option);
        });
    }

    // Appele la fonction pour récupérer les catégories
    fetchCategories();
}

// ENVOI DU NOUVEAU PROJET

const submitImage = document.getElementById('submitNewPrj'); // Récupère le bouton "valider"
const inputTitle = document.getElementById('titre-nouveau-prj'); // Récupère le champ titre

// Rend le bouton valider valide si un titre et ensuite une image ont été rentrés
inputTitle.addEventListener('change', function(event){
    const value = event.target.value;
    if(value == ''){
        submitImage.disabled = true;
        submitImage.style.background = 'gray';
    }else if(fileInput.files.length > 0){
        submitImage.disabled = false;
        submitImage.style.background ='#1D6154';
    }
});

submitImage.addEventListener('click', function(){
    const titleNewPrj = document.getElementById('titre-nouveau-prj').value; // Récupère le titre du nouveau projet
    const imagePreview = fileInput.files[0]; // Récupère l'image du nouveau projet
    const dropdown = document.getElementById('categorieDropdown'); // RRécupère le menu déroulant
    const selectedOption = dropdown.options[dropdown.selectedIndex]; // Récupère l'id de la catégorie sélectionnée dans le menu déroulant
    const cateNewPrj = selectedOption.id;

    // Si l'image + le titre on été rentré, on peut valider le nouveau projet
    if (imagePreview == '' || titleNewPrj.value == '') {
        console.log("Erreur : il manque une valeur");
    }else{

        // Construit le corps de la requête FormData
        const formData = new FormData();
        formData.append('image', imagePreview);
        formData.append('title', titleNewPrj);
        formData.append('category', cateNewPrj);

        fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Erreur lors de la requête POST: ${response.status}`);
            }
        })
        .then(data => {
            console.log('Projet ajouté avec succès:', data);
            addModal.style.display = 'none';
            modal.style.display = 'block';
            inputTitle.value = ''; // Réinitialise l'input titre
            const imagePreview = document.getElementById('imagePreview');
            ajouterPhoto.removeChild(imagePreview); // Enlève la miniature du nouveau projet dans ajouterPhoto
            for(const enfant of ajouterPhoto.children){
                if (enfant.tagName.toLowerCase() !== 'input') {
                    enfant.style.display = 'block'; // Remets les éléments dans la div ajouterPhoto
                }
            }
            fileInput.value = ''; // Réinitialise le bouton input file
            // Désactive le bouton ajouter photo
            submitImage.disabled = true;
            submitImage.style.background = 'gray';
            
            getProjets();
        })
        .catch(error => {
            console.error('Erreur lors de la requête POST:', error);
        });
    }
});


