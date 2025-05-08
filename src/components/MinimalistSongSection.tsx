
import React from "react";
import { SongSection, defaultSectionColors } from "../types/song";
import MinimalistChordLine from "./MinimalistChordLine";

interface MinimalistSongSectionProps {
  section: SongSection;
  showChords?: boolean;
}

const MinimalistSongSection: React.FC<MinimalistSongSectionProps> = ({
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

  const circleBorderColor = section.color || getCircleBorderColor(section.type);

  // Combine right and left notes
  const leftNotes = section.notes?.filter(note => note.position === "left") || [];
  const rightNotes = section.notes?.filter(note => note.position === "right") || [];
  
  const hasContent = section.lines && section.lines.some(line => 
    (line.chords && line.chords.trim()) || (line.lyrics && line.lyrics.trim())
  );

  return (
    <div className="section-container p-4">
      <div className="section-header">
        <div 
          className="section-circle"
          style={{ borderColor: circleBorderColor }}
        >
          {section.type}
        </div>
        <div className="section-title">
          {section.title}
        </div>
        
        {/* Notes as italic text to the right */}
        {(leftNotes.length > 0 || rightNotes.length > 0) && (
          <div className="section-notes">
            {leftNotes.map((note, i) => (
              <span key={`left-${i}`} className="mr-2">{note.text}</span>
            ))}
            {rightNotes.map((note, i) => (
              <span key={`right-${i}`} className="ml-2">{note.text}</span>
            ))}
          </div>
        )}
      </div>

      {/* Chord and lyric content */}
      {hasContent && (
        <div className="chord-content space-y-1">
          {section.lines.map((line, index) => (
            <MinimalistChordLine 
              key={index} 
              line={line} 
              showChords={showChords} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MinimalistSongSection;
