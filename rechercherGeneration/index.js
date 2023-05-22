document.addEventListener('DOMContentLoaded', async function () {
    let pokemonGeneration = document.getElementById('pokemonGeneration');
    let generation = 1;

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

        let pokemonList = result.pokemon_species;
        // Je trie le tableau des Pokémon par leur ID
        pokemonList.sort((a, b) => {
            let pokemonIdA = getPokemonId(a.url);
            let pokemonIdB = getPokemonId(b.url);
            return pokemonIdA - pokemonIdB;
        });

        // Je boucle sur le tableau de résultats
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
            let span = document.createElement('span');
            span.innerHTML = '#' + pokemonId;
            div.appendChild(span);
            //on passe à la ligne
            div.appendChild(document.createElement('br'))

            // J'affiche le nom du Pokémon
            span = document.createElement('span');
            span.innerHTML = pokemonList[i].name;
            div.appendChild(span);

            // Si le div est cliqué, lancer la fonction fetchPokemonDetails
            div.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });

            // Je pousse mon div dans mon ul qui a pour id 'pokemonGeneration'
            pokemonGeneration.appendChild(div);
        }
    }

    //récupère l'id dans l'url du pokemon
    function getPokemonId(url) {
        let urlParts = url.split('/');
        return urlParts[urlParts.length - 2];
    }

});