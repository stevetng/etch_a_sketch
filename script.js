const container = document.getElementById('container');
const resetButton = document.getElementById('resetButton');

function createGrid(size) {
    // Remove existing squares
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Calculate the size of each square
    const squareSize = 960 / size;

    // Create the grid squares
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;

        // Event listener for hover effect
        square.addEventListener('mouseover', () => {
            // If square doesn't have a background color yet, assign a random color
            if (!square.style.backgroundColor) {
                const randomColor = getRandomColor();
                square.style.backgroundColor = randomColor;
                square.dataset.hoverCount = 1;

                // Convert to HSL and store initial HSL values
                const rgbValues = randomColor.match(/\d+/g).map(Number);
                const [r, g, b] = rgbValues;
                const [h, s, l] = rgbToHsl(r, g, b);
                square.dataset.h = h;
                square.dataset.s = s;
                square.dataset.l = l;
            } else {
                // Increase hover count
                let hoverCount = parseInt(square.dataset.hoverCount);
                if (hoverCount < 10) {
                    hoverCount += 1;
                    square.dataset.hoverCount = hoverCount;

                    // Get initial HSL values
                    const h = parseFloat(square.dataset.h);
                    const s = parseFloat(square.dataset.s);
                    const initialL = parseFloat(square.dataset.l);

                    // Calculate new lightness
                    let newL = initialL * (1 - hoverCount * 0.1);
                    newL = Math.max(newL, 0); // Ensure it doesn't go below 0

                    // Convert back to RGB
                    const [newR, newG, newB] = hslToRgb(h, s, newL);
                    square.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
                }
            }
        });

        // Append the square to the container
        container.appendChild(square);
    }
}

// Function to generate a random RGB color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256); // 0 to 255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
    let r, g, b;

    function hue2rgb(p, q, t) {
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }
        if (t < 1 / 6) { return p + (q - p) * 6 * t; }
        if (t < 1 / 2) { return q; }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
        return p;
    }

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

// Event listener for the reset button
resetButton.addEventListener('click', () => {
    let size = prompt("Enter grid size (1-100):");
    size = parseInt(size);
    if (size >= 1 && size <= 100) {
        createGrid(size);
    } else {
        alert("Please enter a number between 1 and 100.");
    }
});

// Initialize the grid with default size
createGrid(16);
