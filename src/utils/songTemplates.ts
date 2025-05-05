
import { SongData } from "../types/song";

// Create an initial empty song structure
export const createEmptySong = (): SongData => {
  return {
    title: "Nueva Canción",
    artist: "",
    key: "C",
    tempo: "",
    timeSignature: "4/4",
    sectionSequence: ["I", "V1", "C1", "V2", "C1", "F"],
    sections: {
      "I": {
        type: "I",
        title: "INTRO",
        lines: [{ chords: "", lyrics: "" }]
      },
      "V1": {
        type: "V1",
        title: "VERSO 1",
        lines: [{ chords: "", lyrics: "" }]
      },
      "V2": {
        type: "V2",
        title: "VERSO 2",
        lines: [{ chords: "", lyrics: "" }]
      },
      "V3": {
        type: "V3",
        title: "VERSO 3",
        lines: [{ chords: "", lyrics: "" }]
      },
      "V4": {
        type: "V4",
        title: "VERSO 4",
        lines: [{ chords: "", lyrics: "" }]
      },
      "C1": {
        type: "C1",
        title: "CORO 1",
        lines: [{ chords: "", lyrics: "" }]
      },
      "C2": {
        type: "C2",
        title: "CORO 2",
        lines: [{ chords: "", lyrics: "" }]
      },
      "Pr": {
        type: "Pr",
        title: "PRE CORO",
        lines: [{ chords: "", lyrics: "" }]
      },
      "Pr2": {
        type: "Pr2",
        title: "PRE CORO",
        lines: [{ chords: "", lyrics: "" }]
      },
      "Rf": {
        type: "Rf",
        title: "REFRAIN",
        lines: [{ chords: "", lyrics: "" }]
      },
      "Rp": {
        type: "Rp",
        title: "REPETIR",
        lines: [{ chords: "", lyrics: "" }]
      },
      "F": {
        type: "F",
        title: "FINAL",
        lines: [{ chords: "", lyrics: "" }]
      }
    },
    pageNumber: 1,
    totalPages: 1
  };
};

// Sample data for initial display
export const getSampleSongData = (): SongData => {
  return {
    title: "Santo Por Siempre",
    artist: "Adoración La IBI",
    key: "G",
    tempo: "70",
    timeSignature: "4/4",
    sectionSequence: ["I", "V1", "V2", "Pr", "C1", "V3", "V4", "Rf", "C1", "C2", "Pr", "Pr2", "C1", "C2", "Rp", "F"],
    sections: {
      "I": {
        type: "I",
        title: "INTRO",
        notes: [{ text: "Línea de Piano & Guitarra Eléctrica\nCuerdas & Pad, suave", position: "right" }],
        lines: [{ chords: "C D G2/B Em7 D", lyrics: "" }]
      },
      "V1": {
        type: "V1",
        title: "VERSO 1",
        lines: [
          { chords: "G", lyrics: "Mil generaciones" },
          { chords: "C            G2", lyrics: "Se postran adorarle" },
          { chords: "Em7          D6sus4", lyrics: "Le cantan al cordero" },
          { chords: "C2", lyrics: "Que venció" }
        ]
      },
      "V2": {
        type: "V2",
        title: "VERSO 2",
        lines: [
          { chords: "G", lyrics: "Los que nos precedieron" },
          { chords: "C            G2", lyrics: "Y los que en Él creerán" },
          { chords: "Em7          Dadd4", lyrics: "Le cantarán a aquel" },
          { chords: "C2", lyrics: "Que ya venció" }
        ]
      },
      "V3": {
        type: "V3",
        title: "VERSO 3",
        notes: [{ text: "Toda la Banda\nRitmo con Toms", position: "right" }],
        lines: [
          { chords: "G", lyrics: "Sí te ha perdonado" },
          { chords: "C            G2", lyrics: "Y tienes salvación" },
          { chords: "Em7          D", lyrics: "Cántale al cordero" },
          { chords: "C2", lyrics: "Que venció" }
        ]
      },
      "V4": {
        type: "V4",
        title: "VERSO 4",
        lines: [
          { chords: "G", lyrics: "Sí te ha libertado" },
          { chords: "C              G2", lyrics: "Su nombre ha puesto en ti" },
          { chords: "Em7          D", lyrics: "Cántale al cordero" },
          { chords: "C2", lyrics: "Que venció" }
        ]
      },
      "Pr": {
        type: "Pr",
        title: "PRE CORO",
        notes: [{ text: "Entra Bajo & Ritmo de Tom, suave", position: "right" }],
        lines: [
          { chords: "C          Em", lyrics: "Tu nombre es más alto" },
          { chords: "D", lyrics: "Tu nombre es más grande" },
          { chords: "Em       D     C", lyrics: "Tu nombre sobre todo es" },
          { chords: "C           Em", lyrics: "Sean tronos dominios" },
          { chords: "D", lyrics: "Poderes potestades" }
        ]
      },
      "Pr2": {
        type: "Pr2",
        title: "PRE CORO",
        notes: [{ text: "Subir intensidad en la 2da vuelta", position: "right" }],
        lines: [
          { chords: "C          Em", lyrics: "Tu nombre es más alto" },
          { chords: "D", lyrics: "Tu nombre es más grande" }
        ]
      },
      "C1": {
        type: "C1",
        title: "CORO 1",
        notes: [{ text: "Ritmo completo", position: "right" }],
        lines: [
          { chords: "C      Em D", lyrics: "Claman ángeles san - to" },
          { chords: "G/B      Em", lyrics: "Clama la creación   santo" },
          { chords: "Am       D", lyrics: "Exaltado Dios   santo" },
          { chords: "G    Gsus4 G", lyrics: "Santo por siempr e" }
        ]
      },
      "C2": {
        type: "C2",
        title: "CORO 2",
        lines: [
          { chords: "C      Em D", lyrics: "Canta el pueblo al Rey san - to" },
          { chords: "G/B      Em", lyrics: "Soberano es Él   santo" },
          { chords: "Am       D", lyrics: "Y por siempre es   santo" },
          { chords: "G    Gsus4 G", lyrics: "Santo por siempr e" }
        ]
      },
      "Rf": {
        type: "Rf",
        title: "REFRAIN",
        notes: [{ text: "Crece en el último compás", position: "right" }],
        lines: [
          { chords: "Em       D       Am", lyrics: "Cantaremos siempre amén" }
        ]
      },
      "Rp": {
        type: "Rp",
        title: "REPETIR",
        lines: [
          { chords: "Am", lyrics: "Y por siempre es" },
          { chords: "D   D6sus4", lyrics: "Santo santo" },
          { chords: "G    Am", lyrics: "Por siempr e" }
        ]
      },
      "F": {
        type: "F",
        title: "FINAL",
        lines: [
          { chords: "G", lyrics: "" }
        ]
      }
    },
    pageNumber: 1,
    totalPages: 2
  };
};
