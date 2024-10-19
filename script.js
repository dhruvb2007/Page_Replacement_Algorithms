// Utility function to parse page reference string into an array of integers
function parsePageReferences(refString) {
    return refString.split(',').map(Number);
}

// FIFO Algorithm with visualization
function fifo(pageReferences, pageFrames) {
    let frames = Array(pageFrames).fill(null); // Initialize empty frames
    let pageFaults = 0;
    let result = [];
    let pointer = 0; // This will keep track of which frame to replace (FIFO)

    pageReferences.forEach((page) => {
        let status = "Miss"; // Default status is "Miss"

        if (!frames.includes(page)) {
            // Page fault occurs
            frames[pointer] = page; // Replace the page at the current pointer
            pointer = (pointer + 1) % pageFrames; // Move the pointer forward in a circular manner
            pageFaults++;
        } else {
            // If the page is already in the frames, it is a hit
            status = "Hit";
        }

        // Save the current frame state and status
        result.push({
            frames: [...frames],
            status: status, // Either "Hit" or "Miss"
            currentPage: page // Keep track of the current page for better visualization
        });
    });

    return { result, pageFaults };
}

// LRU Algorithm with visualization
function lru(pageReferences, pageFrames) {
    let frames = Array(pageFrames).fill(null); // Initialize empty frames
    let pageFaults = 0;
    let result = [];
    let recentUsage = []; // Keep track of the usage order of the pages

    pageReferences.forEach((page) => {
        let status = "Miss"; // Default status is "Miss"

        if (!frames.includes(page)) {
            // If page is not in frames, replace least recently used page
            if (frames.includes(null)) {
                frames[frames.indexOf(null)] = page;
            } else {
                let leastRecentlyUsed = recentUsage.shift();
                frames[frames.indexOf(leastRecentlyUsed)] = page;
            }
            pageFaults++;
        } else {
            // If the page is already in frames, it is a hit
            status = "Hit";
        }

        // Update recent usage
        if (recentUsage.includes(page)) {
            recentUsage = recentUsage.filter(item => item !== page);
        }
        recentUsage.push(page);

        // Save the current frame state and status
        result.push({
            frames: [...frames],
            status: status, // Either "Hit" or "Miss"
            currentPage: page // Keep track of the current page for better visualization
        });
    });

    return { result, pageFaults };
}

// Calculate button click event
document.getElementById('calculate-btn').addEventListener('click', function () {
    const algorithm = document.getElementById('algorithm-dropdown').value;
    const pageReferences = parsePageReferences(document.getElementById('page-references').value);
    const pageFrames = parseInt(document.getElementById('page-frames').value, 10);

    let visualizationResult;
    if (algorithm === 'FIFO') {
        visualizationResult = fifo(pageReferences, pageFrames);
    } else if (algorithm === 'LRU') {
        visualizationResult = lru(pageReferences, pageFrames);
    }

    // Display results
    document.getElementById('input-form').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result-title').innerText = `${algorithm} Algorithm Results:`;
    displayVisualization(visualizationResult.result);
    document.getElementById('total-page-fault').innerText = `Total Page Faults = ${visualizationResult.pageFaults}`;
});

// Function to display visualization as a column
function displayVisualization(framesData) {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = ''; // Clear previous visualization

    // Create a column for each frame
    framesData.forEach((data, index) => {
        const column = document.createElement('div');
        column.classList.add('column');

        // Create status message for the current page
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status');
        statusDiv.textContent = data.status; // Display 'Hit' or 'Miss'
        column.appendChild(statusDiv); // Append status to its column

        // Create frame elements
        data.frames.forEach((frame) => {
            const frameDiv = document.createElement('div');
            frameDiv.classList.add('frame');
            frameDiv.textContent = frame !== null ? frame : '-'; // Show '-' for empty frames
            column.appendChild(frameDiv); // Append frame to its column
        });

        // Header for reference number
        const header = document.createElement('div');
        header.classList.add('header');
        header.textContent = `${data.currentPage}`;
        column.appendChild(header);

        visualizationDiv.appendChild(column); // Append the column to the visualization div
    });
}

// Reset form function
function resetForm() {
    document.getElementById('input-form').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('page-references').value = '';
    document.getElementById('page-frames').value = '';
    document.getElementById('visualization').innerHTML = '';
}
