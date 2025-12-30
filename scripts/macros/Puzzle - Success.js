// console.log("available arguments to play with: ", scope)


    const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const successMessage = game.settings.get("jb2a_puzzle", "successMessage")
    const journalGM = game.journal.find(j => j.flags?.jb2a_puzzle?.name === "GMSolution")
    const journalPlayer = game.journal.find(j => j.flags?.jb2a_puzzle?.name === "PlayerEntry")
    const  pageGM = journalGM.pages.find(j => j.flags?.jb2a_puzzle?.name === "GMSolution")
    // console.log("journal GM", journalGM)
    // console.log("journal Player", journalPlayer)
    // console.log("page GM", pageGM)

    // Open the doors
    // IMPORTANT: You must assign the doors the tag below for them to be toggled. By default it's "jb2a-door"
    const doors = Tagger.getByTag("jb2a-door") ?? null;
    if(!doors.length){
      return ui.notifications.warn(`Couldn't find a door with the tag "jb2a-door"`);
    }
    let doorUpdates = doors.map((door) => ({ _id: door.id, ds: 1 }));
    await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);


let pagePlayer = journalPlayer.pages.find(j => j.flags.jb2a_puzzle.name === "PlayerEntry")

        // Should be all we need to reset the puzzle
    if(game.settings.get("jb2a_puzzle", "resetPattern")){

        const countdown= game.settings.get("jb2a_puzzle", "countdown")
        await pagePlayer.update({ text: { content: `<h1>${successMessage}<br> You have ${countdown} seconds to exit the chamber</h1>` } });
        await wait(2500)

        //This is the countdown timer section
        for(let i=countdown; i>-1; i--){
            await wait(1000)
            await pagePlayer.update({ text: { content: `<h1>${i}</h1>` } });
        }
        

        await pagePlayer.update({ text: { content: ` ` } });
        // Close the doors
        doorUpdates = doors.map((door) => ({ _id: door.id, ds: 0 }));
        await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);
        // await newPattern()
    } else{
      await pagePlayer.update({ text: { content: `<h1>${successMessage}</h1>` } });
    }