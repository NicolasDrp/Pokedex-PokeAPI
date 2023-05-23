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
    // Div contenant le pokemon selectionner , le precedant et le suivant
    let sliderPokemon = document.getElementById('sliderPokemon');
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

    //Affiche les pokemon d'une certaine génération
    function fetchPokemonList() {
        fetch(`https://pokeapi.co/api/v2/generation/${generation}/`, 'GET', printPokemonGeneration);
    }

    function printPokemonGeneration() {
        // Je parse/convertis ma réponse JSON pour accéder aux attributs de l'objet
        let result = JSON.parse(this.responseText);
        console.log(result);

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

        let buttonExist = document.getElementById('loadMoreButton');
        if (buttonExist) {
            loadMoreButton.parentNode.removeChild(loadMoreButton);
        }

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
        console.log(result);
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
                console.log(pokemonList[i])
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
        console.log(pokemon)
        console.log(pokemonList.length)

        //On vide les divs
        displayedPokemon.innerHTML = ''

        //Afficher le nom
        let name = document.createElement('p');
        name.innerHTML = `Name: ${pokemon.name}`;
        displayedPokemon.appendChild(name);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        displayedPokemon.appendChild(image);

        // Afficher le Pokémon précédent s'il existe
        if (prevPokemonId < 1) {

            prevPokemonId = pokemonList.length;
        }
        if (nextPokemonId > pokemonList.length) {
            nextPokemonId = 1;
        }


        //Afficher les types du pokemon

        //On vide les divs
        listType.innerHTML = ''

        //Afficher les types
        pokemon.types.forEach((type) => {
            let li = document.createElement('li');
            li.className = type.type.name;
            li.innerHTML = type.type.name;
            listType.appendChild(li);
        });

        
  
  


        










        fetchPokemonInfoPrev(prevPokemonId);
        fetchPokemonInfoNext(nextPokemonId);

    }

    //afficher les info dans la div prevPokemon ,récupere les données d'un pokemon à partir de son id
    function fetchPokemonInfoPrev(pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonInfoPrev);
    }

    //afficher les info dans la div nextPokemon ,récupere les données d'un pokemon à partir de son id
    function fetchPokemonInfoNext(pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonInfoNext);
    }

    //fonction appeler par fetchPokemonInfo , Afficher les infos du pokemon dans la div nextPokemon
    function printPokemonInfoPrev() {
        let pokemon = JSON.parse(this.responseText);

        //On vide les divs
        prevPokemon.innerHTML = ''

        //Afficher le nom
        let name = document.createElement('p');
        name.innerHTML = `Name: ${pokemon.name}`;
        prevPokemon.appendChild(name);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        prevPokemon.appendChild(image);
    }


    //fonction appeler par fetchPokemonInfo , Afficher les infos du pokemon dans la div nextPokemon
    function printPokemonInfoNext() {
        let pokemon = JSON.parse(this.responseText);

        //On vide les divs
        nextPokemon.innerHTML = ''

        //Afficher le nom
        let name = document.createElement('p');
        name.innerHTML = `Name: ${pokemon.name}`;
        nextPokemon.appendChild(name);

        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        nextPokemon.appendChild(image);
    }



});