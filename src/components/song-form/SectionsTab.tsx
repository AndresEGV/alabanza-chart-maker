
import React, { useRef, useState } from "react";
import { SectionType, SongData, ChordLyricLine } from "@/types/song";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showHelp, setShowHelp] = useState(false);
  
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
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            <span>Ayuda</span>
            {showHelp ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </button>
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
        
        {/* Collapsible Help Section */}
        {showHelp && (
          <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Basic Instructions */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Instrucciones básicas
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• Escribir acordes en una línea y letra en la siguiente</li>
                  <li>• La ubicación exacta de acordes se mantiene en la guía</li>
                  <li>• Usa los botones de formato o markdown</li>
                </ul>
                
                <div className="mt-3 p-2 bg-white border border-blue-100 rounded">
                  <p className="font-mono text-xs">C         G2/B  Em7  D</p>
                  <p className="font-mono text-xs">Se postran adorarle</p>
                </div>
              </div>
              
              {/* Column 2: Format & Repetitions */}
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Formato y Repeticiones</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Formato:</span>
                    <ul className="ml-2 mt-1">
                      <li>• **negrita**, _cursiva_, **_ambos_**</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Repeticiones:</span>
                    <ul className="ml-2 mt-1">
                      <li>• Agrega X2, X3, X4 en cualquier línea</li>
                      <li>• Aparecerá en el círculo de la sección</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Preview the chord-lyric parsing to help users understand how it will render */}
        {sectionText[activeSectionTab]?.trim() && previewParsedLines()}
      </div>
    </div>
  );
};

export default SectionsTab;
