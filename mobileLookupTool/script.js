function searchName() {
    const searchInput = document.getElementById("searchBar");
    const enteredName = searchInput.value.toLowerCase().trim(); // Convert to lowercase and remove extra spaces
    const url = "https://docs.google.com/document/d/1tZGAF2po4KXmNW0n6ZTDc1WiReEA3CQxdaklmBW4RHU/export?format=txt";

    // Clear previous result if it exists
    const previousResultDiv = document.getElementById("resultDiv");
    if (previousResultDiv) {
        previousResultDiv.remove();
    }

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

searchBar.addEventListener("input", async function(event) {
    const enteredName = searchBar.value.toLowerCase().trim(); // Convert to lowercase and remove extra spaces
    if (enteredName === "") {
        clearDisplay();
        return;
    }
    try {
        const suggestedNames = await getSuggestedNames(enteredName); // Wait for the Promise to resolve
        displaySuggestedNames(suggestedNames); // Call the displaySuggestedNames function with the retrieved suggested names
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., display an error message to the user
    }
});

function clearDisplay() {
    const suggestedNamesContainer = document.getElementById("suggestedNamesContainer");
    suggestedNamesContainer.innerHTML = ""; // Clear suggested names

    const resultDiv = document.getElementById("resultDiv");
    if (resultDiv) {
        resultDiv.remove(); // Clear result div
    }
}

function getSuggestedNames(enteredName) {
    // Fetch the data from the Google document
    const url = "https://docs.google.com/document/d/1tZGAF2po4KXmNW0n6ZTDc1WiReEA3CQxdaklmBW4RHU/export?format=txt";

    return fetch(url)
        .then(response => response.text())
        .then(data => {
            // Process the data to extract the names for suggesting based on the user input
            const lines = data.split("\n");
            const suggestedNames = lines.map(line => line.split(",")[0].trim()); // Extract names from the lines

            return suggestedNames.filter(fullName => {
                // Split the full name into words
                const nameParts = fullName.split(" ");
                // Check each part of the name for a match
                return nameParts.some(namePart => hasThreeOrMoreSameCharacters(namePart, enteredName));
            });
        })
        .catch(error => {
            console.log(error);
            return []; // Return an empty array in case of an error
        });
}
function hasThreeOrMoreSameCharacters(name, enteredName) {
    const nameLowerCase = name.toLowerCase();
    const enteredNameLowerCase = enteredName.toLowerCase();

    for (let i = 0; i <= enteredNameLowerCase.length - 3; i++) {
        const subString = enteredNameLowerCase.substring(i, i + 3);
        if (nameLowerCase.includes(subString)) {
            return true;
        }
    }

    return false;
}

function displaySuggestedNames(suggestedNames) {
    const suggestedNamesContainer = document.getElementById("suggestedNamesContainer");
    suggestedNamesContainer.innerHTML = ""; // Clear previous suggestions
    suggestedNamesContainer.style.display = "flex"; // Display the buttons in a column
    suggestedNamesContainer.style.flexDirection = "column";

    if (Array.isArray(suggestedNames)) {
        suggestedNames.forEach(name => {
            const nameButton = document.createElement("button");
            nameButton.innerText = name;
            nameButton.classList.add("px-4", "ml-2", "py-2", "bg-[#A7A6AD]", "text-[#000000]", "rounded", "transition-transform", "hover:scale-105", "w-auto", "mt-2");
            nameButton.addEventListener("click", function() {
                document.getElementById("searchBar").value = name; // Auto-complete the text input
                clearDisplay(); // Clear all suggested names
                searchName(); // Validate the input request, e.g., trigger the searchName function
            });
            suggestedNamesContainer.appendChild(nameButton);
        });
    } else {
        const errorDiv = document.createElement("div");
        errorDiv.innerText = "Error: Suggested names data is not in the expected format";
        suggestedNamesContainer.appendChild(errorDiv);
    }
}
