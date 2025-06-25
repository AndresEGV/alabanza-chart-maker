
import React from "react";
import { SectionType, SongData } from "@/types/song";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";

interface SectionSelectorProps {
  sections: Record<SectionType, { title: string }>;
  activeSection: SectionType;
  onSectionSelect: (section: SectionType) => void;
  onDeleteSection: (section: SectionType) => void;
  onAddSectionClick: () => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onDeleteSection,
  onAddSectionClick,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">Secciones disponibles</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSectionClick}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Agregar sección
        </Button>
      </div>
      
      <div className="flex overflow-x-auto py-2 mb-2 gap-1">
        {Object.entries(sections).map(([type, section]) => (
          <div key={type} className="flex-shrink-0 flex items-center">
            <Button
              variant={activeSection === type ? "default" : "outline"}
              onClick={() => onSectionSelect(type as SectionType)}
              className="flex-shrink-0"
            >
              {type} - {section.title}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={() => onDeleteSection(type as SectionType)}
              disabled={Object.keys(sections).length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionSelector;
