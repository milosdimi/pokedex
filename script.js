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
  for (let p = start; p < end; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    promises.push(fetch(url).then((response) => response.json()));
  }
  const results = await Promise.all(promises);
  results.forEach((pokemonData, index) => {
    data.push(pokemonData);
    renderPokemonCard(index + start, pokemonData);
  });
}

function closeLoadingScreen() {
  console.log("Hiding loading screen...");
  document.getElementById("loadingScreen").classList.add("d-none");
}

function showLoadingScreen() {
  console.log("Showing loading screen...");
  document.getElementById("loadingScreen").classList.remove("d-none");
}

async function loadMore() {
  showLoadingScreen();
  const nextPokemon = currentPokemon + 10;
  await loadPokemons(currentPokemon + 1, nextPokemon + 1);
  currentPokemon = nextPokemon;
  closeLoadingScreen();
}

function renderPokemonCard(p, pokemonData) {
  const { name, sprites, base_experience: xp, types } = pokemonData;

  const validTypes = types?.map((type) => type.type.name).filter(Boolean) || [];

  if (!validTypes.length) {
    console.error(`No valid types found for Pokémon ${name} (ID ${p})`);
  }

  console.log(`Types for Pokémon ${name} (ID ${p}):`, validTypes);

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

  addCardType(p, types);
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

function nextImg(currentIndex) {
  const nextIndex = currentIndex < data.length ? currentIndex + 1 : 1;
  openFullscreen(nextIndex);
}

function previousImg(currentIndex) {
  const previousIndex = currentIndex > 1 ? currentIndex - 1 : data.length;
  openFullscreen(previousIndex);
}

function addCardType(p, types) {
  const typeContent = document.getElementById(`cardType${p}`);
  if (!types || !Array.isArray(types) || types.length === 0) {
    console.error(`No valid types found for Pokémon ID ${p}`);
    return;
  }

  const validTypes = types.map((type) => type?.type?.name).filter(Boolean);

  if (validTypes.length > 0) {
    console.log("Calling generateCardTypesHtml for Pokémon ID:", p);
    typeContent.innerHTML = generateCardTypesHtml(validTypes);
  } else {
    console.error(`No valid types for Pokémon ID ${p}`);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openFullscreen(p) {
  const pokemon = data[p - 1];
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

function getFullscreenObject(pokemon) {
  const { name, sprites, base_experience: xp, types, height, weight } = pokemon;
  return {
    name,
    nameUpperCase: capitalize(name),
    image: sprites.other.home["front_default"],
    xp,
    classbg: types[0].type.name,
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

function windowResize(chart) {
  window.onresize = function () {
    const width = window.innerWidth;
    let fontSize = 18;
    if (width < 380) fontSize = 14;
    else if (width < 600) fontSize = 16;

    Chart.defaults.font.size = fontSize;
    chart.update();
  };
}

function searchPokemon() {
  const query = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const pokemonCards = document.querySelectorAll(".cards");

  if (query === "") {
    pokemonCards.forEach((card) => (card.style.display = "block"));
    return;
  }

  pokemonCards.forEach((card) => {
    const pokemonName = card.querySelector("h2").textContent.toLowerCase();
    if (pokemonName.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
