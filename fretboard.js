function renderFretboard() {
    const fretboard = document.getElementById('fretboard');
    fretboard.innerHTML = '';
    const maxFret = Math.max(12, parseInt(document.getElementById('maxFret').value));
    const isTriadMode = document.getElementById('triadMode').checked;
    const isMobile = window.innerWidth <= 600;
    
    // Add a container for the dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots-container';
    fretboard.appendChild(dotsContainer);

    // Create the strings first
    for (let string = 0; string <= 5; string++) {
        const stringDiv = document.createElement('div');
        stringDiv.className = 'string';
        stringDiv.dataset.string = string;
        
        const openFret = document.createElement('div');
        openFret.className = 'fret open';
        if (isTriadMode && currentChord) {
            currentChord.forEach(([s, f]) => {
                if (s === string && f === 0) openFret.classList.add('active');
            });
        } else if (string === currentString && currentFret === 0) {
            openFret.classList.add('active');
        }
        stringDiv.appendChild(openFret);
        
        for (let fret = 1; fret <= maxFret; fret++) {
            const fretDiv = document.createElement('div');
            fretDiv.className = 'fret';
            fretDiv.dataset.fret = fret;
            fretDiv.dataset.string = string;
            
            if (isTriadMode && currentChord) {
                currentChord.forEach(([s, f]) => {
                    if (s === string && f === fret) fretDiv.classList.add('active');
                });
            } else if (string === currentString && fret === currentFret) {
                fretDiv.classList.add('active');
            }
            stringDiv.appendChild(fretDiv);
        }
        fretboard.appendChild(stringDiv);
    }

    // Now add the fret dots after strings are created
    addFretDots(dotsContainer, maxFret);
}

function addFretDots(container, maxFret) {
    // Standard fret dot positions
    const dotPositions = [
        { fret: 3, position: 50 },  // 50% between 3rd & 4th string
        { fret: 5, position: 50 },  // 50% between 3rd & 4th string
        { fret: 7, position: 50 },  // 50% between 3rd & 4th string
        { fret: 9, position: 50 },  // 50% between 3rd & 4th string
        { fret: 12, position: 37 }, // Adjusted to be closer to middle (was 25%)
        { fret: 12, position: 63 }, // Adjusted to be closer to middle (was 75%)
        // Adding dots for higher frets
        { fret: 15, position: 50 }, // 15th fret
        { fret: 17, position: 50 }, // 17th fret
        { fret: 19, position: 50 }, // 19th fret
        { fret: 21, position: 50 }, // 21st fret
        { fret: 24, position: 37 }, // 24th fret (double dots like 12th fret)
        { fret: 24, position: 63 }  // 24th fret (double dots like 12th fret)
    ];
    
    dotPositions.forEach(({ fret, position }) => {
        if (fret > maxFret) return;
        
        // Get the fret element to reference for horizontal positioning
        const refFretElement = document.querySelector(`.string[data-string="0"] .fret[data-fret="${fret}"]`);
        if (!refFretElement) return;
        
        const dot = document.createElement('div');
        dot.className = 'dot';
        
        // Get position relative to the fretboard
        const fretboardRect = document.getElementById('fretboard').getBoundingClientRect();
        const refFretRect = refFretElement.getBoundingClientRect();
        
        // Calculate horizontal center of the fret
        const left = (refFretRect.left - fretboardRect.left) + (refFretRect.width / 2);
        
        // Calculate vertical position based on percentage of fretboard height
        // No more manual offset since transform: translate(-50%, -50%) handles centering
        const top = fretboardRect.height * position / 100;
        
        dot.style.left = `${left}px`;
        dot.style.top = `${top}px`;
        container.appendChild(dot);
    });
}
