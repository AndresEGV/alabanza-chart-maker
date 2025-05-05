
import { ChordLyricLine, ChordPosition } from "../types/song";

// Parse chord positions from special format in lyrics
// Format: [chord]word  -->  identifies that "chord" should be positioned above "word"
export const parseChordPositionsFromLyrics = (lyrics: string): { cleanLyrics: string, chordPositions: ChordPosition[] } => {
  const chordPositions: ChordPosition[] = [];
  let cleanLyrics = lyrics;
  
  // Regular expression to match [chord]word pattern
  const chordPattern = /\[([^\]]+)\]([^[]*)/g;
  
  // Create a temporary lyrics version for position calculation
  let tempLyrics = lyrics;
  let match;
  
  // Reset regex state by recreating it
  const regex = new RegExp(chordPattern);
  
  while ((match = regex.exec(tempLyrics)) !== null) {
    const chordText = match[1];
    const afterText = match[2];
    const startPos = match.index;
    
    // Calculate position in terms of character position in the clean lyrics
    const position = startPos - (lyrics.length - tempLyrics.length);
    
    chordPositions.push({
      chord: chordText,
      position: position
    });
    
    // Remove this match from temp lyrics to avoid affecting future position calculations
    tempLyrics = tempLyrics.substring(0, startPos) + 
                 " ".repeat(chordText.length + 2) + // +2 for [] brackets
                 tempLyrics.substring(startPos + chordText.length + 2 + afterText.length);
  }
  
  // Remove chord brackets for clean lyrics
  cleanLyrics = cleanLyrics.replace(/\[([^\]]+)\]/g, "");
  
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
