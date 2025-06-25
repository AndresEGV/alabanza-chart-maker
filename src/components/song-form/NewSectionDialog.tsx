
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface NewSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSectionCode: string;
  setNewSectionCode: (code: string) => void;
  newSectionTitle: string;
  setNewSectionTitle: (title: string) => void;
  onAddSection: () => void;
}

const NewSectionDialog: React.FC<NewSectionDialogProps> = ({
  open,
  onOpenChange,
  newSectionCode,
  setNewSectionCode,
  newSectionTitle,
  setNewSectionTitle,
  onAddSection,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onAddSection}
            disabled={!newSectionCode || !newSectionTitle}
          >
            Agregar sección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSectionDialog;
