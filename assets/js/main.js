const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    

    return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <button id="detalhes" type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal-${pokemon.number}">
                Detalhes
            </button>
        </div>
    </li>

    <!-- Modal for ${pokemon.name} -->
    <div class="modal fade" id="pokemonModal-${pokemon.number}" tabindex="-1" role="dialog" aria-labelledby="pokemonModalLabel-${pokemon.number}" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content ${pokemon.type}">
                <div class="modal-header">
                    <h5 class="modal-title" id="pokemonModalLabel-${pokemon.number}">${pokemon.name}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Number: #${pokemon.number}</p>
                    <p>Type(s): ${pokemon.types.join(', ')}</p>
                    <p>Species: ${pokemon.species}</p>
                    <p>Height: ${pokemon.height}</p>
                    <p>Weight: ${pokemon.weight}</p>
                    <p>Abilities: ${pokemon.abilities.join(', ')}</p>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
`;
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        // Atualize as informações adicionais para cada Pokémon
        pokemons.forEach((pokemon) => {
            pokeApi.getPokemonDetails(pokemon).then((details) => {
                pokemon.species = details.species;
                pokemon.height = details.height;
                pokemon.weight = details.weight;
                pokemon.abilities = details.abilities;
            });
        });
    });
}

loadPokemonItens(offset, limit);

        loadMoreButton.addEventListener('click', () => {
            offset += limit;
            const qtdRecordsWithNextPage = offset + limit;

            if (qtdRecordsWithNextPage >= maxRecords) {
                const newLimit = maxRecords - offset;
                loadPokemonItens(offset, newLimit);

                loadMoreButton.parentElement.removeChild(loadMoreButton);
            } else {
                loadPokemonItens(offset, limit);
            }
        });