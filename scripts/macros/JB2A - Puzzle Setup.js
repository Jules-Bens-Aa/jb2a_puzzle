// check tiles
const hasTileFlag = !!Tagger.getByTag("jb2a_puzzle").length;
// console.log("!hasTileFlag", !hasTileFlag)

//check journal entries
const hasJournalFlag = !!Array.from(game.journal).find((j) => j?.flags?.jb2a_puzzle?.delete === true);
// console.log("!hasJournalFlag", !hasJournalFlag)
if (!hasTileFlag && !hasJournalFlag) {
    await setupInit();
} else {
    const warning =
        "JB2A_Puzzle Warning : The puzzle is already setup it seems! Use the Cleanup option first if you need to setup again";
    return ui.notifications.warn(warning);
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
    const sceneWidth = canvas.dimensions.sceneWidth;
    const sceneHeight = canvas.dimensions.sceneHeight;
    const evenColumns = (sceneWidth/gridSize)%2
    const evenRows = (sceneHeight/gridSize)%2
    const position = await Sequencer.Crosshair.show({
        gridHighlight: true,
        snap: {position: 1}
    })
    // console.log("even columns, rows", evenColumns, evenRows)
    const adjustedCenterWidth = position.x - (gridSize/2)
    const adjustedCenterHeight = position.y - (gridSize/2)
    const playerJournalName = "PlayerEntry";
    const gmJournalName = "GMSolution";

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
            "flags.jb2a_puzzle.name": playerJournalName,
            "ownership.default": CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
        },
        {
            name: gmJournalName,
            folder: jb2aFolder[0].id,
            "flags.jb2a_puzzle.delete": true,
            "flags.jb2a_puzzle.name": gmJournalName
        },
    ]);

    const journalGM = game.journal.find(j => j.flags?.jb2a_puzzle?.name === gmJournalName)
    const journalPlayer = game.journal.find(j => j.flags?.jb2a_puzzle?.name === playerJournalName)

    let pageGM = journalGM.pages.find(j => j.flags?.jb2a_puzzle?.name === gmJournalName) ?? undefined;
    if (pageGM === undefined) {
        await journalGM.createEmbeddedDocuments("JournalEntryPage", [{ name: gmJournalName, "flags.jb2a_puzzle.name": gmJournalName }]);
    }

    let pagePlayer = journalPlayer.pages.find(j => j.flags?.jb2a_puzzle?.name === playerJournalName) ?? undefined;
    if (pagePlayer === undefined) {
        await journalPlayer.createEmbeddedDocuments("JournalEntryPage", [{ name: playerJournalName, "flags.jb2a_puzzle.name": playerJournalName, "ownership.default": CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER }]);
    }

    pageGM = journalGM.pages.find(j => j.flags?.jb2a_puzzle?.name === gmJournalName)
    pagePlayer = journalPlayer.pages.find(j => j.flags?.jb2a_puzzle?.name === playerJournalName)

    let positionArray = [

        [-gridSize*3, -gridSize*1],
        [gridSize*3, -gridSize*1],
        [gridSize*3, gridSize*1],
        [-gridSize*3, gridSize*1],

        [-gridSize*4, -gridSize*2],
        [gridSize*4, -gridSize*2],
        [gridSize*4, gridSize*2],
        [-gridSize*4, gridSize*2],

        [-gridSize*5, -gridSize*3],
        [gridSize*5, -gridSize*3],
        [gridSize*5, gridSize*3],
        [-gridSize*5, gridSize*3],

        [-gridSize*5, -gridSize*5],
        [gridSize*5, -gridSize*5],
        [gridSize*5, gridSize*5],
        [-gridSize*5, gridSize*5],

        [-gridSize*3, -gridSize*5],
        [gridSize*3, -gridSize*5],
        [gridSize*3, gridSize*5],
        [-gridSize*3, gridSize*5],

        [-gridSize*2, -gridSize*4],
        [gridSize*2, -gridSize*4],
        [gridSize*2, gridSize*4],
        [-gridSize*2, gridSize*4],

        [-gridSize, -gridSize*3],
        [gridSize, -gridSize*3],
        [gridSize, gridSize*3],
        [-gridSize, gridSize*3]
    ];

    let wallPositions = [
        [-gridSize*3, gridSize*2, -gridSize*3, -gridSize*1],
        [ gridSize*4, gridSize*2,  gridSize*4, -gridSize*1],

        [-gridSize*3, -gridSize*1, -gridSize*4, -gridSize*1],
        [-gridSize*4, -gridSize*1, -gridSize*4, -gridSize*2],
        [-gridSize*4, -gridSize*2, -gridSize*5, -gridSize*2],
        [-gridSize*5, -gridSize*2, -gridSize*5, -gridSize*5],
        [-gridSize*5, -gridSize*5, -gridSize*2, -gridSize*5],
        [-gridSize*2, -gridSize*5, -gridSize*2, -gridSize*4],
        [-gridSize*2, -gridSize*4, -gridSize*1, -gridSize*4],
        [-gridSize*1, -gridSize*4, -gridSize*1, -gridSize*3],
        [-gridSize*1, -gridSize*3, -gridSize*0, -gridSize*3],


        [ gridSize*4, -gridSize*1,  gridSize*5, -gridSize*1],
        [ gridSize*5, -gridSize*1,  gridSize*5, -gridSize*2],
        [ gridSize*5, -gridSize*2,  gridSize*6, -gridSize*2],
        [ gridSize*6, -gridSize*2,  gridSize*6, -gridSize*5],
        [ gridSize*6, -gridSize*5,  gridSize*3, -gridSize*5],
        [ gridSize*3, -gridSize*5,  gridSize*3, -gridSize*4],
        [ gridSize*3, -gridSize*4,  gridSize*2, -gridSize*4],
        [ gridSize*2, -gridSize*4,  gridSize*2, -gridSize*3],
        [ gridSize*2, -gridSize*3,  gridSize*1, -gridSize*3],

        [-gridSize*3,  gridSize*2, -gridSize*4,  gridSize*2],
        [-gridSize*4,  gridSize*2, -gridSize*4,  gridSize*3],
        [-gridSize*4,  gridSize*3, -gridSize*5,  gridSize*3],
        [-gridSize*5,  gridSize*3, -gridSize*5,  gridSize*6],
        [-gridSize*5,  gridSize*6, -gridSize*2,  gridSize*6],
        [-gridSize*2,  gridSize*6, -gridSize*2,  gridSize*5],
        [-gridSize*2,  gridSize*5, -gridSize*1,  gridSize*5],
        [-gridSize*1,  gridSize*5, -gridSize*1,  gridSize*4],
        [-gridSize*1,  gridSize*4, -gridSize*0,  gridSize*4],

        [ gridSize*4,  gridSize*2,  gridSize*5,  gridSize*2],
        [ gridSize*5,  gridSize*2,  gridSize*5,  gridSize*3],
        [ gridSize*5,  gridSize*3,  gridSize*6,  gridSize*3],
        [ gridSize*6,  gridSize*3,  gridSize*6,  gridSize*6],
        [ gridSize*6,  gridSize*6,  gridSize*3,  gridSize*6],
        [ gridSize*3,  gridSize*6,  gridSize*3,  gridSize*5],
        [ gridSize*3,  gridSize*5,  gridSize*2,  gridSize*5],
        [ gridSize*2,  gridSize*5,  gridSize*2,  gridSize*4],
        [ gridSize*2,  gridSize*4,  gridSize*1,  gridSize*4],
    ]

    let doorData = game.settings.get("jb2a_puzzle", "wallCreation") ? wallPositions.map(wp => {
      return {
        c: [adjustedCenterWidth + wp[0], adjustedCenterHeight + wp[1], adjustedCenterWidth + wp[2], adjustedCenterHeight + wp[3]],
        "flags.jb2a_puzzle.delete": true
      }
    }) :
    [];

    doorData.push({
        c: [adjustedCenterWidth + gridSize*0, adjustedCenterHeight + gridSize*-3, adjustedCenterWidth + gridSize*1, adjustedCenterHeight + gridSize*-3],
        door: 2,
        doorSound: "stoneRocky",
        animation: {
            direction: 1,
            double: false,
            duration: 750,
            flip: false,
            strength: 1,
            type: "ascend",
            texture: "canvas/doors/small/Door_Stone_Earthy_B1_1x1.webp"

        },
        "flags.jb2a_puzzle.delete": true,
        "flags.tagger.tags": ["jb2a-door"]
    },
    {
        c: [adjustedCenterWidth + gridSize*0, adjustedCenterHeight + gridSize*4, adjustedCenterWidth + gridSize*1, adjustedCenterHeight + gridSize*4],
        door: 2,
        doorSound: "stoneRocky",
        animation: {
            direction: 1,
            double: false,
            duration: 750,
            flip: false,
            strength: 1,
            type: "ascend",
            texture: "canvas/doors/small/Door_Stone_Earthy_B1_1x1.webp"
        },
        "flags.jb2a_puzzle.delete": true,
        "flags.tagger.tags": ["jb2a-door"]
    })
    await canvas.scene.createEmbeddedDocuments("Wall", doorData)

    const musicNotesPathPrefix = "modules/jb2a_puzzle/assets/Music/SoundNotes/"
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

    let musicScaleString = game.settings.get("jb2a_puzzle", "musicScale").length ? game.settings.get("jb2a_puzzle", "musicScale") : `C,D,E,F,G,A,B`
    // console.log("musicScaleString", musicScaleString)
    let musicScale = musicScaleString.split(",");

    musicScale = musicScale.map(n => notes[n.trim()])
    // console.log("musicScale", musicScale)
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    let note;
    let animation;
    let tileData = [];
    // assemble the tiles and macros with as much info as possible
    for(i=0; i<tiles.length; i++){
        let tile = tiles[i]
        // console.log(`tile ${i}`, tile)
        //const randInt = getRandomInt(5)
        const name = getNoteName(tile);
        animation = animations[i];
        // console.log("i modulo", i%7)
        let stepIndex = steps((i+1), 4)
        // console.log("stepIndex", stepIndex)
        note = musicScale[stepIndex][i%4];
        // console.log("note", note)
        // tile is the filename for the webp
        // i is the index
        const tData = {
            texture: {
                src: tile,
            },
            height: gridSize,
            width: gridSize,
            x: adjustedCenterWidth + positionArray[i][0],
            y: adjustedCenterHeight + positionArray[i][1],
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
            "flags.jb2a_puzzle.customArgs": {name: getNoteName(tile), note: note ?? null, animation: animation ?? null, tile: tile ?? null, playerJournalName: playerJournalName ?? null}
        };

        tileData.push(tData);
    };
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
            x: adjustedCenterWidth,
            y: adjustedCenterHeight,
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
                            macroid: game.macros.find(j => j.flags?.jb2a_puzzle?.name === "JB2A - Pressure Plate")?.id,
                            runasgm: "gm",
                            entity: {
                                id: "Macro." + game.macros.find(j => j.flags?.jb2a_puzzle?.name === "JB2A - Pressure Plate")?.id,
                                name: "JB2A - Pressure Plate",
                            }
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


    const tileMacroData = tiles.map((tile, i) => {
        // this is the actual tile document's id
        const cTile = canvas.scene.tiles.find((t) => t.texture.src === tile);
        // console.log("cTile", cTile)
        // assemble our needed changes
        const changes = {
            _id: cTile.id,
            "flags.monks-active-tiles.actions": [
                {
                    action: "runmacro",
                    delay: 0,
                    id: foundry.utils.randomID(16),
                    data: {
                        macroid: game.macros.find(j => j.flags?.jb2a_puzzle?.name === "JB2A - NoteTile")?.id,
                        runasgm: "gm",
                        entity: {
                            id: "Macro." + game.macros.find(j => j.flags?.jb2a_puzzle?.name === "JB2A - NoteTile")?.id,
                            name: tile,
                        },
                    },
                },
            ],
        };

        return changes;
    });

    await canvas.scene.updateEmbeddedDocuments("Tile", tileMacroData);

    const pressurePlateMacro = game.macros.find(j => j.flags?.jb2a_puzzle?.name === "JB2A - Pressure Plate") ?? null;
    await pressurePlateMacro.execute()
}

function steps(acc, perStep) {
  // acc needs to start at 1, i.e. the index of the for loop should be defined to start at 1
  return Math.floor((acc + ((perStep-3)+2)) / ((perStep-3)+3)) - 1;
}
