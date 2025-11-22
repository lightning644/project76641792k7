// File: Main/functional/artifact/artifact-model.js
// Main/functional/artifact/artifact-model.js

export const ArtifactRarity = {
  FOUR: 4,
  FIVE: 5,
};

export const MAX_LEVEL_BY_RARITY = {
  [ArtifactRarity.FOUR]: 16,
  [ArtifactRarity.FIVE]: 20,
};

export const ArtifactSlotKey = {
  FLOWER: "flower",
  PLUME: "plume",
  SANDS: "sands",
  GOBLET: "goblet",
  CIRCLET: "circlet",
};

export const SLOT_LABELS = {
  [ArtifactSlotKey.FLOWER]: "Цветок жизни",
  [ArtifactSlotKey.PLUME]: "Перо смерти",
  [ArtifactSlotKey.SANDS]: "Пески времени",
  [ArtifactSlotKey.GOBLET]: "Кубок пространства",
  [ArtifactSlotKey.CIRCLET]: "Корона разума",
};

export const MainStatType = {
  HP_FLAT: "HP",
  HP_PERC: "HP%",
  ATK_FLAT: "ATK",
  ATK_PERC: "ATK%",
  DEF_FLAT: "DEF",
  DEF_PERC: "DEF%",
  EM: "Elemental Mastery",
  ER: "Energy Recharge%",
  CRIT_RATE: "Crit Rate%",
  CRIT_DMG: "Crit DMG%",
  HEAL_BONUS: "Healing Bonus%",
  PHYS_DMG: "Physical DMG%",
  PYRO_DMG: "Pyro DMG%",
  HYDRO_DMG: "Hydro DMG%",
  ELECTRO_DMG: "Electro DMG%",
  CRYO_DMG: "Cryo DMG%",
  GEO_DMG: "Geo DMG%",
  ANEMO_DMG: "Anemo DMG%",
  DENDRO_DMG: "Dendro DMG%",
};

export const SubStatType = {
  HP_FLAT: "HP",
  HP_PERC: "HP%",
  ATK_FLAT: "ATK",
  ATK_PERC: "ATK%",
  DEF_FLAT: "DEF",
  DEF_PERC: "DEF%",
  EM: "Elemental Mastery",
  ER: "Energy Recharge%",
  CRIT_RATE: "Crit Rate%",
  CRIT_DMG: "Crit DMG%",
};

export const MAIN_STAT_LABELS = {
  [MainStatType.HP_FLAT]: "HP",
  [MainStatType.HP_PERC]: "HP",
  [MainStatType.ATK_FLAT]: "Сила атаки",
  [MainStatType.ATK_PERC]: "Сила атаки",
  [MainStatType.DEF_FLAT]: "Защита",
  [MainStatType.DEF_PERC]: "Защита",
  [MainStatType.EM]: "Мастерство стихий",
  [MainStatType.ER]: "Восст. энергии",
  [MainStatType.CRIT_RATE]: "Шанс крит. попадания",
  [MainStatType.CRIT_DMG]: "Крит. урон",
  [MainStatType.HEAL_BONUS]: "Бонус лечения",
  [MainStatType.PHYS_DMG]: "Бонус физ. урона",
  [MainStatType.PYRO_DMG]: "Бонус Пиро урона",
  [MainStatType.HYDRO_DMG]: "Бонус Гидро урона",
  [MainStatType.ELECTRO_DMG]: "Бонус Электро урона",
  [MainStatType.CRYO_DMG]: "Бонус Крио урона",
  [MainStatType.GEO_DMG]: "Бонус Гео урона",
  [MainStatType.ANEMO_DMG]: "Бонус Анемо урона",
  [MainStatType.DENDRO_DMG]: "Бонус Дендро урона",
};

export const SUB_STAT_LABELS = {
  [SubStatType.HP_FLAT]: "HP",
  [SubStatType.HP_PERC]: "HP",
  [SubStatType.ATK_FLAT]: "Сила атаки",
  [SubStatType.ATK_PERC]: "Сила атаки",
  [SubStatType.DEF_FLAT]: "Защита",
  [SubStatType.DEF_PERC]: "Защита",
  [SubStatType.EM]: "Мастерство стихий",
  [SubStatType.ER]: "Восст. энергии",
  [SubStatType.CRIT_RATE]: "Шанс крит. попадания",
  [SubStatType.CRIT_DMG]: "Крит. урон",
};

export const MAIN_STAT_TYPES_BY_SLOT = {
  [ArtifactSlotKey.FLOWER]: [MainStatType.HP_FLAT],
  [ArtifactSlotKey.PLUME]: [MainStatType.ATK_FLAT],
  [ArtifactSlotKey.SANDS]: [
    MainStatType.HP_PERC,
    MainStatType.ATK_PERC,
    MainStatType.DEF_PERC,
    MainStatType.ER,
    MainStatType.EM,
  ],
  [ArtifactSlotKey.GOBLET]: [
    MainStatType.HP_PERC,
    MainStatType.ATK_PERC,
    MainStatType.DEF_PERC,
    MainStatType.EM,
    MainStatType.PYRO_DMG,
    MainStatType.HYDRO_DMG,
    MainStatType.ELECTRO_DMG,
    MainStatType.CRYO_DMG,
    MainStatType.ANEMO_DMG,
    MainStatType.GEO_DMG,
    MainStatType.DENDRO_DMG,
    MainStatType.PHYS_DMG,
  ],
  [ArtifactSlotKey.CIRCLET]: [
    MainStatType.HP_PERC,
    MainStatType.ATK_PERC,
    MainStatType.DEF_PERC,
    MainStatType.EM,
    MainStatType.CRIT_RATE,
    MainStatType.CRIT_DMG,
    MainStatType.HEAL_BONUS,
  ],
};

export const MAIN_STAT_DISTRIBUTION = {
  [ArtifactSlotKey.SANDS]: [
    { type: MainStatType.HP_PERC, weight: 26.68 },
    { type: MainStatType.ATK_PERC, weight: 26.66 },
    { type: MainStatType.DEF_PERC, weight: 26.66 },
    { type: MainStatType.ER, weight: 10.0 },
    { type: MainStatType.EM, weight: 10.0 },
  ],
  [ArtifactSlotKey.GOBLET]: [
    { type: MainStatType.HP_PERC, weight: 19.25 },
    { type: MainStatType.ATK_PERC, weight: 19.25 },
    { type: MainStatType.DEF_PERC, weight: 19.0 },
    { type: MainStatType.PYRO_DMG, weight: 5.0 },
    { type: MainStatType.HYDRO_DMG, weight: 5.0 },
    { type: MainStatType.ELECTRO_DMG, weight: 5.0 },
    { type: MainStatType.CRYO_DMG, weight: 5.0 },
    { type: MainStatType.ANEMO_DMG, weight: 5.0 },
    { type: MainStatType.GEO_DMG, weight: 5.0 },
    { type: MainStatType.DENDRO_DMG, weight: 5.0 },
    { type: MainStatType.PHYS_DMG, weight: 5.0 },
    { type: MainStatType.EM, weight: 2.5 },
  ],
  [ArtifactSlotKey.CIRCLET]: [
    { type: MainStatType.HP_PERC, weight: 22.0 },
    { type: MainStatType.ATK_PERC, weight: 22.0 },
    { type: MainStatType.DEF_PERC, weight: 22.0 },
    { type: MainStatType.CRIT_RATE, weight: 10.0 },
    { type: MainStatType.CRIT_DMG, weight: 10.0 },
    { type: MainStatType.HEAL_BONUS, weight: 10.0 },
    { type: MainStatType.EM, weight: 4.0 },
  ],
};

export const SUBSTAT_START_ROLLS = {
  5: {
    [SubStatType.HP_FLAT]: [209.13, 239.0, 268.88, 298.75],
    [SubStatType.ATK_FLAT]: [13.62, 15.56, 17.51, 19.45],
    [SubStatType.DEF_FLAT]: [16.2, 18.52, 20.83, 23.15],
    [SubStatType.HP_PERC]: [4.08, 4.66, 5.25, 5.83],
    [SubStatType.ATK_PERC]: [4.08, 4.66, 5.25, 5.83],
    [SubStatType.DEF_PERC]: [5.1, 5.83, 6.56, 7.29],
    [SubStatType.EM]: [16.32, 18.65, 20.98, 23.31],
    [SubStatType.ER]: [4.53, 5.18, 5.83, 6.48],
    [SubStatType.CRIT_RATE]: [2.72, 3.11, 3.5, 3.89],
    [SubStatType.CRIT_DMG]: [5.44, 6.22, 6.99, 7.77],
  },
  4: {
    [SubStatType.HP_FLAT]: [167.3, 191.2, 215.1, 239.0],
    [SubStatType.ATK_FLAT]: [10.89, 12.45, 14.0, 15.56],
    [SubStatType.DEF_FLAT]: [12.96, 14.82, 16.67, 18.52],
    [SubStatType.HP_PERC]: [3.26, 3.73, 4.2, 4.66],
    [SubStatType.ATK_PERC]: [3.26, 3.73, 4.2, 4.66],
    [SubStatType.DEF_PERC]: [4.08, 4.66, 5.25, 5.83],
    [SubStatType.EM]: [13.06, 14.92, 16.79, 18.65],
    [SubStatType.ER]: [3.63, 4.14, 4.66, 5.18],
    [SubStatType.CRIT_RATE]: [2.18, 2.49, 2.8, 3.11],
    [SubStatType.CRIT_DMG]: [4.35, 4.97, 5.6, 6.22],
  },
};

export const SUBSTAT_UPGRADE_ROLLS = SUBSTAT_START_ROLLS;

export const ALL_SUBSTAT_TYPES = [
  SubStatType.HP_FLAT,
  SubStatType.ATK_FLAT,
  SubStatType.DEF_FLAT,
  SubStatType.HP_PERC,
  SubStatType.ATK_PERC,
  SubStatType.DEF_PERC,
  SubStatType.EM,
  SubStatType.ER,
  SubStatType.CRIT_RATE,
  SubStatType.CRIT_DMG,
];

export const MAIN_STAT_VALUES = {
  5: {
    [MainStatType.HP_FLAT]: {
      0: 717,
      4: 1530,
      8: 2342,
      12: 3155,
      16: 3967,
      20: 4780,
    },
    [MainStatType.ATK_FLAT]: {
      0: 47,
      4: 100,
      8: 152,
      12: 205,
      16: 258,
      20: 311,
    },
    [MainStatType.HP_PERC]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.ATK_PERC]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.DEF_PERC]: {
      0: 8.7,
      4: 18.6,
      8: 28.6,
      12: 38.5,
      16: 48.4,
      20: 58.3,
    },
    [MainStatType.PHYS_DMG]: {
      0: 8.7,
      4: 18.6,
      8: 28.6,
      12: 38.5,
      16: 48.4,
      20: 58.3,
    },
    [MainStatType.PYRO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.HYDRO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.ELECTRO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.CRYO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.ANEMO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.GEO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.DENDRO_DMG]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
      20: 46.6,
    },
    [MainStatType.EM]: {
      0: 28.0,
      4: 59.7,
      8: 91.4,
      12: 123.1,
      16: 154.8,
      20: 186.5,
    },
    [MainStatType.ER]: {
      0: 7.8,
      4: 16.6,
      8: 25.4,
      12: 34.2,
      16: 43.0,
      20: 51.8,
    },
    [MainStatType.CRIT_RATE]: {
      0: 4.7,
      4: 9.9,
      8: 15.2,
      12: 20.5,
      16: 25.8,
      20: 31.1,
    },
    [MainStatType.CRIT_DMG]: {
      0: 9.3,
      4: 19.9,
      8: 30.5,
      12: 41.0,
      16: 51.6,
      20: 62.2,
    },
    [MainStatType.HEAL_BONUS]: {
      0: 5.4,
      4: 11.5,
      8: 17.6,
      12: 23.8,
      16: 29.9,
      20: 36.0,
    },
  },
  4: {
    [MainStatType.HP_FLAT]: {
      0: 645,
      4: 1377,
      8: 2108,
      12: 2839,
      16: 3571,
    },
    [MainStatType.ATK_FLAT]: {
      0: 42,
      4: 90,
      8: 137,
      12: 185,
      16: 232,
    },
    [MainStatType.HP_PERC]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.ATK_PERC]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.DEF_PERC]: {
      0: 7.9,
      4: 16.8,
      8: 25.7,
      12: 34.6,
      16: 43.5,
    },
    [MainStatType.PHYS_DMG]: {
      0: 7.9,
      4: 16.8,
      8: 25.7,
      12: 34.6,
      16: 43.5,
    },
    [MainStatType.PYRO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.HYDRO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.ELECTRO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.CRYO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.ANEMO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.GEO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.DENDRO_DMG]: {
      0: 6.3,
      4: 13.4,
      8: 20.6,
      12: 27.7,
      16: 34.8,
    },
    [MainStatType.EM]: {
      0: 25.2,
      4: 53.7,
      8: 82.2,
      12: 110.8,
      16: 139.3,
    },
    [MainStatType.ER]: {
      0: 7.0,
      4: 14.9,
      8: 22.8,
      12: 30.8,
      16: 38.7,
    },
    [MainStatType.CRIT_RATE]: {
      0: 4.2,
      4: 9.0,
      8: 13.7,
      12: 18.5,
      16: 23.2,
    },
    [MainStatType.CRIT_DMG]: {
      0: 8.4,
      4: 17.9,
      8: 27.4,
      12: 36.9,
      16: 46.4,
    },
    [MainStatType.HEAL_BONUS]: {
      0: 4.8,
      4: 10.3,
      8: 15.8,
      12: 21.3,
      16: 26.8,
    },
  },
};

export function getMainStatValue(rarity, type, level) {
  const table = MAIN_STAT_VALUES[rarity]?.[type];
  if (!table) return 0;
  if (table[level] !== undefined) return table[level];
  const keys = Object.keys(table)
    .map((k) => Number(k))
    .sort((a, b) => a - b);
  const maxKey = keys[keys.length - 1];
  return table[maxKey];
}

export const PERCENT_MAIN_STATS = new Set([
  MainStatType.HP_PERC,
  MainStatType.ATK_PERC,
  MainStatType.DEF_PERC,
  MainStatType.ER,
  MainStatType.CRIT_RATE,
  MainStatType.CRIT_DMG,
  MainStatType.HEAL_BONUS,
  MainStatType.PHYS_DMG,
  MainStatType.PYRO_DMG,
  MainStatType.HYDRO_DMG,
  MainStatType.ELECTRO_DMG,
  MainStatType.CRYO_DMG,
  MainStatType.GEO_DMG,
  MainStatType.ANEMO_DMG,
  MainStatType.DENDRO_DMG,
]);

export const FLAT_MAIN_STATS = new Set([
  MainStatType.HP_FLAT,
  MainStatType.ATK_FLAT,
]);

export const EM_MAIN_STATS = new Set([MainStatType.EM]);

export function formatMainStatValue(type, value) {
  if (value === undefined || value === null) return "";
  if (PERCENT_MAIN_STATS.has(type)) {
    return value.toFixed(1) + "%";
  }
  if (EM_MAIN_STATS.has(type)) {
    return Math.round(value) + "";
  }
  if (FLAT_MAIN_STATS.has(type)) {
    return Math.round(value) + "";
  }
  return value.toString();
}

export function formatSubStatValue(type, value) {
  if (value === undefined || value === null) return "";
  if (
    type === SubStatType.HP_PERC ||
    type === SubStatType.ATK_PERC ||
    type === SubStatType.DEF_PERC ||
    type === SubStatType.ER ||
    type === SubStatType.CRIT_RATE ||
    type === SubStatType.CRIT_DMG
  ) {
    return value.toFixed(1) + "%";
  }
  if (type === SubStatType.EM) {
    return Math.round(value) + "";
  }
  if (
    type === SubStatType.HP_FLAT ||
    type === SubStatType.ATK_FLAT ||
    type === SubStatType.DEF_FLAT
  ) {
    return Math.round(value) + "";
  }
  return value.toString();
}
