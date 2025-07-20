const circleKeys = [
    { key: 'C', angle: 0 },
    { key: 'G', angle: 30 },
    { key: 'D', angle: 60 },
    { key: 'A', angle: 90 },
    { key: 'E', angle: 120 },
    { key: 'B', angle: 150 },
    { key: 'F#', alt: 'Gb', angle: 180 },
    { key: 'C#', alt: 'Db', angle: 210 },
    { key: 'G#', alt: 'Ab', angle: 240 },
    { key: 'D#', alt: 'Eb', angle: 270 },
    { key: 'A#', alt: 'Bb', angle: 300 },
    { key: 'F', angle: 330 }
];

function renderCircleOfFifths() {
    const container = document.getElementById('circle-container');
    if (!container) return;
    container.innerHTML = '';
    const size = Math.min(container.offsetWidth, container.offsetHeight);
    const radius = size / 2;
    circleKeys.forEach(key => {
        const angleRad = (key.angle * Math.PI) / 180;
        const x = radius + (radius * 0.7) * Math.cos(angleRad);
        const y = radius + (radius * 0.7) * Math.sin(angleRad);

        const keyDiv = document.createElement('div');
        keyDiv.className = 'circle-key';
        keyDiv.textContent = getCookie(`circle_${key.key}`) || key.key;
        if (key.alt) keyDiv.classList.add('sharp-flat');
        keyDiv.style.left = `${x}px`;
        keyDiv.style.top = `${y}px`;

        keyDiv.addEventListener('click', () => {
            if (key.alt) {
                const current = keyDiv.textContent;
                const newKey = current === key.key ? key.alt : key.key;
                keyDiv.textContent = newKey;
                
                // Store preference in cookie (use the sharp version as the key)
                const canonicalKey = key.key.includes('#') ? key.key : key.alt;
                setCookie(`circle_${canonicalKey}`, newKey, 30);
                
                // Update any displayed notes on the page to maintain consistency
                updateDisplayedNotes();
            }
        });

        container.appendChild(keyDiv);
    });
}

const tooltip = document.getElementById('circle-of-fifths-tooltip');
const header = document.getElementById('cof-header');
const toggleButton = document.getElementById('toggle-cof');
let isDragging = false;
let currentX = window.innerWidth - 270;
let currentY = 20;
let initialX, initialY;

toggleButton.addEventListener('click', () => {
    tooltip.classList.toggle('collapsed');
});

header.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);

function startDragging(e) {
    if (e.target !== toggleButton) {
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        header.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        tooltip.style.left = `${currentX}px`;
        tooltip.style.top = `${currentY}px`;
        tooltip.style.right = 'auto';
    }
}

function stopDragging() {
    isDragging = false;
    header.style.cursor = 'move';
}

tooltip.style.left = `${currentX}px`;
tooltip.style.top = `${currentY}px`;

function createCircleTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    tooltip.style.display = 'flex';
    tooltip.style.flexDirection = 'column';
    tooltip.style.justifyContent = 'center';
    tooltip.style.alignItems = 'center';
    tooltip.style.textAlign = 'center';
    
    const circleElement = createCircleOfFifths();
    tooltip.appendChild(circleElement);
    
    return tooltip;
}

// Add function to update displayed notes when preferences change
function updateDisplayedNotes() {
    // Update answer buttons if they exist
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
        if (button.dataset.canonicalNote) {
            button.textContent = noteUtils.getDisplayPreference(button.dataset.canonicalNote);
        }
    });
    
    // Update any other displayed notes as needed
}

function initCircleTooltip() {
    // Make sure the toggle button works
    document.getElementById('toggle-cof').addEventListener('click', function() {
        document.getElementById('circle-of-fifths-tooltip').classList.toggle('collapsed');
    });
    
    // Ensure it starts in expanded state
    document.getElementById('circle-of-fifths-tooltip').classList.remove('collapsed');
}

// Call this function at the end of the file
initCircleTooltip();
