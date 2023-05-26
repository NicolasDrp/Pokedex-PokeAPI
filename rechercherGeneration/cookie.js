document.addEventListener('DOMContentLoaded', async function () {

    let btnTeam = document.getElementById('btnTeam');
    let pokeTeam = document.getElementById('pokeTeam');
    //Le bouton pour deconnecter le dresseur
    let btnLogout = document.getElementById('btnLogout');
    //Formulaire d'enregistrement du dresseur
    let dresseurForm = document.getElementById('dresseurForm');


    // Exemple d'utilisation 
    let dresseur = {
        name: undefined,
        pokemonIds: [1, 2, 3, 4]
    };

    //A l'envoie du formulaire dresseurForm , vérifie dans les cookie si l'utilisateur a déja des donneés
    dresseurForm.addEventListener('submit', () => {
        event.preventDefault();
        //Vérifier si un dresseur porte le même nom
        getNameInCookie(document.getElementById('dresseurInput').value);
        //Reset l'input
        document.getElementById('dresseurInput').value = "";

        //on réaffiche le btn et désaffiche le formulaire
        dresseurForm.style.display = 'none';
        btnLogout.style.display = 'initial';
    });

    //fonction appeler a l'envoie du fomulaire
    function getNameInCookie(searchName) {
        const cookieValue = getCookie('dresseur');
        const cookieObj = JSON.parse(cookieValue);

        //Si le nom correspond , on change les valeur de l'objet dresseur en celle du cookie
        if (cookieObj.name === searchName) {
            dresseur.name = searchName;
            dresseur.pokemonIds = cookieObj.pokemonIds;

            //Appelle la fonction printTeam pour afficher les pokemon et mettre à jour les cookies
            printTeam();
        }//Sinon  
        else {
            dresseur.name = searchName;
            dresseur.pokemonIds = [];

            //Appelle la fonction printTeam pour afficher les pokemon et mettre à jour les cookies
            printTeam();
        }
    }

    //fonction printTeam pour afficher les pokemon et mettre à jour les cookies
    function printTeam() {
        pokeTeam.innerHTML = ""
        let li = document.createElement('li');
        li.innerHTML = `équipe de ${dresseur.name}`
        pokeTeam.appendChild(li);
        dresseur.pokemonIds.forEach(element => {
            let li = document.createElement('li');
            pokeTeam.appendChild(li)
            let img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${element}.png`;
            li.appendChild(img);

            // Créer un bouton pour supprimer le li
            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Supprimer';
            deleteBtn.addEventListener('click', () => {
                // Supprimer le li lors du clic sur le bouton
                pokeTeam.removeChild(li);
                // Supprimer l'élément correspondant de la liste dresseur.pokemonIds
                dresseur.pokemonIds = dresseur.pokemonIds.filter(id => id !== element);
            });
            saveCookie()
            li.appendChild(deleteBtn);
        });
    }

    // Fonction appeler getNameInCookie pour récupérer les valeurs d'un cookie par son nom
    function getCookie(cookieName) {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Vérifier si le nom du cookie correspond à celui recherché
            if (cookie.startsWith(`${cookieName}=`)) {
                const cookieValue = cookie.substring(cookieName.length + 1);
                return decodeURIComponent(cookieValue);
            }
        }
    }

    let i = 1;
    //Si le bouton btnTeam est cliqué , mettre à jour l'équipe
    btnTeam.addEventListener('click', () => {
        //On verifie que le dresseur se soit bien enregistrer
        if (dresseur.name != undefined) {
            //si il y a moins de 6 poke , on peut en rajouter
            if (dresseur.pokemonIds.length < 6) {
                // Supprimer l'élément correspondant de la liste dresseur.pokemonIds
                dresseur.pokemonIds = dresseur.pokemonIds.filter(id => id !== i);
                dresseur.pokemonIds.push(i);
                i++;
            } else {
                alert("Equipe complete , retirer un pokemon pour en rajouter de nouveau")
            }
            //Appelle la fonction printTeam pour afficher les pokemon et mettre à jour les cookies
            printTeam();
        }
    });

    //On ajoute/modifie les valeurs du cookie
    function saveCookie() {
        // Convertir l'objet dresseur en chaîne JSON
        const dresseurJSON = JSON.stringify(dresseur);

        // Enregistrer la chaîne JSON dans un cookie
        document.cookie = `dresseur=${dresseurJSON}; max-age = 86400`;
    }

    //A l'appuie du bouton pour se déconnecter
    btnLogout.addEventListener('click', () => {
        //on vide l'objet ainsi que le container html
        dresseur.name = undefined;
        dresseur.pokemonIds = [];
        pokeTeam.innerHTML = ""

        //on réaffiche le formulaire et désaffiche le btn
        dresseurForm.style.display = 'initial';
        btnLogout.style.display = "none";
    });

});