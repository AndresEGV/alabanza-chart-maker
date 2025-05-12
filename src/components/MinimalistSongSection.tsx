
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

  const hasContent = section.lines && section.lines.some(line => 
    (line.chords && line.chords.trim()) || (line.lyrics && line.lyrics.trim())
  );

  return (
    <div className="section-container p-4">
      <div className="section-header">
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
      
      {/* Section notes positioned correctly below the section title */}
      {section.notes && section.notes.length > 0 && (
        <div className="flex justify-between text-sm italic text-gray-600 mt-1 mb-2">
          <div>
            {section.notes
              .filter(note => note.position === "left")
              .map((note, i) => (
                <span key={`left-${i}`} className="mr-2">{note.text}</span>
              ))}
          </div>
          <div className="text-right">
            {section.notes
              .filter(note => note.position === "right")
              .map((note, i) => (
                <span key={`right-${i}`} className="ml-2">{note.text}</span>
              ))}
          </div>
        </div>
      )}

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
