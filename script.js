let data = [];
let currentPokemon = 13;

function init() {
  showLoadingScreen();
  getPokemons().then(closeLoadingScreen);
}

async function getPokemons() {
  await loadPokemons(1, currentPokemon);
}

async function loadPokemons(start, end) {
  const promises = [];
  for (let p = start; p <= end; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    promises.push(
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to fetch Pokémon ID ${p}`);
          return response.json();
        })
        .catch((error) => {
          console.error(error.message);
          return null; // Add `null` for failed Pokémon
        })
    );
  }

  const results = await Promise.all(promises);

  results.forEach((pokemonData, index) => {
    if (pokemonData) {
      const pokemonId = start + index; // Calculate correct ID
      data[pokemonId] = pokemonData; // Use ID as index for direct access
      renderPokemonCard(pokemonId, pokemonData);
    } else {
      console.warn(`No data found for Pokémon ID ${start + index}`);
    }
  });
}

function closeLoadingScreen() {
  document.getElementById("loadingScreen").classList.add("d-none");
}

function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("d-none");
}

async function loadMore() {
  showLoadingScreen();

  const startPokemon = currentPokemon + 1;
  const nextPokemon = currentPokemon + 10;

  await loadPokemons(startPokemon, nextPokemon);
  currentPokemon = nextPokemon;

  closeLoadingScreen();
}

function renderPokemonCard(p, pokemonData) {
  const { name, sprites, base_experience: xp, types } = pokemonData;

  const validTypes = types?.map((type) => type.type.name).filter(Boolean) || [];
  const nameUpperCase = capitalize(name);
  const image = sprites.other.home["front_default"];
  const classbg = validTypes[0] || "default";

  const content = document.getElementById("content");
  content.innerHTML += generatePokemonCardHtml(
    p,
    nameUpperCase,
    image,
    xp,
    classbg,
    validTypes
  );

  // Add Pokémon types to the card
  addCardType(p, validTypes);
}

function addCardType(p, types) {
  const typeContent = document.getElementById(`cardType${p}`);

  if (!types || !Array.isArray(types) || types.length === 0) {
    console.error(`No valid types found for Pokémon ID ${p}`);
    return;
  }

  const html = generateCardTypesHtml(types);
  typeContent.innerHTML = html;
}

function addCardTypeFullscreen(p, types) {
  const typeContent = document.getElementById(`cardTypeFullscreen${p}`);

  if (!types || !Array.isArray(types) || types.length === 0) {
    console.error(`No valid types found for Pokémon ID ${p}`);
    typeContent.innerHTML = "<div>No types available</div>";
    return;
  }

  const html = generateCardTypesHtml(types, true);
  typeContent.innerHTML = html;
}

function openFullscreen(p) {
  const pokemon = data[p];

  if (!pokemon) {
    console.error(`No Pokémon found for ID ${p}`);
    return;
  }

  const object = getFullscreenObject(pokemon);
  const fullScreenContent = document.getElementById("fullscreen");

  showFullscreen(fullScreenContent);

  fullScreenContent.innerHTML = generateFullscreenHtml(
    p,
    object.nameUpperCase,
    object.image,
    object.xp,
    object.classbg,
    object.height,
    object.weight,
    object.types
  );

  addCardTypeFullscreen(p, object.types);
  renderStatsChart(pokemon);
}

function nextImg(currentIndex) {
  const nextIndex = currentIndex < currentPokemon ? currentIndex + 1 : 1;
  openFullscreen(nextIndex);
}

function previousImg(currentIndex) {
  const previousIndex = currentIndex > 1 ? currentIndex - 1 : currentPokemon;
  openFullscreen(previousIndex);
}

function getFullscreenObject(pokemon) {
  const { name, sprites, base_experience: xp, types, height, weight } = pokemon;
  return {
    name,
    nameUpperCase: capitalize(name),
    image: sprites.other.home["front_default"],
    xp,
    classbg: types[0]?.type?.name || "default",
    height: height / 10,
    weight: weight / 10,
    types: types.map((type) => type.type.name),
  };
}

function showFullscreen(fullScreenContent) {
  fullScreenContent.classList.remove("d-none");
  document.body.classList.add("overflow-hidden");
}

function closeFullscreen(event) {
  const fullScreenContent = document.getElementById("fullscreen");
  if (
    event.target === fullScreenContent ||
    event.target.closest(".close-button")
  ) {
    fullScreenContent.classList.add("d-none");
    document.body.classList.remove("overflow-hidden");
  }
}

function renderStatsChart(pokemon) {
  const stats = getPokemonStats(pokemon);
  const container = document.getElementById("stats");

  container.innerHTML = "";

  Object.keys(stats).forEach((key) => {
    const value = stats[key];
    const statLabel = document.createElement("div");
    statLabel.className = "stat-label";
    statLabel.textContent = `${key.toUpperCase()} (${value})`;

    const statBarContainer = document.createElement("div");
    statBarContainer.className = "stat-bar-container";

    const statBar = document.createElement("div");
    statBar.className = "stat-bar";
    statBar.style.width = `${value / 2}%`;

    statBarContainer.appendChild(statBar);
    container.appendChild(statLabel);
    container.appendChild(statBarContainer);
  });
}

function getPokemonStats(pokemon) {
  return {
    hp: pokemon.stats[0].base_stat,
    attack: pokemon.stats[1].base_stat,
    defense: pokemon.stats[2].base_stat,
    spAttack: pokemon.stats[3].base_stat,
    spDefense: pokemon.stats[4].base_stat,
    speed: pokemon.stats[5].base_stat,
  };
}

function searchPokemon() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const pokemonCards = document.querySelectorAll(".cards");

  if (query === "") {
    pokemonCards.forEach((card) => (card.style.display = "block"));
    return;
  }

  pokemonCards.forEach((card) => {
    const pokemonName = card.querySelector("h2").textContent.toLowerCase();
    card.style.display = pokemonName.includes(query) ? "block" : "none";
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
