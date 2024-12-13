function generatePokemonCardHtml(
  singlePokemon,
  nameUpperCase,
  image,
  xp,
  classbg,
  types
) {
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

const generateFooter = () => {
  const footerContent = `
    <footer class="footer bg-dark text-white py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4 text-center text-md-start">
            <img src="./img/pokeball.png" alt="Logo" class="footer-logo mb-3">
            <p>&copy; 2024 dimit. All rights reserved.</p>
            <p>Email: <a href="mailto:dm@dimit.cc" class="text-white">dm@dimit.cc</a></p>
            <p>Phone: <a href="tel:+436642178313" class="text-white">+436642178313</a></p>
          </div>
          <div class="col-md-4 text-center">
            <h5>Follow Us</h5>
            <a href="https://www.facebook.com/profile.php?id=61557717354333" target="_blank" class="mx-3 text-white">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/dimit.it/" target="_blank" class="mx-3 text-white">
              <i class="bi bi-instagram"></i>
            </a>
          </div>
          <div class="col-md-4 text-center text-md-end">
            <h5>Useful Links</h5>
            <ul class="list-unstyled">
              <li><a href="/impressum.html" class="text-white">Impressum</a></li>
              <li><a href="/datenschutzerklaerung.html" class="text-white">Datenschutz</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerContent);
};

window.addEventListener("DOMContentLoaded", generateFooter);

const generateCookieBanner = () => {
  const userChoice = localStorage.getItem("cookieConsent");
  if (userChoice) return;
  const bannerHTML = `
    <div class="cookie-banner">
      <p>Wir verwenden Cookies, um unsere Website zu verbessern. Sie können wählen, welche Cookies Sie akzeptieren.</p>
      <div class="cookie-buttons">
        <button id="accept-cookies" class="cookie-button accept">Akzeptieren</button>
        <button id="decline-cookies" class="cookie-button decline">Ablehnen</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", bannerHTML);
  document.getElementById("accept-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    removeCookieBanner();
  });

  document.getElementById("decline-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    removeCookieBanner();
  });

  const removeCookieBanner = () => {
    const banner = document.querySelector(".cookie-banner");
    if (banner) banner.remove();
  };
};

window.addEventListener("DOMContentLoaded", generateCookieBanner);
