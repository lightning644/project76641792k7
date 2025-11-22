// File: Main/functional/artifact-view-model.js

import {
  MAIN_STAT_LABELS,
  SUB_STAT_LABELS,
  formatMainStatValue,
  formatSubStatValue,
} from "./artifact-model.js";

/**
 * Строит view-модель артефакта для UI (карточка, список и т.п.).
 * На вход: "сырой" артефакт (данные игры) + определение сета.
 * На выход: объект с уже готовыми строками, иконкой и отформатированными числами.
 */
export function buildArtifactViewModel(artifact, setDef) {
  if (!setDef) {
    throw new Error(
      `buildArtifactViewModel: не найден setDef для setId=${artifact.setId}`
    );
  }

  const piece = setDef.pieces[artifact.slotKey];
  if (!piece) {
    throw new Error(
      `buildArtifactViewModel: в сете ${setDef.id} нет слота ${artifact.slotKey}`
    );
  }

  const setBonuses = Object.entries(setDef.bonuses || {}).map(
    ([pieces, description]) => ({
      pieces: Number(pieces),
      description,
    })
  );

  return {
    // Базовая идентичность / состояние
    id: artifact.id,
    setId: artifact.setId,
    rarity: artifact.rarity,
    level: artifact.level,
    maxLevel: artifact.maxLevel,
    isLocked: Boolean(artifact.isLocked),
    isFavorited: Boolean(artifact.isFavorited),

    // Основная визуальная информация
    name: piece.name,
    slotKey: artifact.slotKey,
    slotLabel: piece.slotLabel,
    iconUrl: piece.iconUrl,
    setName: setDef.name,
    setBonuses,
    description: piece.description || "",

    // Основной стат
    mainStatType: artifact.mainStatType,
    mainStatLabel: MAIN_STAT_LABELS[artifact.mainStatType] || "",
    mainStatValue: formatMainStatValue(
      artifact.mainStatType,
      artifact.mainStatValue
    ),

    // Сабстаты
    substats: (artifact.substats || []).map((s) => ({
      type: s.type,
      label: SUB_STAT_LABELS[s.type] || "",
      value: s.value,
      displayValue: formatSubStatValue(s.type, s.value),
      rolls: Array.isArray(s.rolls) ? [...s.rolls] : [],
    })),

    // Лог апгрейда (если нужно показывать в UI)
    upgradeLog: Array.isArray(artifact.upgradeLog)
      ? [...artifact.upgradeLog]
      : [],
  };
}
