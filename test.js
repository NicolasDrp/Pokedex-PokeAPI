function fetch(url, method, fun) {
  const request = new XMLHttpRequest();
  request.addEventListener('load', fun);
  request.open(method, url);
  request.setRequestHeader('Accept', 'application/json');
  request.send();
}

document.getElementById('searchButton2').addEventListener('click', fetchPokemonListType);

function fetchPokemonListType() {
  let searchInput2 = document.getElementById('searchInput2').value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/type/${searchInput2}`, 'GET', printPokemonSearchType);
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
      ul.appendChild(li);
    }

    resultContainer.appendChild(ul);
  }
}
