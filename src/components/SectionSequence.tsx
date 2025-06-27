
import React from "react";
import { SectionType, defaultSectionColors, SongSection } from "../types/song";

interface SectionSequenceProps {
  sequence: SectionType[];
  sections?: Record<SectionType, SongSection>;
}

const SectionSequence: React.FC<SectionSequenceProps> = ({ sequence, sections }) => {
  const getCircleBorderColor = (sectionType: string) => {
    // Check for full section type match first (e.g., "Rf", "Rp")
    if (defaultSectionColors[sectionType]) {
      return defaultSectionColors[sectionType];
    }
    
    // Fall back to base type (first character) if no exact match
    const baseType = sectionType.charAt(0);
    return defaultSectionColors[baseType] || defaultSectionColors.default;
  };

  // Function to extract repeat number from section content
  const getRepeatNumber = (sectionType: string): string | null => {
    if (!sections || !sections[sectionType]) return null;
    
    const section = sections[sectionType];
    // Check all lines for patterns like "X2", "X3", "X4", etc.
    for (const line of section.lines) {
      const content = `${line.chords || ''} ${line.lyrics || ''}`.trim();
      const match = content.match(/\bX(\d+)\b/i);
      if (match) {
        return match[1]; // Return just the number
      }
    }
    return null;
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {sequence.map((section, index) => {
        const repeatNumber = getRepeatNumber(section);
        
        return (
          <div
            key={index}
            className="relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ 
              border: `2px solid ${getCircleBorderColor(section)}`,
              backgroundColor: "white",
              color: "black"
            }}
            title={section}
          >
            {section}
            {repeatNumber && (
              <>
                {/* White overlay to create gap effect */}
                <div 
                  className="absolute w-3 h-3 bg-white"
                  style={{
                    top: '-1px',
                    right: '-1px',
                    borderRadius: '0 50% 0 0'
                  }}
                />
                <div 
                  className="absolute top-0 right-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    color: "black",
                    fontSize: "0.7rem",
                    transform: "translate(25%, -25%)",
                    zIndex: 10
                  }}
                >
                  {repeatNumber}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SectionSequence;
