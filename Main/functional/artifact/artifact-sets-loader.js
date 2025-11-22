// File: Main/functional/artifact/artifact-sets-loader.js
// Main/functional/artifact/artifact-sets-loader.js

const SET_IDS = ["wanderer_troupe", "gladiator_finale"];

export async function loadArtifactSet(setId) {
  const res = await fetch(`../../data/artifact-sets/${setId}/info.json`);
  if (!res.ok) {
    throw new Error(`Не удалось загрузить info.json для сета ${setId}`);
  }
  const json = await res.json();

  for (const pieceKey of Object.keys(json.pieces)) {
    const piece = json.pieces[pieceKey];
    piece.iconUrl = `../../data/artifact-sets/${setId}/${piece.icon}`;
  }

  return json;
}

export async function loadAllArtifactSets() {
  const entries = await Promise.all(
    SET_IDS.map(async (id) => [id, await loadArtifactSet(id)])
  );
  return Object.fromEntries(entries);
}
