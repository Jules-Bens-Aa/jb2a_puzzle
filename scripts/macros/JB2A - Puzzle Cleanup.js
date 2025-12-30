new foundry.applications.api.DialogV2({
  window: { title: "Cleanup the whole puzzle", icon: "fa-solid fa-circle-xmark" },
  content: `Are you sure? <br> <strong>WARNING: </strong> This is irreversible and will delete all tiles, walls, doors, macros and journal entries related to this puzzle. You can always use the Setup to start again however.`,
  buttons: [
    {
    action: "yes",
    label: "Yes"
    },
    {
    action: "cancel",
    label: "Cancel",
    default: true,
    callback: (event, button, dialog) => {
      // console.log("event and button", event, button,dialog)
      // console.log("button form elements",button.form.elements)
    }
    }
    ],
  position: {width:800},
  resizable: true,
  closeOnSubmit: true,
  submit: async (result) => {
    if ( result === "cancel" ) console.log("Cleanup cancelled, no action taken");
    else{
        // for macros, journals, and folders filter by our cleanup flag
        const macros = game.macros
            .filter((macro) => macro.flags?.jb2a_puzzle?.delete === true)
            .map((document) => document.id);
        const journals = game.journal
            .filter((journal) => journal.flags.jb2a_puzzle?.delete === true)
            .map((document) => document.id);
        const folders = game.folders
            .filter((folder) => folder.flags.jb2a_puzzle?.delete === true)
            .map((document) => document.id);
        const walls = Array.from(canvas.scene.walls)
            .filter((wall) => wall.flags.jb2a_puzzle?.delete === true)
            .map((document) => document.id);
        // for tiles we can just use tagger to filter
        const tiles = Tagger.getByTag("jb2a_puzzle").map((document) => document.id);

        // mass delete everything that matched
        await Macro.deleteDocuments(macros);
        await Folder.deleteDocuments(folders);
        await JournalEntry.deleteDocuments(journals);
        await canvas.scene.deleteEmbeddedDocuments("Tile", tiles);
        await canvas.scene.deleteEmbeddedDocuments("Wall", walls);
    }
  }
}).render({ force: true });