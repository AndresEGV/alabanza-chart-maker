
import { ChordLyricLine, ChordPosition } from "../types/song";

// Parse chord positions from special format in lyrics
// Format: [chord]word  -->  identifies that "chord" should be positioned above "word"
export const parseChordPositionsFromLyrics = (lyrics: string): { cleanLyrics: string, chordPositions: ChordPosition[] } => {
  const chordPositions: ChordPosition[] = [];
  let cleanLyrics = lyrics;
  
  // Regular expression to match [chord]word pattern
  const chordPattern = /\[([^\]]+)\]([^[]+)/g;
  
  // Find all chord positions
  let match;
  let positionOffset = 0;
  
  while ((match = chordPattern.exec(lyrics)) !== null) {
    const chordText = match[1];
    const word = match[2];
    const startPos = match.index - positionOffset;
    
    chordPositions.push({
      chord: chordText,
      position: startPos
    });
    
    // Remove chord brackets for clean lyrics
    cleanLyrics = cleanLyrics.replace(`[${chordText}]${word}`, word);
    positionOffset += chordText.length + word.length + 2; // +2 for the brackets
  }
  
  return { cleanLyrics, chordPositions };
};

// Convert text with line breaks into chord-lyric pairs
export const parseChordLyricTextInput = (text: string): ChordLyricLine[] => {
  const lines = text.split('\n');
  const result: ChordLyricLine[] = [];
  
  for (let i = 0; i < lines.length; i += 2) {
    const chords = lines[i] || '';
    const lyrics = lines[i + 1] || '';
    
    // Skip empty line pairs
    if (!chords.trim() && !lyrics.trim()) {
      continue;
    }
    
    // Check if lyrics contain chord position markers [chord]
    if (lyrics && lyrics.includes('[') && lyrics.includes(']')) {
      const { cleanLyrics, chordPositions } = parseChordPositionsFromLyrics(lyrics);
      
      result.push({
        chords: chords, // Keep original chord line for backward compatibility
        lyrics: cleanLyrics,
        chordPositions: chordPositions
      });
    } else {
      // Use traditional chord-over-lyrics format
      result.push({
        chords,
        lyrics
      });
    }
  }
  
  return result;
};
