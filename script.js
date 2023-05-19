document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0;
    let limit = 20;

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

    function printPokemon() {
        // Je parse/convertis ma réponse JSON pour accéder aux attributs de l'objet
        let result = JSON.parse(this.responseText);
        console.log(result);

        let pokemonList = result.results;
        // Je boucle sur le tableau de résultats
        for (let i = 0; i < pokemonList.length; i++) {
            // Je récupère le numéro du Pokémon à partir de l'URL
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            // Je crée mon <li></li>
            let li = document.createElement('li');
            // J'affiche le numéro et le nom du Pokémon
            li.innerHTML = pokemonId + " : " + pokemonList[i].name;
            //Si le li est cliqué , lancer la fonction fetchPokemonDetails
            li.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });
            // Je pousse mon li dans mon Ul qui a pour id 'pokemonList'
            document.getElementById('pokemonList').appendChild(li);
        }

        if (result.next) {
            let loadButton = document.createElement('button');
            loadButton.innerHTML = 'Afficher plus';
            loadButton.addEventListener('click', loadMorePokemon);
            document.getElementById('pokemonList').appendChild(loadButton);
        }
    }

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

        // Afficher les détails du Pokémon
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
});
