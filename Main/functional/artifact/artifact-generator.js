// File: Main/functional/artifact/artifact-generator.js
// @path Main/functional/artifact/artifact-generator.js
import {
  MAX_LEVEL_BY_RARITY,
  MAIN_STAT_TYPES_BY_SLOT,
  MAIN_STAT_LABELS,
  SUB_STAT_LABELS,
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

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// стартовое число саб-статов (приближённо к игре)
function rollInitialSubstatCount(rarity) {
  if (rarity === 5) {
    return Math.random() < 0.75 ? 4 : 3;
  }
  if (rarity === 4) {
    return Math.random() < 0.5 ? 4 : 3;
  }
  return 3;
}

// пока без весов, просто равномерно по допустимым типам
function rollMainStat(slotKey) {
  const list = MAIN_STAT_TYPES_BY_SLOT[slotKey];
  if (!list || list.length === 0) {
    throw new Error(`Для слота ${slotKey} не заданы основные статы`);
  }
  return randomFrom(list);
}

function generateInitialSubstats(mainStatType, count, rarity) {
  const candidates = ALL_SUBSTAT_TYPES.filter((t) => t !== mainStatType);
  const substats = [];
  while (substats.length < count && candidates.length > 0) {
    const type = randomFrom(candidates);
    candidates.splice(candidates.indexOf(type), 1);
    const rolls = SUBSTAT_START_ROLLS[rarity][type] || [0];
    const value = randomFrom(rolls);
    substats.push({
      type,
      label: SUB_STAT_LABELS[type] || "",
      value,
      rolls: [value],
    });
  }
  return substats;
}

export function createArtifactInstance(
  setDef,
  slotKey,
  rarity,
  overrides = {}
) {
  const piece = setDef.pieces[slotKey];
  if (!piece) {
    throw new Error(`В сете ${setDef.id} нет слота ${slotKey}`);
  }

  const id = overrides.id || randomId();
  const level = overrides.level ?? 0;
  const maxLevel = MAX_LEVEL_BY_RARITY[rarity] || 20;

  const mainStatType = overrides.mainStatType || rollMainStat(slotKey);
  const mainStatLabel =
    overrides.mainStatLabel || MAIN_STAT_LABELS[mainStatType] || "";

  const mainStatValue =
    overrides.mainStatValue !== undefined
      ? overrides.mainStatValue
      : getMainStatValue(rarity, mainStatType, level);

  const startSubCount =
    overrides.startSubCount ?? rollInitialSubstatCount(rarity);

  const substats =
    overrides.substats ||
    generateInitialSubstats(mainStatType, startSubCount, rarity);

  const setBonuses = Object.entries(setDef.bonuses || {}).map(
    ([pieces, description]) => ({
      pieces: Number(pieces),
      description,
    })
  );

  return {
    id,
    setId: setDef.id,
    setName: setDef.name,
    slotKey: piece.slotKey,
    slotLabel: piece.slotLabel,
    name: piece.name,
    iconUrl: piece.iconUrl,
    rarity,
    level,
    maxLevel,
    mainStatType,
    mainStatLabel,
    mainStatValue,
    substats,
    setBonuses,
    description: piece.description || "",
    isLocked: Boolean(overrides.isLocked),
    isFavorited: Boolean(overrides.isFavorited),
    upgradeLog: [],
  };
}

export function upgradeArtifact(artifact, targetLevel) {
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
      applySubstatUpgrade(artifact);
    }
  }
}

function applySubstatUpgrade(artifact) {
  const rarity = artifact.rarity;

  if (!artifact.upgradeLog) artifact.upgradeLog = [];

  if (artifact.substats.length < 4) {
    const newType = rollNewSubstatType(artifact);
    const roll = randomFrom(SUBSTAT_UPGRADE_ROLLS[rarity][newType] || [0]);
    artifact.substats.push({
      type: newType,
      label: SUB_STAT_LABELS[newType] || "",
      value: roll,
      rolls: [roll],
    });
    artifact.upgradeLog.push({ type: newType, roll, added: true });
  } else {
    const index = Math.floor(Math.random() * artifact.substats.length);
    const sub = artifact.substats[index];
    const rolls = SUBSTAT_UPGRADE_ROLLS[rarity][sub.type] || [0];
    const roll = randomFrom(rolls);
    sub.value += roll;
    if (!sub.rolls) sub.rolls = [];
    sub.rolls.push(roll);
    artifact.upgradeLog.push({ type: sub.type, roll, added: false });
  }
}

function rollNewSubstatType(artifact) {
  const usedTypes = artifact.substats.map((s) => s.type);
  const candidates = ALL_SUBSTAT_TYPES.filter(
    (t) => t !== artifact.mainStatType && !usedTypes.includes(t)
  );
  if (candidates.length === 0) {
    return randomFrom(ALL_SUBSTAT_TYPES);
  }
  return randomFrom(candidates);
}
