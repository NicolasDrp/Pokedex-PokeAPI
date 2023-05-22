document.addEventListener('DOMContentLoaded', async function () {
    // div contenant les pokemon d'une génération
    let pokemonGeneration = document.getElementById('pokemonGeneration');
    // initialise la génération à 1 par défault
    let generation = 1;
    // div contenant les génération disponible
    let containerGeneration = document.getElementById('containerGeneration');
    // Récupère toutes les div enfants de containerGeneration
    let divGeneration = containerGeneration.getElementsByTagName('div');

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
            let p = document.createElement('p');
            p.innerHTML = '#' + pokemonId;
            div.appendChild(p);

            // J'affiche le nom du Pokémon
            p = document.createElement('p');
            p.innerHTML = pokemonList[i].name;
            div.appendChild(p);

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

    // parcour les div et récupere la valeur selon leur position
    for (let i = 0; i < divGeneration.length; i++) {
        divGeneration[i].addEventListener('click', function () {
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

    // Fonction pour appliquer les styles aux divs de génération
    function changeColorDiv(generationDivs, selectedIndex) {
        // // Réinitialise les styles pour toutes les divs de génération
        // for (let i = 0; i < generationDivs.length; i++) {
        //     generationDivs[i].style.backgroundColor = "none";
        // }

        // // Applique le style à la div de génération sélectionnée
        // let selectedDiv = generationDivs[selectedIndex];
        // selectedDiv.style.backgroundColor = "white";
    }

});