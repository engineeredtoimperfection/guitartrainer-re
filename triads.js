function getRandomTriad(attempts = 0, maxAttempts = 10) {
    const minFret = parseInt(document.getElementById('minFret').value);
    const maxFret = parseInt(document.getElementById('maxFret').value);
    const selectedStrings = Array.from(document.querySelectorAll('.string:checked'))
        .map(cb => parseInt(cb.value)).sort((a, b) => b - a); // Sort descending (low E to high E)

    if (selectedStrings.length < 3) {
        alert('Please select at least 3 strings for triad mode');
        document.getElementById('noteMode').checked = true;
        getRandomNote();
        return;
    }

    const inversions = [];
    if (document.getElementById('rootPosition').checked) inversions.push(0);
    if (document.getElementById('firstInversion').checked) inversions.push(1);
    if (document.getElementById('secondInversion').checked) inversions.push(2);
    
    if (inversions.length === 0) {
        alert('Please select at least one triad inversion');
        document.getElementById('rootPosition').checked = true;
        inversions.push(0);
    }

    // Pick a base string (lowest string number must allow two higher strings)
    const validBaseStrings = selectedStrings.filter(s => {
        const nextString = s - 1;
        const nextNextString = s - 2;
        return selectedStrings.includes(nextString) && selectedStrings.includes(nextNextString);
    });

    if (validBaseStrings.length === 0) {
        alert('Please select at least 3 consecutive strings for triad mode');
        document.getElementById('noteMode').checked = true;
        getRandomNote();
        return;
    }

    const baseString = validBaseStrings[Math.floor(Math.random() * validBaseStrings.length)];
    const boxStart = Math.max(minFret, Math.floor(Math.random() * (maxFret - 4 + 1))); // Ensure 5-fret box fits
    const boxEnd = Math.min(boxStart + 4, maxFret);
    const baseFret = Math.floor(Math.random() * (boxEnd - boxStart + 1)) + boxStart;
    const baseNoteIndex = (notes.indexOf(stringTunings[baseString]) + baseFret) % 12;
    const isMajor = Math.random() > 0.5;
    const inversion = inversions[Math.floor(Math.random() * inversions.length)];

    let rootIndex, thirdIndex, fifthIndex;
    if (inversion === 0) { // Root Position: base is root
        rootIndex = baseNoteIndex;
        thirdIndex = (rootIndex + (isMajor ? 4 : 3)) % 12;
        fifthIndex = (rootIndex + 7) % 12;
    } else if (inversion === 1) { // First Inversion: base is third
        thirdIndex = baseNoteIndex;
        rootIndex = (thirdIndex - (isMajor ? 4 : 3) + 12) % 12;
        fifthIndex = (rootIndex + 7) % 12;
    } else { // Second Inversion: base is fifth
        fifthIndex = baseNoteIndex;
        rootIndex = (fifthIndex - 7 + 12) % 12;
        thirdIndex = (rootIndex + (isMajor ? 4 : 3)) % 12;
    }

    const triadNotes = [rootIndex, thirdIndex, fifthIndex];
    const positions = [
        [baseString, baseFret] // Base note on the lowest string
    ];

    // Next string up (lower string number) for the next note
    const nextString = baseString - 1;
    const nextBase = notes.indexOf(stringTunings[nextString]);
    let nextFret = boxStart;
    while (nextFret <= boxEnd) {
        const note = (nextBase + nextFret) % 12;
        if (note === triadNotes[inversion === 0 ? 1 : inversion === 1 ? 2 : 0]) {
            positions.push([nextString, nextFret]);
            break;
        }
        nextFret++;
    }

    // Next-next string up for the final note
    const nextNextString = baseString - 2;
    const nextNextBase = notes.indexOf(stringTunings[nextNextString]);
    let nextNextFret = boxStart;
    while (nextNextFret <= boxEnd) {
        const note = (nextNextBase + nextNextFret) % 12;
        if (note === triadNotes[inversion === 0 ? 2 : inversion === 1 ? 0 : 1]) {
            positions.push([nextNextString, nextNextFret]);
            break;
        }
        nextNextFret++;
    }

    if (positions.length !== 3) {
        if (attempts < maxAttempts) {
            getRandomTriad(attempts + 1, maxAttempts);
        } else {
            alert('Could not find a valid triad with current settings. Switching to Note mode.');
            document.getElementById('noteMode').checked = true;
            getRandomNote();
        }
        return;
    }

    currentChord = positions;
    correctChordName = `${notes[rootIndex]} ${isMajor ? 'Major' : 'Minor'}${inversion === 0 ? '' : inversion === 1 ? ' (1st)' : ' (2nd)'}`;
    renderFretboard();
    document.getElementById('feedback').textContent = '';
    generateAnswerButtons();
}

function generateTriadAnswerOptions(correctChordName) {
    const options = new Set([correctChordName]);
    const rootNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    while (options.size < 4) {
        const root = rootNotes[Math.floor(Math.random() * rootNotes.length)];
        const quality = Math.random() > 0.5 ? 'Major' : 'Minor';
        const chordName = `${root} ${quality}${correctChordName.includes('(') ? correctChordName.slice(correctChordName.indexOf(' (')) : ''}`;
        if (chordName !== correctChordName) options.add(chordName);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}
