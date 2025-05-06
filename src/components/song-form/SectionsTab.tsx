
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
            <span>Escribir acordes en una línea y letra en la siguiente</span>
          </div>
        </div>
        
        <ScrollArea className="h-96 border rounded-md p-4">
          <Textarea
            id="sectionText"
            className="min-h-[300px] font-mono"
            value={sectionText[activeSectionTab] || ""}
            onChange={onSectionTextChange}
            placeholder={`G
Mil generaciones

C            G2
Se postran adorarle

Em            D
Le cantan al cordero
      C
Que venció`}
            style={{
              fontFamily: "monospace",
              letterSpacing: "0",
              lineHeight: "1.5"
            }}
          />
        </ScrollArea>
        
        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-4 mt-2">
          <p className="font-medium text-amber-700">⚠️ Importante:</p>
          <p>Para mantener la alineación precisa de acordes sobre letras, use el formato de dos líneas:</p>
          <div className="mt-2 p-2 bg-white border rounded">
            <p className="font-mono text-xs text-gray-500">// Ejemplo de posicionamiento:</p>
            <p className="font-mono">C            G2</p>
            <p className="font-mono">Se postran adorarle</p>
          </div>
          <p className="mt-1">La ubicación exacta de cada acorde en el editor se mantendrá de forma idéntica en la guía generada.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionsTab;
