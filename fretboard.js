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

// Add this function definition before it's used
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Then the existing code will work:
window.addEventListener('resize', debounce(() => {
    positionDots();
}, 100));

// Heatmap rendering function
function renderHeatmap() {
    const fretboard = document.getElementById('fretboard');
    // Clear any existing heatmap dots
    document.querySelectorAll('.heatmap-dot').forEach(el => el.remove());
    
    // Get performance data from cookies
    const noteLog = JSON.parse(getCookie('noteLog') || '[]');
    const chordLog = JSON.parse(getCookie('chordLog') || '[]');
    
    // Combine both logs
    const allLogs = [...noteLog, ...chordLog];
    
    // If no data, show message and return
    if (allLogs.length === 0) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10;
        `;
        message.textContent = 'No performance data available yet';
        fretboard.appendChild(message);
        return;
    }
    
    // Count correct/incorrect answers for each string/fret combination
    const heatmapData = {};
    
    allLogs.forEach(log => {
        const key = `${log.string}-${log.fret}`;
        if (!heatmapData[key]) {
            heatmapData[key] = { correct: 0, incorrect: 0, total: 0 };
        }
        
        if (log.result === 'correct') {
            heatmapData[key].correct++;
        } else {
            heatmapData[key].incorrect++;
        }
        heatmapData[key].total++;
    });
    
    // Create heatmap visuals - attach directly to fret elements like notes
    Object.keys(heatmapData).forEach(key => {
        const [string, fret] = key.split('-').map(Number);
        const data = heatmapData[key];
        
        // Find the fret element - using same selector logic as showNotesOnFretboard
        let fretElement;
        if (fret === 0) {
            fretElement = document.querySelector(`.string[data-string="${string}"] .fret.open`);
        } else {
            fretElement = document.querySelector(`.string[data-string="${string}"] .fret[data-fret="${fret}"]`);
        }
        
        if (fretElement) {
            // Calculate color based on correct/incorrect ratio
            const ratio = data.correct / data.total;
            let color;
            if (ratio >= 0.8) {
                // Green for mostly correct
                color = `rgba(0, 204, 153, ${Math.min(0.9, 0.3 + data.total * 0.05)})`;
            } else if (ratio >= 0.5) {
                // Yellow for mixed
                color = `rgba(255, 204, 0, ${Math.min(0.9, 0.3 + data.total * 0.05)})`;
            } else {
                // Red for mostly incorrect
                color = `rgba(255, 102, 102, ${Math.min(0.9, 0.3 + data.total * 0.05)})`;
            }
            
            // Size based on total attempts
            const size = Math.min(40, 15 + data.total * 2);
            
            // Create heat dot - attach directly to the fret element
            const dot = document.createElement('div');
            dot.className = 'heatmap-dot';
            
            dot.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                opacity: 0.7;
                z-index: ${90 + data.total}; /* Below the note display but above frets */
                pointer-events: none;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
            `;
            
            // Tooltip with stats
            dot.title = `${data.correct} correct / ${data.total} total (${Math.round(ratio * 100)}%)`;
            
            fretElement.appendChild(dot);
        }
    });
}

// Update setupHeatmap function
function setupHeatmap() {
    const heatmapToggle = document.getElementById('heatmap-toggle');
    const resetScoreButton = document.getElementById('reset-score');
    
    if (heatmapToggle) {
        // Set the initial text/icon
        heatmapToggle.textContent = '🔥';
        
        heatmapToggle.addEventListener('click', function() {
            const fretboard = document.getElementById('fretboard');
            const heatmapActive = fretboard.classList.contains('heatmap-active');
            
            if (heatmapActive) {
                // Turn off heatmap
                clearHeatmap();
                // Remove active state from button
                heatmapToggle.classList.remove('active-toggle');
            } else {
                // Turn on heatmap
                renderHeatmap();
                fretboard.classList.add('heatmap-active');
                // Add active state to button
                heatmapToggle.classList.add('active-toggle');
            }
        });
    }
    
    // Add reset functionality
    if (resetScoreButton) {
        // Add event listener to clear logs when reset is clicked
        resetScoreButton.addEventListener('click', function() {
            // Clear the heatmap if it's active
            clearHeatmap();
            
            // Clear the log cookies
            clearLogCookies();
        });
    }
}

// Update clearHeatmap function
function clearHeatmap() {
    const fretboard = document.getElementById('fretboard');
    const heatmapToggle = document.getElementById('heatmap-toggle');
    
    document.querySelectorAll('.heatmap-dot').forEach(el => el.remove());
    fretboard.classList.remove('heatmap-active');
    if (heatmapToggle) heatmapToggle.classList.remove('active-toggle');
}

// Function to clear the note and chord log cookies
function clearLogCookies() {
    // Set both cookies to empty arrays
    document.cookie = "noteLog=[]" + "; path=/; max-age=" + 60*60*24*365; // 1 year expiration
    document.cookie = "chordLog=[]" + "; path=/; max-age=" + 60*60*24*365; // 1 year expiration
    console.log("Note and chord logs have been cleared");
}

// Helper function to set cookies
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';path=/;expires=' + expires.toUTCString();
}

// Helper function to read cookies - duplicate of the one in main script
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// Then add a call to setupHeatmap at the end of the file
window.addEventListener('DOMContentLoaded', function() {
    setupHeatmap();
});
