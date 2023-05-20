function fetch(url, method, fun) {
    const request = new XMLHttpRequest();
    request.addEventListener('load', fun);
    request.open(method, url);
    request.setRequestHeader('Accept', 'application/json');
    request.send();
}

document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0;
    let limit = 20;
    let pokemonListContainer = document.getElementById('pokemonList');
    let croix = document.getElementById("croix");
    let detailsContainer = document.getElementById('pokemonDetails');
    let containerDetails = document.getElementById('containerDetails')

    fetchPokemonList();

    function fetchPokemonList() {
        event.preventDefault();
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`, 'GET', printPokemon);
    }

    function fetchPokemonListType() {
        event.preventDefault();
        let searchInput2 = document.getElementById('searchInput2').value.toLowerCase();
        fetch(`https://pokeapi.co/api/v2/type/${searchInput2}`, 'GET', printPokemonSearchType);
    }

    function fetch(url, method, fun) {
        const request = new XMLHttpRequest();
        request.addEventListener('load', fun);
        request.open(method, url);
        request.setRequestHeader('Accept', 'application/json');
        request.send();
    }

    //verifie si la recherche correspond à un nom ou à un id 
    function filterPokemonList(pokemonList) {
        if (searchQuery === '') {
            return pokemonList;
        }
        return pokemonList.filter((pokemon) => {
            let pokemonUrl = pokemon.url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            return pokemon.name.includes(searchQuery.toLowerCase()) || pokemonId.includes(searchQuery);
        });
    }

    function printPokemonSearchResult(pokemonList) {
        pokemonListContainer.innerHTML = '';

        for (let i = 0; i < pokemonList.length; i++) {
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            let li = document.createElement('li');
            li.innerHTML = `${pokemonId}: ${pokemonList[i].name}`;
            li.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });
            pokemonListContainer.appendChild(li);
        }
    }

    function printPokemon() {
        let result = JSON.parse(this.responseText);
        console.log(result);

        let pokemonList = result.results;

        for (let i = 0; i < pokemonList.length; i++) {
            let pokemonUrl = pokemonList[i].url;
            let pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
            let li = document.createElement('li');
            li.innerHTML = pokemonId + " : " + pokemonList[i].name;
            li.addEventListener('click', function () {
                fetchPokemonDetails(pokemonId);
            });
            pokemonListContainer.appendChild(li);
        }

        if (result.next) {
            let loadButton = document.createElement('button');
            loadButton.innerHTML = 'Afficher plus';
            loadButton.addEventListener('click', loadMorePokemon);
            pokemonListContainer.appendChild(loadButton);
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
        //réaffiche la div des détails
        containerDetails.style.display = "initial";

        let pokemon = JSON.parse(this.responseText);
        console.log(pokemon);

        // let detailsContainer = document.getElementById('pokemonDetails');
        detailsContainer.innerHTML = '';

        let name = document.createElement('p');
        name.innerHTML = `Name: ${pokemon.name}`;
        detailsContainer.appendChild(name);

        let id = document.createElement('p');
        id.innerHTML = `ID: ${pokemon.id}`;
        detailsContainer.appendChild(id);

        let image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        detailsContainer.appendChild(image);

        let types = document.createElement('p');
        types.innerHTML = `Types: ${pokemon.types.map((type) => type.type.name).join(', ')}`;
        detailsContainer.appendChild(types);

        let stats = document.createElement('p');
        stats.innerHTML = 'Stats:';
        detailsContainer.appendChild(stats);

        let statsList = document.createElement('ul');
        pokemon.stats.forEach((stat) => {
            let statItem = document.createElement('li');
            statItem.innerHTML = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(statItem);
        });
        detailsContainer.appendChild(statsList);
    }

    function searchPokemon() {
        searchQuery = document.getElementById('searchInput').value.toLowerCase();
        offset = 0;
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1009`, 'GET', searchResult);
    }

    function printPokemonSearchType() {
        const request = this;

        if (request.status === 200) {
            const response = JSON.parse(request.responseText);
            const pokemonList = response.pokemon.map(pokemon => ({
                id: pokemon.pokemon.url.split('/').filter(Boolean).pop(),
                name: pokemon.pokemon.name
            }));
            displayResults(pokemonList);
        } else {
            console.log('Une erreur s\'est produite :', request.status);
            displayResults([]);
        }
    }

    function displayResults(pokemonList) {
        const resultContainer = document.getElementById('pokemonList');

        if (pokemonList.length === 0) {
            resultContainer.innerHTML = 'Aucun Pokémon trouvé';
        } else {
            resultContainer.innerHTML = ''; // Supprime le contenu précédent

            const ul = document.createElement('ul');

            for (let i = 0; i < pokemonList.length; i++) {
                const pokemon = pokemonList[i];
                const li = document.createElement('li');
                li.textContent = `${pokemon.id}: ${pokemon.name}`;
                li.addEventListener('click', function () {
                    fetchPokemonDetails(pokemon.id);
                });
                ul.appendChild(li);
            }

            resultContainer.appendChild(ul);
        }
    }

    function searchResult() {
        let result = JSON.parse(this.responseText);
        let pokemonList = result.results;
        let filteredPokemonList = filterPokemonList(pokemonList);
        printPokemonSearchResult(filteredPokemonList);
    }


    document.getElementById('formName').addEventListener('click', searchPokemon);
    document.getElementById('formType').addEventListener('click', fetchPokemonListType);

    //Au clic de la croix , lance la fonction hidDetail
    croix.addEventListener("click",hidDetail);

    //Cache le container des détails
    function hidDetail(){
        containerDetails.style.display = "none"
    }

});


//TODO : Ajouter bouton reset pour revenir a la liste de 20