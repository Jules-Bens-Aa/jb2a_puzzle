export const MODULE_NAME = "jb2a_puzzle";
export default async function jb2aPuzzleSettings() {

  game.settings.registerMenu(MODULE_NAME, "puzzleGuide", {
    name: "Open Menu",
    icon: "fa-solid fa-wrench",
    type: puzzleFormApplication,
    restricted: true
  });
};


