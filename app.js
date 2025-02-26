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
        // Check checkbox states with the CORRECT IDs from HTML
        const naturalOnly = document.getElementById('naturals')?.checked || false;
        const accidentalsOnly = document.getElementById('sharpsFlats')?.checked || false;
        
        console.log("Filter checkboxes (correct IDs):", { naturalOnly, accidentalsOnly });
        
        if (naturalOnly && !accidentalsOnly) {
            console.log("Using natural notes only:", this.naturalNotes);
            return [...this.naturalNotes]; // Return a copy to avoid mutations
        } else if (!naturalOnly && accidentalsOnly) {
            console.log("Using accidentals only:", this.accidentalNotes);
            return [...this.accidentalNotes]; // Return a copy to avoid mutations
        } else {
            // Both checked or both unchecked = all notes
            console.log("Using all notes:", this.allNotes);
            return [...this.allNotes]; // Return a copy to avoid mutations
        }
    },
    
    // Generate answer choices that respect study mode and display preferences
    generateAnswerChoices: function(correctNote) {
        console.log('generateAnswerChoices in app.js', correctNote);
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

// Function to create a new quiz question - fixed version
function createNewQuestion() {
    // Clear any existing feedback
    document.getElementById('feedback').innerText = '';
    
    // Get available notes based on study mode - GET THIS ONCE
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
    // PASS THE SAME NOTE POOL USED FOR CORRECT ANSWER
    const answerChoices = generateAnswerChoicesFromPool(correctNote, notePool);
    
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

// New helper function to ensure consistent note pools
function generateAnswerChoicesFromPool(correctNote, notePool) {
    // Always include the correct answer
    let choices = [correctNote];
    
    // Add random incorrect answers from the SAME note pool
    while (choices.length < 4) {
        const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
        
        // Avoid duplicates and equivalents
        if (!choices.some(note => noteUtils.areEquivalent(note, randomNote))) {
            choices.push(randomNote);
        }
    }
    
    // Shuffle the choices
    choices = noteUtils.shuffleArray(choices);
    
    // Apply display preferences
    return choices.map(note => noteUtils.getDisplayPreference(note));
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

// Theme toggling functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '🌕' : '🌑';  // Full white moon for dark mode, full dark moon for light mode
    }
    
    // Update accidental notes array based on Circle of Fifths preferences
    updateAccidentalNotesFromPreferences();
    
    // Force a full refresh of all circle preferences
    refreshCirclePreferences();
    
}); 

function generateNoteAnswerOptions(correctNote) {
    // Get the canonical form of the correct note
    const canonicalCorrect = getCanonicalForm(correctNote);
    
    // Get available notes based on study mode
    const notePool = noteUtils.getNotesForStudyMode();
    
    // CRITICAL FIX: Check if the correct note is actually in the study pool
    // If not, we need to select a new correct note from the pool
    if (!notePool.includes(canonicalCorrect) && 
        !notePool.some(note => noteUtils.areEquivalent(note, canonicalCorrect))) {
        // The correct note isn't in our study pool! Get a new one from the pool
        const randomIndex = Math.floor(Math.random() * notePool.length);
        correctNote = notePool[randomIndex];
        
        // Update global correct note
        window.correctNote = correctNote;
        
        // Reposition on fretboard
        const stringFretCombinations = findNoteLocations(correctNote);
        const position = selectRandomLocation(stringFretCombinations);
        currentString = position.string;
        currentFret = position.fret;
        renderFretboard();
    }
    
    // Create answer choices using the filtered note pool
    let choices = [canonicalCorrect]; // Start with correct answer
    
    // Add random incorrect answers from the note pool
    while (choices.length < 4) {
        const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
        if (!choices.some(note => noteUtils.areEquivalent(note, randomNote))) {
            choices.push(randomNote);
        }
    }
    
    // Shuffle the choices
    const shuffledChoices = noteUtils.shuffleArray(choices);
    
    // Apply display preferences from Circle of Fifths
    return shuffledChoices.map(note => {
        // Ensure we're using canonical form before getting preference
        return noteUtils.getDisplayPreference(getCanonicalForm(note));
    });
} 

// Enhanced function to update accidental notes array with better logging
function updateAccidentalNotesFromPreferences() {
    // Start with the canonical sharp versions
    const accidentals = ['C#', 'D#', 'F#', 'G#', 'A#'];
    
    // Log the cookies for debugging
    console.log("Current Circle of Fifths cookie values:");
    accidentals.forEach(note => {
        console.log(`circle_${note}: ${getCookie(`circle_${note}`)}`);
    });
    
    // Replace each with the user's preferred display version
    noteUtils.accidentalNotes = accidentals.map(note => {
        const preference = getCookie(`circle_${note}`);
        return preference || note; // Use preference if available, otherwise keep the sharp version
    });
    
    console.log("Updated accidental notes array:", noteUtils.accidentalNotes);
}

// Create a new function that forces a refresh of all Circle of Fifths cookies
function refreshCirclePreferences() {
    // Get all Circle of Fifths keys that have alternatives
    const keysWithAlts = circleKeys.filter(k => k.alt);
    
    keysWithAlts.forEach(key => {
        // Get the canonical key (the sharp version)
        const canonicalKey = key.key.includes('#') ? key.key : key.alt;
        
        // Get current preference
        const currentPreference = getCookie(`circle_${canonicalKey}`);
        
        console.log(`Current preference for ${canonicalKey}: ${currentPreference}`);
        
        // If no preference is set, set default (the key displayed in the circle)
        if (!currentPreference) {
            // Get the element from the circle
            const keyElement = document.querySelector(`.circle-key[data-note="${canonicalKey}"]`);
            if (keyElement) {
                const displayed = keyElement.textContent;
                setCookie(`circle_${canonicalKey}`, displayed, 30);
                console.log(`Setting default for ${canonicalKey} to ${displayed}`);
            } else {
                // If element doesn't exist yet, set default based on circleKeys definition
                const defaultDisplay = key.key; // Use key.key as default
                setCookie(`circle_${canonicalKey}`, defaultDisplay, 30);
                console.log(`Setting initial default for ${canonicalKey} to ${defaultDisplay}`);
            }
        }
    });
    
    // Now update the accidental notes array
    updateAccidentalNotesFromPreferences();
}

// Wait for full document load, not just DOM content loaded
window.addEventListener('load', function() {
    console.log("Window fully loaded - refreshing Circle preferences");
    setTimeout(refreshCirclePreferences, 500); // Short delay to ensure circle is rendered
});

function updateDisplayedNotes() {
    // First update the accidentals array
    updateAccidentalNotesFromPreferences();
    
    // Then update displayed buttons
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
        if (button.dataset.canonicalNote) {
            button.textContent = noteUtils.getDisplayPreference(button.dataset.canonicalNote);
        }
    });
} 