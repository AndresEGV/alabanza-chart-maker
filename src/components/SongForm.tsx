import React, { useState } from "react";
import { LayoutType, SectionType, SongData, SongSection as SongSectionType } from "../types/song";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { parseChordLyricTextInput } from "@/utils/songUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Info, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SongFormProps {
  initialSong: SongData;
  onSongUpdate: (song: SongData) => void;
  onLayoutChange: (layout: LayoutType) => void;
  currentLayout: LayoutType;
}

const SongForm: React.FC<SongFormProps> = ({
  initialSong,
  onSongUpdate,
  onLayoutChange,
  currentLayout,
}) => {
  const [song, setSong] = useState<SongData>(initialSong);
  const [activeSectionTab, setActiveSectionTab] = useState<SectionType>("I");
  const [sectionText, setSectionText] = useState<Record<SectionType, string>>({} as Record<SectionType, string>);
  const [sequenceInput, setSequenceInput] = useState<string>(
    initialSong.sectionSequence.join(" ")
  );
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [newSectionCode, setNewSectionCode] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // Initialize section text from song data
  React.useEffect(() => {
    const initialSectionText: Record<SectionType, string> = {} as Record<SectionType, string>;
    
    Object.entries(initialSong.sections).forEach(([type, section]) => {
      const lines = section.lines.map(line => `${line.chords}\n${line.lyrics}`).join('\n\n');
      initialSectionText[type as SectionType] = lines;
    });
    
    setSectionText(initialSectionText);
  }, [initialSong]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSectionText(prev => ({
      ...prev,
      [activeSectionTab]: value
    }));
  };

  const handleSequenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceInput(e.target.value);
    const sequence = e.target.value.split(/\s+/).filter(Boolean) as SectionType[];
    setSong(prev => ({
      ...prev,
      sectionSequence: sequence
    }));
  };

  const handleAddSection = () => {
    if (!newSectionCode || !newSectionTitle) return;
    
    // Add the new section type to the song sections
    const sectionCode = newSectionCode as SectionType;
    
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionCode]: {
          type: sectionCode,
          title: newSectionTitle,
          lines: [{ chords: "", lyrics: "" }]
        }
      }
    }));
    
    // Add empty text for the new section
    setSectionText(prev => ({
      ...prev,
      [sectionCode]: ""
    }));
    
    // Set the new section as active
    setActiveSectionTab(sectionCode);
    
    // Reset form fields
    setNewSectionCode("");
    setNewSectionTitle("");
    setNewSectionDialogOpen(false);
  };

  const handleDeleteSection = (sectionType: SectionType) => {
    // Cannot delete if it's the only section
    if (Object.keys(song.sections).length <= 1) return;
    
    // Create a new sections object without the deleted section
    const { [sectionType]: removedSection, ...remainingSections } = song.sections;
    
    // Update the sequence by removing the deleted section
    const updatedSequence = song.sectionSequence.filter(type => type !== sectionType);
    
    // Set a new active section if the current one is being deleted
    if (activeSectionTab === sectionType) {
      const firstRemainingSection = Object.keys(remainingSections)[0] as SectionType;
      setActiveSectionTab(firstRemainingSection);
    }
    
    // Update the song state
    setSong(prev => ({
      ...prev,
      sections: remainingSections,
      sectionSequence: updatedSequence
    }));
    
    // Update the sequence input
    setSequenceInput(updatedSequence.join(" "));
    
    // Remove the section from the text state
    const { [sectionType]: removedText, ...remainingText } = sectionText;
    setSectionText(remainingText as Record<SectionType, string>);
  };

  const handleGenerateChart = () => {
    // Parse section text into chord-lyric pairs
    const updatedSections = { ...song.sections };
    
    Object.entries(sectionText).forEach(([type, text]) => {
      const lines = parseChordLyricTextInput(text);
      updatedSections[type as SectionType] = {
        ...updatedSections[type as SectionType],
        lines
      };
    });
    
    const updatedSong = {
      ...song,
      sections: updatedSections,
      sectionSequence: sequenceInput.split(/\s+/).filter(Boolean) as SectionType[]
    };
    
    onSongUpdate(updatedSong);
  };

  const [newNote, setNewNote] = useState({ text: "", position: "left" as "left" | "right" });

  const handleAddNote = () => {
    if (!newNote.text) return;
    
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [activeSectionTab]: {
          ...prev.sections[activeSectionTab],
          notes: [
            ...(prev.sections[activeSectionTab].notes || []),
            { text: newNote.text, position: newNote.position }
          ]
        }
      }
    }));
    
    setNewNote({ text: "", position: "left" });
  };

  const handleDeleteNote = (noteIndex: number) => {
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [activeSectionTab]: {
          ...prev.sections[activeSectionTab],
          notes: prev.sections[activeSectionTab].notes?.filter((_, i) => i !== noteIndex)
        }
      }
    }));
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Información básica</TabsTrigger>
            <TabsTrigger value="sections">Secciones</TabsTrigger>
            <TabsTrigger value="sequence">Secuencia</TabsTrigger>
            <TabsTrigger value="layout">Diseño</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={song.title}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist">Artista</Label>
                <Input
                  id="artist"
                  name="artist"
                  value={song.artist}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key">Tono</Label>
                <Input
                  id="key"
                  name="key"
                  value={song.key}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo</Label>
                <Input
                  id="tempo"
                  name="tempo"
                  value={song.tempo}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSignature">Compás</Label>
                <Input
                  id="timeSignature"
                  name="timeSignature"
                  value={song.timeSignature}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="composer">Compositor(es)</Label>
                <Input
                  id="composer"
                  name="composer"
                  value={song.composer || ""}
                  onChange={handleBasicInfoChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-lg font-semibold">Secciones disponibles</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setNewSectionDialogOpen(true)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Agregar sección
              </Button>
            </div>
            
            <div className="flex overflow-x-auto py-2 mb-2 gap-1">
              {Object.entries(song.sections).map(([type, section]) => (
                <div key={type} className="flex-shrink-0 flex items-center">
                  <Button
                    variant={activeSectionTab === type ? "default" : "outline"}
                    onClick={() => setActiveSectionTab(type as SectionType)}
                    className="flex-shrink-0"
                  >
                    {type} - {section.title}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-1"
                    onClick={() => handleDeleteSection(type as SectionType)}
                    disabled={Object.keys(song.sections).length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Notas de sección</Label>
                <div className="flex gap-2">
                  <select 
                    className="border rounded p-2"
                    value={newNote.position}
                    onChange={(e) => setNewNote(prev => ({ ...prev, position: e.target.value as "left" | "right" }))}
                  >
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                  <Input
                    placeholder="Agregar nota musical o indicación..."
                    value={newNote.text}
                    onChange={(e) => setNewNote(prev => ({ ...prev, text: e.target.value }))}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.text}>
                    Agregar Nota
                  </Button>
                </div>
              </div>

              {song.sections[activeSectionTab]?.notes && (
                <div className="space-y-2">
                  <Label>Notas actuales:</Label>
                  <div className="space-y-2">
                    {song.sections[activeSectionTab].notes.map((note, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{note.position === "left" ? "Izquierda" : "Derecha"}: {note.text}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="sectionText">Acordes y Letra</Label>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    Escribir acordes en una línea y letra en la siguiente
                  </div>
                </div>
                
                <ScrollArea className="h-96 border rounded-md p-4">
                  <Textarea
                    id="sectionText"
                    className="min-h-[300px] font-mono"
                    value={sectionText[activeSectionTab] || ""}
                    onChange={handleSectionTextChange}
                    placeholder={`G\nMil generaciones\n\nC            G2\nSe postran adorarle`}
                  />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sequence" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sequence">Secuencia de secciones</Label>
              <div className="text-sm text-muted-foreground mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Ingrese la secuencia separando con espacios (ej: "I V1 C1 V2 C1 B F")
              </div>
              <Input
                id="sequence"
                value={sequenceInput}
                onChange={handleSequenceChange}
                placeholder="I V1 C1 V2 C1 B F"
              />
              
              <div className="mt-4 p-4 border rounded-md bg-slate-50">
                <div className="font-semibold mb-2">Secciones disponibles:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(song.sections).map((type) => (
                    <span key={type} className="px-2 py-1 bg-white border rounded text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <Label className="block mb-2">Diseño de la página</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={currentLayout === LayoutType.TWO_COLUMN ? "default" : "outline"}
                  onClick={() => onLayoutChange(LayoutType.TWO_COLUMN)}
                  className="h-40 flex flex-col justify-center items-center p-4"
                >
                  <div className="w-full h-full border rounded flex">
                    <div className="border-r w-1/2"></div>
                    <div className="w-1/2"></div>
                  </div>
                  <span className="mt-2">Dos columnas</span>
                </Button>
                
                <Button
                  variant={currentLayout === LayoutType.SINGLE_COLUMN ? "default" : "outline"}
                  onClick={() => onLayoutChange(LayoutType.SINGLE_COLUMN)}
                  className="h-40 flex flex-col justify-center items-center p-4"
                >
                  <div className="w-full h-full border rounded"></div>
                  <span className="mt-2">Una columna</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleGenerateChart}>Generar Guía</Button>
        </div>

        {/* Dialog for adding a new section */}
        <Dialog open={newSectionDialogOpen} onOpenChange={setNewSectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nueva sección</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sectionCode">Código de sección</Label>
                <div className="text-xs text-muted-foreground mb-1">
                  Código corto (1-4 caracteres) como "V1", "C2", "B", etc.
                </div>
                <Input
                  id="sectionCode"
                  value={newSectionCode}
                  onChange={(e) => setNewSectionCode(e.target.value)}
                  placeholder="Ej: V3, Bs, PC"
                  maxLength={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sectionTitle">Título de sección</Label>
                <div className="text-xs text-muted-foreground mb-1">
                  Nombre completo como "VERSO 3", "PUENTE", etc.
                </div>
                <Input
                  id="sectionTitle"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Ej: VERSO 3, PUENTE, PRE-CORO"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewSectionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddSection}
                disabled={!newSectionCode || !newSectionTitle}
              >
                Agregar sección
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SongForm;
