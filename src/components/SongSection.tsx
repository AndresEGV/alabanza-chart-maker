
import React from "react";
import { SongSection as SongSectionType, defaultSectionColors } from "../types/song";
import ChordLine from "./ChordLine";

interface SongSectionProps {
  section: SongSectionType;
  showChords?: boolean;
}

const SongSection: React.FC<SongSectionProps> = ({ 
  section,
  showChords = true 
}) => {
  // Determine section color based on exact section type first, then fall back to first character
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

  // Check if section has any non-empty lines (either chords or lyrics)
  const hasContent = section.lines.some(line => 
    (line.chords && line.chords.trim()) || (line.lyrics && line.lyrics.trim())
  );

  return (
    <div className="relative border border-chart-border rounded-md mb-4 p-4 bg-white">
      <div className="flex items-start mb-2">
        <div className="flex-shrink-0 -mt-7 -ml-7">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black"
            style={{ 
              border: `2px solid ${circleBorderColor}`,
              backgroundColor: "white" 
            }}
          >
            {section.type}
          </div>
        </div>
        <h3 className="ml-2 font-bold text-lg">{section.title}</h3>
        {section.notes && section.notes.some(note => note.position === "left") && (
          <div className="ml-4 text-sm italic text-gray-600">
            {section.notes.filter(note => note.position === "left").map((note, i) => (
              <div key={i} className="whitespace-pre-line">{note.text}</div>
            ))}
          </div>
        )}
        <div className="flex-grow"></div>
        {section.notes && section.notes.some(note => note.position === "right") && (
          <div className="text-sm italic text-gray-600 text-right">
            {section.notes.filter(note => note.position === "right").map((note, i) => (
              <div key={i} className="whitespace-pre-line">{note.text}</div>
            ))}
          </div>
        )}
      </div>
      {hasContent && (
        <div className="font-mono chord-section space-y-1" style={{ fontFamily: "'Courier New', monospace", whiteSpace: "pre" }}>
          {section.lines.map((line, index) => (
            <ChordLine key={index} line={line} showChords={showChords} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SongSection;
