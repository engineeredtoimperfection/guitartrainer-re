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
    // Wait for the layout to be rendered before positioning dots
    setTimeout(() => addFretDots(dotsContainer, maxFret), 0);
}

function addFretDots(container, maxFret) {
    // Standard fret dots with different approach to vertical positioning
    const dotPositions = [
        { fret: 3, verticalPosition: 'middle' },  // middle of fretboard
        { fret: 5, verticalPosition: 'middle' },  
        { fret: 7, verticalPosition: 'middle' },  
        { fret: 9, verticalPosition: 'middle' },  
        { fret: 12, verticalPosition: 'upper' },  // upper dot (12th fret)
        { fret: 12, verticalPosition: 'lower' },  // lower dot (12th fret)
        { fret: 15, verticalPosition: 'middle' }, 
        { fret: 17, verticalPosition: 'middle' }, 
        { fret: 19, verticalPosition: 'middle' }, 
        { fret: 21, verticalPosition: 'middle' }, 
        { fret: 24, verticalPosition: 'upper' }, 
        { fret: 24, verticalPosition: 'lower' }  
    ];
    
    // Clear existing dots
    container.innerHTML = '';
    
    dotPositions.forEach(({ fret, verticalPosition }) => {
        if (fret > maxFret) return;
        
        // Create a dot with data attributes for position type
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.fret = fret;
        dot.dataset.position = verticalPosition;
        
        // Add to container
        container.appendChild(dot);
    });
    
    // Now position the dots after they're in the DOM
    positionDots();
}

// Improved positioning function
function positionDots() {
    const fretboard = document.getElementById('fretboard');
    const dots = document.querySelectorAll('.dot');
    
    // First, find the first and last string for vertical reference points
    const firstString = document.querySelector('.string[data-string="0"]');
    const lastString = document.querySelector('.string[data-string="5"]');
    
    if (!firstString || !lastString) return;
    
    // Calculate the vertical range of the strings
    const firstStringRect = firstString.getBoundingClientRect();
    const lastStringRect = lastString.getBoundingClientRect();
    
    // Calculate top, middle and bottom positions
    const topPosition = firstStringRect.top + (firstStringRect.height / 2);
    const bottomPosition = lastStringRect.top + (lastStringRect.height / 2);
    const middlePosition = topPosition + ((bottomPosition - topPosition) / 2);
    
    // Define vertical positions relative to the fretboard, not the window
    const fretboardRect = fretboard.getBoundingClientRect();
    const relativeTop = topPosition - fretboardRect.top + 4; // Add slight offset for better visual position
    const relativeMiddle = middlePosition - fretboardRect.top;
    const relativeBottom = bottomPosition - fretboardRect.top - 4; // Subtract slight offset
    
    // Use these relative positions to place dots
    dots.forEach(dot => {
        const fret = parseInt(dot.dataset.fret);
        const positionType = dot.dataset.position;
        
        // Find reference fret element
        const refFretElement = document.querySelector(`.string[data-string="0"] .fret[data-fret="${fret}"]`);
        if (!refFretElement) return;
        
        // Calculate center position of the fret
        const refFretRect = refFretElement.getBoundingClientRect();
        const left = (refFretRect.left - fretboardRect.left) + (refFretRect.width / 2);
        
        // Set vertical position based on position type
        let top;
        if (positionType === 'upper') {
            top = relativeTop + ((relativeMiddle - relativeTop) / 2); // Between top and middle
        } else if (positionType === 'lower') {
            top = relativeMiddle + ((relativeBottom - relativeMiddle) / 2); // Between middle and bottom
        } else {
            top = relativeMiddle; // Default middle
        }
        
        // Set the position (using transform for exact centering)
        dot.style.left = `${left}px`;
        dot.style.top = `${top}px`;
    });
}

// Add a resize handler to reposition dots when window size changes
window.addEventListener('resize', debounce(() => {
    positionDots();
}, 100));
