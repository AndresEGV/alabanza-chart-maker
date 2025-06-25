/**
 * Chord Transposer Utility
 * Transposes chords by semitones while preserving chord qualities
 */

// Chromatic scale - 12 semitones
const CHROMATIC_SCALE = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Alternative note names (flats)
const FLAT_NOTES = {
  'C#': 'Db',
  'D#': 'Eb', 
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

// Common chord patterns regex
const CHORD_PATTERN = /^([A-G][#b]?)(.*)$/;

/**
 * Normalize note to sharp notation
 */
function normalizeNote(note: string): string {
  const noteMap: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  };
  return noteMap[note] || note;
}

/**
 * Transpose a single note by semitones
 */
function transposeNote(note: string, semitones: number): string {
  const normalizedNote = normalizeNote(note);
  const currentIndex = CHROMATIC_SCALE.indexOf(normalizedNote);
  
  if (currentIndex === -1) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // Calculate new index with wrap-around
  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }
  
  return CHROMATIC_SCALE[newIndex];
}

/**
 * Transpose a chord by semitones
 * Examples: G -> G#, Am -> A#m, C7 -> C#7, F#maj7 -> Gmaj7
 */
export function transposeChord(chord: string, semitones: number): string {
  if (!chord || semitones === 0) return chord;
  
  const match = chord.match(CHORD_PATTERN);
  if (!match) return chord; // Return original if not a valid chord
  
  const [, rootNote, chordQuality] = match;
  
  try {
    const transposedRoot = transposeNote(rootNote, semitones);
    return transposedRoot + chordQuality;
  } catch (error) {
    console.warn(`Failed to transpose chord: ${chord}`, error);
    return chord; // Return original if transpose fails
  }
}

/**
 * Transpose all chords in a text string
 * Finds chord patterns like [Am], [G7], [C#maj7] and transposes them
 */
export function transposeChordText(text: string, semitones: number): string {
  if (!text || semitones === 0) return text;
  
  // Match chords in brackets like [Am], [G7], [C#maj7]
  const chordRegex = /\[([A-G][#b]?[^\]]*)\]/g;
  
  return text.replace(chordRegex, (match, chord) => {
    const transposedChord = transposeChord(chord, semitones);
    return `[${transposedChord}]`;
  });
}

/**
 * Transpose all chords in positional format
 * Handles format like "C    Em    F    G"
 */
export function transposePositionalChords(text: string, semitones: number): string {
  if (!text || semitones === 0) return text;
  
  // Split by lines and process each line
  return text.split('\n').map(line => {
    // More precise chord pattern matching
    // Matches: C, C#, Bb, Am, G7, Em7, D6sus4, G2/B, Cmaj7, etc.
    return line.replace(/\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|\d)*(?:\/[A-G][#b]?)?)\b/g, (match, chord) => {
      // Additional validation: skip very long strings or words with many lowercase letters
      if (chord.length > 12 || (chord.match(/[a-z]/g) || []).length > 4) {
        return match;
      }
      
      // Skip words that are clearly not chords
      const lowerChord = chord.toLowerCase();
      const nonChordWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'que', 'y', 'o', 'con', 'sin', 'por', 'para', 'en', 'al', 'se', 'te', 'le', 'lo', 'me', 'mi', 'tu', 'su', 'no', 'es', 'son', 'fue', 'ha', 'he', 'muy', 'mas', 'solo', 'todo', 'toda'];
      if (nonChordWords.includes(lowerChord)) {
        return match;
      }
      
      try {
        return transposeChord(chord, semitones);
      } catch (error) {
        console.warn(`Failed to transpose chord: ${chord}`, error);
        return match; // Return original if transpose fails
      }
    });
  }).join('\n');
}

/**
 * Get chord name for display (e.g., "C# / Db")
 */
export function getChordDisplayName(chord: string): string {
  const match = chord.match(CHORD_PATTERN);
  if (!match) return chord;
  
  const [, rootNote, quality] = match;
  const normalizedRoot = normalizeNote(rootNote);
  const flatEquivalent = FLAT_NOTES[normalizedRoot as keyof typeof FLAT_NOTES];
  
  if (flatEquivalent && rootNote === normalizedRoot) {
    return `${chord} / ${flatEquivalent}${quality}`;
  }
  
  return chord;
}

/**
 * Get transposition interval name
 */
export function getTransposeIntervalName(semitones: number): string {
  const intervals = [
    'Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th',
    'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th'
  ];
  
  const normalizedSemitones = ((semitones % 12) + 12) % 12;
  return intervals[normalizedSemitones] || 'Unknown';
}