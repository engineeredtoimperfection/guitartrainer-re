const openStringFreqs = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];

// Pre-generate reverb impulse with a simple decay pattern (no randomness)
let reverbImpulse = null;

function createReverbImpulse(audioContext) {
    if (reverbImpulse) return reverbImpulse;
    
    const reverbLength = audioContext.sampleRate * 1.5;
    const impulse = audioContext.createBuffer(2, reverbLength, audioContext.sampleRate);
    
    // Use a simple exponential decay pattern with no randomness
    for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < reverbLength; i++) {
            // Simple exponential decay
            data[i] = (i === 0 ? 1 : 0.5) * Math.pow(0.9, i / (audioContext.sampleRate * 0.1));
        }
    }
    
    reverbImpulse = impulse;
    return reverbImpulse;
}

// Use the existing sharedAudioContext from index.html
function playNote(string, fret) {
    try {
        // Get the shared audio context instead of creating a new one
        const audioContext = sharedAudioContext || initAudioContext();
        if (!audioContext) {
            console.error('AudioContext not available');
            return;
        }
        
        // Master gain for the whole note
        const masterGain = audioContext.createGain();
        
        const baseFreq = openStringFreqs[string];
        const freq = baseFreq * Math.pow(2, fret / 12);
        
        // Shape the envelope - smoother attack for creamier sound
        const attackTime = 0.02;
        const decayTime = 2.0;
        
        masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + attackTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);
        
        // Multiple oscillators for a richer tone
        const oscillatorTypes = ['triangle', 'sine', 'sawtooth'];
        const detunes = [0, -5, 5];
        const gains = [0.6, 0.3, 0.1];
        
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const filter = audioContext.createBiquadFilter();
            const gainNode = audioContext.createGain();
            
            // Set oscillator properties
            oscillator.type = oscillatorTypes[i];
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.detune.setValueAtTime(detunes[i], audioContext.currentTime);
            
            // Warm filter settings
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1500 + (i * 300), audioContext.currentTime);
            filter.Q.value = 0.3;
            
            // Set gain for this oscillator
            gainNode.gain.value = gains[i];
            
            // Connect nodes
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(masterGain);
            
            // Start and stop the oscillator
            oscillator.start();
            oscillator.stop(audioContext.currentTime + decayTime);
        }
        
        // Add a simple body resonance filter for more acoustic guitar character
        const bodyFilter = audioContext.createBiquadFilter();
        bodyFilter.type = 'peaking';
        bodyFilter.frequency.value = 250; // Acoustic guitar body resonance
        bodyFilter.gain.value = 5;
        bodyFilter.Q.value = 2;
        
        // Use consistent reverb impulse
        const convolver = audioContext.createConvolver();
        convolver.buffer = createReverbImpulse(audioContext);
        
        // Reverb mix
        const dryGain = audioContext.createGain();
        const wetGain = audioContext.createGain();
        dryGain.gain.value = 0.8;
        wetGain.gain.value = 0.2;
        
        // Connect all effects
        masterGain.connect(bodyFilter);
        
        // Dry signal
        bodyFilter.connect(dryGain);
        dryGain.connect(audioContext.destination);
        
        // Wet (reverb) signal
        bodyFilter.connect(convolver);
        convolver.connect(wetGain);
        wetGain.connect(audioContext.destination);
        
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
        
        // Create a master chain for the chord
        const masterGain = audioContext.createGain();
        
        // Shape the envelope
        const attackTime = 0.03;
        const decayTime = 3.0;
        
        masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + attackTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);
        
        // Create body resonance
        const bodyFilter = audioContext.createBiquadFilter();
        bodyFilter.type = 'peaking';
        bodyFilter.frequency.value = 250; 
        bodyFilter.gain.value = 5;
        bodyFilter.Q.value = 2;
        
        // Create a compressor for balancing the chord
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 10;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.005;
        compressor.release.value = 0.1;
        
        // Use consistent reverb impulse
        const convolver = audioContext.createConvolver();
        convolver.buffer = createReverbImpulse(audioContext);
        
        // Reverb mix
        const dryGain = audioContext.createGain();
        const wetGain = audioContext.createGain();
        dryGain.gain.value = 0.8;
        wetGain.gain.value = 0.2;
        
        // Connect effects chain
        masterGain.connect(bodyFilter);
        bodyFilter.connect(compressor);
        
        // Dry signal
        compressor.connect(dryGain);
        dryGain.connect(audioContext.destination);
        
        // Wet (reverb) signal
        compressor.connect(convolver);
        convolver.connect(wetGain);
        wetGain.connect(audioContext.destination);
        
        // Play all notes with improved sound
        positions.forEach(([string, fret]) => {
            // Multiple oscillators per string for richness
            const oscillatorTypes = ['triangle', 'sine', 'sawtooth'];
            const detunes = [0, -5, 5];
            const gains = [0.6, 0.3, 0.1];
            
            for (let i = 0; i < 3; i++) {
                const oscillator = audioContext.createOscillator();
                const filter = audioContext.createBiquadFilter();
                const gainNode = audioContext.createGain();
                
                // Set oscillator properties
                oscillator.type = oscillatorTypes[i];
                
                const baseFreq = openStringFreqs[string];
                const freq = baseFreq * Math.pow(2, fret / 12);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.detune.setValueAtTime(detunes[i], audioContext.currentTime);
                
                // Warm filter settings
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1500 + (i * 300), audioContext.currentTime);
                filter.Q.value = 0.3;
                
                // Set gain for this oscillator
                gainNode.gain.value = gains[i];
                
                // Connect nodes
                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(masterGain);
                
                // Start and stop the oscillator
                oscillator.start();
                oscillator.stop(audioContext.currentTime + decayTime);
            }
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

// Expose playCurrentSound as a consistent function that can be used by both spacebar and button
function playCurrentSound() {
    // Use the shared audio context
    const audioContext = sharedAudioContext || initAudioContext();
    if (!audioContext) {
        console.error('AudioContext not available');
        return;
    }
    
    // In note mode, play the current note
    if (document.getElementById('noteMode').checked) {
        if (currentString !== undefined && currentFret !== undefined) {
            playNote(currentString, currentFret);
        }
    } 
    // In triad mode, play the current chord
    else if (document.getElementById('triadMode').checked) {
        if (currentChord) {
            playChord(currentChord);
        }
    }
}

// Add this line at the end of the file to make it accessible globally
window.playCurrentSound = playCurrentSound;
