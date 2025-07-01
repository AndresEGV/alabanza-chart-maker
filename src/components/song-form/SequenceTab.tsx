import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, GripVertical, Plus, X, ToggleLeft, ToggleRight, Music } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { defaultSectionColors } from "@/types/song";

interface SequenceTabProps {
  sequenceInput: string;
  onSequenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableSections: string[];
}

interface SortableItemProps {
  id: string;
  section: string;
  onRemove: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, section, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get color for the section
  const baseType = section.charAt(0);
  const sectionColor = defaultSectionColors[section] || 
                      defaultSectionColors[baseType] || 
                      defaultSectionColors.default;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 bg-white border-2 rounded-lg shadow-sm transition-all hover:shadow-md cursor-grab hover:cursor-grabbing ${
        isDragging ? "opacity-50 z-50 shadow-lg cursor-grabbing" : ""
      } min-w-[120px] touch-none`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-gray-400 pointer-events-none" />
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ 
          backgroundColor: "white",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: sectionColor 
        }}
      >
        {section}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onRemove}
            className="ml-auto p-1 hover:bg-red-50 hover:text-red-600 rounded transition-all duration-200"
            type="button"
          >
            <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Eliminar sección</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const SequenceTab: React.FC<SequenceTabProps> = ({
  sequenceInput,
  onSequenceChange,
  availableSections,
}) => {
  const [useVisualMode, setUseVisualMode] = useState(true);
  const [sequence, setSequence] = useState<string[]>(
    sequenceInput ? sequenceInput.split(" ").filter(s => s.trim()) : []
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSequence((items) => {
        // Find indices based on the full ID (including index)
        const activeId = active.id as string;
        const overId = over.id as string;
        
        const oldIndex = items.findIndex((item, idx) => `${item}-${idx}` === activeId);
        const newIndex = items.findIndex((item, idx) => `${item}-${idx}` === overId);
        
        if (oldIndex === -1 || newIndex === -1) return items;
        
        const newSequence = arrayMove(items, oldIndex, newIndex);
        
        // Update the text input
        const syntheticEvent = {
          target: { value: newSequence.join(" ") },
        } as React.ChangeEvent<HTMLInputElement>;
        onSequenceChange(syntheticEvent);
        
        return newSequence;
      });
    }
    setActiveId(null);
  };

  const addSection = (section: string) => {
    const newSequence = [...sequence, section];
    setSequence(newSequence);
    
    // Update the text input
    const syntheticEvent = {
      target: { value: newSequence.join(" ") },
    } as React.ChangeEvent<HTMLInputElement>;
    onSequenceChange(syntheticEvent);
  };

  const removeSection = (index: number) => {
    const newSequence = sequence.filter((_, i) => i !== index);
    setSequence(newSequence);
    
    // Update the text input
    const syntheticEvent = {
      target: { value: newSequence.join(" ") },
    } as React.ChangeEvent<HTMLInputElement>;
    onSequenceChange(syntheticEvent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSequenceChange(e);
    const newSequence = e.target.value.split(" ").filter(s => s.trim());
    setSequence(newSequence);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="sequence">Secuencia de secciones</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setUseVisualMode(!useVisualMode)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {useVisualMode ? (
                  <>
                    <ToggleRight className="h-4 w-4" />
                    <span>Modo visual</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4" />
                    <span>Modo texto</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cambiar a modo {useVisualMode ? "texto" : "visual"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {useVisualMode ? (
          <>
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Arrastra para reordenar o haz clic en las secciones disponibles para agregar</span>
            </div>

            {/* Draggable sequence */}
            <div className={`p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border-2 border-dashed transition-all ${
              sequence.length === 0 ? "border-gray-300" : "border-gray-200"
            } ${sequence.length < 4 ? "min-h-[80px]" : "min-h-[120px]"}`}>
              {sequence.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Music className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-center text-gray-400 text-sm font-medium">
                    Haz clic en las secciones disponibles para comenzar
                  </p>
                  <p className="text-center text-gray-400 text-xs mt-1">
                    o arrastra para reordenar
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sequence.map((_, index) => `${sequence[index]}-${index}`)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="flex flex-wrap gap-2">
                      {sequence.map((section, index) => (
                        <SortableItem
                          key={`${section}-${index}`}
                          id={`${section}-${index}`}
                          section={section}
                          onRemove={() => removeSection(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 rounded-lg shadow-2xl transform rotate-3">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                          style={{ 
                            backgroundColor: "white",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            borderColor: defaultSectionColors[activeId.split('-')[0]] || defaultSectionColors.default
                          }}
                        >
                          {activeId.split('-')[0]}
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>

            {/* Available sections */}
            <div className="mt-4 p-4 border rounded-md bg-slate-50">
              <div className="font-semibold mb-2">Secciones disponibles:</div>
              <div className="flex flex-wrap gap-2">
                {availableSections.map((type) => {
                  const baseType = type.charAt(0);
                  const sectionColor = defaultSectionColors[type] || 
                                      defaultSectionColors[baseType] || 
                                      defaultSectionColors.default;
                  
                  return (
                    <Tooltip key={type}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => addSection(type)}
                          className="group flex items-center gap-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{ 
                              backgroundColor: "white",
                              borderWidth: "2px",
                              borderStyle: "solid",
                              borderColor: sectionColor 
                            }}
                          >
                            {type}
                          </div>
                          <Plus className="h-3 w-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Agregar sección {type}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Ingrese la secuencia separando con espacios (ej: "I V1 C1 V2 C1 B F")</span>
            </div>
            <Input
              id="sequence"
              value={sequenceInput}
              onChange={handleTextChange}
              placeholder="I V1 C1 V2 C1 B F"
            />
            
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
          </>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
};

export default SequenceTab;