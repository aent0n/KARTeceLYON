function searchName() {
    const searchInput = document.getElementById("searchBar");
    const enteredName = searchInput.value.toLowerCase().trim(); // Convert to lowercase and remove extra spaces
    const url = "https://docs.google.com/document/d/1tZGAF2po4KXmNW0n6ZTDc1WiReEA3CQxdaklmBW4RHU/export?format=txt";

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const formattedNames = lines.map(line => line.split(",")[0].toLowerCase().trim()); // Convert names to lowercase and remove extra spaces

            // Check for direct match
            const directMatchIndex = formattedNames.findIndex(name => name === enteredName);
            if (directMatchIndex !== -1) {
                displayResult(lines[directMatchIndex]);
                return;
            }

            // Check for reversed order match
            const [firstName, lastName] = enteredName.split(" ");
            const reversedName = `${lastName} ${firstName}`;
            const reversedMatchIndex = formattedNames.findIndex(name => name === reversedName);
            if (reversedMatchIndex !== -1) {
                displayResult(lines[reversedMatchIndex]);
                return;
            }

            // Handle no match
            displayNoResult();
        })
        .catch(error => console.log(error));
}

function displayResult(result) {
    // Clear previous result if it exists
    const previousResultDiv = document.getElementById("resultDiv");
    if (previousResultDiv) {
        previousResultDiv.remove();
    }

    // Create and insert the new result div
    const resultDiv = document.createElement("div");
    resultDiv.id = "resultDiv";
    resultDiv.classList.add("mx-auto");
    const idText = document.createElement("span");
    idText.innerText = result.split(",")[1];
    idText.style.color = "#4E92EC";
    resultDiv.innerText = "⚡ User found, ID is: ";
    resultDiv.appendChild(idText);
    resultDiv.style.fontSize = "12px";
    // Insert the resultDiv inside the resultContainer
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.appendChild(resultDiv);
}

function displayNoResult() {
    // Clear previous result if it exists
    const previousResultDiv = document.getElementById("resultDiv");
    if (previousResultDiv) {
        previousResultDiv.remove();
    }

    // Create and insert the new result div for no result
    const resultDiv = document.createElement("div");
    resultDiv.id = "resultDiv";
    resultDiv.classList.add("mx-auto");
    resultDiv.innerText = "❌ User not found";
    resultDiv.style.fontSize = "12px";
    // Insert the resultDiv inside the resultContainer
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.appendChild(resultDiv);
}

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    searchName();
});

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", function() {
    const resultDiv = document.getElementById("resultDiv");
    if (resultDiv) {
        resultDiv.remove();
    }
});

const searchBar2 = document.getElementById("searchBar");
searchBar2.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default form submission behavior
        searchName();
    }
});
