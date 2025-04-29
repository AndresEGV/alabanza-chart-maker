
import React from "react";
import { SectionType, defaultSectionColors } from "../types/song";

interface SectionSequenceProps {
  sequence: SectionType[];
}

const SectionSequence: React.FC<SectionSequenceProps> = ({ sequence }) => {
  const getCircleBorderColor = (sectionType: string) => {
    // Check for full section type match first (e.g., "Rf", "Rp")
    if (defaultSectionColors[sectionType]) {
      return defaultSectionColors[sectionType];
    }
    
    // Fall back to base type (first character) if no exact match
    const baseType = sectionType.charAt(0);
    return defaultSectionColors[baseType] || defaultSectionColors.default;
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {sequence.map((section, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-chart-sequence"
          style={{ 
            border: `2px solid ${getCircleBorderColor(section)}` 
          }}
          title={section}
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default SectionSequence;
