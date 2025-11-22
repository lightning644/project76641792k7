// File: Main/ui/app/app.js
// Main/ui/app/app.js

import {
  ArtifactRarity,
  ArtifactSlotKey,
} from "../../functional/artifact/artifact-model.js";
import { loadAllArtifactSets } from "../../functional/artifact/artifact-sets-loader.js";
import {
  createArtifactInstance,
  upgradeArtifact,
} from "../../functional/artifact/artifact-generator.js";
import { buildArtifactViewModel } from "../../functional/artifact/artifact-view-model.js";
import {
  renderArtifactCard,
  initInertialScroll,
  updateLockFavoriteUI,
} from "../artifact/artifact-modular-window/artifact-modular-window.js";

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

/**
 * Построить view-модель для конкретного артефакта
 * (добавляем цвета, форматирование и всё, что нужно карточке).
 */
function enrichArtifactForUI(artifact) {
  const setDef = ArtifactSets[artifact.setId];
  const vm = buildArtifactViewModel(artifact, setDef);

  vm.gradient = GRADIENT_BY_RARITY[artifact.rarity];
  vm.titleBarColor = TITLEBAR_COLOR_BY_RARITY[artifact.rarity];

  return vm;
}

function renderInventoryGrid(container) {
  container.innerHTML = "";

  inventory.forEach((art) => {
    const vm = enrichArtifactForUI(art);

    const item = document.createElement("div");
    item.className = "inv-slot";

    if (vm.rarity === ArtifactRarity.FIVE) {
      item.classList.add("inv-slot--rarity-5");
    }
    if (vm.rarity === ArtifactRarity.FOUR) {
      item.classList.add("inv-slot--rarity-4");
    }
    if (vm.id === selectedArtifactId) {
      item.classList.add("inv-slot--selected");
    }

    const img = document.createElement("img");
    img.src = vm.iconUrl;
    img.alt = "";
    img.className = "inv-slot__icon";
    img.draggable = false;

    const lvl = document.createElement("div");
    lvl.className = "inv-slot__level";
    lvl.textContent = "+" + vm.level;

    item.appendChild(img);
    item.appendChild(lvl);

    item.addEventListener("click", () => {
      selectedArtifactId = vm.id;
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

  return createArtifactInstance(setDef, slotKey, filters.rarity);
}

async function initInventoryPage() {
  ArtifactSets = await loadAllArtifactSets();

  const cardRoot = document.getElementById("artifact-card-root");
  const gridRoot = document.getElementById("inventory-grid");
  const cardElement = cardRoot.closest(".artifact-card");
  initInertialScroll(cardElement);

  const form = document.getElementById("gacha-form");
  const setSelect = form.querySelector("[name='set']");
  const slotSelect = form.querySelector("[name='slot']");

  // Заполнение списка сетов
  Object.values(ArtifactSets).forEach((set) => {
    const opt = document.createElement("option");
    opt.value = set.id;
    opt.textContent = set.name;
    setSelect.appendChild(opt);
  });

  // Заполнение списка слотов
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
    inventory.unshift(art);
    selectedArtifactId = art.id;
    renderInventoryGrid(gridRoot);
    renderArtifactCard(cardRoot, enrichArtifactForUI(art));
  });

  // Тестовый стартовый артефакт
  const firstSet = ArtifactSets["wanderer_troupe"];
  const testArt = createArtifactInstance(
    firstSet,
    "flower",
    ArtifactRarity.FIVE,
    { mainStatType: "HP", mainStatValue: 717 }
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
    if (!art) return;
    art.isLocked = !art.isLocked;
    updateLockFavoriteUI(cardRoot, enrichArtifactForUI(art));
    renderInventoryGrid(gridRoot);
  });

  favBtn.addEventListener("click", () => {
    const art = inventory.find((a) => a.id === selectedArtifactId);
    if (!art) return;
    art.isFavorited = !art.isFavorited;
    updateLockFavoriteUI(cardRoot, enrichArtifactForUI(art));
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

function initNavbar() {
  const buttons = document.querySelectorAll(".navbar__btn");
  const pages = {
    inventory: document.getElementById("page-inventory"),
    gacha: document.getElementById("page-gacha"),
    build: document.getElementById("page-build"),
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;

      buttons.forEach((b) =>
        b.classList.toggle("navbar__btn--active", b === btn)
      );

      Object.entries(pages).forEach(([key, el]) => {
        el.classList.toggle("page--active", key === page);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initInventoryPage().catch(console.error);
});
