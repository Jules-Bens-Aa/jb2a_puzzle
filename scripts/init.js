
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
    }
  
}
  
window.puzzleFormApplication = puzzleFormApplication;

async function popupHTML(){
  let html = `
  <div><h3>JB2A - Puzzle Menu</h3></div>
  <p>Click this button to open the instruction guide on our Wiki in a new tab</p>
  `

  return html
}