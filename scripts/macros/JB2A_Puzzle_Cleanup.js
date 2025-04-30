// for macros, journals, and folders filter by our cleanup flag
const macros = game.macros
    .filter((macro) => macro.flags.jb2a_puzzle?.delete === true)
    .map((document) => document.id);
const journals = game.journal
    .filter((journal) => journal.flags.jb2a_puzzle?.delete === true)
    .map((document) => document.id);
const folders = game.folders
    .filter((folder) => folder.flags.jb2a_puzzle?.delete === true)
    .map((document) => document.id);
// for tiles we can just use tagger to filter
const tiles = Tagger.getByTag("jb2a_puzzle").map((document) => document.id);
// mass delete everything that matched
await Macro.deleteDocuments(macros);
await Folder.deleteDocuments(folders);
await JournalEntry.deleteDocuments(journals);
await canvas.scene.deleteEmbeddedDocuments("Tile", tiles);
