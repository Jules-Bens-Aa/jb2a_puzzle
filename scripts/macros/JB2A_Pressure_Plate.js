const music_folder = "modules/jb2a_patreon/Library/Generic/Music_Notation";
const folder = await FilePicker.browse(
    typeof ForgeVTT !== "undefined" && ForgeVTT.usingTheForge ? "forge-bazaar" : "data",
    music_folder
);
const files = folder.files;
const animations = files.filter((file) => file.endsWith(".webm"));
const tiles = files.filter((file) => file.endsWith(".webp"));

const pressurePlate = Tagger.getByTag("jb2a-puzzle-pressure-plate")[0];
const journalGM = game.journal.getName("GM Solution");
const journalPlayer = game.journal.getName("PlayerEntry");

let pageGM = journalGM.pages.getName("GM Solution");
if (pageGM === undefined) {
    await journalGM.createEmbeddedDocuments("JournalEntryPage", [{ name: "GM Solution" }]);
}

let pagePlayer = journalPlayer.pages.getName("PlayerEntry");
if (pagePlayer === undefined) {
    await journalPlayer.createEmbeddedDocuments("JournalEntryPage", [{ name: "PlayerEntry" }]);
}

pageGM = journalGM.pages.getName("GM Solution");
pagePlayer = journalPlayer.pages.getName("PlayerEntry");

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// only execute if the pagePlayer has the same note-code as the solution
if (pageGM.text.content === pagePlayer.text.content) {
    // Open the doors
    // IMPORTANT: You must assign the doors the tag below for them to be toggled. By default it's `jb2a-door`
    const doors = Tagger.getByTag("jb2a-door");
    let doorUpdates = doors.map((door) => ({ _id: door.id, ds: 1 }));
    await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);

    //This is the countdown timer section
    pagePlayer.update({ text: { content: `<h1>You have 5 seconds to exit the chamber</h1>` } });
    //We set an await, a delay in milliseconds, 1000 will roughly be equivalent to 1 second.
    await wait(2000);
    pagePlayer.update({ text: { content: `<h1>4</h1>` } });
    await wait(1000);
    pagePlayer.update({ text: { content: `<h1>3</h1>` } });
    await wait(1000);
    pagePlayer.update({ text: { content: `<h1>2</h1>` } });
    await wait(1000);
    pagePlayer.update({ text: { content: `<h1>1</h1>` } });
    await wait(1000);
    pagePlayer.update({ text: { content: `<h1>0</h1>` } });
    await wait(1000);
    pagePlayer.update({ text: { content: ` ` } });
    // Close the doors
    doorUpdates = doors.map((door) => ({ _id: door.id, ds: 0 }));
    await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);
}
// this executes regardless if we matched or not
// at this point we reset the pattern
pagePlayer.update({ "text.content": `` });

let chosenTiles = [];

// One of the Bass or BeamedQuaver
chosenTiles.push(tiles.slice(0, 8)[Math.floor(Math.random() * 8)]);

// One Flat or Crotchet
chosenTiles.push(tiles.slice(8, 16)[Math.floor(Math.random() * 8)]);

// Two Sharp or Treble Clef or Quavers
chosenTiles.push(tiles.slice(16, 24)[Math.floor(Math.random() * 8)]);

chosenTiles.push(tiles.slice(16, 24)[Math.floor(Math.random() * 8)]);

let newContent = "";
const cTile = pressurePlate;
const scale = (cTile.width + cTile.height) / 2 / 100;

// assemble new solution
chosenTiles.forEach((tile) => {
    //Class="secret means that this text/image will be only visible to the GM"
    const content = `<img src = ${tile} width = 100 />`;
    //Here, we add text to the Journal Entry
    //journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
    newContent = newContent + content;
});
// update gm solution journal with new note-code
pageGM.update({ text: { content: newContent } });

let tileMacros = [
    game.macros.find(m => m.img === chosenTiles[0]),
    game.macros.find(m => m.img === chosenTiles[1]),
    game.macros.find(m => m.img === chosenTiles[2]),
    game.macros.find(m => m.img === chosenTiles[3])
]

let tileNotes= [
    tileMacros[0].flags["jb2a_puzzle"]["note"],
    tileMacros[1].flags["jb2a_puzzle"]["note"],
    tileMacros[2].flags["jb2a_puzzle"]["note"],
    tileMacros[3].flags["jb2a_puzzle"]["note"],
];


// play the solution
// prettier-ignore
new Sequence()
    .sound()
        .file(tileNotes[0])
    .effect()
        .atLocation(cTile, {offset: {x: 0, y: scale * -100}})
        .file(animations[tiles.indexOf(chosenTiles[0])])
        .scale(scale)
    .wait(2000)
    .sound()
        .file(tileNotes[1])
    .effect()
        .atLocation(cTile, {offset: {x: 0, y: scale * -100}})
        .file(animations[tiles.indexOf(chosenTiles[1])])
        .scale(scale)
    .wait(2000)
    .sound()
        .file(tileNotes[2])
    .effect()
        .atLocation(cTile, {offset: {x: 0, y: scale * -100}})
        .file(animations[tiles.indexOf(chosenTiles[2])])
        .scale(scale)
    .wait(2000)
    .sound()
        .file(tileNotes[3])
    .effect()
        .atLocation(cTile, {offset: {x: 0, y: scale * -100}})
        .file(animations[tiles.indexOf(chosenTiles[3])])
        .scale(scale)
    .play();
