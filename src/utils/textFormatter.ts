// Text formatting utilities for chord/lyric editor

export interface TextFormat {
  bold?: boolean;
  italic?: boolean;
}

// Markers for text formatting
export const FORMAT_MARKERS = {
  bold: {
    start: '**',
    end: '**'
  },
  italic: {
    start: '_',
    end: '_'
  }
};

// Apply format to selected text
export function applyFormat(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: 'bold' | 'italic'
): { newText: string; newSelectionStart: number; newSelectionEnd: number } {
  if (selectionStart === selectionEnd) {
    // No selection, return unchanged
    return { newText: text, newSelectionStart: selectionStart, newSelectionEnd: selectionEnd };
  }
  
  const selectedText = text.substring(selectionStart, selectionEnd);
  const boldMarker = FORMAT_MARKERS.bold;
  const italicMarker = FORMAT_MARKERS.italic;
  
  // Check current formatting state
  let hasBold = false;
  let hasItalic = false;
  let effectiveStart = selectionStart;
  let effectiveEnd = selectionEnd;
  
  // Check for bold markers
  if (text.substring(selectionStart - 2, selectionStart) === boldMarker.start &&
      text.substring(selectionEnd, selectionEnd + 2) === boldMarker.end) {
    hasBold = true;
    effectiveStart -= 2;
    effectiveEnd += 2;
  }
  
  // Check for italic markers
  if (text.substring(selectionStart - 1, selectionStart) === italicMarker.start &&
      text.substring(selectionEnd, selectionEnd + 1) === italicMarker.end) {
    hasItalic = true;
    if (!hasBold) {
      effectiveStart -= 1;
      effectiveEnd += 1;
    }
  }
  
  // Check for combined formatting (bold wrapping italic or vice versa)
  const expandedStart = Math.max(0, selectionStart - 3);
  const expandedEnd = Math.min(text.length, selectionEnd + 3);
  const expandedText = text.substring(expandedStart, expandedEnd);
  
  // Determine what to do based on current state and requested format
  if (format === 'bold') {
    if (hasBold) {
      // Remove bold
      let newText = text;
      if (hasItalic) {
        // Has both bold and italic, just remove bold
        newText = text.substring(0, effectiveStart) + 
                 '_' + selectedText + '_' + 
                 text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart + 1,
          newSelectionEnd: effectiveStart + 1 + selectedText.length
        };
      } else {
        // Just remove bold
        newText = text.substring(0, effectiveStart) + 
                 selectedText + 
                 text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart,
          newSelectionEnd: effectiveStart + selectedText.length
        };
      }
    } else {
      // Add bold
      if (hasItalic) {
        // Already has italic, wrap with bold
        const newText = text.substring(0, effectiveStart) + 
                       '**_' + selectedText + '_**' + 
                       text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart + 3,
          newSelectionEnd: effectiveStart + 3 + selectedText.length
        };
      } else {
        // Just add bold
        const newText = text.substring(0, selectionStart) + 
                       '**' + selectedText + '**' + 
                       text.substring(selectionEnd);
        return {
          newText,
          newSelectionStart: selectionStart + 2,
          newSelectionEnd: selectionEnd + 2
        };
      }
    }
  } else { // format === 'italic'
    if (hasItalic) {
      // Remove italic
      let newText = text;
      if (hasBold) {
        // Has both bold and italic, just remove italic
        newText = text.substring(0, effectiveStart) + 
                 '**' + selectedText + '**' + 
                 text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart + 2,
          newSelectionEnd: effectiveStart + 2 + selectedText.length
        };
      } else {
        // Just remove italic
        newText = text.substring(0, effectiveStart) + 
                 selectedText + 
                 text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart,
          newSelectionEnd: effectiveStart + selectedText.length
        };
      }
    } else {
      // Add italic
      if (hasBold) {
        // Already has bold, wrap with italic
        const newText = text.substring(0, effectiveStart) + 
                       '_**' + selectedText + '**_' + 
                       text.substring(effectiveEnd);
        return {
          newText,
          newSelectionStart: effectiveStart + 3,
          newSelectionEnd: effectiveStart + 3 + selectedText.length
        };
      } else {
        // Just add italic
        const newText = text.substring(0, selectionStart) + 
                       '_' + selectedText + '_' + 
                       text.substring(selectionEnd);
        return {
          newText,
          newSelectionStart: selectionStart + 1,
          newSelectionEnd: selectionEnd + 1
        };
      }
    }
  }
}

// Parse text with format markers into segments
export interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export function parseFormattedText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;
  let currentPos = 0;
  
  // Regular expression to match formatting patterns
  // Matches: **bold**, _italic_, or **_bold italic_**
  const formatRegex = /(\*\*_[^_]+_\*\*)|(_\*\*[^*]+\*\*_)|(\*\*[^*]+\*\*)|(_[^_]+_)/g;
  
  let match;
  while ((match = formatRegex.exec(text)) !== null) {
    // Add any plain text before the match
    if (match.index > currentPos) {
      segments.push({
        text: text.substring(currentPos, match.index)
      });
    }
    
    const matchedText = match[0];
    
    // Check what type of formatting we found
    if (matchedText.startsWith('**_') && matchedText.endsWith('_**')) {
      // Bold and italic: **_text_**
      segments.push({
        text: matchedText.slice(3, -3),
        bold: true,
        italic: true
      });
    } else if (matchedText.startsWith('_**') && matchedText.endsWith('**_')) {
      // Italic and bold: _**text**_
      segments.push({
        text: matchedText.slice(3, -3),
        bold: true,
        italic: true
      });
    } else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      // Just bold: **text**
      const innerText = matchedText.slice(2, -2);
      // Check if the inner text contains italic markers
      const italicParts = parseItalicInBold(innerText);
      segments.push(...italicParts);
    } else if (matchedText.startsWith('_') && matchedText.endsWith('_')) {
      // Just italic: _text_
      const innerText = matchedText.slice(1, -1);
      // Check if the inner text contains bold markers
      const boldParts = parseBoldInItalic(innerText);
      segments.push(...boldParts);
    }
    
    currentPos = match.index + matchedText.length;
  }
  
  // Add any remaining plain text
  if (currentPos < text.length) {
    segments.push({
      text: text.substring(currentPos)
    });
  }
  
  return segments;
}

// Helper function to parse italic markers within bold text
function parseItalicInBold(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const parts = text.split(/(_[^_]+_)/);
  
  for (const part of parts) {
    if (part.startsWith('_') && part.endsWith('_')) {
      segments.push({
        text: part.slice(1, -1),
        bold: true,
        italic: true
      });
    } else if (part) {
      segments.push({
        text: part,
        bold: true
      });
    }
  }
  
  return segments;
}

// Helper function to parse bold markers within italic text
function parseBoldInItalic(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      segments.push({
        text: part.slice(2, -2),
        bold: true,
        italic: true
      });
    } else if (part) {
      segments.push({
        text: part,
        italic: true
      });
    }
  }
  
  return segments;
}

// Remove all formatting from text
export function removeFormatting(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1');
}