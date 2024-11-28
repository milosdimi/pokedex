function generatePokemonCardHtml(p, nameUpperCase, image, xp, classbg, types) {
  return `
    <div id="pokemon${p}" class="cards bg-${classbg}" onclick="openFullscreen(${p})">
      ${generateCardHeader(p, xp)}
      <h2 id="pokemonName${p}">${nameUpperCase}</h2>
      ${generateImageBox(image)}
      <div id="cardType${p}" class="card-type">
        ${generateCardTypesHtml(types)}
      </div>
    </div>
  `;
}

function generateFullscreenHtml(
  p,
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
      ${generateCardHeader(p, xp, true)}
      <h2 class="h2-fs">${nameUpperCase}</h2>
      <div id="cardTypeFullscreen${p}" class="card-type card-type-fs">
        ${generateCardTypesHtml(types, true)}
      </div>
      ${generateImageBox(image, true)}
      ${generateNavigationButtons(p)}
      ${generateAboutSection(height, weight)}
      <div id="stats" class="stats-container">
        <canvas id="statsChart" width="400" height="200"></canvas>
      </div>
    </div>
  `;
}

function generateCardHeader(p, xp, fullscreen = false) {
  const headerClass = fullscreen ? "card-number card-number-fs" : "card-number";
  const h5Class = fullscreen ? "h5-fs" : "";
  return `
    <div class="${headerClass}">
      <div class="pokemon-id">
        <h5 class="${h5Class}">${p}</h5>
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

function generateNavigationButtons(p) {
  return `
    <button onclick="previousImg(${p})" class="previous-button">
      <img src="./img/left.png" alt="Previous">
    </button>
    <button onclick="nextImg(${p})" class="next-button">
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

function generateCardTypesHtml(types = [], fullscreen = false) {
  console.log("Types passed to generateCardTypesHtml:", types);

  if (!Array.isArray(types) || types.length === 0) {
    console.error("Invalid or empty 'types' array:", types);
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
