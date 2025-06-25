/**
 * Advanced Chord Transposer Utility
 * Transposes chords by semitones while respecting key signatures
 */

// Chromatic scale with sharps
const CHROMATIC_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Chromatic scale with flats
const CHROMATIC_FLAT = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
];

// Key signatures with their alterations
const KEY_SIGNATURES = {
  // Major keys with sharps
  'C': { type: 'none', alterations: [] },
  'G': { type: 'sharp', alterations: ['F#'] },
  'D': { type: 'sharp', alterations: ['F#', 'C#'] },
  'A': { type: 'sharp', alterations: ['F#', 'C#', 'G#'] },
  'E': { type: 'sharp', alterations: ['F#', 'C#', 'G#', 'D#'] },
  'B': { type: 'sharp', alterations: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  'F#': { type: 'sharp', alterations: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
  'C#': { type: 'sharp', alterations: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] },
  
  // Major keys with flats
  'F': { type: 'flat', alterations: ['Bb'] },
  'Bb': { type: 'flat', alterations: ['Bb', 'Eb'] },
  'Eb': { type: 'flat', alterations: ['Bb', 'Eb', 'Ab'] },
  'Ab': { type: 'flat', alterations: ['Bb', 'Eb', 'Ab', 'Db'] },
  'Db': { type: 'flat', alterations: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  'Gb': { type: 'flat', alterations: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
  'Cb': { type: 'flat', alterations: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] }
};

// Note equivalences
const ENHARMONIC_EQUIVALENTS: Record<string, string> = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'E#': 'F', 'F': 'E#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
  'B#': 'C', 'C': 'B#',
  'Cb': 'B', 'B': 'Cb',
  'Fb': 'E', 'E': 'Fb'
};

// Normalize note to chromatic index
function getNoteIndex(note: string): number {
  let index = CHROMATIC_SHARP.indexOf(note);
  if (index === -1) {
    index = CHROMATIC_FLAT.indexOf(note);
  }
  if (index === -1) {
    // Handle special cases
    if (note === 'E#') return 5; // F
    if (note === 'B#') return 0; // C
    if (note === 'Cb') return 11; // B
    if (note === 'Fb') return 4; // E
  }
  return index;
}

// Get the appropriate note name for a given key and direction
function getNoteForKey(chromaticIndex: number, targetKey: string, semitones: number): string {
  const keyInfo = KEY_SIGNATURES[targetKey];
  
  if (!keyInfo) {
    // Default based on direction if key not found
    return semitones > 0 ? CHROMATIC_SHARP[chromaticIndex] : CHROMATIC_FLAT[chromaticIndex];
  }
  
  // For natural notes (C, D, E, F, G, A, B), always return the natural
  const naturalNote = CHROMATIC_SHARP[chromaticIndex];
  if (!naturalNote.includes('#')) {
    return naturalNote;
  }
  
  // Check if this note should use the key's specific alterations
  for (const alteration of keyInfo.alterations) {
    if (getNoteIndex(alteration) === chromaticIndex) {
      return alteration;
    }
  }
  
  // For accidentals not in the key signature, decide based on key type and direction
  if (keyInfo.type === 'flat' || (keyInfo.type === 'none' && semitones < 0)) {
    // For flat keys or when going down, prefer flat notation
    return CHROMATIC_FLAT[chromaticIndex];
  } else {
    // For sharp keys or when going up, prefer sharp notation
    return CHROMATIC_SHARP[chromaticIndex];
  }
}

// Transpose a single note by semitones with key awareness
export function transposeNoteWithKey(note: string, semitones: number, originalKey: string, targetKey: string): string {
  const currentIndex = getNoteIndex(note);
  
  if (currentIndex === -1) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // Calculate new chromatic position
  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }
  
  // Get appropriate note name for the target key with direction awareness
  return getNoteForKey(newIndex, targetKey, semitones);
}

// Detect the likely key from a chord progression
export function detectKey(chords: string[]): string {
  // Simple heuristic: look for the first major chord that could be the tonic
  // This is a simplified approach - real key detection is more complex
  
  for (const chord of chords) {
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (match) {
      const [, rootNote, quality] = match;
      // If it's a major chord (no 'm' after root)
      if (!quality.startsWith('m') && !quality.includes('min')) {
        // Check if this is a valid key
        if (KEY_SIGNATURES[rootNote]) {
          return rootNote;
        }
        // Try enharmonic equivalent
        const enharmonic = ENHARMONIC_EQUIVALENTS[rootNote];
        if (enharmonic && KEY_SIGNATURES[enharmonic]) {
          return enharmonic;
        }
      }
    }
  }
  
  // Default to C if no key detected
  return 'C';
}

// Calculate target key after transposition
export function getTargetKey(originalKey: string, semitones: number): string {
  const keyIndex = getNoteIndex(originalKey);
  if (keyIndex === -1) return 'C';
  
  let newIndex = (keyIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }
  
  // Try to find a standard key for this root
  const possibleKeys = [
    CHROMATIC_SHARP[newIndex],
    CHROMATIC_FLAT[newIndex]
  ];
  
  for (const key of possibleKeys) {
    if (KEY_SIGNATURES[key]) {
      return key;
    }
  }
  
  // Default to sharp notation
  return CHROMATIC_SHARP[newIndex];
}

// Transpose a chord with key awareness
export function transposeChordWithKey(chord: string, semitones: number, originalKey: string, targetKey: string): string {
  if (!chord || semitones === 0) return chord;
  
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;
  
  const [, rootNote, chordQuality] = match;
  
  try {
    const transposedRoot = transposeNoteWithKey(rootNote, semitones, originalKey, targetKey);
    return transposedRoot + chordQuality;
  } catch (error) {
    console.warn(`Failed to transpose chord: ${chord}`, error);
    return chord;
  }
}

// Transpose all chords in a line with key awareness
export function transposeLineWithKey(line: string, semitones: number, originalKey: string): string {
  if (!line || semitones === 0) return line;
  
  // Extract all chords from the line first to detect key if needed
  const chordMatches = Array.from(line.matchAll(/\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|\d)*(?:\/[A-G][#b]?)?)\b/g));
  const chords = chordMatches.map(match => match[1]);
  
  // If no original key provided, try to detect it
  const detectedKey = originalKey || detectKey(chords);
  const targetKey = getTargetKey(detectedKey, semitones);
  
  // Replace each chord
  return line.replace(/\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|\d)*(?:\/[A-G][#b]?)?)\b/g, (match, chord) => {
    // Skip non-chord words
    if (chord.length > 12 || (chord.match(/[a-z]/g) || []).length > 4) {
      return match;
    }
    
    const lowerChord = chord.toLowerCase();
    const nonChordWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'que', 'y', 'o', 'con', 'sin', 'por', 'para', 'en', 'al', 'se', 'te', 'le', 'lo', 'me', 'mi', 'tu', 'su', 'no', 'es', 'son', 'fue', 'ha', 'he', 'muy', 'mas', 'solo', 'todo', 'toda'];
    if (nonChordWords.includes(lowerChord)) {
      return match;
    }
    
    try {
      // Parse chord parts
      const chordMatch = chord.match(/^([A-G][#b]?)(.*)$/);
      if (!chordMatch) return match;
      
      const [, rootNote, chordQuality] = chordMatch;
      
      // Handle slash chords
      let bassNote = '';
      let quality = chordQuality;
      const slashMatch = chordQuality.match(/^(.*)\/([A-G][#b]?)$/);
      if (slashMatch) {
        quality = slashMatch[1];
        bassNote = slashMatch[2];
      }
      
      // Transpose root
      const transposedRoot = transposeNoteWithKey(rootNote, semitones, detectedKey, targetKey);
      
      // Transpose bass note if present
      let transposedBass = '';
      if (bassNote) {
        transposedBass = '/' + transposeNoteWithKey(bassNote, semitones, detectedKey, targetKey);
      }
      
      return transposedRoot + quality + transposedBass;
    } catch (error) {
      console.warn(`Failed to transpose chord: ${chord}`, error);
      return match;
    }
  });
}