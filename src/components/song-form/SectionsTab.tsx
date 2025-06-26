
import React, { useRef } from "react";
import { SectionType, SongData, ChordLyricLine } from "@/types/song";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import SectionSelector from "./SectionSelector";
import SectionNotes from "./SectionNotes";
import { parseChordLyricTextInput } from "@/utils/chordParser";
import FormatToolbar from "@/components/FormatToolbar";
import { applyFormat, parseFormattedText } from "@/utils/textFormatter";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleFormat = (format: 'bold' | 'italic') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const { selectionStart, selectionEnd } = textarea;
    const currentText = sectionText[activeSectionTab] || '';
    
    const { newText, newSelectionStart, newSelectionEnd } = applyFormat(
      currentText,
      selectionStart,
      selectionEnd,
      format
    );
    
    // Create synthetic event to update the text
    const syntheticEvent = {
      target: {
        value: newText
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onSectionTextChange(syntheticEvent);
    
    // Restore selection after React re-renders
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
    }, 0);
  };
  // Preview the chord-lyric parsing to show how it will render
  const previewParsedLines = () => {
    if (!sectionText[activeSectionTab]) return null;
    
    const parsedLines = parseChordLyricTextInput(sectionText[activeSectionTab]);
    
    return (
      <div className="mt-4 p-4 bg-slate-50 rounded-md border font-mono text-sm">
        <h4 className="text-sm font-medium mb-2 text-slate-500">Preview:</h4>
        {parsedLines.map((line, i) => {
          // Only show chord line if it has content
          const hasChords = line.chords && line.chords.trim().length > 0;
          
          return (
            <div key={i} className="mb-0">
              {hasChords && (
                <div 
                  className="text-blue-600 font-bold leading-none" 
                  style={{ 
                    fontFamily: "'Courier New', monospace",
                    whiteSpace: "pre",
                    letterSpacing: "0",
                    lineHeight: "1",
                    height: "1em",
                    marginBottom: "0"
                  }}
                >
                  {line.chords}
                </div>
              )}
              {line.lyrics && (
                <div 
                  style={{ 
                    fontFamily: "'Courier New', monospace",
                    whiteSpace: "pre",
                    letterSpacing: "0",
                    lineHeight: "1.1",
                    marginTop: "0"
                  }}
                >
                  {parseFormattedText(line.lyrics).map((segment, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: segment.bold ? 'bold' : 'normal',
                        fontStyle: segment.italic ? 'italic' : 'normal'
                      }}
                    >
                      {segment.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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
          <div className="flex items-center gap-4">
            <Label htmlFor="sectionText">Acordes y Letra</Label>
            <FormatToolbar onFormat={handleFormat} />
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            <span>Escribir acordes en una línea y letra en la siguiente</span>
          </div>
        </div>
        
        <ScrollArea className="h-96 border rounded-md p-4">
          <Textarea
            ref={textareaRef}
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
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0",
              lineHeight: "1.5",
              whiteSpace: "pre",
              tabSize: 2,
              resize: "vertical",
              width: "100%"
            }}
          />
        </ScrollArea>
        
        {/* Preview the chord-lyric parsing to help users understand how it will render */}
        {sectionText[activeSectionTab]?.trim() && previewParsedLines()}
        
        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-4 mt-2">
          <p className="font-medium text-amber-700">⚠️ Importante:</p>
          <p>Para mantener la alineación precisa de acordes sobre letras:</p>
          <div className="mt-2 p-2 bg-white border rounded">
            <p className="font-mono text-xs text-gray-500">// Ejemplo de posicionamiento:</p>
            <p className="font-mono">C            G2</p>
            <p className="font-mono">Se postran adorarle</p>
          </div>
          <p className="mt-1">La ubicación exacta de cada acorde en el editor se mantendrá de forma idéntica en la guía generada.</p>
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <p className="font-medium text-amber-700">Formato de texto:</p>
            <p className="mt-1">• Negrita: **texto en negrita**</p>
            <p>• Cursiva: _texto en cursiva_</p>
            <p>• Negrita y cursiva: **_texto_** o _**texto**_</p>
            <p className="mt-2 text-xs">Selecciona el texto y usa los botones para aplicar/quitar formato</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsTab;
