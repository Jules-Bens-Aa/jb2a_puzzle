export const MODULE_NAME = "jb2a_puzzle";
export default async function jb2aPuzzleSettings() {

  game.settings.registerMenu(MODULE_NAME, "puzzleGuide", {
    name: "Setup / Guide",
    icon: "fa-solid fa-wrench",
    type: puzzleFormApplication,
    restricted: true
  });

  game.settings.register(MODULE_NAME, 'wallCreation', {
  name: 'Wall creation',
  hint: `Switch off if you just want doors and no "room walls". Changing this option only takes effect if the puzzle is reset (Cleanup and Setup)`,
  config: true,
  type: Boolean,
  default: true,
  requiresReload: true
  });

  game.settings.register(MODULE_NAME, 'musicScale', {
  name: 'Music scale',
  hint: `An array of 7 notes defining the musical scale. Example: For a C harmonic minor scale, use "C,D,Eb,F,G,Ab,B". Changing this option only takes effect if the puzzle is reset (Cleanup and Setup)`,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: `C,D,E,F,G,A,B`,
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });

  game.settings.register(MODULE_NAME, 'difficulty', {
  name: 'Difficulty',
  hint: 'How many notes in the pattern do you want?',
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: Number,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: 3,
  onChange: value => { // value is the new value of the setting
    // console.log(value)
  },
  requiresReload: false, // true if you want to prompt the user to reload
  range: {
    min: 1,
    step: 1,
    max: 12
  }
  });
  
  game.settings.register(MODULE_NAME, 'notesDelay', {
  name: 'Delay between notes',
  hint: 'In milliseconds. The shorter this delay, the harder it will be to memorize the pattern! Careful however, the animations start to overlap when below 500ms',
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: Number,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: 1000,
  onChange: value => { // value is the new value of the setting
    // console.log(value)
  },
  requiresReload: false, // true if you want to prompt the user to reload
  /** Number settings can have a range slider, with an optional step property */
  range: {
    min: 250,
    step: 10,
    max: 3000
  }
  });

  game.settings.register(MODULE_NAME, 'resetPattern', {
    name: 'Reset pattern after success',
    hint: `When the first pattern is solved, do you want to reset the puzzle automatically, after a countdown? (This is configured in the Success macro)`,
    config: true,
    type: Boolean,
    default: true,
    requiresReload: false
  });

  game.settings.register(MODULE_NAME, 'countdown', {
  name: 'Countdown',
  hint: 'Delay before the puzzle is reset (only relevant when reset pattern checkbox above is ON)',
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: Number,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: 5,
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false, // true if you want to prompt the user to reload
  range: {
    min: 1,
    step: 1,
    max: 30
  }
  });



  game.settings.register(MODULE_NAME, 'successMessage', {
  name: 'Custom success message',
  hint: `A quick message that appears in the players' journal when they solve the puzzle`,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: "Congratulations!",
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });

  game.settings.register(MODULE_NAME, 'failureMessage', {
  name: 'Custom failure message',
  hint: `A quick message that appears in the players' journal when they fail to solve the puzzle`,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: "Your answer is incorrect! Try again.",
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });

  game.settings.register(MODULE_NAME, 'successTriggerMacro', {
  name: 'Success macro',
  hint: `Enter the name or ID of an optional macro you want to trigger when the puzzle is solved.`,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: false,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: "Puzzle - Success",
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });


  game.settings.register(MODULE_NAME, 'failureTriggerMacro', {
  name: 'Failure Macro',
  hint: `Enter the name or ID of an optional macro you want to trigger when the proposed pattern is incorrect.`,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: false,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: "Puzzle - Failure",
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });



  game.settings.register(MODULE_NAME, 'actorSpawnSetting', {
  name: 'Optional Actor to spawn on Failure',
  hint: `Leave empty if you don't want this feature. Otherwise, enter the name, ID or Uuid of an actor you'd like to spawn in case of failure. `,
  scope: 'world',     // "world" = sync to db, "client" = local storage
  config: true,       // false if you dont want it to show in module config
  type: String,       // You want the primitive class, e.g. Number, not the name of the class as a string
  default: "",
  onChange: value => { // value is the new value of the setting
    //console.log(value)
  },
  requiresReload: false
  });
};


