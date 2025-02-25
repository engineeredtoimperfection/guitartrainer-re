/**
 * getTriadShape
 *
 * Generates a guitar triad shape based on the specified root note, triad type, string set, and fret range.
 * The function can return either a deterministic shape (smallest fret numbers) or a random valid shape.
 *
 * @param {string} root - The root note of the triad (e.g., 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B').
 * @param {string} type - The triad type ('major', 'minor', 'diminished', 'augmented').
 * @param {number[]} stringSet - An array of three consecutive string numbers (e.g., [1, 2, 3] for high E, B, G strings).
 * @param {Object} fretbox - An object specifying the fret range { min: number, max: number } (e.g., { min: 0, max: 4 }).
 * @param {boolean} [random=false] - If true, selects a random valid shape; if false, selects the shape with the smallest fret numbers.
 * @returns {Object|null} - An object { strings: number[], frets: number[] } representing the triad shape, or null if no valid shape is found.
 *
 * @example
 * // Deterministic: Get C major triad on strings 1-2-3, frets 0-4
 * const shape1 = getTriadShape('C', 'major', [1, 2, 3], { min: 0, max: 4 });
 * console.log(shape1); // { strings: [1, 2, 3], frets: [3, 3, 2] }
 *
 * @example
 * // Random: Get a random C major triad on strings 1-2-3, frets 0-4
 * const shape2 = getTriadShape('C', 'major', [1, 2, 3], { min: 0, max: 4 }, true);
 * console.log(shape2); // e.g., { strings: [1, 2, 3], frets: [3, 3, 2] } or { strings: [1, 2, 3], frets: [8, 7, 5] }
 *
 * @example
 * // Get D minor triad on strings 3-4-5, frets 5-9
 * const shape3 = getTriadShape('D', 'minor', [3, 4, 5], { min: 5, max: 9 });
 * console.log(shape3); // { strings: [3, 4, 5], frets: [7, 7, 5] }
 */

function getTriadShape(root, type, stringSet, fretbox, random = false) {
    // Predefined pitch classes for notes (e.g., C = 0, C# = 1, ..., B = 11)
    const noteToPc = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
  
    // Predefined intervals for triad types
    const intervals = {
      'major': [0, 4, 7],      // Root, Major 3rd, Perfect 5th
      'minor': [0, 3, 7],      // Root, Minor 3rd, Perfect 5th
      'diminished': [0, 3, 6], // Root, Minor 3rd, Diminished 5th
      'augmented': [0, 4, 8]   // Root, Major 3rd, Augmented 5th
    };
  
    // Open string pitch classes (assuming standard tuning: EADGBE)
    const openPc = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E (strings 1 to 6)
  
    // Validate inputs
    const rootPc = noteToPc[root];
    if (rootPc === undefined) throw new Error('Invalid root note');
    const triadIntervals = intervals[type];
    if (!triadIntervals) throw new Error('Invalid triad type');
  
    // Calculate triad pitch classes
    const triadPcs = triadIntervals.map(interval => (rootPc + interval) % 12);
  
    // Extract string set pitch classes (adjust for 1-based string numbering)
    const [s1, s2, s3] = stringSet;
    const openPc1 = openPc[s1 - 1];
    const openPc2 = openPc[s2 - 1];
    const openPc3 = openPc[s3 - 1];
  
    // Collect all valid shapes
    let validShapes = [];
    for (let f1 = fretbox.min; f1 <= fretbox.max; f1++) {
      for (let f2 = fretbox.min; f2 <= fretbox.max; f2++) {
        for (let f3 = fretbox.min; f3 <= fretbox.max; f3++) {
          const frets = [f1, f2, f3];
          const minFret = Math.min(...frets);
          const maxFret = Math.max(...frets);
  
          // Ensure playable fret span (≤ 4 frets)
          if (maxFret - minFret > 4) continue;
  
          // Calculate pitch classes for this shape
          const pc1 = (openPc1 + f1) % 12;
          const pc2 = (openPc2 + f2) % 12;
          const pc3 = (openPc3 + f3) % 12;
          const shapePcs = new Set([pc1, pc2, pc3]);
  
          // Check if this shape matches the triad (all triad pitch classes are present)
          if (shapePcs.size === 3 && triadPcs.every(pc => shapePcs.has(pc))) {
            validShapes.push(frets);
          }
        }
      }
    }
  
    // If no valid shapes found, return null
    if (validShapes.length === 0) return null;
  
    // Return a random shape if random is true, otherwise the smallest fret shape
    if (random) {
      const randomIndex = Math.floor(Math.random() * validShapes.length);
      return { strings: stringSet, frets: validShapes[randomIndex] };
    } else {
      validShapes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
      return { strings: stringSet, frets: validShapes[0] };
    }
  }
  
  // Export the function for use in other modules
  module.exports = getTriadShape;