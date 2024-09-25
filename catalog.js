const fs = require('fs');

// Function to decode values from different bases
function decodeValue(base, value) {
    return BigInt(parseInt(value, base));  // Use BigInt to handle large numbers
}

// Function to calculate Lagrange Interpolation
function lagrangeInterpolation(points) {
    let constantTerm = BigInt(0);  // Initialize as BigInt

    for (let i = 0; i < points.length; i++) {
        let xi = BigInt(points[i].x);
        let yi = points[i].y;
        let li = BigInt(1);

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = BigInt(points[j].x);
                li *= -xj / (xi - xj);  // Calculating the Lagrange basis polynomial
            }
        }
        constantTerm += yi * li;
    }
    return constantTerm;
}

// Function to extract and decode points from JSON
function extractPointsFromJSON(data) {
    const points = [];
    for (let i = 1; i <= data.keys.n; i++) {
        if (data[i]) {
            const x = parseInt(i);  // 'x' is the key (1, 2, 3, etc.)
            const y = decodeValue(data[i].base, data[i].value);  // Decode 'y'
            points.push({ x, y });
        }
    }
    return points;
}

// Reading JSON data from file
fs.readFile('input.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    try {
        const data = JSON.parse(jsonString);

        // Extract points from the JSON data
        let points = extractPointsFromJSON(data);

        // Sort points by 'x' value (key)
        points.sort((a, b) => a.x - b.x);

        // We need k points to solve the polynomial (k = m + 1)
        if (points.length >= data.keys.k) {
            const selectedPoints = points.slice(0, data.keys.k);  // Select k points

            // Calculate the constant term 'c' using Lagrange interpolation
            const constantTerm = lagrangeInterpolation(selectedPoints);
            console.log("The constant term (c) is:", constantTerm.toString());
        } else {
            console.log("Not enough points to solve the polynomial.");
        }
    } catch (err) {
        console.error("Error parsing JSON string:", err);
    }
});
