// Main/functional/artifact/artifact-generator.js

import {
  MAX_LEVEL_BY_RARITY,
  MAIN_STAT_TYPES_BY_SLOT,
  MAIN_STAT_DISTRIBUTION,
  ALL_SUBSTAT_TYPES,
  SUBSTAT_START_ROLLS,
  SUBSTAT_UPGRADE_ROLLS,
  getMainStatValue,
} from "./artifact-model.js";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return String(Date.now() + Math.random());
}

function randomFrom(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

function weightedRandom(distribution, rng = Math.random) {
  const total = distribution.reduce((sum, item) => sum + item.weight, 0);
  let r = rng() * total;

  for (const item of distribution) {
    if (r < item.weight) return item.type;
    r -= item.weight;
  }
  // На всякий случай
  return distribution[distribution.length - 1].type;
}

// стартовое число саб-статов (приближённо к игре)
function rollInitialSubstatCount(rarity, rng = Math.random) {
  if (rarity === 5) {
    return rng() < 0.75 ? 4 : 3;
  }
  if (rarity === 4) {
    return rng() < 0.5 ? 4 : 3;
  }
  return 3;
}

// выбор основного стата с учётом MAIN_STAT_DISTRIBUTION, если есть
function rollMainStat(slotKey, rng = Math.random) {
  const dist = MAIN_STAT_DISTRIBUTION[slotKey];
  if (dist && dist.length > 0) {
    return weightedRandom(dist, rng);
  }

  const list = MAIN_STAT_TYPES_BY_SLOT[slotKey];
  if (!list || list.length === 0) {
    throw new Error(`Для слота ${slotKey} не заданы основные статы`);
  }
  return randomFrom(list, rng);
}

function generateInitialSubstats(
  mainStatType,
  count,
  rarity,
  rng = Math.random
) {
  const candidates = ALL_SUBSTAT_TYPES.filter((t) => t !== mainStatType);
  const substats = [];

  while (substats.length < count && candidates.length > 0) {
    const index = Math.floor(rng() * candidates.length);
    const type = candidates.splice(index, 1)[0];

    const rolls = SUBSTAT_START_ROLLS[rarity][type] || [0];
    const value = randomFrom(rolls, rng);

    substats.push({
      type,
      value,
      rolls: [value], // история стартового ролла
    });
  }

  return substats;
}

/**
 * "Сырый" экземпляр артефакта (без UI-строк, иконок и т.п.).
 * Всё, что нужно для отображения, достаём отдельно из описания сета.
 */
export function createArtifactInstance(
  setDef,
  slotKey,
  rarity,
  overrides = {},
  rng = Math.random
) {
  const piece = setDef.pieces[slotKey];
  if (!piece) {
    throw new Error(`В сете ${setDef.id} нет слота ${slotKey}`);
  }

  const id = overrides.id || randomId();
  const level = overrides.level ?? 0;
  const maxLevel = MAX_LEVEL_BY_RARITY[rarity] || 20;

  const mainStatType = overrides.mainStatType || rollMainStat(slotKey, rng);

  const mainStatValue =
    overrides.mainStatValue !== undefined
      ? overrides.mainStatValue
      : getMainStatValue(rarity, mainStatType, level);

  const startSubCount =
    overrides.startSubCount ?? rollInitialSubstatCount(rarity, rng);

  const substats =
    overrides.substats ||
    generateInitialSubstats(mainStatType, startSubCount, rarity, rng);

  return {
    id,
    setId: setDef.id,
    slotKey,
    rarity,
    level,
    maxLevel,
    mainStatType,
    mainStatValue,
    substats,
    isLocked: Boolean(overrides.isLocked),
    isFavorited: Boolean(overrides.isFavorited),
    // Лог событий апгрейда, чтобы потом красиво анимировать
    upgradeLog: [],
  };
}

/**
 * Пока оставляем мутирующий апгрейд (как у тебя), но уже без UI-полей.
 * Позже можно будет переписать на "шаговый" upgradeArtifactStep.
 */
export function upgradeArtifact(artifact, targetLevel, rng = Math.random) {
  const max = artifact.maxLevel;
  const newLevel = Math.min(targetLevel, max);

  for (let lvl = artifact.level + 1; lvl <= newLevel; lvl++) {
    artifact.level = lvl;
    artifact.mainStatValue = getMainStatValue(
      artifact.rarity,
      artifact.mainStatType,
      lvl
    );

    if (lvl % 4 === 0) {
      applySubstatUpgrade(artifact, rng);
    }
  }
}

function applySubstatUpgrade(artifact, rng = Math.random) {
  const rarity = artifact.rarity;

  if (!artifact.upgradeLog) artifact.upgradeLog = [];

  // если сабов меньше 4 – добавляем новый
  if (artifact.substats.length < 4) {
    const newType = rollNewSubstatType(artifact, rng);
    const roll = randomFrom(SUBSTAT_UPGRADE_ROLLS[rarity][newType] || [0], rng);

    artifact.substats.push({
      type: newType,
      value: roll,
      rolls: [roll],
    });

    artifact.upgradeLog.push({
      level: artifact.level,
      type: newType,
      roll,
      added: true,
    });
  } else {
    // иначе рандомный уже существующий саб получает прок
    const index = Math.floor(rng() * artifact.substats.length);
    const sub = artifact.substats[index];
    const rolls = SUBSTAT_UPGRADE_ROLLS[rarity][sub.type] || [0];
    const roll = randomFrom(rolls, rng);

    sub.value += roll;
    if (!sub.rolls) sub.rolls = [];
    sub.rolls.push(roll);

    artifact.upgradeLog.push({
      level: artifact.level,
      type: sub.type,
      roll,
      added: false,
    });
  }
}

function rollNewSubstatType(artifact, rng = Math.random) {
  const usedTypes = artifact.substats.map((s) => s.type);

  const candidates = ALL_SUBSTAT_TYPES.filter(
    (t) => t !== artifact.mainStatType && !usedTypes.includes(t)
  );

  if (candidates.length === 0) {
    return randomFrom(ALL_SUBSTAT_TYPES, rng);
  }
  return randomFrom(candidates, rng);
}
