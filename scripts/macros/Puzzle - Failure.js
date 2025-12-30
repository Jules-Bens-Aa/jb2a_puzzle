// console.log("scope", scope)

if(scope.isFailure){
  // scope.isFailure means players have attempted to add notes but the pattern does not correspond.
  // This is where you can add a sound, spawn some creatures...etc

  // For example: 




    // Let's retrieve the actor from the settings.
    const actorSpawnSetting = game.settings.get("jb2a_puzzle", "actorSpawnSetting");

    const actorToSpawn = game.actors?.getName(actorSpawnSetting) || game.actors?.get(actorSpawnSetting) || await fromUuid(actorSpawnSetting) || "";
    // console.log("actor to spawn", actorToSpawn)
    if(actorToSpawn === undefined){
      return ui.notifications.warn(`No actor found in your list of imported actors with this name or ID`);
    } else if(actorToSpawn === ""){
      return console.log("Skipped Actor to spawn")
    }


  new foundry.applications.api.DialogV2({
  window: { title: "Spawn Actor Prompt", icon: "fa-solid fa-address-card" },
  content: `Do you want to spawn ${actorToSpawn.name}? <br> After selecting yes, you will be able to choose where to spawn this creature. You'll still be able to cancel it with a right click`,
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
    if ( result === "cancel" ) console.log("Spawning cancelled, no action taken");
    else{
      const position = await Sequencer.Crosshair.show()
      if(!position){ return; }
      const tokenWidth = actorToSpawn.prototypeToken.width;
      const tokenHeight = actorToSpawn.prototypeToken.height;
      const tokenDoc = await actorToSpawn.getTokenDocument({
        x: position.x-((tokenWidth * canvas.grid.size)/2), 
        y: position.y-((tokenHeight * canvas.grid.size)/2),
        alpha: 0
      });
      // console.log("actor", actorToSpawn)
      // console.log("tokenDoc", tokenDoc)

      const [summoned] = await canvas.scene.createEmbeddedDocuments('Token', [tokenDoc])

      const hasPSFXPatreon = !!game.modules.get("psfx-patreon") && game.modules.get("psfx-patreon").active;
      // console.log("Is PSFX Patreon Installed and Active?", hasPSFXPatreon)

      const hasPSFX = !!game.modules.get("psfx") && game.modules.get("psfx").active;

      let seq = new Sequence();

      if(hasPSFXPatreon){
        seq.sound()
        .file("psfx.impacts.magicaleffects.generic.002.003.0")
        .waitUntilFinished(-3000);
      }
      if(hasPSFX){
        seq.sound()
        .file("psfx.impacts.magicaleffects.generic.002.001.0")
        .waitUntilFinished(-3000);
      }

      seq.effect()
          .file("jb2a.smoke.puff.ring.01.multicolored.0")
          .atLocation(position)
          .scaleToObject(5)
        .animation()
          .on(summoned)
          .opacity(1)
          .fadeIn(250)
      await seq.play()
    }
  }
}).render({ force: true });
  
} else{
  // Here, players have not entered any notes, just pushed the pressure plate, which resets the pattern.
  // Here is an example of how to ramp up the difficulty, adding one more note to the pattern. Remove /* and */ to activate 

  /*
  const currentDifficulty = game.settings.get("jb2a_puzzle", "difficulty");
  await game.settings.set("jb2a_puzzle", "difficulty", currentDifficulty + 1)
  */

  // Here, we check for doors having the tag "jb2a-door" and close them.
  const doors = Tagger.getByTag("jb2a-door");
  if(!doors.length && game.settings.get("jb2a_puzzle")){
    return ui.notifications.warn(`Couldn't find a door with the tag "jb2a-door"`);
  }
  let doorUpdates = doors.map((door) => ({ _id: door.id, ds: 0 }));
  await canvas.scene.updateEmbeddedDocuments("Wall", doorUpdates);


}