const openStringFreqs = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];

// Use the existing sharedAudioContext from index.html
function playNote(string, fret) {
    try {
        // Get the shared audio context instead of creating a new one
        const audioContext = sharedAudioContext || initAudioContext();
        if (!audioContext) {
            console.error('AudioContext not available');
            return;
        }
        
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        // More guitar-like settings
        oscillator.type = 'sawtooth';
        const baseFreq = openStringFreqs[string];
        const freq = baseFreq * Math.pow(2, fret / 12);
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        // Add filter for more natural guitar sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, audioContext.currentTime);
        filter.Q.value = 0.5;

        // Shape the envelope like a plucked string
        const attackTime = 0.01;
        const decayTime = 1.5;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);

        // Connect the nodes
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + decayTime);
    } catch (error) {
        console.error('Error playing note:', error);
    }
}

function playChord(positions) {
    try {
        // Get the shared audio context instead of creating a new one
        const audioContext = sharedAudioContext || initAudioContext();
        if (!audioContext) {
            console.error('AudioContext not available');
            return;
        }
        
        // Create a chord envelope shared by all notes
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        
        // Set up the shared envelope
        const attackTime = 0.01;
        const decayTime = 1.5;
        
        masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + attackTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);
        
        // Play all notes at once
        positions.forEach(([string, fret]) => {
            const oscillator = audioContext.createOscillator();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.type = 'sawtooth';
            const baseFreq = openStringFreqs[string];
            const freq = baseFreq * Math.pow(2, fret / 12);
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, audioContext.currentTime);
            filter.Q.value = 0.5;
            
            oscillator.connect(filter);
            filter.connect(masterGain);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + decayTime);
        });
    } catch (error) {
        console.error('Error playing chord:', error);
    }
}

function playFeedbackSound(isCorrect) {
    if (isCorrect) {
        playTone(880, 0.15);
        setTimeout(() => playTone(1318.51, 0.25), 150);
    } else {
        playTone(349.23, 0.15);
        setTimeout(() => playTone(329.63, 0.3), 150);
    }
}

function playTone(frequency, duration) {
    try {
        // Get the shared audio context instead of creating a new one
        const audioContext = sharedAudioContext || initAudioContext();
        if (!audioContext) {
            console.error('AudioContext not available');
            return;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + duration * 0.75);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.error('Error playing tone:', error);
    }
}

function calculateNoteFrequency(string, fret) {
    const openStringFrequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
    return openStringFrequencies[string] * Math.pow(2, fret / 12);
}
