
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
            <span>Escribir acordes en una línea y letra en la siguiente, o usar formato [acorde]sílaba</span>
          </div>
        </div>
        
        <ScrollArea className="h-96 border rounded-md p-4">
          <Textarea
            id="sectionText"
            className="min-h-[300px] font-mono"
            value={sectionText[activeSectionTab] || ""}
            onChange={onSectionTextChange}
            placeholder={`G\nMil generaciones\n\nC            G2\nSe postran adorarle\n\nEm            D\nLe cantan al cordero\n      C\nQue venció\n\nO usar formato marcado:\n[G]Mil gene[C]ra[D]ciones\n[C]Se pos[G2]tran ado[D]rarle`}
            style={{
              fontFamily: "monospace",
              letterSpacing: "0",
              lineHeight: "1.5"
            }}
          />
        </ScrollArea>
        
        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-4 mt-2">
          <p className="font-medium text-amber-700">✨ Alineación precisa por sílaba:</p>
          <p>Use el formato <code className="bg-white px-1 py-0.5 rounded border">[acorde]</code> justo antes de la sílaba específica donde quiere que aparezca el acorde.</p>
          <div className="mt-2 p-2 bg-white border rounded">
            <p className="font-mono text-xs text-gray-500">// Ejemplo de posicionamiento por sílaba:</p>
            <p className="font-mono">Le [Em]can[D]tan al cor[G]dero Que ven[C]ció</p>
            <p className="font-mono text-xs text-gray-500 mt-2">// Se mostrará como:</p>
            <div className="font-mono relative h-5 mt-1">
              <span className="absolute text-sm font-bold" style={{left: "3ch"}}>Em</span>
              <span className="absolute text-sm font-bold" style={{left: "6ch"}}>D</span>
              <span className="absolute text-sm font-bold" style={{left: "14ch"}}>G</span>
              <span className="absolute text-sm font-bold" style={{left: "24ch"}}>C</span>
            </div>
            <p className="font-mono">Le cantan al cordero Que venció</p>
          </div>
          <p className="mt-2 text-xs text-amber-600">La ubicación exacta de cada acorde en el editor se mantendrá de forma idéntica en la guía generada.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionsTab;
