/**
 * Perfect Chord Transposer
 * Implementación completa de transposición respetando tonalidades, alteraciones y enarmonía
 */

// Escala cromática completa con semitonos
const CHROMATIC_NOTES = [
  ['C', 'B#'],           // 0
  ['C#', 'Db'],          // 1
  ['D'],                 // 2
  ['D#', 'Eb'],          // 3
  ['E', 'Fb'],           // 4
  ['F', 'E#'],           // 5
  ['F#', 'Gb'],          // 6
  ['G'],                 // 7
  ['G#', 'Ab'],          // 8
  ['A'],                 // 9
  ['A#', 'Bb'],          // 10
  ['B', 'Cb']            // 11
];

// Mapa de notas a índices cromáticos
const NOTE_TO_INDEX: Record<string, number> = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

// Tabla completa de tonalidades mayores con sus alteraciones
const MAJOR_KEYS: Record<string, {
  type: 'sharp' | 'flat' | 'none';
  sharps: string[];
  flats: string[];
  scale: string[];
}> = {
  // Tonalidades con sostenidos
  'C': { 
    type: 'none', 
    sharps: [], 
    flats: [],
    scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  },
  'G': { 
    type: 'sharp', 
    sharps: ['F#'], 
    flats: [],
    scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
  },
  'D': { 
    type: 'sharp', 
    sharps: ['F#', 'C#'], 
    flats: [],
    scale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
  },
  'A': { 
    type: 'sharp', 
    sharps: ['F#', 'C#', 'G#'], 
    flats: [],
    scale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
  },
  'E': { 
    type: 'sharp', 
    sharps: ['F#', 'C#', 'G#', 'D#'], 
    flats: [],
    scale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']
  },
  'B': { 
    type: 'sharp', 
    sharps: ['F#', 'C#', 'G#', 'D#', 'A#'], 
    flats: [],
    scale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
  },
  'F#': { 
    type: 'sharp', 
    sharps: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'], 
    flats: [],
    scale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']
  },
  'C#': { 
    type: 'sharp', 
    sharps: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'], 
    flats: [],
    scale: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#']
  },
  
  // Tonalidades con bemoles
  'F': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb'],
    scale: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
  },
  'Bb': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb'],
    scale: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']
  },
  'Eb': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb', 'Ab'],
    scale: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D']
  },
  'Ab': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb', 'Ab', 'Db'],
    scale: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']
  },
  'Db': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
    scale: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']
  },
  'Gb': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
    scale: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
  },
  'Cb': { 
    type: 'flat', 
    sharps: [], 
    flats: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'],
    scale: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb']
  }
};

// Círculo de quintas (orden de sostenidos y bemoles)
const CIRCLE_OF_FIFTHS = {
  sharps: ['G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
  flats: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']
};

/**
 * Obtiene el índice cromático de una nota
 */
function getChromaticIndex(note: string): number {
  const index = NOTE_TO_INDEX[note];
  if (index === undefined) {
    throw new Error(`Nota inválida: ${note}`);
  }
  return index;
}

/**
 * Simplifica notas enarmónicas evitando dobles alteraciones
 */
function simplifyEnharmonic(note: string): string {
  // Casos especiales de dobles alteraciones a evitar
  const simplifications: Record<string, string> = {
    'C##': 'D',
    'D##': 'E',
    'E##': 'F#',
    'F##': 'G',
    'G##': 'A',
    'A##': 'B',
    'B##': 'C#',
    'Cbb': 'Bb',
    'Dbb': 'C',
    'Ebb': 'D',
    'Fbb': 'Eb',
    'Gbb': 'F',
    'Abb': 'G',
    'Bbb': 'A'
  };
  
  return simplifications[note] || note;
}

/**
 * Obtiene el nombre correcto de una nota para una tonalidad específica
 */
function getNoteForKey(chromaticIndex: number, targetKey: string, semitones: number): string {
  const keyInfo = MAJOR_KEYS[targetKey];
  
  if (!keyInfo) {
    // Si no se encuentra la tonalidad, usar lógica por defecto
    const options = CHROMATIC_NOTES[chromaticIndex];
    if (semitones > 0) {
      // Subiendo: preferir sostenidos
      return options.find(n => n.includes('#')) || options[0];
    } else {
      // Bajando: preferir bemoles
      return options.find(n => n.includes('b')) || options[0];
    }
  }
  
  // Buscar la nota en la escala de la tonalidad
  const possibleNotes = CHROMATIC_NOTES[chromaticIndex];
  
  // Primero, buscar si alguna de las opciones está en la escala de la tonalidad
  for (const note of possibleNotes) {
    if (keyInfo.scale.includes(note)) {
      return note;
    }
  }
  
  // Si no está en la escala, decidir basándose en el tipo de tonalidad
  if (keyInfo.type === 'sharp' || (keyInfo.type === 'none' && semitones > 0)) {
    // Tonalidad con sostenidos o C mayor subiendo: preferir sostenidos
    // Pero solo si no genera notas problemáticas
    const sharpOption = possibleNotes.find(n => n.includes('#'));
    if (sharpOption && sharpOption !== 'E#' && sharpOption !== 'B#') {
      return sharpOption;
    }
    return possibleNotes[0];
  } else if (keyInfo.type === 'flat' || (keyInfo.type === 'none' && semitones < 0)) {
    // Tonalidad con bemoles o C mayor bajando: preferir bemoles
    // Pero solo si no genera notas problemáticas
    const flatOption = possibleNotes.find(n => n.includes('b'));
    if (flatOption && flatOption !== 'Fb' && flatOption !== 'Cb') {
      return flatOption;
    }
    return possibleNotes[0];
  } else {
    // Tonalidad de C sin dirección clara: usar la nota más simple
    return possibleNotes[0];
  }
}

/**
 * Transpone una nota individual
 */
export function transposeNote(note: string, semitones: number, originalKey: string, targetKey: string): string {
  const currentIndex = getChromaticIndex(note);
  
  // Calcular nuevo índice cromático
  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }
  
  // Obtener el nombre correcto para la tonalidad destino
  let transposedNote = getNoteForKey(newIndex, targetKey, semitones);
  
  // Siempre evitar E#, B#, Fb, Cb excepto si están específicamente en la escala destino
  const keyInfo = MAJOR_KEYS[targetKey];
  if (transposedNote === 'E#' && (!keyInfo || !keyInfo.scale.includes('E#'))) {
    transposedNote = 'F';
  } else if (transposedNote === 'B#' && (!keyInfo || !keyInfo.scale.includes('B#'))) {
    transposedNote = 'C';
  } else if (transposedNote === 'Fb' && (!keyInfo || !keyInfo.scale.includes('Fb'))) {
    transposedNote = 'E';
  } else if (transposedNote === 'Cb' && (!keyInfo || !keyInfo.scale.includes('Cb'))) {
    transposedNote = 'B';
  }
  
  // Simplificar si hay dobles alteraciones
  transposedNote = simplifyEnharmonic(transposedNote);
  
  return transposedNote;
}

/**
 * Detecta la tonalidad de una progresión de acordes
 */
export function detectKeyFromChords(chords: string[]): string {
  // Contar apariciones de cada posible tónica
  const keyScores: Record<string, number> = {};
  
  for (const chord of chords) {
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) continue;
    
    const [, root, quality] = match;
    
    // Los acordes mayores tienen más peso como posibles tónicas
    const isMajor = !quality.includes('m') && !quality.includes('dim') && !quality.includes('°');
    const weight = isMajor ? 3 : 1;
    
    // Verificar si este acorde podría ser el I, IV o V de alguna tonalidad
    for (const [key, keyInfo] of Object.entries(MAJOR_KEYS)) {
      if (keyInfo.scale[0] === root && isMajor) {
        // Podría ser el I (tónica)
        keyScores[key] = (keyScores[key] || 0) + weight * 3;
      } else if (keyInfo.scale[3] === root && isMajor) {
        // Podría ser el IV (subdominante)
        keyScores[key] = (keyScores[key] || 0) + weight * 2;
      } else if (keyInfo.scale[4] === root && isMajor) {
        // Podría ser el V (dominante)
        keyScores[key] = (keyScores[key] || 0) + weight * 2;
      } else if (keyInfo.scale.includes(root)) {
        // Está en la escala
        keyScores[key] = (keyScores[key] || 0) + weight;
      }
    }
  }
  
  // Encontrar la tonalidad con mayor puntuación
  let bestKey = 'C';
  let bestScore = 0;
  
  for (const [key, score] of Object.entries(keyScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }
  
  return bestKey;
}

/**
 * Calcula la tonalidad destino después de la transposición
 */
export function calculateTargetKey(originalKey: string, semitones: number): string {
  const currentIndex = getChromaticIndex(originalKey);
  
  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }
  
  // Buscar una tonalidad estándar para este índice
  const possibleNotes = CHROMATIC_NOTES[newIndex];
  
  // Intentar encontrar una tonalidad mayor estándar
  for (const note of possibleNotes) {
    if (MAJOR_KEYS[note]) {
      return note;
    }
  }
  
  // Si no hay tonalidad estándar, devolver la primera opción
  return possibleNotes[0];
}

/**
 * Transpone un acorde completo
 */
export function transposeChord(chord: string, semitones: number, originalKey: string, targetKey: string): string {
  if (!chord || semitones === 0) return chord;
  
  // Parsear el acorde
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;
  
  const [, rootNote, suffix] = match;
  
  // Manejar acordes con bajo (slash chords)
  let bassNote = '';
  let quality = suffix;
  const slashMatch = suffix.match(/^(.*?)\/([A-G][#b]?)$/);
  if (slashMatch) {
    quality = slashMatch[1];
    bassNote = slashMatch[2];
  }
  
  // Transponer la nota raíz
  const transposedRoot = transposeNote(rootNote, semitones, originalKey, targetKey);
  
  // Transponer el bajo si existe
  let transposedBass = '';
  if (bassNote) {
    const transposedBassNote = transposeNote(bassNote, semitones, originalKey, targetKey);
    transposedBass = `/${transposedBassNote}`;
  }
  
  return transposedRoot + quality + transposedBass;
}

/**
 * Transpone una línea completa de acordes
 */
export function transposeLine(line: string, semitones: number, originalKey?: string): string {
  if (!line || semitones === 0) return line;
  
  // Encontrar todos los acordes en la línea
  const chordRegex = /\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|°|\d)*(?:\/[A-G][#b]?)?)\b/g;
  const matches = Array.from(line.matchAll(chordRegex));
  const chords = matches.map(m => m[1]);
  
  // Detectar tonalidad si no se proporciona
  const detectedKey = originalKey || detectKeyFromChords(chords);
  const targetKey = calculateTargetKey(detectedKey, semitones);
  
  // Reemplazar cada acorde
  return line.replace(chordRegex, (match, chord) => {
    // Filtrar palabras que no son acordes
    if (chord.length > 12 || (chord.match(/[a-z]/g) || []).length > 4) {
      return match;
    }
    
    // Lista de palabras comunes que no son acordes
    const nonChordWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 
      'que', 'y', 'o', 'con', 'sin', 'por', 'para', 'en', 'al', 'se', 'te', 
      'le', 'lo', 'me', 'mi', 'tu', 'su', 'no', 'es', 'son', 'fue', 'ha', 
      'he', 'muy', 'mas', 'solo', 'todo', 'toda'];
    
    if (nonChordWords.includes(chord.toLowerCase())) {
      return match;
    }
    
    try {
      return transposeChord(chord, semitones, detectedKey, targetKey);
    } catch (error) {
      console.warn(`Error al transponer acorde: ${chord}`, error);
      return match;
    }
  });
}

/**
 * Obtiene el nombre del intervalo musical
 */
export function getIntervalName(semitones: number): string {
  const intervals = [
    'Unísono',      // 0
    '2ª menor',     // 1
    '2ª mayor',     // 2
    '3ª menor',     // 3
    '3ª mayor',     // 4
    '4ª justa',     // 5
    'Tritono',      // 6
    '5ª justa',     // 7
    '6ª menor',     // 8
    '6ª mayor',     // 9
    '7ª menor',     // 10
    '7ª mayor'      // 11
  ];
  
  const normalizedSemitones = ((semitones % 12) + 12) % 12;
  return intervals[normalizedSemitones] || 'Desconocido';
}