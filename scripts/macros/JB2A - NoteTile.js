if(!tile){
  return ui.notifications.warn("This macro can only work when triggered via monk's active tile triggers. Try stepping on the tile with a player character")
}
const customArgs = tile?.flags?.["jb2a_puzzle"]?.["customArgs"]
// console.log("customArgs", customArgs)
const name = customArgs.name
const note = customArgs.note
const animation = customArgs.animation
const tileImg = customArgs.tile
const playerJournalName = customArgs.playerJournalName

const tTile = Tagger.getByTag(name)[0];
const scale = ((tTile.width + tTile.height)/2)/ 100;
new Sequence()
    .sound()
        .file(note)
    .effect()
        .atLocation(tTile, {offset: {x: 0, y: scale * -100}})
        .file(animation)
        .scale(scale)
    .play()
    
const content = `<img src = ${tileImg} width = 100 /> `;
const journal = game.journal.find(j => j.flags?.jb2a_puzzle?.name === `${playerJournalName}`);
const jPage = journal.pages.find(j => j.flags?.jb2a_puzzle?.name === `${playerJournalName}`);
//Here, we add text to the Journal Entry
//journal.data.content is what's already in the Journal Entry and we add what we defined just above as "content"
jPage.update({"text.content": jPage.text.content + content});