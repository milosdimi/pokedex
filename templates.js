function generatePokemonCardHtml(singlePokemon, nameUpperCase, image, xp, classbg, types) {
  return `
    <div id="pokemon${singlePokemon}" class="cards bg-${classbg}" onclick="openFullscreen(${singlePokemon})">
      ${generateCardHeader(singlePokemon, xp)}
      <h2 id="pokemonName${singlePokemon}">${nameUpperCase}</h2>
      ${generateImageBox(image)}
      <div id="cardType${singlePokemon}" class="card-type">
        ${generateCardTypesHtml(types)}
      </div>
    </div>
  `;
}

function generateFullscreenHtml(
  singlePokemon,
  nameUpperCase,
  image,
  xp,
  classbg,
  height,
  weight,
  types
) {
  return `
    <div class="card-fullscreen bg-${classbg}">
      ${generateCardHeader(singlePokemon, xp, true)}
      <h2 class="h2-fs">${nameUpperCase}</h2>
      <div id="cardTypeFullscreen${singlePokemon}" class="card-type card-type-fs">
        ${generateCardTypesHtml(types, true)}
      </div>
      ${generateImageBox(image, true)}
      ${generateNavigationButtons(singlePokemon)}
      ${generateAboutSection(height, weight)}
      <div id="stats" class="stats-container">
        <canvas id="statsChart" width="400" height="200"></canvas>
      </div>
    </div>
  `;
}

function generateCardHeader(singlePokemon, xp, fullscreen = false) {
  const headerClass = fullscreen ? "card-number card-number-fs" : "card-number";
  const h5Class = fullscreen ? "h5-fs" : "";
  return `
    <div class="${headerClass}">
      <div class="pokemon-id">
        <h5 class="${h5Class}">${singlePokemon}</h5>
      </div>
      <div class="margin-left-auto">
        <h5 class="${h5Class}">XP ${xp}</h5>
      </div>
    </div>
  `;
}

function generateImageBox(image, fullscreen = false) {
  const imgClass = fullscreen ? "fullscreen-img" : "";
  return `
    <div class="imagebox ${fullscreen ? "imagebox-fs" : ""}">
      <img class="${imgClass}" src="${image}" alt="Pokemon Image">
    </div>
  `;
}

function generateNavigationButtons(singlePokemon) {
  return `
    <button onclick="previousImg(${singlePokemon})" class="previous-button">
      <img src="./img/left.png" alt="Previous">
    </button>
    <button onclick="nextImg(${singlePokemon})" class="next-button">
      <img src="./img/arrow-right.png" alt="Next">
    </button>
    <button onclick="closeFullscreen(event)" class="close-button">
      <img class="close-icon" src="./img/circle-xmark.png" alt="Close">
    </button>
  `;
}

function generateAboutSection(height, weight) {
  return `
    <div id="about">
      <div class="about-hw">
        <div class="hw-container">
          <div class="height-container">
            <span>Height</span><span class="separator"></span><span>${height} m</span>
          </div>
          <div class="height-container">
            <span>Weight</span><span class="separator"></span><span>${weight} kg</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateStatsHtml(stats) {
  return Object.keys(stats)
    .map((key) => {
      const value = stats[key];
      return `
        <div class="stat-label">${key.toUpperCase()} (${value})</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: ${value / 2}%;"></div>
        </div>
      `;
    })
    .join("");
}

function generateCardTypesHtml(types = [], fullscreen = false) {
  if (!Array.isArray(types) || types.length === 0) {
    return "<div class='no-types'>No types available</div>";
  }

  return types
    .map(
      (type, index) => `
        <div class="${index === 0 ? "first-type" : "second-type"} ${
        fullscreen ? "first-type-fs" : ""
      }">
          <h4 class="${fullscreen ? "h4-fs" : ""}">${type}</h4>
        </div>
      `
    )
    .join("");
}
