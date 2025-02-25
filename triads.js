const triads = {
    major: {
        name: 'Major',
        symbol: '',  // Empty string because major is implied
        intervals: [0, 4, 7] // Root, Major 3rd, Perfect 5th
    },
    minor: {
        name: 'Minor',
        symbol: 'm',
        intervals: [0, 3, 7] // Root, Minor 3rd, Perfect 5th
    },
    diminished: {
        name: 'Diminished',
        symbol: 'o',
        intervals: [0, 3, 6] // Root, Minor 3rd, Diminished 5th
    },
    augmented: {
        name: 'Augmented',
        symbol: '+',
        intervals: [0, 4, 8] // Root, Major 3rd, Augmented 5th
    }
};

// Define practical guitar triad shapes based on CAGED system
// These shapes follow standard guitar fingerings with small spans (3-4 frets max)
const triadShapes = {
    major: {
        // Root position triads (root in bass)
        root: [
            // E-shape (strings are relative to the root string)
            [[0, 0], [1, 0], [2, 1]],  // E shape (strings 4,5,6 or 1,2,3)
            // A-shape
            [[0, 0], [1, 2], [2, 2]],  // A shape 
            // C-shape
            [[0, 0], [1, 1], [2, 0]],  // C shape
            // G-shape compact version
            [[0, 0], [1, 0], [2, 3]]   // G shape simplified
        ],
        // First inversion triads (3rd in bass)
        first: [
            [[0, 0], [1, 0], [2, 2]],  // E-based 1st inversion
            [[0, 0], [1, 3], [2, 2]],  // A-based 1st inversion
            [[0, 0], [1, 2], [2, 0]],  // C-based 1st inversion
            [[0, 0], [1, 2], [2, 4]]   // Compact 1st inversion
        ],
        // Second inversion triads (5th in bass)
        second: [
            [[0, 0], [1, 2], [2, 2]],  // E-based 2nd inversion
            [[0, 0], [1, 0], [2, 0]],  // A-based 2nd inversion
            [[0, 0], [1, 0], [2, 1]],  // D-based 2nd inversion
            [[0, 0], [1, 1], [2, 3]]   // Compact 2nd inversion
        ]
    },
    minor: {
        // Root position triads (root in bass)
        root: [
            // Em-shape
            [[0, 0], [1, 0], [2, 0]],  // Em shape
            // Am-shape
            [[0, 0], [1, 1], [2, 2]],  // Am shape
            // Dm-shape
            [[0, 0], [1, 1], [2, 3]],  // Dm shape
            // Custom compact shape
            [[0, 0], [1, 3], [2, 3]]   // Compact minor shape
        ],
        // First inversion triads (♭3rd in bass)
        first: [
            [[0, 0], [1, 0], [2, 3]],  // Em-based 1st inversion
            [[0, 0], [1, 2], [2, 2]],  // Am-based 1st inversion
            [[0, 0], [1, 2], [2, 0]],  // Dm-based 1st inversion
            [[0, 0], [1, 3], [2, 3]]   // Compact 1st inversion
        ],
        // Second inversion triads (5th in bass)
        second: [
            [[0, 0], [1, 3], [2, 3]],  // Em-based 2nd inversion
            [[0, 0], [1, 0], [2, 0]],  // Am-based 2nd inversion
            [[0, 0], [1, 0], [2, 2]],  // Compact 2nd inversion
            [[0, 0], [1, 2], [2, 3]]   // Dm-based 2nd inversion
        ]
    },
    diminished: {
        root: [
            [[0, 0], [1, 0], [2, -1]],  // Edim shape
            [[0, 0], [1, 1], [2, 1]],   // Adim shape
            [[0, 0], [1, 0], [2, 2]],   // Compact dim shape
            [[0, 0], [1, 3], [2, 2]]    // Ddim shape
        ],
        first: [
            [[0, 0], [1, 0], [2, 3]],   // 1st inversion
            [[0, 0], [1, 2], [2, 1]],   // Compact 1st inversion
            [[0, 0], [1, 3], [2, 0]],   // Alternative 1st inversion
            [[0, 0], [1, 0], [2, 0]]    // Simple 1st inversion
        ],
        second: [
            [[0, 0], [1, 3], [2, 3]],   // 2nd inversion
            [[0, 0], [1, 0], [2, -1]],  // Compact 2nd inversion
            [[0, 0], [1, 0], [2, 1]],   // Alternative 2nd inversion
            [[0, 0], [1, 2], [2, 0]]    // Simple 2nd inversion
        ]
    },
    augmented: {
        root: [
            [[0, 0], [1, 0], [2, 1]],   // E+ shape
            [[0, 0], [1, 1], [2, 1]],   // A+ shape
            [[0, 0], [1, 1], [2, 0]],   // Compact aug shape
            [[0, 0], [1, 4], [2, 4]]    // D+ shape
        ],
        first: [
            [[0, 0], [1, 0], [2, 1]],   // 1st inversion
            [[0, 0], [1, 1], [2, 0]],   // Compact 1st inversion
            [[0, 0], [1, 1], [2, 1]],   // Alternative 1st inversion
            [[0, 0], [1, 0], [2, 0]]    // Simple 1st inversion
        ],
        second: [
            [[0, 0], [1, 1], [2, 0]],   // 2nd inversion
            [[0, 0], [1, 0], [2, 0]],   // Compact 2nd inversion
            [[0, 0], [1, 0], [2, 1]],   // Alternative 2nd inversion
            [[0, 0], [1, 1], [2, 1]]    // Simple 2nd inversion
        ]
    }
};

function getAvailableTriadTypes() {
    const types = [];
    if (document.getElementById('majorTriads').checked) types.push('major');
    if (document.getElementById('minorTriads').checked) types.push('minor');
    if (document.getElementById('diminishedTriads').checked) types.push('diminished');
    if (document.getElementById('augmentedTriads').checked) types.push('augmented');
    
    // Default to major if nothing is selected
    return types.length > 0 ? types : ['major'];
}

function getAvailableStrings() {
    return Array.from(document.querySelectorAll('.string:checked'))
        .map(cb => parseInt(cb.value))
        .sort((a, b) => a - b); // Sort in ascending order
}

function formatChordName(root, type, inversion, positions) {
    // For root position, simply return the chord name with no slash
    if (inversion === 0) {
        return `${root}${triads[type].symbol}`;
    }
    
    // For inversions, find the actual bass note by looking at the lowest string
    // (highest string number is the lowest-pitched string on guitar)
    const sortedPositions = [...positions].sort((a, b) => b[0] - a[0]);
    
    // Get the lowest string position [string, fret]
    const bassString = sortedPositions[0][0];
    const bassFret = sortedPositions[0][1];
    
    // Calculate the actual note played on that string/fret
    const stringTuning = stringTunings[bassString];
    const stringTuningIndex = getNoteIndex(stringTuning);
    const bassNoteIndex = (stringTuningIndex + bassFret) % 12;
    
    // Use a guaranteed clean list of note names - no chord symbols possible
    const cleanNoteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const bassNote = cleanNoteNames[bassNoteIndex];
    
    // Return the proper chord name with slash notation
    return `${root}${triads[type].symbol}/${bassNote}`;
}

function getRandomTriad() {
    const minFret = parseInt(document.getElementById('minFret').value);
    const maxFret = parseInt(document.getElementById('maxFret').value);
    const selectedStrings = getAvailableStrings();

    if (selectedStrings.length < 3) {
        alert('Please select at least 3 strings for triad mode');
        document.getElementById('noteMode').checked = true;
        getRandomNote();
        return;
    }

    // Get available inversions
    const inversions = [];
    if (document.getElementById('rootPosition').checked) inversions.push(0);
    if (document.getElementById('firstInversion').checked) inversions.push(1);
    if (document.getElementById('secondInversion').checked) inversions.push(2);
    
    if (inversions.length === 0) {
        alert('Please select at least one triad inversion');
        document.getElementById('rootPosition').checked = true;
        inversions.push(0);
    }

    // Get available triad types
    const triadTypes = getAvailableTriadTypes();
    
    // Clean note names only
    const cleanNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Select random root note, type and inversion
    const rootNote = cleanNotes[Math.floor(Math.random() * cleanNotes.length)];
    const triadType = triadTypes[Math.floor(Math.random() * triadTypes.length)];
    const inversion = inversions[Math.floor(Math.random() * inversions.length)];
    
    // Get the intervals for this triad type
    const intervals = triads[triadType].intervals;
    const rootIndex = getNoteIndex(rootNote);
    
    // Calculate the actual notes of this triad (chromatic indices)
    const triadNotes = intervals.map(interval => (rootIndex + interval) % 12);
    
    // Find valid string sets from available strings
    const validStringSets = [];
    for (let i = 0; i <= selectedStrings.length - 3; i++) {
        // Get consecutive strings
        validStringSets.push(selectedStrings.slice(i, i + 3));
    }
    
    if (validStringSets.length === 0) {
        alert('Need at least 3 consecutive strings selected');
        return;
    }
    
    // Try to place the triad on the fretboard
    let position = null;
    
    // Try each valid string set
    for (const stringSet of validStringSets) {
        // Sort strings by pitch (bass to treble)
        const sortedStrings = [...stringSet].sort((a, b) => b - a);
        
        // Get the triad notes in the correct order based on inversion
        let orderedNotes;
        if (inversion === 0) {
            // Root position: Root, 3rd, 5th
            orderedNotes = [triadNotes[0], triadNotes[1], triadNotes[2]];
        } else if (inversion === 1) {
            // First inversion: 3rd, Root, 5th
            orderedNotes = [triadNotes[1], triadNotes[0], triadNotes[2]];
        } else {
            // Second inversion: 5th, Root, 3rd
            orderedNotes = [triadNotes[2], triadNotes[0], triadNotes[1]];
        }
        
        // Try to place these notes on these strings
        position = calculateValidTriadPosition(sortedStrings, orderedNotes, minFret, maxFret);
        
        if (position) break;
    }
    
    // If we couldn't find a position, try again with different constraints
    if (!position) {
        // Try with a slightly expanded fret range
        const expandedMinFret = Math.max(0, minFret - 2);
        const expandedMaxFret = Math.min(24, maxFret + 2);
        
        for (const stringSet of validStringSets) {
            const sortedStrings = [...stringSet].sort((a, b) => b - a);
            
            let orderedNotes;
            if (inversion === 0) {
                orderedNotes = [triadNotes[0], triadNotes[1], triadNotes[2]];
            } else if (inversion === 1) {
                orderedNotes = [triadNotes[1], triadNotes[0], triadNotes[2]];
            } else {
                orderedNotes = [triadNotes[2], triadNotes[0], triadNotes[1]];
            }
            
            position = calculateValidTriadPosition(sortedStrings, orderedNotes, expandedMinFret, expandedMaxFret);
            
            if (position) break;
        }
    }
    
    // If still no position found, retry with a different chord
    if (!position) {
        console.log("Couldn't find a valid position, trying a different chord...");
        getRandomTriad();
        return;
    }
    
    // Set current chord and update display
    currentChord = position;
    const actualChordName = determineActualChordName(position);
    correctChordName = actualChordName;
    
    renderFretboard();
    document.getElementById('feedback').textContent = '';
    generateAnswerButtons();
}

// Calculate a valid position for the specified notes on the specified strings
function calculateValidTriadPosition(strings, notes, minFret, maxFret) {
    const positions = [];
    
    // For each string-note pair
    for (let i = 0; i < 3; i++) {
        const string = strings[i];
        const note = notes[i];
        
        // Calculate what fret gives us this note on this string
        const stringTuning = stringTunings[string];
        const tuningIndex = getNoteIndex(stringTuning);
        
        // Find the fret that produces this note
        let fret = (note - tuningIndex + 12) % 12;
        
        // Adjust to be within range
        while (fret < minFret) fret += 12;
        
        // If we can't fit this note in range, return null
        if (fret > maxFret) return null;
        
        positions.push([string, fret]);
    }
    
    return positions;
}

// Determine the actual chord name based on the notes in the position
function determineActualChordName(positions) {
    // Calculate the actual notes being played
    const notes = positions.map(pos => {
        const [string, fret] = pos;
        const stringNote = stringTunings[string];
        const stringIndex = getNoteIndex(stringNote);
        return (stringIndex + fret) % 12;
    });
    
    // Find the lowest note (bass)
    const lowestStringPos = [...positions].sort((a, b) => b[0] - a[0])[0];
    const bassString = lowestStringPos[0];
    const bassFret = lowestStringPos[1];
    
    // Calculate the bass note
    const bassStringNote = stringTunings[bassString];
    const bassStringIndex = getNoteIndex(bassStringNote);
    const bassNoteIndex = (bassStringIndex + bassFret) % 12;
    
    // Clean note names
    const cleanNoteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const bassNote = cleanNoteNames[bassNoteIndex];
    
    // Try to identify the chord
    // Sort the notes to compare with triad intervals
    const sortedNotes = [...notes].sort((a, b) => a - b);
    
    // Try each possible root note
    for (let i = 0; i < 3; i++) {
        const possibleRoot = sortedNotes[i];
        
        // Check against each triad type
        for (const [type, triadInfo] of Object.entries(triads)) {
            // Calculate what the triad notes would be with this root
            const expectedNotes = triadInfo.intervals.map(interval => 
                (possibleRoot + interval) % 12
            );
            
            // Check if these match our notes (in any order)
            if (hasAllNotes(sortedNotes, expectedNotes)) {
                const rootNoteName = cleanNoteNames[possibleRoot];
                
                // If the bass note is the root, return simple chord name
                if (bassNoteIndex === possibleRoot) {
                    return `${rootNoteName}${triadInfo.symbol}`;
                } else {
                    // Otherwise, it's a slash chord
                    return `${rootNoteName}${triadInfo.symbol}/${bassNote}`;
                }
            }
        }
    }
    
    // If no standard triad is found, return a description based on the bass note
    return `${bassNote} triad`;
}

// Helper function to check if all notes from one array are in another
function hasAllNotes(notesArray, targetNotes) {
    if (notesArray.length !== targetNotes.length) return false;
    
    // Check if every target note is in the notes array
    return targetNotes.every(note => notesArray.includes(note));
}

// Helper function to get note index (0 = C, 1 = C#, etc.)
function getNoteIndex(note) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return notes.indexOf(note);
}

// Generate answer options for the current triad
function generateTriadAnswerOptions(correctChordName) {
    const options = [correctChordName];
    
    // Get available triad types
    const triadTypes = getAvailableTriadTypes();
    
    // Clean note names to choose from
    const cleanNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Create wrong options until we have 4 total options
    while (options.length < 4) {
        // Random note
        const note = cleanNotes[Math.floor(Math.random() * cleanNotes.length)];
        
        // Random triad type
        const type = triadTypes[Math.floor(Math.random() * triadTypes.length)];
        
        // Format a fake chord name
        let wrongOption = `${note}${triads[type].symbol}`;
        
        // Randomly add a slash chord extension
        if (Math.random() > 0.5) {
            const bassNote = cleanNotes[Math.floor(Math.random() * cleanNotes.length)];
            wrongOption += `/${bassNote}`;
        }
        
        // Add to options if not already included
        if (!options.includes(wrongOption)) {
            options.push(wrongOption);
        }
    }
    
    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
}

// Add this to your triads.js file - it ensures buttons remain clickable
function ensureClickableAnswerButtons() {
    // Select all answer buttons
    const answerButtons = document.querySelectorAll('.answer-button');
    
    // If no buttons were found, regenerate them
    if (answerButtons.length === 0) {
        console.error("No answer buttons found!");
        return;
    }
    
    // Check each button for event listeners
    answerButtons.forEach(button => {
        // Clone and replace to remove any stale event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add fresh event listener
        newButton.addEventListener('click', function() {
            const selectedAnswer = newButton.textContent;
            
            if (selectedAnswer === correctChordName) {
                document.getElementById('feedback').textContent = 'Correct!';
                newButton.classList.add('correct');
                setTimeout(getRandomTriad, 1000);
            } else {
                document.getElementById('feedback').textContent = 'Incorrect. Try again.';
                newButton.classList.add('incorrect');
            }
            
            // Show notes on fretboard after answering
            showNotesOnFretboard();
        });
    });
}

