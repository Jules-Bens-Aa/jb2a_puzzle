// check tiles
const hasTileFlag = !!Tagger.getByTag("jb2a_puzzle").length;

// check macros
const hasMacroFlag = !!Array.from(game.macros).find((m) => m?.flags?.jb2a_puzzle?.delete === true);

//check journal entries
const hasJournalFlag = !!Array.from(game.journal).find((j) => j?.flags?.jb2a_puzzle?.delete === true);

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
    const gridSize = canvas.grid.size;

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
        [-gridSize, -gridSize*10],
        [gridSize, -gridSize*10],
        [gridSize, -gridSize*4],
        [-gridSize, -gridSize*4],
        [-gridSize*2, -gridSize*11],
        [gridSize*2, -gridSize*11],
        [gridSize*2, -gridSize*3],
        [-gridSize*2, -gridSize*3],
        [-gridSize*3, -gridSize*12],
        [gridSize*3, -gridSize*12],
        [gridSize*3, -gridSize*2],
        [-gridSize*3, -gridSize*2],
        [-gridSize*4, -gridSize*9],
        [gridSize*4, -gridSize*9],
        [gridSize*4, -gridSize*5],
        [-gridSize*4, -gridSize*5],
        [-gridSize*5, -gridSize*10],
        [gridSize*5, -gridSize*10],
        [gridSize*5, -gridSize*4],
        [-gridSize*5, -gridSize*4],
        [-gridSize*5, -gridSize*12],
        [gridSize*5, -gridSize*12],
        [gridSize*5, -gridSize*2],
        [-gridSize*5, -gridSize*2],
        [-gridSize*3, -gridSize*8],
        [gridSize*3, -gridSize*8],
        [gridSize*3, -gridSize*6],
        [-gridSize*3, -gridSize*6],
    ];

    // let positionArray = [
    //     [-100, -1000],
    //     [100, -1000],
    //     [100, -400],
    //     [-100, -400],
    //     [-200, -1100],
    //     [200, -1100],
    //     [200, -300],
    //     [-200, -300],
    //     [-300, -1200],
    //     [300, -1200],
    //     [300, -200],
    //     [-300, -200],
    //     [-400, -900],
    //     [400, -900],
    //     [400, -500],
    //     [-400, -500],
    //     [-500, -1000],
    //     [500, -1000],
    //     [500, -400],
    //     [-500, -400],
    //     [-500, -1200],
    //     [500, -1200],
    //     [500, -200],
    //     [-500, -200],
    //     [-300, -800],
    //     [300, -800],
    //     [300, -600],
    //     [-300, -600],
    // ];
    const musicNotesPathPrefix = "modules/jb2a-cipher/assets/Music/SoundNotes/"
    let notes = {};
    notes["A"]= [
        `${musicNotesPathPrefix}A2.ogg`,
        `${musicNotesPathPrefix}A3.ogg`,
        `${musicNotesPathPrefix}A4.ogg`,
        `${musicNotesPathPrefix}A5.ogg`,
        `${musicNotesPathPrefix}A6.ogg`
    ],
    notes["Bb"]= [
        `${musicNotesPathPrefix}Bb2.ogg`,
        `${musicNotesPathPrefix}Bb3.ogg`,
        `${musicNotesPathPrefix}Bb4.ogg`,
        `${musicNotesPathPrefix}Bb5.ogg`,
        `${musicNotesPathPrefix}Bb6.ogg`
    ],
    notes["B"]= [
        `${musicNotesPathPrefix}B2.ogg`,
        `${musicNotesPathPrefix}B3.ogg`,
        `${musicNotesPathPrefix}B4.ogg`,
        `${musicNotesPathPrefix}B5.ogg`,
        `${musicNotesPathPrefix}B6.ogg`
    ],
    notes["C"]= [
        `${musicNotesPathPrefix}C2.ogg`,
        `${musicNotesPathPrefix}C3.ogg`,
        `${musicNotesPathPrefix}C4.ogg`,
        `${musicNotesPathPrefix}C5.ogg`,
        `${musicNotesPathPrefix}C6.ogg`
    ],
    notes["Db"]= [
        `${musicNotesPathPrefix}Db2.ogg`,
        `${musicNotesPathPrefix}Db3.ogg`,
        `${musicNotesPathPrefix}Db4.ogg`,
        `${musicNotesPathPrefix}Db5.ogg`,
        `${musicNotesPathPrefix}Db6.ogg`
    ],
    notes["D"]= [
        `${musicNotesPathPrefix}D2.ogg`,
        `${musicNotesPathPrefix}D3.ogg`,
        `${musicNotesPathPrefix}D4.ogg`,
        `${musicNotesPathPrefix}D5.ogg`,
        `${musicNotesPathPrefix}D6.ogg`
    ],
    notes["Eb"]= [
        `${musicNotesPathPrefix}Eb2.ogg`,
        `${musicNotesPathPrefix}Eb3.ogg`,
        `${musicNotesPathPrefix}Eb4.ogg`,
        `${musicNotesPathPrefix}Eb5.ogg`,
        `${musicNotesPathPrefix}Eb6.ogg`
    ],
    notes["E"]= [
        `${musicNotesPathPrefix}E2.ogg`,
        `${musicNotesPathPrefix}E3.ogg`,
        `${musicNotesPathPrefix}E4.ogg`,
        `${musicNotesPathPrefix}E5.ogg`,
        `${musicNotesPathPrefix}E6.ogg`
    ],
    notes["F"]= [
        `${musicNotesPathPrefix}F2.ogg`,
        `${musicNotesPathPrefix}F3.ogg`,
        `${musicNotesPathPrefix}F4.ogg`,
        `${musicNotesPathPrefix}F5.ogg`,
        `${musicNotesPathPrefix}F6.ogg`
    ],
    notes["Gb"]= [
        `${musicNotesPathPrefix}Gb2.ogg`,
        `${musicNotesPathPrefix}Gb3.ogg`,
        `${musicNotesPathPrefix}Gb4.ogg`,
        `${musicNotesPathPrefix}Gb5.ogg`,
        `${musicNotesPathPrefix}Gb6.ogg`
    ],
    notes["G"]= [
        `${musicNotesPathPrefix}G2.ogg`,
        `${musicNotesPathPrefix}G3.ogg`,
        `${musicNotesPathPrefix}G4.ogg`,
        `${musicNotesPathPrefix}G5.ogg`,
        `${musicNotesPathPrefix}G6.ogg`
    ],
    notes["Ab"]= [
        `${musicNotesPathPrefix}Ab2.ogg`,
        `${musicNotesPathPrefix}Ab3.ogg`,
        `${musicNotesPathPrefix}Ab4.ogg`,
        `${musicNotesPathPrefix}Ab5.ogg`,
        `${musicNotesPathPrefix}Ab6.ogg`
    ]

    // let musicScale = ["C", "D", "Eb", "F", "G", "Ab", "B"]
    let musicScale = ["C", "D", "E", "F", "G", "A", "B"]
    musicScale = musicScale.map(n => notes[n])

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    let tileData = [];
    let macroData = [];
    // assemble the tiles and macros with as much info as possible
    tiles.forEach((tile, i) => {
        const randInt = getRandomInt(5)
        const name = getNoteName(tile);
        // tile is the filename for the webp
        // i is the index
        const tData = {
            texture: {
                src: tile,
            },
            height: gridSize,
            width: gridSize,
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
        const note = musicScale[i%7][randInt];
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
                    .sound()
                        .file("${note}")
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
            "flags.jb2a_puzzle.note": note,
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
            height: gridSize,
            width: gridSize,
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
