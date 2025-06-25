
import { ChordPosition } from "../types/song";

// Parse chord positions from special format in lyrics
// Format: [chord]word  -->  identifies that "chord" should be positioned above "word"
export const parseChordPositionsFromLyrics = (lyrics: string): { cleanLyrics: string, chordPositions: ChordPosition[] } => {
  const chordPositions: ChordPosition[] = [];
  let cleanLyrics = lyrics;
  
  // Regular expression to match [chord]word pattern
  // This includes a more flexible pattern to handle mid-word chord placement
  const chordPattern = /\[([^\]]+)\]/g;
  
  // Create a temporary working copy for position calculation
  let tempLyrics = lyrics;
  let offset = 0;
  
  let match: RegExpExecArray | null;
  while ((match = chordPattern.exec(lyrics)) !== null) {
    const chordText = match[1];
    const startPos = match.index - offset;
    
    // Add chord with its position
    chordPositions.push({
      chord: chordText,
      position: startPos
    });
    
    // Calculate how many characters to remove
    const bracketLength = chordText.length + 2; // +2 for [] brackets
    
    // Update our working copy by removing the chord bracket
    tempLyrics = tempLyrics.substring(0, match.index - offset) + 
                 tempLyrics.substring(match.index - offset + bracketLength);
    
    // Track how much we've removed for position calculations
    offset += bracketLength;
  }
  
  // Remove chord brackets for clean lyrics
  cleanLyrics = cleanLyrics.replace(/\[([^\]]+)\]/g, "");
  
  return { cleanLyrics, chordPositions };
};

// Turn traditional chord-over-lyrics format into chord positions
export const convertTraditionalToPositions = (chords: string, lyrics: string): ChordPosition[] => {
  if (!chords || !lyrics) return [];
  
  const positions: ChordPosition[] = [];
  
  // Scan through the chord line character by character
  for (let i = 0; i < chords.length; i++) {
    // If we find a non-whitespace character
    if (chords[i].trim() !== '') {
      // This could be the start of a chord
      let chordText = '';
      let j = i;
      
      // Collect the entire chord
      while (j < chords.length && chords[j].trim() !== '') {
        chordText += chords[j];
        j++;
      }
      
      // Record position of this chord - exact character position
      positions.push({
        chord: chordText,
        position: i  // This is the exact character position
      });
      
      // Skip ahead to end of this chord
      i = j - 1;
    }
  }
  
  return positions;
};
