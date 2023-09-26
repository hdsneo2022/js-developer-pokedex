
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.species = pokeDetail.species
    pokemon.abilities = pokeDetail.abilities
    

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    
    pokemon.types = types
    pokemon.type = type
    
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails)) // Faz uma chamada para obter detalhes de cada Pokémon
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => {
            // Agora, para cada Pokémon detalhado, faça uma segunda chamada para obter informações de espécie e habilidades
            const detailedPokemons = pokemonsDetails.map((pokemon) => {
                return fetch(pokemon.species.url) // Use a URL de espécie do Pokémon
                    .then((response) => response.json())
                    .then((speciesData) => {
                        // Adicione a espécie ao Pokémon
                        pokemon.species = speciesData.name;
                        return fetch(pokemon.abilities[0].ability.url) // Use a URL da primeira habilidade do Pokémon (você pode iterar por todas as habilidades se necessário)
                            .then((response) => response.json())
                            .then((abilityData) => {
                                // Obtenha o nome da primeira habilidade e adicione ao Pokémon
                                pokemon.abilities = [abilityData.name];
                                return pokemon;
                            });
                    });
            });

            // Retorne uma Promise.all para esperar que todas as chamadas secundárias da API sejam concluídas
            return Promise.all(detailedPokemons);
        });
};