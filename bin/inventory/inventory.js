// File: Main/ui/inventory/inventory.js
// Main/ui/inventory/inventory.js
import {
  ArtifactRarity,
  ArtifactSlotKey,
  formatMainStatValue,
  formatSubStatValue,
} from "../../Main/functional/artifact/artifact-model.js";
import { loadAllArtifactSets } from "../../Main/functional/artifact/artifact-sets-loader.js";
import {
  createArtifactInstance,
  upgradeArtifact,
} from "../../Main/functional/artifact/artifact-generator.js";
import {
  renderArtifactCard,
  initInertialScroll,
  updateLockFavoriteUI,
} from "../../Main/ui/artifact/artifact-modular-window/artifact-modular-window.js";

const GRADIENT_BY_RARITY = {
  4: "linear-gradient(148.93deg, rgba(91, 81, 114, 1) 0%, rgba(152, 101, 169, 1) 77.25030183792114%)",
  5: "linear-gradient(148.93deg, rgba(105, 84, 83, 1) 0%, rgba(140, 99, 79, 1) 26.923078298568726%, rgba(245, 177, 74, 1) 88.94230723381042%, rgba(243, 188, 105, 1) 100%)",
};

const TITLEBAR_COLOR_BY_RARITY = {
  4: "#A050E1",
  5: "#BC6932",
};

let ArtifactSets = {};
let inventory = [];
let selectedArtifactId = null;

function enrichArtifactForUI(artifact) {
  return {
    ...artifact,
    gradient: GRADIENT_BY_RARITY[artifact.rarity],
    titleBarColor: TITLEBAR_COLOR_BY_RARITY[artifact.rarity],
    mainStatValue: formatMainStatValue(
      artifact.mainStatType,
      artifact.mainStatValue
    ),
    substats: artifact.substats.map((s) => ({
      ...s,
      displayValue: formatSubStatValue(s.type, s.value),
    })),
  };
}

function renderInventoryGrid(container) {
  container.innerHTML = "";
  inventory.forEach((art) => {
    const item = document.createElement("div");
    item.className = "inv-slot";
    if (art.rarity === ArtifactRarity.FIVE) {
      item.classList.add("inv-slot--rarity-5");
    }
    if (art.rarity === ArtifactRarity.FOUR) {
      item.classList.add("inv-slot--rarity-4");
    }
    if (art.id === selectedArtifactId) {
      item.classList.add("inv-slot--selected");
    }

    const img = document.createElement("img");
    img.src = art.iconUrl;
    img.alt = "";
    img.className = "inv-slot__icon";
    img.draggable = false;

    const lvl = document.createElement("div");
    lvl.className = "inv-slot__level";
    lvl.textContent = "+" + art.level;

    item.appendChild(img);
    item.appendChild(lvl);

    item.addEventListener("click", () => {
      selectedArtifactId = art.id;
      const cardRoot = document.getElementById("artifact-card-root");
      renderArtifactCard(cardRoot, enrichArtifactForUI(art));
      renderInventoryGrid(container);
    });

    container.appendChild(item);
  });
}

function readFiltersFromForm() {
  const form = document.getElementById("gacha-form");
  const setSelect = form.querySelector("[name='set']");
  const slotSelect = form.querySelector("[name='slot']");
  const raritySelect = form.querySelector("[name='rarity']");

  const setId = setSelect.value || null;
  const slotKey = slotSelect.value || null;
  const rarity = Number(raritySelect.value) || ArtifactRarity.FIVE;

  const availableSetIds = setId ? [setId] : Object.keys(ArtifactSets);
  const availableSlots = slotKey
    ? [slotKey]
    : Object.keys(ArtifactSets[availableSetIds[0]].pieces);

  return { availableSetIds, availableSlots, rarity };
}

function rollArtifact(filters) {
  const setId =
    filters.availableSetIds[
      Math.floor(Math.random() * filters.availableSetIds.length)
    ];
  const setDef = ArtifactSets[setId];

  const slots = filters.availableSlots;
  const slotKey = slots[Math.floor(Math.random() * slots.length)];

  const art = createArtifactInstance(setDef, slotKey, filters.rarity);
  return art;
}

async function initApp() {
  ArtifactSets = await loadAllArtifactSets();

  const cardRoot = document.getElementById("artifact-card-root");
  const gridRoot = document.getElementById("inventory-grid");
  const cardElement = cardRoot.closest(".artifact-card");
  initInertialScroll(cardElement);

  const form = document.getElementById("gacha-form");
  const setSelect = form.querySelector("[name='set']");
  const slotSelect = form.querySelector("[name='slot']");

  Object.values(ArtifactSets).forEach((set) => {
    const opt = document.createElement("option");
    opt.value = set.id;
    opt.textContent = set.name;
    setSelect.appendChild(opt);
  });

  const slotKeys = [
    "",
    ArtifactSlotKey.FLOWER,
    ArtifactSlotKey.PLUME,
    ArtifactSlotKey.SANDS,
    ArtifactSlotKey.GOBLET,
    ArtifactSlotKey.CIRCLET,
  ];

  slotKeys.forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent =
      key === ""
        ? "Любой тип"
        : ArtifactSets[Object.keys(ArtifactSets)[0]].pieces[key].slotLabel;
    slotSelect.appendChild(opt);
  });

  document.getElementById("gacha-button").addEventListener("click", (e) => {
    e.preventDefault();
    const filters = readFiltersFromForm();
    const art = rollArtifact(filters);
    // новые артефакты в начало списка
    inventory.unshift(art);
    selectedArtifactId = art.id;
    renderInventoryGrid(gridRoot);
    renderArtifactCard(cardRoot, enrichArtifactForUI(art));
  });

  const firstSet = ArtifactSets["wanderer_troupe"];
  const testArt = createArtifactInstance(
    firstSet,
    "flower",
    ArtifactRarity.FIVE,
    { mainStatType: "HP", mainStatLabel: "HP", mainStatValue: 717 }
  );
  inventory.unshift(testArt);
  selectedArtifactId = testArt.id;

  renderInventoryGrid(gridRoot);
  renderArtifactCard(cardRoot, enrichArtifactForUI(testArt));

  const lockBtn = cardRoot.querySelector(".artifact-card__lock");
  const favBtn = cardRoot.querySelector(".artifact-card__favorite");
  const upgradeBtn = document.getElementById("upgrade-button");

  lockBtn.addEventListener("click", () => {
    const art = inventory.find((a) => a.id === selectedArtifactId);
    art.isLocked = !art.isLocked;
    updateLockFavoriteUI(cardRoot, art);
    renderInventoryGrid(gridRoot);
  });

  favBtn.addEventListener("click", () => {
    const art = inventory.find((a) => a.id === selectedArtifactId);
    art.isFavorited = !art.isFavorited;
    updateLockFavoriteUI(cardRoot, art);
    renderInventoryGrid(gridRoot);
  });

  upgradeBtn.addEventListener("click", () => {
    const art = inventory.find((a) => a.id === selectedArtifactId);
    if (!art) return;
    upgradeArtifact(art, art.maxLevel);
    renderArtifactCard(cardRoot, enrichArtifactForUI(art));
    renderInventoryGrid(gridRoot);
    console.log("upgradeLog", art.upgradeLog);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initApp().catch(console.error);
});
