document.addEventListener('DOMContentLoaded', async function () {
    //Début de la liste de pokemon
    let offset = 0;
    //Taille de la liste de pokemon 
    let limit = 20;
    //div pour afficher la liste des pokemon
    let pokemonListContainer = document.getElementById('pokemonList');

    //Afficher les 20 premier pokemon
    fetchPokemonList();

    function fetchPokemonList() {
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`, 'GET', printPokemon);
    }

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

    // Fonction pour filtrer la liste des pokemon en fonction de la recherche
    function filterPokemonList(pokemonList) {
        // Si la recherche est vide , afficher tout les pokemon
        if (searchQuery === '') {
            return pokemonList;
        }
        //Sinon , afficher le resultat de la recherche
        return pokemonList.filter((pokemon) => {
            let pokemonUrl = pokemon.url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            return pokemon.name.includes(searchQuery.toLowerCase()) || pokemonId.includes(searchQuery);
        });
    }

    // Fonction pour afficher les résultats de recherche des pokemon
    function printPokemonSearchResult(pokemonList) {
        pokemonListContainer.innerHTML = '';

        for (let i = 0; i < pokemonList.length; i++) {
            // Je récupère le numéro du pokemon à partir de l'URL
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            let li = document.createElement('li');
            li.innerHTML = `${pokemonId}: ${pokemonList[i].name}`;
            //Si le li est cliqué , lancer la fonction fetchPokemonDetails
            li.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });
            // Je pousse mon li dans mon Ul qui a pour id 'pokemonList'
            pokemonListContainer.appendChild(li);
        }
    }

    function printPokemon() {
        // Je parse/convertis ma réponse JSON pour accéder aux attributs de l'objet
        let result = JSON.parse(this.responseText);
        console.log(result);

        let pokemonList = result.results;
        // Je boucle sur le tableau de résultats
        for (let i = 0; i < pokemonList.length; i++) {
            // Je récupère le numéro du pokemon à partir de l'URL
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            // Je crée mon <li></li>
            let li = document.createElement('li');
            // J'affiche le numéro et le nom du pokemon
            li.innerHTML = pokemonId + " : " + pokemonList[i].name;
            //Si le li est cliqué , lancer la fonction fetchPokemonDetails
            li.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });
            // Je pousse mon li dans mon Ul qui a pour id 'pokemonList'
            pokemonListContainer.appendChild(li);
        }

        if (result.next) {
            let loadButton = document.createElement('button');
            loadButton.innerHTML = 'Afficher plus';
            loadButton.addEventListener('click', loadMorePokemon);
            pokemonListContainer.appendChild(loadButton);
        }
    }

    //rajoute la limit(20) à l'offset pour afficher les 20 prochain pokemon
    function loadMorePokemon() {
        offset += limit;
        fetchPokemonList();
    }

    function fetchPokemonDetails(pokemonId) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, 'GET', printPokemonDetails);
    }

    function printPokemonDetails() {
        let pokemon = JSON.parse(this.responseText);
        console.log(pokemon);

        // Afficher les détails du pokemon
        let detailsContainer = document.getElementById('pokemonDetails');
        detailsContainer.innerHTML = '';

        //Afficher le nom
        let name = document.createElement('p');
        name.innerHTML = `Name: ${pokemon.name}`;
        detailsContainer.appendChild(name);

        //Afficher l'id
        let id = document.createElement('p');
        id.innerHTML = `ID: ${pokemon.id}`;
        detailsContainer.appendChild(id);
        //Afficher l'image
        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        detailsContainer.appendChild(image);
        //Afficher le type
        let types = document.createElement('p');
        types.innerHTML = `Types: ${pokemon.types.map((type) => type.type.name).join(', ')}`;
        detailsContainer.appendChild(types);
        //afficher le mot stats
        let stats = document.createElement('p');
        stats.innerHTML = 'Stats:';
        detailsContainer.appendChild(stats);
        //Afficher le détail des stats
        let statsList = document.createElement('ul');
        pokemon.stats.forEach((stat) => {
            let statItem = document.createElement('li');
            statItem.innerHTML = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(statItem);
        });
        detailsContainer.appendChild(statsList);
    }

    // Fonction pour rechercher un pokemon
    function searchPokemon() {
        searchQuery = document.getElementById('searchInput').value.toLowerCase();
        offset = 0; // Réinitialise l'offset pour afficher les premiers résultats de la recherche
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1009`, 'GET', searchResult);
    }

    // Fonction pour traiter les résultats de la recherche
    function searchResult() {
        let result = JSON.parse(this.responseText);
        let pokemonList = result.results;
        let filteredPokemonList = filterPokemonList(pokemonList);
        printPokemonSearchResult(filteredPokemonList);
    }

    // Bouton pour effectuer la recherche
    document.getElementById('searchButton').addEventListener('click', searchPokemon);
});
