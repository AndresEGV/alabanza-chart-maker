
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Music } from "lucide-react";

interface SequenceTabProps {
  sequenceInput: string;
  onSequenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableSections: string[];
}

const SequenceTab: React.FC<SequenceTabProps> = ({
  sequenceInput,
  onSequenceChange,
  availableSections,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sequence">Secuencia de secciones</Label>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Ingrese la secuencia separando con espacios (ej: "I V1 C1 V2 C1 B F")
        </div>
        <Input
          id="sequence"
          value={sequenceInput}
          onChange={onSequenceChange}
          placeholder="I V1 C1 V2 C1 B F"
        />
        
        <div className="mt-6 p-4 border rounded-md bg-blue-50 text-blue-700">
          <div className="flex items-start">
            <Music className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Recordatorio de alineamiento de acordes:</p>
              <p className="text-sm">Para obtener la alineación exacta de acordes sobre las letras en la guía generada, 
                use el formato <code className="bg-white px-1 py-0.5 rounded border">[acorde]palabra</code> en la pestaña de Secciones.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 border rounded-md bg-slate-50">
          <div className="font-semibold mb-2">Secciones disponibles:</div>
          <div className="flex flex-wrap gap-2">
            {availableSections.map((type) => (
              <span key={type} className="px-2 py-1 bg-white border rounded text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceTab;
