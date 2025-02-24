const openStringFreqs = [
    329.63, // string 0: E4 (high E)
    246.94, // string 1: B3
    196.00, // string 2: G3
    146.83, // string 3: D3
    110.00, // string 4: A2
    82.41   // string 5: E2 (low E)
];

function playNote(string, fret) {
    if (!document.getElementById('sound').checked) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sawtooth';
    const baseFreq = openStringFreqs[string];
    const freq = baseFreq * Math.pow(2, fret / 12);
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);

    const attackTime = 0.01;
    const decayTime = 1.5;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + decayTime);
}

function playChord(chord) {
    if (!document.getElementById('sound').checked) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    chord.forEach(([string, fret]) => {
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sawtooth';
        const baseFreq = openStringFreqs[string];
        const freq = baseFreq * Math.pow(2, fret / 12);
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, audioContext.currentTime);
        filter.Q.setValueAtTime(1, audioContext.currentTime);

        const attackTime = 0.01;
        const decayTime = 1.5;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + decayTime);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + decayTime);
    });
}

function playFeedbackSound(isCorrect) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isCorrect ? 800 : 400, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}
