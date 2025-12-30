
import jb2aPuzzleSettings, {MODULE_NAME} from "./settings.js";


Hooks.once("init", async() => {
  await jb2aPuzzleSettings()
});

class puzzleFormApplication extends FormApplication {
    constructor() {
      super();
    }
  
    async html() {
      return await popupHTML();
    }
  
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["form"],
        popOut: true,
        template: `modules/${MODULE_NAME}/form/Puzzle.html`,
        id: "puzzleMenu",
        title: "Menu",
      });
    }
  
    async getData() {
      // Send data to the template
      return { messageSetup: await this.html() };
    } 

    async _updateObject(event) {
      // $(".jb2a-puzzle-update-buttons").attr("disabled", true);
      if (event.submitter.name === "guide") {
        let url = "https://jules-bens-aa.github.io/jb2a-wiki/other-projects/music-puzzle";
        window.open(url, '_blank').focus();
      }
      if(event.submitter.name === "setup"){

          new foundry.applications.api.DialogV2({
          window: { title: "Puzzle Setup", icon: "fa-solid fa-wrench" },
          content: `<p>This will prompt you to choose where to create the puzzle "room"</p>`,
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
            if ( result === "cancel" ) console.log("Setup cancelled, no action taken");
            else{
              // check tiles
              const hasTileFlag = !!Tagger.getByTag("jb2a_puzzle").length;
              // console.log("!hasTileFlag", !hasTileFlag)

              //check journal entries
              const hasJournalFlag = !!Array.from(game.journal).find((j) => j?.flags?.jb2a_puzzle?.delete === true);
              // console.log("!hasJournalFlag", !hasJournalFlag)
              if (!hasTileFlag && !hasJournalFlag) {
                const key = "jb2a_puzzle.jb2a-puzzle-macros";
                const pack = game.packs.get(key);

                await pack.importAll({folderName: "JB2A - Puzzle - Macros"})
                let folder = game.folders.find(f => f.name === "JB2A - Puzzle - Macros")
                await folder.update({"flags.jb2a_puzzle.delete": true})
                let macros = game.macros.filter(m => m.folder?.name === "JB2A - Puzzle - Macros") ?? [];

                for(let i=0; i<macros.length; i++){
                  await macros[i].update({"flags.jb2a_puzzle.delete": true, "flags.jb2a_puzzle.name": macros[i].name})
                }
                let setupMacro = Array.from(game.macros).find(m => m.flags?.["jb2a_puzzle"]?.name === "JB2A - Puzzle Setup")
                // console.log("setup macro from init", setupMacro)

                // WIP: add dialog box before the crosshair placement and implement right-click cancel
                await setupMacro.execute()
              } else {
                  const warning =
                      "JB2A_Puzzle Warning : The puzzle is already setup it seems! Use the Cleanup option first if you need to setup again";
                  return ui.notifications.warn(warning);
              }
            }
          }
          }).render({ force: true });
      }
      if(event.submitter.name === "cleanup"){
        const cleanupMacro = Array.from(game.macros).find(m => m.flags?.["jb2a_puzzle"]?.name === "JB2A - Puzzle Cleanup") ?? null;
        if(cleanupMacro){
          await cleanupMacro.execute()
        }
      } 
    }
  
}
  
window.puzzleFormApplication = puzzleFormApplication;

async function popupHTML(){
  let html = `
  <div><h3>JB2A - Music Puzzle Menu</h3></div>
    <ul>
    <li>Click <strong><em>Guide</em></strong> to open the wiki page in another browser tab</li>
    <li>Click <strong><em>Setup</em></strong> to place the puzzle on the canvas</li>
    <li>Click <strong><em>Cleanup</em></strong> to remove all trace of the puzzle from the world</li>
    </ul>
  `

  return html
}