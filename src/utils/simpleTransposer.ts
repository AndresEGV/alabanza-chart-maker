/**
 * Simple Transposer - Sistema simplificado usando solo sostenidos
 * Diseñado para evitar problemas de transposición acumulativa
 */

// Escala cromática simple usando solo sostenidos (como en sitios web de acordes)
const SIMPLE_CHROMATIC_SCALE = [
  'C',   // 0
  'C#',  // 1  
  'D',   // 2
  'D#',  // 3
  'E',   // 4
  'F',   // 5
  'F#',  // 6
  'G',   // 7
  'G#',  // 8
  'A',   // 9
  'A#',  // 10
  'B'    // 11
];

// Mapeo de todas las variantes de notas al índice cromático
const NOTE_TO_SEMITONE: Record<string, number> = {
  // Notas naturales
  'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11,
  
  // Sostenidos
  'C#': 1, 'D#': 3, 'F#': 6, 'G#': 8, 'A#': 10,
  
  // Bemoles (convertidos a sostenidos equivalentes)
  'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10,
  
  // Casos especiales (raramente usados pero por completitud)
  'B#': 0, 'E#': 5, 'Cb': 11, 'Fb': 4
};

/**
 * Convierte cualquier nota a su representación con sostenidos
 */
function normalizeToSharp(note: string): string {
  const semitone = NOTE_TO_SEMITONE[note];
  if (semitone === undefined) {
    throw new Error(`Nota inválida: ${note}`);
  }
  return SIMPLE_CHROMATIC_SCALE[semitone];
}

/**
 * Normaliza notas evitando dobles alteraciones
 */
function normalizeNote(note: string): string {
  // Eliminar múltiples sostenidos/bemoles y convertir a la nota simple
  const doubleSharpPattern = /^([A-G])##/;
  const doubleFlatPattern = /^([A-G])bb/;
  
  const doubleSharpMatch = note.match(doubleSharpPattern);
  if (doubleSharpMatch) {
    const baseNote = doubleSharpMatch[1];
    const baseSemitone = NOTE_TO_SEMITONE[baseNote];
    if (baseSemitone !== undefined) {
      const newSemitone = (baseSemitone + 2) % 12;
      return SIMPLE_CHROMATIC_SCALE[newSemitone];
    }
  }
  
  const doubleFlatMatch = note.match(doubleFlatPattern);
  if (doubleFlatMatch) {
    const baseNote = doubleFlatMatch[1];
    const baseSemitone = NOTE_TO_SEMITONE[baseNote];
    if (baseSemitone !== undefined) {
      const newSemitone = (baseSemitone - 2 + 12) % 12;
      return SIMPLE_CHROMATIC_SCALE[newSemitone];
    }
  }
  
  return note;
}

/**
 * Transpone una nota individual por un número de semitonos
 */
export function transposeNote(note: string, semitones: number): string {
  // Primero normalizar la nota de entrada
  const normalizedNote = normalizeNote(note);
  
  const originalSemitone = NOTE_TO_SEMITONE[normalizedNote];
  if (originalSemitone === undefined) {
    throw new Error(`Nota inválida: ${note} (normalizada: ${normalizedNote})`);
  }
  
  // Calcular nuevo índice cromático con wrap-around
  let newSemitone = (originalSemitone + semitones) % 12;
  if (newSemitone < 0) {
    newSemitone += 12;
  }
  
  return SIMPLE_CHROMATIC_SCALE[newSemitone];
}

/**
 * Parsea un acorde en sus componentes
 */
function parseChord(chordString: string): {
  root: string;
  quality: string;
  bassNote?: string;
} {
  // Regex mejorada para capturar dobles alteraciones también
  const chordRegex = /^([A-G][#b]{0,2})([^/]*?)(?:\/([A-G][#b]{0,2}))?$/;
  const match = chordString.match(chordRegex);
  
  if (!match) {
    throw new Error(`No se pudo parsear el acorde: ${chordString}`);
  }
  
  const [, root, quality, bassNote] = match;
  
  return {
    root: normalizeNote(root),
    quality: quality || '',
    bassNote: bassNote ? normalizeNote(bassNote) : undefined
  };
}

/**
 * Reconstruye un acorde desde sus componentes
 */
function reconstructChord(parsed: {
  root: string;
  quality: string;
  bassNote?: string;
}): string {
  let result = parsed.root + parsed.quality;
  
  if (parsed.bassNote) {
    result += '/' + parsed.bassNote;
  }
  
  return result;
}

/**
 * Transpone un acorde individual
 */
export function transposeChord(chordString: string, semitones: number): string {
  if (!chordString || semitones === 0) {
    return chordString;
  }
  
  try {
    const parsed = parseChord(chordString);
    
    // Transponer la raíz
    parsed.root = transposeNote(parsed.root, semitones);
    
    // Transponer el bajo si existe
    if (parsed.bassNote) {
      parsed.bassNote = transposeNote(parsed.bassNote, semitones);
    }
    
    return reconstructChord(parsed);
  } catch (error) {
    console.warn(`Error transponiendo acorde ${chordString}:`, error);
    return chordString;
  }
}

/**
 * Transpone una línea completa de acordes
 */
export function transposeLine(line: string, semitones: number): string {
  if (!line || semitones === 0) {
    return line;
  }
  
  
  // Regex para encontrar acordes (captura dobles alteraciones también)
  const chordRegex = /([A-G][#b]{0,2}(?:maj|min|m|sus|add|dim|aug|°|\d)*(?:\/[A-G][#b]{0,2})?)/g;
  
  const result = line.replace(chordRegex, (match, chord) => {
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
    
    const transposed = transposeChord(chord, semitones);
    return transposed;
  });
  
  return result;
}

/**
 * Calcula la nueva tonalidad después de transponer
 */
export function calculateTargetKey(originalKey: string, semitones: number): string {
  return transposeNote(originalKey, semitones);
}

/**
 * Obtiene el nombre del intervalo
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

/**
 * Transpone una canción completa desde su estado original
 */
export function transposeSong(originalSong: any, totalSemitones: number): any {
  if (!originalSong || totalSemitones === 0) {
    return originalSong;
  }
  
  
  // Hacer una copia profunda para asegurar que React detecte los cambios
  const newSong = {
    ...originalSong,
    sections: {}
  };
  
  // Crear nuevas secciones completamente
  for (const [key, section] of Object.entries(originalSong.sections) as [string, any][]) {
    
    newSong.sections[key] = {
      ...section,
      lines: section.lines.map((line: any, lineIndex: number) => {
        const originalChords = line.chords || '';
        const transposedChords = transposeLine(originalChords, totalSemitones);
        
        
        // Crear un nuevo objeto línea completamente
        const newLine: any = {
          lyrics: line.lyrics,
          chords: transposedChords,
          _transpositionKey: `${transposedChords}-${Date.now()}-${lineIndex}`
        };
        
        // Si hay chordPositions, también transponer esos acordes
        if (line.chordPositions && line.chordPositions.length > 0) {
          newLine.chordPositions = line.chordPositions.map((pos: any) => ({
            ...pos,
            chord: transposeChord(pos.chord, totalSemitones)
          }));
        }
        
        return newLine;
      })
    };
  }
  
  return newSong;
}