/**
 * Musical Transposer - Sistema robusto de transposición basado en teoría musical
 * Maneja correctamente la enarmonía según las escalas de las tonalidades
 */

// 1. Mapeo de notas a semitonos (0-11)
const NOTE_TO_SEMITONE: Record<string, number> = {
    "C": 0, "B#": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4, "Fb": 4,
    "F": 5, "E#": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11, "Cb": 11
};

// 2. Escalas mayores para cada tonalidad (fundamental para enarmonía)
// Usando las escalas prácticas más comunes, evitando dobles alteraciones
const SCALE_NOTES_BY_KEY: Record<string, string[]> = {
    "C": ["C", "D", "E", "F", "G", "A", "B"],
    "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],       // C# Mayor corregida
    "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    "D": ["D", "E", "F#", "G", "A", "B", "C#"],
    "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "F": ["F", "G", "A", "Bb", "C", "D", "E"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],       // F# Mayor corregida
    "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],       // Gb Mayor corregida
    "G": ["G", "A", "B", "C", "D", "E", "F#"],
    "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"]
};

// 3. Opciones enarmónicas para cada semitono
const ENHARMONIC_OPTIONS: Record<number, string[]> = {
    0: ["C", "B#"],
    1: ["C#", "Db"],
    2: ["D"],
    3: ["D#", "Eb"],
    4: ["E", "Fb"],
    5: ["F", "E#"],
    6: ["F#", "Gb"],
    7: ["G"],
    8: ["G#", "Ab"],
    9: ["A"],
    10: ["A#", "Bb"],
    11: ["B", "Cb"]
};

// Interface para acordes parseados
interface ParsedChord {
    root: string;
    quality: string;
    bassNote?: string;
}

/**
 * Función CRÍTICA: Obtiene el nombre correcto de nota según la tonalidad destino
 */
function getNoteNameFromSemitone(semitoneValue: number, targetKey: string): string {
    // Normalizar el semitono al rango 0-11
    const normalizedSemitone = ((semitoneValue % 12) + 12) % 12;
    const possibleNotes = ENHARMONIC_OPTIONS[normalizedSemitone];
    
    // Si solo hay una opción, devolverla
    if (possibleNotes.length === 1) {
        return possibleNotes[0];
    }
    
    // Obtener la escala de la tonalidad destino
    const targetScale = SCALE_NOTES_BY_KEY[targetKey];
    
    if (!targetScale) {
        // Si no encontramos la tonalidad, usar preferencias por defecto
        return getDefaultEnharmonicChoice(normalizedSemitone, targetKey);
    }
    
    // Buscar cuál de las opciones enarmónicas está en la escala destino
    for (const note of possibleNotes) {
        if (targetScale.includes(note)) {
            return note;
        }
    }
    
    // Si ninguna está en la escala (acorde cromático), aplicar lógica inteligente
    return getDefaultEnharmonicChoice(normalizedSemitone, targetKey);
}

/**
 * Lógica por defecto para elegir entre opciones enarmónicas
 */
function getDefaultEnharmonicChoice(semitone: number, targetKey: string): string {
    const possibleNotes = ENHARMONIC_OPTIONS[semitone];
    
    if (possibleNotes.length === 1) {
        return possibleNotes[0];
    }
    
    // Solo evitar estas notas si NO están en la escala destino
    const targetScale = SCALE_NOTES_BY_KEY[targetKey];
    const avoidNotes = ['E#', 'B#', 'Cb', 'Fb'];
    const validOptions = possibleNotes.filter(note => 
        !avoidNotes.includes(note) || (targetScale && targetScale.includes(note))
    );
    
    if (validOptions.length > 0) {
        // Si hay opciones válidas, usar lógica de tonalidad
        const keyType = getKeyType(targetKey);
        
        if (keyType === 'flat') {
            return validOptions.find(note => note.includes('b')) || validOptions[0];
        } else if (keyType === 'sharp') {
            return validOptions.find(note => note.includes('#')) || validOptions[0];
        } else {
            // Para C mayor, preferir notas naturales
            return validOptions.find(note => !note.includes('#') && !note.includes('b')) || validOptions[0];
        }
    }
    
    // Si todas las opciones son problemáticas, devolver la primera
    return possibleNotes[0];
}

/**
 * Determina si una tonalidad es predominantemente de sostenidos o bemoles
 */
function getKeyType(key: string): 'sharp' | 'flat' | 'natural' {
    const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
    const sharpKeys = ['G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
    
    if (flatKeys.includes(key)) return 'flat';
    if (sharpKeys.includes(key)) return 'sharp';
    return 'natural';
}

/**
 * Parsea un acorde en sus componentes
 */
function parseChord(chordString: string): ParsedChord {
    // Regex para capturar: raíz + calidad + bajo opcional
    const chordRegex = /^([A-G][#b]?)([^/]*?)(?:\/([A-G][#b]?))?$/;
    const match = chordString.match(chordRegex);
    
    if (!match) {
        throw new Error(`No se pudo parsear el acorde: ${chordString}`);
    }
    
    const [, root, quality, bassNote] = match;
    
    return {
        root: root,
        quality: quality || '',
        bassNote: bassNote
    };
}

/**
 * Reconstruye un acorde desde sus componentes
 */
function reconstructChord(parsedChord: ParsedChord): string {
    let result = parsedChord.root + parsedChord.quality;
    
    if (parsedChord.bassNote) {
        result += '/' + parsedChord.bassNote;
    }
    
    return result;
}

/**
 * Transpone una nota individual
 */
export function transposeNote(note: string, originalKey: string, targetKey: string): string {
    // Calcular desplazamiento en semitonos
    const originalSemitone = NOTE_TO_SEMITONE[originalKey];
    const targetSemitone = NOTE_TO_SEMITONE[targetKey];
    const semitonesToTranspose = (targetSemitone - originalSemitone + 12) % 12;
    
    // Obtener semitono de la nota original
    const noteSemitone = NOTE_TO_SEMITONE[note];
    if (noteSemitone === undefined) {
        throw new Error(`Nota inválida: ${note}`);
    }
    
    // Calcular nuevo semitono
    const newSemitone = (noteSemitone + semitonesToTranspose) % 12;
    
    // Obtener nombre correcto según la tonalidad destino
    return getNoteNameFromSemitone(newSemitone, targetKey);
}

/**
 * Transpone un acorde individual
 */
export function transposeChord(chordString: string, originalKey: string, targetKey: string): string {
    if (!chordString || originalKey === targetKey) {
        return chordString;
    }
    
    try {
        const parsed = parseChord(chordString);
        
        // Transponer la raíz
        parsed.root = transposeNote(parsed.root, originalKey, targetKey);
        
        // Transponer el bajo si existe
        if (parsed.bassNote) {
            parsed.bassNote = transposeNote(parsed.bassNote, originalKey, targetKey);
        }
        
        return reconstructChord(parsed);
    } catch (error) {
        console.warn(`Error transponiendo acorde ${chordString}:`, error);
        return chordString;
    }
}

/**
 * Transpone una línea completa de acordes
 */
export function transposeLine(line: string, originalKey: string, targetKey: string): string {
    if (!line || originalKey === targetKey) {
        return line;
    }
    
    // Regex para encontrar acordes
    const chordRegex = /\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|°|\d)*(?:\/[A-G][#b]?)?)\b/g;
    
    return line.replace(chordRegex, (match, chord) => {
        // Filtrar palabras que no son acordes
        if (chord.length > 12 || (chord.match(/[a-z]/g) || []).length > 4) {
            return match;
        }
        
        // Lista de palabras comunes que no son acordes
        const nonChordWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 
            'que', 'y', 'o', 'con', 'sin', 'por', 'para', 'en', 'al', 'se', 'te', 
            'le', 'lo', 'me', 'mi', 'tu', 'su', 'no', 'es', 'son', 'fue', 'ha', 
            'he', 'muy', 'mas', 'solo', 'todo', 'toda'];
        
        if (nonChordWords.includes(chord.toLowerCase())) {
            return match;
        }
        
        return transposeChord(chord, originalKey, targetKey);
    });
}

/**
 * Función principal: Transpone una canción completa
 */
export function transposeSong(songData: any, originalKey: string, targetKey: string): any {
    if (!songData || originalKey === targetKey) {
        return songData;
    }
    
    return {
        ...songData,
        sections: Object.fromEntries(
            Object.entries(songData.sections).map(([key, section]: [string, any]) => [
                key,
                {
                    ...section,
                    lines: section.lines.map((line: any) => ({
                        ...line,
                        chords: transposeLine(line.chords, originalKey, targetKey)
                    }))
                }
            ])
        )
    };
}

/**
 * Calcula los semitonos de diferencia entre dos tonalidades
 */
export function calculateSemitonesDifference(originalKey: string, targetKey: string): number {
    const originalSemitone = NOTE_TO_SEMITONE[originalKey];
    const targetSemitone = NOTE_TO_SEMITONE[targetKey];
    
    if (originalSemitone === undefined || targetSemitone === undefined) {
        throw new Error(`Tonalidad inválida: ${originalKey} o ${targetKey}`);
    }
    
    return (targetSemitone - originalSemitone + 12) % 12;
}

/**
 * Obtiene el nombre del intervalo musical
 */
export function getIntervalName(semitones: number): string {
    const intervals = [
        'Unísono',      // 0
        '2ª menor',     // 1
        '2ª mayor',     // 2
        '3ª menor',     // 3
        '3ª mayor',     // 4
        '4ª justa',     // 5
        'Tritono',      // 6
        '5ª justa',     // 7
        '6ª menor',     // 8
        '6ª mayor',     // 9
        '7ª menor',     // 10
        '7ª mayor'      // 11
    ];
    
    const normalizedSemitones = ((semitones % 12) + 12) % 12;
    return intervals[normalizedSemitones] || 'Desconocido';
}