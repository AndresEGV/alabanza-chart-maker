
import { ChordLyricLine, ChordPosition } from "../types/song";
import { parseChordPositionsFromLyrics, convertTraditionalToPositions } from "./chordPositionParser";

// Convert text with line breaks into chord-lyric pairs
export const parseChordLyricTextInput = (text: string): ChordLyricLine[] => {
  if (!text) return [];
  
  // Remove carriage returns but keep line feeds for consistent line endings
  const normalizedText = text.replace(/\r/g, '');
  
  // Check if the input uses [chord] format (with or without attached words)
  if (normalizedText.includes('[') && normalizedText.includes(']')) {
    // Process input line by line for [chord] format
    const lines = normalizedText.split('\n');
    const result: ChordLyricLine[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines but add them to preserve formatting
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
        const chordPositions = convertTraditionalToPositions(currentLine.lyrics, nextLine.lyrics);
        
        finalResult.push({
          chords: currentLine.lyrics, // First line is chords
          lyrics: nextLine.lyrics,    // Second line is lyrics
          chordPositions: chordPositions // Add calculated positions
        });
        i += 2; // Skip both lines
      } else {
        // Special case: standalone chord line without associated lyrics
        if (currentLine.lyrics && currentLine.lyrics.trim()) {
          finalResult.push({
            chords: currentLine.lyrics,
            lyrics: '',
            chordPositions: []
          });
        } else {
          // This is just a single line (could be empty)
          finalResult.push(currentLine);
        }
        i++;
      }
    }
    
    return finalResult;
  } else {
    // Use traditional parsing for chord-over-lyric format
    const lines = normalizedText.split('\n');
    const result: ChordLyricLine[] = [];
    
    // Special case: if there's just one line with chords only
    if (lines.length === 1 && lines[0].trim()) {
      return [{ chords: lines[0], lyrics: '', chordPositions: [] }];
    }
    
    // Iterate through the lines to create chord-lyric pairs
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
      
      if (currentLine.trim()) { // Current line has content
        if (nextLine && nextLine.trim()) { // Next line also has content
          // Assume chord-lyric pair
          const chordPositions = convertTraditionalToPositions(currentLine, nextLine);
          result.push({
            chords: currentLine,
            lyrics: nextLine,
            chordPositions: chordPositions
          });
          i++; // Skip the next line as we've processed it
        } else {
          // Solo chord line or solo lyric - assume chord
          result.push({ chords: currentLine, lyrics: '', chordPositions: [] });
          
          // If next line is empty, just skip it (don't add to result)
          if (nextLine === '') {
            i++;
          }
        }
      } else if (currentLine === '') {
        // Empty line - preserve one empty line for spacing
        // Only add if we're not at the start/end and previous wasn't empty
        if (i > 0 && i < lines.length - 1 && lines[i-1] !== '') {
          result.push({ chords: '', lyrics: '', chordPositions: [] });
        }
      }
    }
    
    return result;
  }
};
