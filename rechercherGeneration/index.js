document.addEventListener('DOMContentLoaded', async function () {
    // div contenant les pokemon d'une génération
    let pokemonGeneration = document.getElementById('pokemonGeneration');
    // initialise la génération à 1 par défault
    let generation = 1;
    // div contenant les génération disponible
    let containerGeneration = document.getElementById('containerGeneration');
    // Récupère toutes les div enfants de containerGeneration
    let divGeneration = containerGeneration.getElementsByTagName('div');
    // Nombre de Pokémon à afficher
    let pokemonPerPage = 28;
    // Nombre de Pokémon affichés actuellement
    let displayedPokemons = 0;
    //Div du pokemon afficher
    let displayedPokemon = document.getElementById('displayedPokemon');
    //Div du pokemon precedant
    let prevPokemon = document.getElementById('prevPokemon');
    //Div du pokemon suivant
    let nextPokemon = document.getElementById('nextPokemon');
    // list des pokemon afficher
    let pokemonList;
    //ul pour afficher les types du pokemon
    let listType = document.getElementById('listType');
    //ul pour afficher les faiblesses du pokemon
    let listWeakness = document.getElementById('listWeakness');
    //h4 sous lequel rajouter le poids du pokemon
    let height = document.getElementById('height');
    //h4 sous lequel rajouter la taille du pokemon
    let weight = document.getElementById('weight');
    //h4 sous lequel rajouter les abilitées du pokemon
    let abilities = document.getElementById('abilities');
    //liste des générations existante
    let generationList;
    //Tableau pour eviter les doublons de faiblesse
    uniqueWeaknessList = [];


    function fetch(url, method, fun) {
        //Initialisation de XHR
        const request = new XMLHttpRequest();
        request.addEventListener('load', fun);
        //Spécifier le type d'appelle [ GET, POST, PUT, PATCH, DELETE ] et l'URL
        request.open(method, url);
        //Spécification que je veux du JSON en type de retour
        request.setRequestHeader('Accept', 'application/json');
        //Permet d'envoyer la requêtes
        request.send();
    }

    //affiche les pokemon de la première génération
    fetchPokemonList();

    //affiche le pokemon à l'id 1 sur la section de droite
    fetchPokemonInfo(1);

    //affiche les générations disponible
    fetchGeneration();


    //Affiche les pokemon d'une certaine génération
    function fetchPokemonList() {
        fetch(`https://pokeapi.co/api/v2/generation/${generation}/`, 'GET', printPokemonGeneration);
    }

    function printPokemonGeneration() {
        // Je parse/convertis ma réponse JSON pour accéder aux attributs de l'objet
        let result = JSON.parse(this.responseText);

        pokemonList = result.pokemon_species;
        // Je trie le tableau des Pokémon par leur ID
        pokemonList.sort((a, b) => {
            let pokemonIdA = getPokemonId(a.url);
            let pokemonIdB = getPokemonId(b.url);
            return pokemonIdA - pokemonIdB;
        });

        // Je boucle sur le tableau de résultats
        for (let i = displayedPokemons; i < displayedPokemons + pokemonPerPage && i < pokemonList.length; i++) {
            // Je récupère le numéro du Pokémon à partir de l'URL
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = getPokemonId(pokemonUrl);

            // Je crée un élément <div></div> pour le Pokémon
            let div = document.createElement('div');

            // J'affiche l'image du Pokémon
            let img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            div.appendChild(img);

            // J'affiche le numéro du Pokémon
            let p = document.createElement('p');
            p.innerHTML = '#' + pokemonId;
            div.appendChild(p);

            // J'affiche le nom du Pokémon
            p = document.createElement('p');
            p.innerHTML = pokemonList[i].name;
            div.appendChild(p);

            // Si la div est cliqué, lancer la fonction fetchPokemonInfo

            div.addEventListener('click', function () {
                fetchPokemonInfo(pokemonId);
            });

            // Je pousse mon div dans mon container qui a pour id 'pokemonGeneration'
            pokemonGeneration.appendChild(div);
        }

        //Si il y a deja un bouton LoadMore , le supprimer
        let buttonExist = document.getElementById('loadMoreButton');
        if (buttonExist) {
            loadMoreButton.parentNode.removeChild(loadMoreButton);
        }

        //Creer un nouveau bouton LoadMore
        button = document.createElement('button');
        button.innerHTML = "Plus..";
        button.id = 'loadMoreButton';
        pokemonGeneration.appendChild(button)

        displayedPokemons += pokemonPerPage;

        // Vérifie si tous les Pokémon ont été affichés
        if (displayedPokemons >= pokemonList.length) {
            // Cache le bouton s'il n'y a plus de Pokémon à afficher
            document.getElementById('loadMoreButton').style.display = 'none';
        } else {
            // Affiche le bouton s'il y a encore des Pokémon à afficher
            document.getElementById('loadMoreButton').style.display = 'block';
        }

        // bouton pour charger plus de pokemon
        button.addEventListener('click', function () {
            // Appelle la fonction pour afficher plus de Pokémon
            fetchPokemonList();
        });
    }

    //récupère l'id dans l'url du pokemon
    function getPokemonId(url) {
        let urlParts = url.split('/');
        return urlParts[urlParts.length - 2];
    }

    // parcour les div et récupere la valeur selon leur position
    for (let i = 0; i < divGeneration.length; i++) {
        divGeneration[i].addEventListener('click', function () {
            displayedPokemons = 0;
            // change la valeur de génération
            generation = i + 1;
            // vide la div pokemonGeneration
            pokemonGeneration.innerHTML = '';
            // fetch avec la nouvelle valeur
            fetchPokemonList();

            // réinitialise le style pour toutes les divs de génération
            for (let j = 0; j < divGeneration.length; j++) {
                divGeneration[j].style.backgroundColor = "initial";
            }

            // applique le style à la div de génération sélectionnée
            divGeneration[i].style.backgroundColor = "white";

        });
    }

    //Rechercher par Nom ou par Id
    //A l'envoie du formulaire formName , lance la fonction searchPokemon
    document.getElementById('formSearch').addEventListener('submit', searchPokemon);

    // Fonction appeler par l'envoie du formulaire pour rechercher un pokemon
    function searchPokemon() {
        event.preventDefault();
        searchQuery = document.getElementById('searchInput').value.toLowerCase();
        offset = 0; // Réinitialise l'offset pour afficher les premiers résultats de la recherche
        fetch(`https://pokeapi.co/api/v2/generation/${generation}/`, 'GET', searchResult);
    }

    // Fonction appeler par searchPokemon pour traiter les résultats de la recherche
    function searchResult() {
        let result = JSON.parse(this.responseText);
        let pokemonList = result.pokemon_species;
        let filteredPokemonList = filterPokemonList(pokemonList);
        printPokemonSearchResult(filteredPokemonList);
    }

    // Fonction pour filtrer la liste des pokemon en fonction de la recherche
    function filterPokemonList(pokemonList) {
        //afficher le resultat de la recherche
        return pokemonList.filter((pokemon) => {
            let pokemonUrl = pokemon.url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            return pokemon.name.includes(searchQuery.toLowerCase()) || pokemonId === searchQuery;
        });
    }

    // Fonction appeler par searchResult pour afficher les résultats de recherche des pokemon
    function printPokemonSearchResult(pokemonList) {
        if (pokemonList.length === 0) {
            pokemonGeneration.innerHTML = 'Aucun Pokémon trouvé';
        } else {
            pokemonGeneration.innerHTML = '';

            // Je trie le tableau des Pokémon par leur ID
            pokemonList.sort((a, b) => {
                let pokemonIdA = getPokemonId(a.url);
                let pokemonIdB = getPokemonId(b.url);
                return pokemonIdA - pokemonIdB;
            });

            for (let i = 0; i < pokemonList.length; i++) {
                // Je récupère le numéro du Pokémon à partir de l'URL
                let pokemonUrl = pokemonList[i].url;
                let pokemonId = getPokemonId(pokemonUrl);

                // Je crée un élément <div></div> pour le Pokémon
                let div = document.createElement('div');

                // J'affiche l'image du Pokémon
                let img = document.createElement('img');
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                div.appendChild(img);

                // J'affiche le numéro du Pokémon
                let p = document.createElement('p');
                p.innerHTML = '#' + pokemonId;
                div.appendChild(p);

                // J'affiche le nom du Pokémon
                p = document.createElement('p');
                p.innerHTML = pokemonList[i].name;
                div.appendChild(p);
                // Si la div est cliqué, lancer la fonction fetchPokemonInfo

                div.addEventListener('click', function () {
                    fetchPokemonInfo(pokemonId);
                });
                pokemonGeneration.appendChild(div);
            }
        }
    }

    //Au clic d'une div d'un pokemon ,récupere les données d'un pokemon à partir de son id
    function fetchPokemonInfo(pokemonId) {
        prevPokemonId = pokemonId - 1;
        nextPokemonId = parseInt(pokemonId) + 1;
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonInfo);
    }

    //fonction appeler par fetchPokemonInfo
    function printPokemonInfo() {
        let pokemon = JSON.parse(this.responseText);

        //On vide les divs
        displayedPokemon.innerHTML = ''

        //Afficher le nom et l'id
        let nameID = document.createElement('p');
        nameID.innerHTML = `${pokemon.name} #${pokemon.id}`;
        displayedPokemon.appendChild(nameID);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        displayedPokemon.appendChild(image);

        //Récupere l'id du premier element de ma generation
        let lastElementList = getPokemonId(pokemonList[pokemonList.length - 1].url);
        //Récupere l'id du dernier element de ma generation
        let firstElementList = getPokemonId(pokemonList[0].url);
        // Afficher dernier pokemon de la generation si nous sommes sur le premier
        if (prevPokemonId < firstElementList) {
            prevPokemonId = lastElementList;
        }
        // Afficher premier pokemon de la generation si nous sommes sur le dernier
        if (nextPokemonId > lastElementList) {
            nextPokemonId = firstElementList;
        }

        //On vide les ul
        listType.innerHTML = '';
        listWeakness.innerHTML = '';

        //on vide le tableau
        uniqueWeaknessList = [];

        //Liste des types filtré pour évité les doublons
        let uniqueWeaknessListFiltred;

        //Afficher les types
        pokemon.types.forEach((type) => {
            let li = document.createElement('li');
            li.className = type.type.name;
            li.innerHTML = type.type.name;
            listType.appendChild(li);

            fetch(type.type.url, 'GET', printWeakness)
        });

        //Fonction appeler par printPokemonInfo qui affiche les faiblesses d'un type
        function printWeakness() {
            let weak = JSON.parse(this.responseText);

            // Passer les faiblesse du type dans un tableau
            weak.damage_relations.double_damage_from.forEach((weakness) => {
                uniqueWeaknessList.push(weakness.name);
            });

            //Filtrer le tableau pour en enlever les doublons
            uniqueWeaknessListFiltred = uniqueWeaknessList.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            //Afficher les faiblesse dans le ul , mais dabord supprimer le contenue car si le pokemon a n types , le append se fera n fois
            listWeakness.innerHTML = '';
            uniqueWeaknessListFiltred.forEach((weakness) => {
                let li = document.createElement('li');
                li.className = weakness;
                li.innerHTML = weakness;
                listWeakness.appendChild(li);
            });

        }      

        fetchPokemonInfoPrev(prevPokemonId);
        fetchPokemonInfoNext(nextPokemonId);

        //Afficher les information (taille poid , abilitées ) du pokemon

        //on vide les information
        weight.innerHTML = "";
        height.innerHTML = "";
        abilities.innerHTML = "";

        //Afficher le poids
        let weightValue = document.createElement('li');
        weightValue.innerHTML = `Weight : `;
        weight.appendChild(weightValue);

        weightValue = document.createElement('li');
        weightValue.innerHTML = `${pokemon.weight}`;
        weight.appendChild(weightValue);

        //Afficher la taille
        let heightValue = document.createElement('li');
        heightValue.innerHTML = `Height : `;
        height.appendChild(heightValue);

        heightValue = document.createElement('li');
        heightValue.innerHTML = `${pokemon.height}`;
        height.appendChild(heightValue);


        //Afficher les abilitées

        let abilityValue = document.createElement('li');
        abilityValue.innerHTML = 'Abilities : ';
        abilities.appendChild(abilityValue);

        pokemon.abilities.forEach((ability) => {
            let abilityValue = document.createElement('li');
            abilityValue.innerHTML = ability.ability.name;
            abilities.appendChild(abilityValue);
        });
    }

    //afficher les info dans la div prevPokemon ,récupere les données d'un pokemon à partir de son id
    function fetchPokemonInfoPrev(pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonInfoPrev);
    }

    //afficher les info dans la div nextPokemon ,récupere les données d'un pokemon à partir de son id
    function fetchPokemonInfoNext(pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonInfoNext);
    }

    //fonction appeler par fetchPokemonInfo , Afficher les infos du pokemon dans la div prevPokemon
    function printPokemonInfoPrev() {
        let pokemon = JSON.parse(this.responseText);

        //On vide les divs
        prevPokemon.innerHTML = ''


        //Afficher le nom et l'id
        let nameID = document.createElement('p');
        nameID.innerHTML = `${pokemon.name} #${pokemon.id}`;
        prevPokemon.appendChild(nameID);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        prevPokemon.appendChild(image);

        prevPokemonID = pokemon.id;
    }

    // Si la div est cliqué, lancer la fonction fetchPokemonInfo
    prevPokemon.addEventListener('click', function () {
        fetchPokemonInfo(prevPokemonID);
    });

    //fonction appeler par fetchPokemonInfo , Afficher les infos du pokemon dans la div nextPokemon
    function printPokemonInfoNext() {
        let pokemon = JSON.parse(this.responseText);

        //On vide les divs
        nextPokemon.innerHTML = ''

        //Afficher le nom et l'id
        let nameID = document.createElement('p');
        nameID.innerHTML = `${pokemon.name} #${pokemon.id}`;
        nextPokemon.appendChild(nameID);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        nextPokemon.appendChild(image);

        nextPokemonID = pokemon.id;
    }

    // Si la div est cliqué, lancer la fonction fetchPokemonInfo
    nextPokemon.addEventListener('click', function () {
        fetchPokemonInfo(nextPokemonID);
    });


    //Prev Next Pokemon au clavier
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case "ArrowLeft":
                // Lancement de la fonction fetchPokemonInfo au clic de la flèche gauche du clavier
                fetchPokemonInfo(prevPokemonID);
                break;
            case "ArrowRight":
                // Lancement de la fonction fetchPokemonInfo au clic de la flèche gauche du clavier
                fetchPokemonInfo(nextPokemonID);
                break;
        }
    });




    // Récupère la liste des générations
    function fetchGeneration() {
        fetch(`https://pokeapi.co/api/v2/generation/`, 'GET', printGenerations);
    }

    // Fonction appelée par fetchGeneration qui affiche les générations existantes
    function printGenerations() {
        let generations = JSON.parse(this.responseText);
        generationList = generations.count;

        for (let i = 1; i < generationList + 1; i++) {
            let div = document.createElement("div");
            div.innerHTML = `Gen ${i}`;
            div.className = "generations";
            containerGeneration.appendChild(div);
        }

        // parcour les div et récupere la valeur selon leur position
        for (let i = 0; i < divGeneration.length; i++) {
            divGeneration[i].addEventListener('click', function () {
                displayedPokemons = 0;
                // change la valeur de génération
                generation = i + 1;
                // vide la div pokemonGeneration
                pokemonGeneration.innerHTML = '';
                // fetch avec la nouvelle valeur
                fetchPokemonList();

                // réinitialise le style pour toutes les divs de génération
                for (let j = 0; j < divGeneration.length; j++) {
                    divGeneration[j].style.backgroundColor = "initial";
                }

                // applique le style à la div de génération sélectionnée
                divGeneration[i].style.backgroundColor = "white";

            });
        }
    }


});