import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { KeyboardIcon } from 'lucide-react';

interface ShortcutItem {
  keys: string;
  description: string;
  category: string;
}

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: ShortcutItem[] = [
    // File operations
    { keys: 'Ctrl + S', description: 'Guardar manualmente', category: 'Archivo' },
    { keys: 'Ctrl + N', description: 'Nueva guía', category: 'Archivo' },
    { keys: 'Ctrl + P', description: 'Imprimir guía', category: 'Archivo' },
    { keys: 'Ctrl + E', description: 'Editar guía', category: 'Archivo' },
    
    // View operations
    { keys: 'Ctrl + H', description: 'Alternar vista de acordes', category: 'Vista' },
    
    // Music operations
    { keys: 'Ctrl + ↑', description: 'Transponer hacia arriba (+1 semitono)', category: 'Música' },
    { keys: 'Ctrl + ↓', description: 'Transponer hacia abajo (-1 semitono)', category: 'Música' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <KeyboardIcon className="mr-2 h-4 w-4" />
          Atajos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyboardIcon className="h-5 w-5" />
            Atajos de Teclado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(shortcut => shortcut.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los atajos funcionan cuando no estás escribiendo en campos de texto</li>
              <li>• Algunos atajos solo están disponibles en ciertos modos (edición/vista)</li>
              <li>• Presiona <kbd className="px-1 py-0.5 text-xs bg-white border rounded">Ctrl + S</kbd> regularmente para guardar tu trabajo</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}