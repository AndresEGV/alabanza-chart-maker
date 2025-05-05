
import React from "react";
import { SectionType, SongData } from "@/types/song";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import SectionSelector from "./SectionSelector";
import SectionNotes from "./SectionNotes";

interface SectionsTabProps {
  song: SongData;
  activeSectionTab: SectionType;
  sectionText: Record<SectionType, string>;
  onSectionSelect: (section: SectionType) => void;
  onDeleteSection: (section: SectionType) => void;
  onAddSectionClick: () => void;
  onSectionTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddNote: (note: { text: string; position: "left" | "right" }) => void;
  onDeleteNote: (index: number) => void;
}

const SectionsTab: React.FC<SectionsTabProps> = ({
  song,
  activeSectionTab,
  sectionText,
  onSectionSelect,
  onDeleteSection,
  onAddSectionClick,
  onSectionTextChange,
  onAddNote,
  onDeleteNote,
}) => {
  return (
    <div className="space-y-4">
      <SectionSelector 
        sections={song.sections}
        activeSection={activeSectionTab}
        onSectionSelect={onSectionSelect}
        onDeleteSection={onDeleteSection}
        onAddSectionClick={onAddSectionClick}
      />
      
      <SectionNotes
        sectionType={activeSectionTab}
        notes={song.sections[activeSectionTab]?.notes || []}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
      />
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="sectionText">Acordes y Letra</Label>
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            <span>Escribir acordes en una línea y letra en la siguiente, o usar [acorde]palabra para posicionamiento exacto</span>
          </div>
        </div>
        
        <ScrollArea className="h-96 border rounded-md p-4">
          <Textarea
            id="sectionText"
            className="min-h-[300px] font-mono"
            value={sectionText[activeSectionTab] || ""}
            onChange={onSectionTextChange}
            placeholder={`G\nMil generaciones\n\nC            G2\nSe postran adorarle\n\nO usar formato marcado:\n\n\n[G]Mil generaciones\n\n[C]Se [G2]postran adorarle`}
          />
        </ScrollArea>
        
        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
          <p className="font-medium">Nuevo formato disponible:</p>
          <p>Ahora puedes usar [acorde]palabra para posicionar acordes con precisión sobre palabras específicas.</p>
          <p className="mt-1">Ejemplo: <code>[G]Mil [C]gene[D]raciones</code> mostrará cada acorde exactamente sobre la palabra correspondiente.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionsTab;
