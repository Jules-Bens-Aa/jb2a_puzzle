// check tiles
const hasTileFlag = !!Tagger.getByTag("jb2a_puzzle").length;
//console.log(hasTileFlag);

// check macros
const hasMacroFlag = !!Array.from(game.macros).find((m) => m?.flags?.jb2a_puzzle?.delete === true);
//console.log(hasMacroFlag);

//check journal entries
const hasJournalFlag = !!Array.from(game.journal).find((j) => j?.data?.jb2a_puzzle?.delete === true);
//console.log(hasJournalFlag);

if (!hasTileFlag && !hasMacroFlag && !hasJournalFlag) {
    await setupInit();
} else {
    const warning =
        "JB2A_Puzzle Warning : You have already executed this macro ! Use the Cleanup macro first if you want to start again";
    ui.notifications.warn(warning);
}

async function setupInit() {
    const music_folder = "modules/jb2a_patreon/Library/Generic/Music_Notation";
    const folder = await FilePicker.browse(
        typeof ForgeVTT !== "undefined" && ForgeVTT.usingTheForge ? "forge-bazaar" : "data",
        music_folder
    );
    const files = folder.files;
    const animations = files.filter((file) => file.endsWith(".webm"));
    const tiles = files.filter((file) => file.endsWith(".webp"));
    const canvasCenterWidth = canvas.dimensions.width / 2;
    const canvasCenterHeight = canvas.dimensions.height / 2;

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

    let positionArray = [
        [-100, -1000],
        [100, -1000],
        [100, -400],
        [-100, -400],
        [-200, -1100],
        [200, -1100],
        [200, -300],
        [-200, -300],
        [-300, -1200],
        [300, -1200],
        [300, -200],
        [-300, -200],
        [-400, -900],
        [400, -900],
        [400, -500],
        [-400, -500],
        [-500, -1000],
        [500, -1000],
        [500, -400],
        [-500, -400],
        [-500, -1200],
        [500, -1200],
        [500, -200],
        [-500, -200],
        [-300, -800],
        [300, -800],
        [300, -600],
        [-300, -600],
    ];

    let tileData = [];
    let macroData = [];
    // assemble the tiles and macros with as much info as possible
    tiles.forEach((tile, i) => {
        const name = getNoteName(tile);
        // tile is the filename for the webp
        // i is the index
        const tData = {
            texture: {
                src: tile,
            },
            height: 100,
            width: 100,
            x: canvasCenterWidth + positionArray[i][0],
            y: canvasCenterWidth + positionArray[i][1],
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
                const tTile = Tagger.getByTag("${name}")[0];
                const scale = ((tTile.width + tTile.height)/2)/ 100;
                new Sequence()
                    .effect()
                        .atLocation(tTile, {offset: {x: 0, y: scale * -100}})
                        .file("${animation}")
                        .scale(scale)
                    .play()
                    

                //Class="secret means that this text/image will be only visible to the GM"
                const content = "<img src = ${tile} width = 100 /> ";
                const journal = game.journal.getName("${playerJournalName}");
                const jPage = journal.pages.getName("${playerJournalName}");
                //Here, we add text to the Journal Entry
                //journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
                jPage.update({"text.content": jPage.text.content + content});
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
            texture: {
                src: "icons/environment/traps/pressure-plate.webp",
            },
            height: 100,
            width: 100,
            x: canvasCenterWidth,
            y: canvasCenterHeight,
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
                            entity: {
                                id: "Macro." + game.macros.getName("JB2A - Pressure Plate").id,
                                name: "JB2A - Pressure Plate",
                            },
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
        const cTile = canvas.scene.tiles.find((t) => t.texture.src === tile);
        // assemble our needed changes
        const changes = {
            _id: cTile.id,
            "flags.monks-active-tiles.actions": [
                {
                    action: "runmacro",
                    delay: 0,
                    id: foundry.utils.randomID(16),
                    data: {
                        macroid: game.macros.getName(getNoteName(tile)).id,
                        runasgm: "gm",
                        entity: {
                            id: "Macro." + game.macros.getName(getNoteName(tile)).id,
                            name: tile,
                        },
                    },
                },
            ],
        };

        return changes;
    });

    await canvas.scene.updateEmbeddedDocuments("Tile", tileMacroData);
}
