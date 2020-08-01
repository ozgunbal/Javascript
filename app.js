/**
 * @description Represents a Dino
 * @constructor
 * @param {string} species - dino species
 * @param {number} weight - weight in lbs
 * @param {number} height - height in inches
 * @param {string} dier - diet of dino
 * @param {string} where - place of where dino lived
 * @param {string} when - era of when dino lived
 * @param {string} fact - dino fact
 */
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

/**
 * @description Decides dino is heavier than human (Dino Compare Method 1)
 * @param {object} human Human Object
 * @returns {string} Comparison result
 */
Dino.prototype.hasHeaiverThan = function (human) {
  return this.weight > human.weight
    ? "Heavier than human"
    : "Lighter than human";
};

/**
 * @description Decides dino is taller than human (Dino Compare Method 2)
 * @param {object} human Human Object
 * @returns {string} Comparison result
 */
Dino.prototype.hasTallerThan = function (human) {
  return this.height > human.height
    ? "Taller than human"
    : "Shorter than human";
};

/**
 * @description Decides dino has same diet with human (Dino Compare Method 3)
 * @param {object} human Human Object
 * @returns {string} Comparison result
 */
Dino.prototype.hasSameDiet = function (human) {
  return this.diet === human.diet
    ? "Same Diet with human"
    : "Different Diet from human";
};

/**
 * @description Represents a Human
 * @constructor
 * @param {string} name - name of the human
 * @param {number} feet - feet height of the human
 * @param {number} inches - inches height of the human
 * @param {number} weight - weight of the human
 * @param {string} diet - herbavor, omnivor or carnivor
 */
function Human(name, feet, inches, weight, diet) {
  this.name = name;
  this.species = "Human";
  this.height = feet * 12 + inches;
  this.weight = weight;
  this.diet = diet;
}

// HTML Nodes
const form = document.querySelector("#dino-compare");
const grid = document.querySelector("#grid");
const newInfographButton = document.querySelector("#info-graph-btn");
const formFieldIds = ["#name", "#feet", "#inches", "#weight", "#diet"];

const TILE_TYPES = {
  DINO: "Dino",
  HUMAN: "Human",
  PIGEON: "Pigeon",
};

/**
 * @description Gets Dino data asynchronously
 * @returns {Promise<Dino[]>} Promise of Array of Dino Objects
 */
const getDinoData = async () => {
  const jsonResponse = await fetch("dino.json");
  const { Dinos } = await jsonResponse.json();
  return Dinos.map(
    ({ species, weight, height, diet, where, when, fact }) =>
      new Dino(species, weight, height, diet, where, when, fact)
  );
};

/**
 * @description Generates grid item including title, image and fact
 * @param {object} obj Dino(, Pigeon) or Human object
 * @param {number} human Human object for comparison when obj is Dino
 * @returns {HTMLDivElement} Grid item of either dino, pigon or human
 */
const generateTile = (obj, human) => {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");
  const head = document.createElement("h3");
  const image = document.createElement("img");
  const fact = document.createElement("p");

  if (obj.species === TILE_TYPES.HUMAN) {
    head.innerText = obj.name;

    image.src = `/images/human.png`;
    image.alt = "human";
  } else {
    head.innerText = obj.species;

    image.src = `/images/${obj.species.toLowerCase()}.png`;
    image.alt = obj.species;

    fact.innerText =
      obj.species === TILE_TYPES.PIGEON ? obj.fact : getRandomFact(obj, human);
  }

  gridItem.appendChild(head);
  gridItem.appendChild(image);
  fact.innerText && gridItem.appendChild(fact);

  return gridItem;
};

/**
 * @description Shuffles order of the items in the array
 * @param {array} array
 * @returns {array} Shuffed array
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * @description Gets random fact about dino
 * @param {object} dino
 * @param {object} human
 * @returns {string} fact descriptino
 */
const getRandomFact = (dino, human) => {
  const luckyNumber = Math.floor(Math.random() * 6);
  switch (luckyNumber) {
    case 0:
      return dino.hasHeaiverThan(human);
    case 1:
      return dino.hasTallerThan(human);
    case 2:
      return dino.hasSameDiet(human);
    case 3:
      return `Live at ${dino.when}`;
    case 4:
      return `Born in ${dino.where}`;
    case 5:
    default:
      return dino.fact;
  }
};

/**
 * @description Generates all tiles add to DOM
 * @param {object[]} dinos Array of Dino Object
 * @param {object} human
 */
const generateTiles = (dinos, human) => {
  // Generate Tiles for each Dino in Array
  const dinoTiles = shuffleArray(dinos).map((dino) =>
    generateTile(dino, human)
  );
  const humanTile = generateTile(human);
  const tiles = [...dinoTiles.slice(0, 4), humanTile, ...dinoTiles.slice(4)];

  // Add tiles to DOM
  tiles.forEach((tile) => grid.appendChild(tile));
};

/**
 * @description Execution after form submition
 */
const main = async () => {
  // Create Dino Objects
  const dinos = await getDinoData();

  // Create Human Object
  // Use IIFE to get human data from form
  const human = (function getFields() {
    const [name, feet, inches, weight, diet] = formFieldIds
      .map((id) => document.querySelector(id))
      .map((field) => field.value);
    console.log(name, +feet, +inches, +weight, diet);
    return new Human(name, +feet, +inches, +weight, diet);
  })();

  generateTiles(dinos, human);
  // Remove form from screen
  form.classList.add("hidden");
  newInfographButton.classList.remove("hidden");
};

// On button click, prepare and display infographic
form.addEventListener("submit", function formHandler(evt) {
  evt.preventDefault();
  main();
});

// Clear form values before re-appear
const clearForm = () => {
  const inputs = formFieldIds.map((id) => document.querySelector(id));
  inputs.forEach((input) => {
    input.value = "";
  });
  inputs[inputs.length - 1].value = "herbavor";
};

//On new infographic button click, reveal empty form and hide grid
newInfographButton.addEventListener("click", function newInfographicClick() {
  form.classList.remove("hidden");
  newInfographButton.classList.add("hidden");
  clearForm();
  Array.from(grid.childNodes).forEach((node) => {
    grid.removeChild(node);
  });
});
