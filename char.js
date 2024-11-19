function renderStatsChart(pokemon) {
  let stats = getPokemonStats(pokemon);
  let ctx = document.getElementById("statsChart");

  Chart.defaults.font.weight = 400;
  Chart.defaults.font.size = 18;
  Chart.defaults.color = "#2c2c2c";
  Chart.defaults.font.family = "Josefin Sans", sans-serif;

  let chart = createChart(ctx, stats);
  windowResize(chart);
  updateChartFontSize(chart);
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

function createChart(ctx, stats) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        `HP ${stats.hp}`,
        `Attack ${stats.attack}`,
        `Defense ${stats.defense}`,
        `Sp. Atk ${stats.spAttack}`,
        `Sp. Def ${stats.spDefense}`,
        `Speed ${stats.speed}`,
      ],
      datasets: [
        {
          data: [
            stats.hp,
            stats.attack,
            stats.defense,
            stats.spAttack,
            stats.spDefense,
            stats.speed,
          ],
          backgroundColor: [
            "#2C2C2C",
            "#FF4500",
            "#0A42E3",
            "#FFD700",
            "#32CD32",
            "#00CED1",
          ],
          borderWidth: 1.5,
          borderColor: [
            "#000000",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
          ],
          hoverBackgroundColor: [
            "#2C2C2C",
            "#FF4500",
            "#0A42E3",
            "#FFD700",
            "#32CD32",
            "#00CED1",
          ],
          hoverBorderColor: [
            "#000000",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
          ],
          borderRadius: {
            topRight: 8,
            bottomRight: 8,
          },
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function updateChartFontSize(chart) {
  let width = window.innerWidth;
  let fontSize;
  if (width < 380) {
    fontSize = 14;
  } else if (width < 600) {
    fontSize = 16;
  } else {
    fontSize = 18;
  }
  Chart.defaults.font.size = fontSize;
  chart.update();
}

function windowResize(chart) {
  window.onresize = function () {
    updateChartFontSize(chart);
  };
}
