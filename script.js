let data = [];
let currentPokemon = 10;

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
  document.getElementById("loadingScreen").classList.add("d-none");
}

function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("d-none");
}

function renderPokemonCard(p, pokemonData) {
  const { name, sprites, base_experience: xp, types } = pokemonData;

  // Sicherstellen, dass 'types' definiert ist und nicht leer ist
  if (!types || types.length === 0) {
    console.error(`No types found for Pokémon ${name}`);
    return;
  }

  console.log(`Types for Pokémon ${name} (ID ${p}):`, types);

  const nameUpperCase = capitalize(name);
  const image = sprites.other.home["front_default"];
  const classbg = types[0]?.type?.name || "default";

  const content = document.getElementById("content");
  content.innerHTML += generatePokemonCardHtml(
    p,
    nameUpperCase,
    image,
    xp,
    classbg
  );

  // Übergebe nur valide Typen an addCardType
  addCardType(p, types);
}

function addCardType(p, types) {
  const typeContent = document.getElementById(`cardType${p}`);

  // Überprüfen, ob 'types' definiert ist und mindestens einen gültigen Typ enthält
  if (!types || !Array.isArray(types) || types.length === 0) {
    console.error(`No valid types found for Pokémon ID ${p}`);
    return;
  }

  // Filter valid types and map to names
  const validTypes = types.map((type) => type?.type?.name).filter(Boolean);

  // Log the valid types to confirm they are passed correctly
  console.log("Valid types passed to generateCardTypesHtml:", validTypes);

  // Safety check before passing to generateCardTypesHtml
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

function searchPokemon() {
  const searchField = document
    .getElementById("searchField")
    .value.toLowerCase();
  const pokemonCards = document.querySelectorAll(".cards");

  if (searchField.length >= 3) {
    showSearchResults(searchField, pokemonCards);
  } else {
    resetSearchResults(pokemonCards);
  }
}

function showSearchResults(searchField, pokemonCards) {
  pokemonCards.forEach((card, i) => {
    const name = document
      .getElementById(`pokemonName${i + 1}`)
      .innerText.toLowerCase();
    card.style.display = name.includes(searchField) ? "flex" : "none";
  });
}

function resetSearchResults(pokemonCards) {
  pokemonCards.forEach((card) => (card.style.display = "flex"));
}

async function loadMore() {
  showLoadingScreen();
  await fetchMorePokemons();
  closeLoadingScreen();
}

async function fetchMorePokemons() {
  const nextPokemon = currentPokemon + 40;
  await loadPokemons(currentPokemon, nextPokemon);
  currentPokemon = nextPokemon;
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
    object.weight
  );
  addCardTypeFullscreen(p, pokemon);
  renderStatsChart(pokemon);
  updateCloseIconTheme();
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

function addCardTypeFullscreen(p, pokemon) {
  const typeContent = document.getElementById(`cardTypeFullscreen${p}`);
  const [type0, type1] = pokemon.types.map((type) => type.type.name);
  typeContent.innerHTML = generateCardTypeFullscreenHtml(type0, type1);
}
