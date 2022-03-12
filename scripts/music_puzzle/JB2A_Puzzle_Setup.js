const music_folder = "modules/jb2a_patreon/Library/Generic/Music_Notation";
let datasource;
if (typeof ForgeVTT !== "undefined" && ForgeVTT.usingTheForge) {
    datasource = "forge-bazaar";
} else {
    datasource = "data";
}
const folder = await FilePicker.browse(datasource, music_folder);
const files = folder.files;
const animations = files.filter((file) => file.endsWith(".webm"));
const tiles = files.filter((file) => file.endsWith(".webp"));

const playerJournalName = "PlayerEntry";
const gmJournalName = "GM Solution";

// shorthand for getting the name of the note without the path
const getNoteName = (tile) => tile.replace(music_folder, "").replace(".webp", "").replace("/", "");
// create our folder with flag for cleanup
const jb2aFolder = await Folder.create([
    {
        name: "JB2A - Puzzle Journals",
        type: "JournalEntry",
        "flags.jb2a_puzzle.delete": true,
    },
]);
// create necessary JournalEntries
await JournalEntry.create([
    {
        name: playerJournalName,
        folder: jb2aFolder[0].id,
        "flags.jb2a_puzzle.delete": true,
    },
    {
        name: gmJournalName,
        folder: jb2aFolder[0].id,
        "flags.jb2a_puzzle.delete": true,
    },
]);

let tileData = [];
let macroData = [];
// assemble the tiles and macros with as much info as possible
tiles.forEach((tile, i) => {
    const name = getNoteName(tile);
    // tile is the filename for the webp
    // i is the index
    const tData = {
        img: tile,
        height: 100,
        width: 100,
        "flags.monks-active-tiles": {
            active: true,
            chance: 100,
            controlled: "all",
            history: {},
            minrequired: 0,
            pertoken: false,
            restriction: "all",
            trigger: "enter",
        },
        "flags.tagger.tags": [name, "jb2a_puzzle"],
    };

    const animation = animations[i];

    // this macro will find the note and play its respective animation at the tile location
    // it will also update the playerJournal with the new note
    const mData = {
        name: getNoteName(tile),
        img: tile,
        type: "script",
        scope: "global",
        command: `
                const tile = Tagger.getByTag("${name}")[0];
                const scale = ((tile.data.width + tile.data.height)/2)/ 100;
                new Sequence()
                    .effect()
                        .atLocation(tile)
                        .file("${animation}")
                        .scale(scale)
                        .offset({y: scale * 100})
                    .play()
                    

                //Class="secret means that this text/image will be only visible to the GM"
                const content = "<img src = ${tile} width = 100 /> ";
                const journal = game.journal.getName("${playerJournalName}");
                //Here, we add text to the Journal Entry
                //journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
                journal.update({content: journal.data.content + content});
        `,
        author: game.user.id,
        "flags.jb2a_puzzle.delete": true,
    };

    macroData.push(mData);
    tileData.push(tData);
});
// create all the tiles we need
await canvas.scene.createEmbeddedDocuments("Tile", [
    // These are all of the musical notes
    ...tileData,
    // This is a specially crafted pressure plate tile
    {
        img: "icons/environment/traps/pressure-plate.webp",
        height: 100,
        width: 100,
        "flags.monks-active-tiles": {
            active: true,
            actions: [
                {
                    action: "runmacro",
                    delay: 0,
                    id: foundry.utils.randomID(16),
                    data: {
                        // If you change the name of the pressure plate macro
                        // be sure to change it here too
                        macroid: game.macros.getName("JB2A - Pressure Plate").id,
                        runasgm: "gm",
                    },
                },
            ],
            chance: 100,
            controlled: "all",
            history: {},
            minrequired: 0,
            pertoken: false,
            restriction: "all",
            trigger: "enter",
        },
        // pressure-plate tag is used for finding the pressure plate (used for coords of sequencer effects)
        // jb2a_puzzle for cleanup
        "flags.tagger.tags": ["jb2a-puzzle-pressure-plate", "jb2a_puzzle"],
    },
]);
// create all the Macros
await Macro.createDocuments(macroData);

const tileMacroData = tiles.map((tile, i) => {
    // this is the actual tile document's id
    const cTile = canvas.scene.tiles.find((t) => t.data.img === tile).id;
    // assemble our needed changes
    const changes = {
        _id: cTile,
        "flags.monks-active-tiles.actions": [
            {
                action: "runmacro",
                delay: 0,
                id: foundry.utils.randomID(16),
                data: {
                    macroid: game.macros.getName(getNoteName(tile)).id,
                    runasgm: "gm",
                },
            },
        ],
    };

    return changes;
});

await canvas.scene.updateEmbeddedDocuments("Tile", tileMacroData);
