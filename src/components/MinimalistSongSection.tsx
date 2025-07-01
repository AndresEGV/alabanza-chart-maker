
import React from "react";
import { SongSection, defaultSectionColors } from "../types/song";
import MinimalistChordLine from "./MinimalistChordLine";

interface MinimalistSongSectionProps {
  section: SongSection;
  showChords?: boolean;
}

const MinimalistSongSection: React.FC<MinimalistSongSectionProps> = React.memo(({
  section,
  showChords = true
}) => {
  // Determine section color based on section type
  const getCircleBorderColor = (sectionType: string) => {
    // Check for full section type match first (e.g., "Rf", "Rp")
    if (defaultSectionColors[sectionType]) {
      return defaultSectionColors[sectionType];
    }
    
    // Fall back to base type (first character) if no exact match
    const baseType = sectionType.charAt(0);
    return defaultSectionColors[baseType] || defaultSectionColors.default;
  };

  // Smart line breaking for section notes
  const formatSectionNote = (text: string): string[] => {
    const maxLength = 28; // Maximum characters per line - reducido para mejor división en impresión
    
    // If text is short enough, return as is
    if (text.length <= maxLength) {
      return [text];
    }
    
    // Split by natural break points
    const breakPoints = [', ', ' & ', ' - ', '. '];
    let lines: string[] = [];
    let currentText = text;
    
    // Try to split at natural break points
    for (const breakPoint of breakPoints) {
      if (currentText.includes(breakPoint)) {
        const parts = currentText.split(breakPoint);
        let currentLine = '';
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const separator = i < parts.length - 1 ? breakPoint.trim() : '';
          
          if ((currentLine + part + separator).length <= maxLength) {
            currentLine += part + (i < parts.length - 1 ? breakPoint : '');
          } else {
            if (currentLine) lines.push(currentLine.trim());
            currentLine = part + (i < parts.length - 1 ? breakPoint : '');
          }
        }
        if (currentLine) lines.push(currentLine.trim());
        return lines;
      }
    }
    
    // If no natural break points, split by words
    const words = text.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines;
  };

  const circleBorderColor = section.color || getCircleBorderColor(section.type);

  const hasContent = section.lines && section.lines.some(line => 
    (line.chords && line.chords.trim()) || (line.lyrics && line.lyrics.trim())
  );

  return (
    <div className="section-container p-3">
      <div className="section-header">
        <div className="flex items-center flex-1">
          <div 
            className="section-circle"
            style={{ 
              borderColor: circleBorderColor,
              backgroundColor: "white",
              color: "black"
            }}
          >
            {section.type}
          </div>
          <div className="section-title">
            {section.title}
          </div>
        </div>
        
        {/* Section notes positioned inline with header */}
        {section.notes && section.notes.length > 0 && (
          <div className="flex items-center text-xs italic text-gray-500 ml-auto" style={{ maxWidth: '50%' }}>
            {section.notes
              .filter(note => note.position === "right")
              .map((note, i) => {
                const lines = formatSectionNote(note.text);
                if (lines.length === 1) {
                  return <span key={`right-${i}`} className="ml-2">{lines[0]}</span>;
                } else {
                  // Para notas multi-línea, mostrarlas en un div flexible
                  return (
                    <div key={`right-${i}`} className="ml-2 text-right" style={{ fontSize: '0.75rem' }}>
                      {lines.map((line, lineIndex) => (
                        <div key={`right-${i}-line-${lineIndex}`}>{line}</div>
                      ))}
                    </div>
                  );
                }
              })}
          </div>
        )}
      </div>

      {hasContent && (
        <div className={`chord-content space-y-1 ${!section.notes || section.notes.length === 0 ? 'mt-3' : 'mt-2'}`}>
          {section.lines.map((line, index) => (
            <MinimalistChordLine 
              key={`line-${index}-${line.chords || 'empty'}`} 
              line={line} 
              showChords={showChords} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

MinimalistSongSection.displayName = 'MinimalistSongSection';

export default MinimalistSongSection;
