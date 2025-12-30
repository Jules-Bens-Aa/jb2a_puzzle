const music_folder = "modules/jb2a_patreon/Library/Generic/Music_Notation";
const folder = await FilePicker.browse(
    typeof ForgeVTT !== "undefined" && ForgeVTT.usingTheForge ? "forge-bazaar" : "data",
    music_folder
);
const files = folder.files;
const animations = files.filter((file) => file.endsWith(".webm"));
const tiles = files.filter((file) => file.endsWith(".webp"));

const pressurePlate = Tagger.getByTag("jb2a-puzzle-pressure-plate")[0];
const journalGM = game.journal.find(j => j.flags?.jb2a_puzzle?.name === "GMSolution")
const journalPlayer = game.journal.find(j => j.flags?.jb2a_puzzle?.name === "PlayerEntry")

let pageGM = journalGM.pages.find(j => j.flags?.jb2a_puzzle?.name === "GMSolution")
// if (pageGM === undefined) {
//     await journalGM.createEmbeddedDocuments("JournalEntryPage", [{ name: "GMSolution" }]);
// }

let pagePlayer = journalPlayer.pages.find(j => j.flags?.jb2a_puzzle?.name === "PlayerEntry")
// if (pagePlayer === undefined) {
//     await journalPlayer.createEmbeddedDocuments("JournalEntryPage", [{ name: "PlayerEntry" }]);
// }


const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const failureTriggerMacroID = game.settings.get("jb2a_puzzle", "failureTriggerMacro")
// console.log("macro id in settings", failureTriggerMacroID)
const failureTriggerMacro = game.macros.getName(failureTriggerMacroID) || 
game.macros.get(failureTriggerMacroID) ||
await fromUuid(failureTriggerMacroID)
// console.log("failure macro trigger", failureTriggerMacro)

// only execute if the pagePlayer has the same note-code as the solution
if (pageGM.text?.content?.length && pageGM?.text?.content === pagePlayer?.text?.content) {

    const successTriggerMacroID = game.settings.get("jb2a_puzzle", "successTriggerMacro")
    // console.log("macro id in settings", successTriggerMacroID)
    const successTriggerMacro = game.macros.getName(successTriggerMacroID) || 
    game.macros.get(successTriggerMacroID) ||
    await fromUuid(successTriggerMacroID)

    // console.log("success macro trigger", successTriggerMacro)
    const dataToSend = {
      pressurePlateTileID: tile.id,
      tokenID: token.id,
      args: args
    }
    await successTriggerMacro.execute(dataToSend)
    await newPattern()

    
} else if(pageGM.text?.content?.length && pagePlayer?.text?.content?.length && pageGM?.text?.content !== pagePlayer?.text?.content){
  // Pattern exists but answer is incorrect. Let's reset the pattern and execute the optional failure macro

    const failureMessage = game.settings.get("jb2a_puzzle", "failureMessage")

  if(failureTriggerMacro){
    const dataToSend = {
      pressurePlateTileID: tile.id,
      tokenID: token.id,
      args: args
    }
    await pagePlayer.update({ text: { content: `<h1>${failureMessage}</h1>` } });
    await failureTriggerMacro?.execute({isFailure: true})
    await wait(2000)
    await newPattern()
  }
  
} else{
  await failureTriggerMacro?.execute({isFailure: false})
  await newPattern()
}


async function newPattern(){
  // this executes regardless if we matched or not
  // at this point we reset the pattern
  await pagePlayer.update({ "text.content": `` });

  const difficulty = game.settings.get("jb2a_puzzle", "difficulty");
  // console.log("difficulty", difficulty)
  let chosenTiles = [];

  for(let i=0; i<difficulty; i++){
      chosenTiles.push(tiles[Math.floor(Math.random() * 28)])
  }


  let newContent = "";
  const cTile = pressurePlate;
  const scale = (cTile.width + cTile.height) / 2 / 100;

  // assemble new solution
  chosenTiles.forEach((tile) => {
      const content = `<img src = ${tile} width = 100 />`;
      //Here, we add text to the Journal Entry
      //journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
      newContent = newContent + content;
  });
  // update GMSolution journal with new note-code
  pageGM.update({ text: { content: newContent } });

  let chosenTileDocuments = []
  let tileNotes = []
  let seq = new Sequence();
  const delay = game.settings.get("jb2a_puzzle", "notesDelay")

  for(let i=0; i<difficulty; i++){
    //console.log("tile", cTile)
    //console.log(`tileMacros and notes - ${i}`, chosenTileDocuments, tileNotes)
    //console.log("chosen tile", chosenTiles[i])
    chosenTileDocuments.push(canvas.scene.tiles.find(t => t.texture.src === chosenTiles[i]))
    tileNotes.push(chosenTileDocuments[i].flags["jb2a_puzzle"]["customArgs"]["note"])
    //console.log("tile macro i", chosenTileDocuments, tileNotes)
    seq.sound()
      .file(tileNotes[i])
    .effect()
          .atLocation(cTile, {offset: {x: 0, y: scale * -100}})
          .file(animations[tiles.indexOf(chosenTiles[i])])
          .scale(scale)
    .wait(delay)
  }


  await seq.play()
}