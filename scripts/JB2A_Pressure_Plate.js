const music_folder = "modules/jb2a_patreon/Library/Generic/Music_Notation";
const folder = await FilePicker.browse(typeof ForgeVTT !== "undefined" && ForgeVTT.usingTheForge ? "forge-bazaar" : 'data', music_folder);
const files = folder.files;
const animations = files.filter((file) => file.endsWith(".webm"));
const tiles = files.filter((file) => file.endsWith(".webp"));

const pressurePlate = Tagger.getByTag("jb2a-puzzle-pressure-plate")[0];
const journalGM = game.journal.getName("GM Solution");
const journalPlayer = game.journal.getName("PlayerEntry");

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// only execute if the journalPlayer has the same note-code as the solution
if (journalGM.data.content === journalPlayer.data.content) {
    // Open the doors
    // IMPORTANT: You must assign the doors the tag below for them to be toggled. By default it's `jb2a-door`
    const doors = Tagger.getByTag("jb2a-door");
    let doorUpdates = doors.map((door) => ({ _id: door.id, ds: 1 }));
    await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);

    //This is the countdown timer section
    journalPlayer.update({ content: `<h1>You have 5 seconds to exit the chamber</h1>` });
    //We set an await, a delay in milliseconds, 1000 will roughly be equivalent to 1 second.
    await wait(2000);
    journalPlayer.update({ content: `<h1>4</h1>` });
    await wait(1000);
    journalPlayer.update({ content: `<h1>3</h1>` });
    await wait(1000);
    journalPlayer.update({ content: `<h1>2</h1>` });
    await wait(1000);
    journalPlayer.update({ content: `<h1>1</h1>` });
    await wait(1000);
    journalPlayer.update({ content: `<h1>0</h1>` });
    await wait(1000);
    journalPlayer.update({ content: ` ` });
    // Close the doors
    doorUpdates = doors.map((door) => ({ _id: door.id, ds: 0 }));
    await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);
}

// this executes regardless if we matched or not
// at this point we reset the pattern
journalPlayer.update({ content: `` });

chosenTiles = [];

// One of the Bass or BeamedQuaver
chosenTiles.push(tiles.slice(0, 8)[Math.floor(Math.random() * 8)]);

// One Flat or Crotchet
chosenTiles.push(tiles.slice(8, 16)[Math.floor(Math.random() * 8)]);

// Two Sharp or Treble Clef or Quavers
chosenTiles.push(tiles.slice(16, 24)[Math.floor(Math.random() * 8)]);

chosenTiles.push(tiles.slice(16, 24)[Math.floor(Math.random() * 8)]);

let newContent = "";
const cTile = pressurePlate;
const scale = (cTile.data.width + cTile.data.height) / 2 / 100;

// assemble new solution
chosenTiles.forEach((tile) => {
    //Class="secret means that this text/image will be only visible to the GM"
    const content = `<img src = ${tile} width = 100 />`;
    //Here, we add text to the Journal Entry
    //journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
    newContent = newContent + content;
});
// update gm solution journal with new note-code
journalGM.update({ content: newContent });

// play the solution
// prettier-ignore
new Sequence()
    .effect()
        .atLocation(cTile)
        .file(animations[tiles.indexOf(chosenTiles[0])])
        .scale(scale)
        .offset({ y: scale * 100 })
    .wait(2000)
    .effect()
        .atLocation(cTile)
        .file(animations[tiles.indexOf(chosenTiles[1])])
        .scale(scale)
        .offset({ y: scale * 100 })
    .wait(2000)
    .effect()
        .atLocation(cTile)
        .file(animations[tiles.indexOf(chosenTiles[2])])
        .scale(scale)
        .offset({ y: scale * 100 })
    .wait(2000)
    .effect()
        .atLocation(cTile)
        .file(animations[tiles.indexOf(chosenTiles[3])])
        .scale(scale)
        .offset({ y: scale * 100 })
    .play();
