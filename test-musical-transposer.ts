import { 
    transposeNote, 
    transposeChord, 
    transposeLine,
    calculateSemitonesDifference 
} from './src/utils/musicalTransposer';

console.log('=== Pruebas del Sistema Musical de Transposición ===\n');

// Datos de prueba: progresión en G
const progressionInG = 'C D G2/B Em7 D';

// Escenario 1: Transponer de G a Ab
console.log('Escenario 1: G → Ab');
console.log(`Original (G):     ${progressionInG}`);
const gToAb = transposeLine(progressionInG, 'G', 'Ab');
console.log(`Transpuesto (Ab): ${gToAb}`);
console.log(`Esperado:         Db Eb Ab2/C Fm7 Eb`);
console.log(`Semitonos:        ${calculateSemitonesDifference('G', 'Ab')} (subir 1)\n`);

// Escenario 2: Transponer de G a F#
console.log('Escenario 2: G → F#');
console.log(`Original (G):     ${progressionInG}`);
const gToFs = transposeLine(progressionInG, 'G', 'F#');
console.log(`Transpuesto (F#): ${gToFs}`);
console.log(`Esperado:         B C# F#2/A# D#m7 C#`);
console.log(`Semitonos:        ${calculateSemitonesDifference('G', 'F#')} (bajar 1 = subir 11)\n`);

// Escenario 3: Transponer de F# de vuelta a G (El problema original)
console.log('Escenario 3: F# → G (Vuelta al original)');
console.log(`Original (F#):    ${gToFs}`);
const fsToG = transposeLine(gToFs, 'F#', 'G');
console.log(`Transpuesto (G):  ${fsToG}`);
console.log(`Esperado:         ${progressionInG}`);
console.log(`Semitonos:        ${calculateSemitonesDifference('F#', 'G')} (subir 1)\n`);

// Pruebas de notas individuales para verificar enarmonía
console.log('=== Pruebas de Notas Individuales ===');

console.log('\nG → Ab (semitono 1):');
['C', 'D', 'G', 'E', 'B'].forEach(note => {
    const transposed = transposeNote(note, 'G', 'Ab');
    console.log(`  ${note} → ${transposed}`);
});

console.log('\nG → F# (semitono 11):');
['C', 'D', 'G', 'E', 'B'].forEach(note => {
    const transposed = transposeNote(note, 'G', 'F#');
    console.log(`  ${note} → ${transposed}`);
});

console.log('\nF# → G (semitono 1):');
['B', 'C#', 'F#', 'D#', 'A#'].forEach(note => {
    const transposed = transposeNote(note, 'F#', 'G');
    console.log(`  ${note} → ${transposed}`);
});

// Prueba específica del problema reportado
console.log('\n=== Prueba del Problema Reportado ===');
console.log('Problema: C# (en F#) → D (en G) - debe ser D, no C##');
const problematicNote = transposeNote('C#', 'F#', 'G');
console.log(`C# (F#) → ${problematicNote} (G) - ${problematicNote === 'D' ? '✓ CORRECTO' : '✗ INCORRECTO'}`);

// Pruebas adicionales de enarmonía
console.log('\n=== Pruebas Adicionales de Enarmonía ===');

const additionalTests = [
    { note: 'Db', from: 'Ab', to: 'A', expected: 'C#' },
    { note: 'Eb', from: 'Bb', to: 'B', expected: 'D#' },
    { note: 'Gb', from: 'Db', to: 'D', expected: 'F#' },
    { note: 'Ab', from: 'Eb', to: 'E', expected: 'G#' },
    { note: 'Bb', from: 'F', to: 'F#', expected: 'A#' }
];

additionalTests.forEach(({ note, from, to, expected }) => {
    const result = transposeNote(note, from, to);
    const isCorrect = result === expected;
    console.log(`${note} (${from}) → ${result} (${to}) - Esperado: ${expected} ${isCorrect ? '✓' : '✗'}`);
});

// Test de acordes complejos
console.log('\n=== Pruebas de Acordes Complejos ===');
const complexChords = ['Cmaj7', 'Em7', 'Am9', 'F#dim', 'G/B', 'D7sus4'];

console.log('\nDe C mayor a Db mayor:');
complexChords.forEach(chord => {
    const transposed = transposeChord(chord, 'C', 'Db');
    console.log(`  ${chord} → ${transposed}`);
});

console.log('\nDe C mayor a C# mayor:');
complexChords.forEach(chord => {
    const transposed = transposeChord(chord, 'C', 'C#');
    console.log(`  ${chord} → ${transposed}`);
});