// Utility functions for consistent note handling
const noteUtils = {
    // Maps between sharp and flat representations
    equivalents: {
        'F#': 'Gb',
        'C#': 'Db',
        'G#': 'Ab',
        'D#': 'Eb',
        'A#': 'Bb'
    },
    
    // All notes in standard order (using sharp notation as canonical)
    allNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    
    // Natural notes only
    naturalNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    
    // Accidental notes (sharp form)
    accidentalNotes: ['C#', 'D#', 'F#', 'G#', 'A#'],
    
    // Get the preferred display for a note based on Circle of Fifths settings
    getDisplayPreference: function(note) {
        // Natural notes have no alternative display
        if (!note.includes('#') && !note.includes('b')) {
            return note;
        }
        
        // Convert note to canonical (sharp) form if it's flat
        let canonicalNote = note;
        if (note.includes('b')) {
            for (const [sharp, flat] of Object.entries(this.equivalents)) {
                if (flat === note) {
                    canonicalNote = sharp;
                    break;
                }
            }
        }
        
        // Look up display preference from Circle of Fifths
        const preference = getCookie(`circle_${canonicalNote}`);
        if (preference) {
            return preference;
        }
        
        // No preference found, return the original note
        return note;
    },
    
    // Check if two notes are equivalent (e.g., F# and Gb)
    areEquivalent: function(note1, note2) {
        if (note1 === note2) return true;
        
        for (const [sharp, flat] of Object.entries(this.equivalents)) {
            if ((note1 === sharp && note2 === flat) || 
                (note1 === flat && note2 === sharp)) {
                return true;
            }
        }
        
        return false;
    },
    
    // Get available notes based on the current study mode
    getNotesForStudyMode: function() {
        const naturalOnly = document.getElementById('naturalNotesOnly')?.checked || false;
        const accidentalsOnly = document.getElementById('accidentalsOnly')?.checked || false;
        
        if (naturalOnly) {
            return this.naturalNotes;
        } else if (accidentalsOnly) {
            return this.accidentalNotes;
        } else {
            return this.allNotes;
        }
    },
    
    // Generate answer choices that respect study mode and display preferences
    generateAnswerChoices: function(correctNote) {
        const notePool = this.getNotesForStudyMode();
        
        // Always include the correct answer (in canonical form)
        let choices = [correctNote];
        
        // Add random incorrect answers from the appropriate note pool
        while (choices.length < 4) { // Assuming 4 total answer choices
            const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
            
            // Avoid duplicates and equivalents
            if (!choices.some(note => this.areEquivalent(note, randomNote))) {
                choices.push(randomNote);
            }
        }
        
        // Shuffle the choices
        choices = this.shuffleArray(choices);
        
        // Apply display preferences
        return choices.map(note => this.getDisplayPreference(note));
    },
    
    // Helper function to shuffle an array
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}; 

// Function to create a new quiz question
function createNewQuestion() {
    // Clear any existing feedback
    document.getElementById('feedback').innerText = '';
    
    // Get available notes based on study mode
    const notePool = noteUtils.getNotesForStudyMode();
    
    // If no notes are available in the current mode, show an error and return
    if (notePool.length === 0) {
        document.getElementById('feedback').innerText = 'No notes available with current settings';
        return;
    }
    
    // Select a random note
    const randomIndex = Math.floor(Math.random() * notePool.length);
    const correctNote = notePool[randomIndex];
    
    // Randomly select string and fret for this note
    const stringFretCombinations = findNoteLocations(correctNote);
    const { string, fret } = selectRandomLocation(stringFretCombinations);
    
    // Place the note on the fretboard
    currentString = string;
    currentFret = fret;
    renderFretboard();
    
    // Generate answer choices respecting the study mode and display preferences
    const answerChoices = noteUtils.generateAnswerChoices(correctNote);
    
    // Update the answer buttons
    const answerButtonsContainer = document.getElementById('answer-buttons');
    answerButtonsContainer.innerHTML = ''; // Clear existing buttons
    
    answerChoices.forEach(displayedNote => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = displayedNote; // Display according to user preference
        button.dataset.canonicalNote = getCanonicalForm(displayedNote); // Store canonical form for checking
        
        button.addEventListener('click', function() {
            checkAnswer(this);
        });
        
        answerButtonsContainer.appendChild(button);
    });
    
    // Store the correct answer for checking
    currentCorrectAnswer = correctNote;
}

// Function to check the user's answer
function checkAnswer(selectedButton) {
    const selectedNote = selectedButton.dataset.canonicalNote;
    
    // Use note equivalence checking
    if (noteUtils.areEquivalent(selectedNote, currentCorrectAnswer)) {
        // Handle correct answer
        // ... existing code ...
    } else {
        // Handle incorrect answer
        // ... existing code ...
    }
}

// Helper to get canonical form (sharp version) of any note
function getCanonicalForm(note) {
    if (note.includes('b')) {
        // Convert flat to sharp for canonical storage
        for (const [sharp, flat] of Object.entries(noteUtils.equivalents)) {
            if (flat === note) return sharp;
        }
    }
    return note;
} 