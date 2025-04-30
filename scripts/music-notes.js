const notes = {};
export async function buildNotes(
    musicNotesPathPrefix = "modules/jb2a-cipher/assets/Music/SoundNotes/"

) {
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
}
export { notes }