
import React, { useState } from "react";
import { SectionType } from "@/types/song";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";

interface SectionNotesProps {
  sectionType: SectionType;
  notes?: { text: string; position: "left" | "right" }[];
  onAddNote: (note: { text: string; position: "left" | "right" }) => void;
  onDeleteNote: (index: number) => void;
}

const SectionNotes: React.FC<SectionNotesProps> = ({
  notes = [],
  onAddNote,
  onDeleteNote,
}) => {
  const [newNote, setNewNote] = useState({ text: "", position: "left" as "left" | "right" });

  const handleAddNote = () => {
    if (!newNote.text) return;
    onAddNote(newNote);
    setNewNote({ text: "", position: "left" });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Notas de sección</Label>
        <div className="flex gap-2">
          <select
            className="border rounded p-2"
            value={newNote.position}
            onChange={(e) => setNewNote((prev) => ({ ...prev, position: e.target.value as "left" | "right" }))}
          >
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
          </select>
          <Input
            placeholder="Agregar nota musical o indicación..."
            value={newNote.text}
            onChange={(e) => setNewNote((prev) => ({ ...prev, text: e.target.value }))}
          />
          <Button onClick={handleAddNote} disabled={!newNote.text}>
            Agregar Nota
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="space-y-2">
          <Label>Notas actuales:</Label>
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{note.position === "left" ? "Izquierda" : "Derecha"}: {note.text}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteNote(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionNotes;
