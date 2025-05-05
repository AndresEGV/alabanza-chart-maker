import { ChordLyricLine, ChordPosition } from "../types/song";

// Parse chord positions from special format in lyrics
// Format: [chord]word  -->  identifies that "chord" should be positioned above "word"
export const parseChordPositionsFromLyrics = (lyrics: string): { cleanLyrics: string, chordPositions: ChordPosition[] } => {
  const chordPositions: ChordPosition[] = [];
  let cleanLyrics = lyrics;
  
  // Regular expression to match [chord]word pattern
  const chordPattern = /\[([^\]]+)\]([^[]*)/g;
  
  // Create a temporary working copy for position calculation
  let tempLyrics = lyrics;
  let match;
  let offset = 0;
  
  // Reset regex state by recreating it
  const regex = new RegExp(chordPattern);
  
  while ((match = regex.exec(lyrics)) !== null) {
    const fullMatch = match[0];
    const chordText = match[1];
    const startPos = match.index - offset;
    
    // Add chord with its position
    chordPositions.push({
      chord: chordText,
      position: startPos
    });
    
    // Update lyrics and tracking variables
    const replacementText = fullMatch.substring(chordText.length + 2); // +2 for [] brackets
    const cutLength = fullMatch.length;
    
    // Update our working copy for the next iteration
    tempLyrics = tempLyrics.substring(0, match.index - offset) + 
                 replacementText + 
                 tempLyrics.substring(match.index - offset + cutLength);
    
    // Track how much we've removed for position calculations
    offset += chordText.length + 2; // +2 for the [] brackets
  }
  
  // Remove chord brackets for clean lyrics
  cleanLyrics = cleanLyrics.replace(/\[([^\]]+)\]/g, "");
  
  return { cleanLyrics, chordPositions };
};

// Convert text with line breaks into chord-lyric pairs
export const parseChordLyricTextInput = (text: string): ChordLyricLine[] => {
  // Check if the input uses [chord]word format
  if (text.includes('[') && text.includes(']')) {
    // Process input line by line for [chord]word format
    const lines = text.split('\n');
    const result: ChordLyricLine[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines
      if (!line.trim()) {
        result.push({ chords: '', lyrics: '' });
        continue;
      }
      
      // Parse chord positions if this line contains [chord] markers
      if (line.includes('[') && line.includes(']')) {
        const { cleanLyrics, chordPositions } = parseChordPositionsFromLyrics(line);
        
        result.push({
          chords: '', // We'll generate chord line from positions for backward compatibility
          lyrics: cleanLyrics,
          chordPositions: chordPositions
        });
      } else {
        // Handle as regular text line (could be a chord line or lyrics line)
        // We'll determine if it's a chord or lyric later in pairs
        result.push({
          chords: '',
          lyrics: line
        });
      }
    }
    
    // Now pair up chord lines with lyric lines for traditional format sections
    const finalResult: ChordLyricLine[] = [];
    let i = 0;
    
    while (i < result.length) {
      const currentLine = result[i];
      
      // If this line already has chord positions, add it directly
      if (currentLine.chordPositions && currentLine.chordPositions.length > 0) {
        finalResult.push(currentLine);
        i++;
        continue;
      }
      
      // Otherwise, check if this is a chord+lyrics pair in traditional format
      const nextLine = i + 1 < result.length ? result[i + 1] : null;
      
      if (nextLine && !nextLine.chordPositions) {
        // This looks like a traditional chord+lyric pair
        finalResult.push({
          chords: currentLine.lyrics, // First line is chords
          lyrics: nextLine.lyrics      // Second line is lyrics
        });
        i += 2; // Skip both lines
      } else {
        // This is just a single line
        finalResult.push(currentLine);
        i++;
      }
    }
    
    return finalResult;
  } else {
    // Use traditional parsing for chord-over-lyric format
    const lines = text.split('\n');
    const result: ChordLyricLine[] = [];
    
    for (let i = 0; i < lines.length; i += 2) {
      const chords = lines[i] || '';
      const lyrics = lines[i + 1] || '';
      
      // Skip empty line pairs
      if (!chords.trim() && !lyrics.trim()) {
        continue;
      }
      
      result.push({
        chords,
        lyrics
      });
    }
    
    return result;
  }
};
