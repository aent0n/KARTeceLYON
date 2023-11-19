function searchName() {
    const searchInput = document.getElementById("searchBar");
    const name = searchInput.value;
    const url = "https://docs.google.com/document/d/1tZGAF2po4KXmNW0n6ZTDc1WiReEA3CQxdaklmBW4RHU/export?format=txt";

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const names = lines.map(line => line.split(",")[0]);
            const ids = lines.map(line => line.split(",")[1]);
            const index = names.findIndex(n => n.trim() === name);

            // Remove any existing result div
            const existingResultDiv = document.getElementById("resultDiv");
            if (existingResultDiv) {
                existingResultDiv.remove();
            }

            // Create and insert the new result div
            const resultDiv = document.createElement("div");
            resultDiv.id = "resultDiv";
            resultDiv.classList.add("mx-auto");
            if (index !== -1) {
                const idText = document.createElement("span");
                idText.innerText = ids[index];
                idText.style.color = "#4E92EC";
                resultDiv.innerText = "⚡ User found, ID is: ";
                resultDiv.appendChild(idText);
            } else {
                resultDiv.innerText = "❌ User not found";
            }
            resultDiv.style.fontSize = "12px";
            // Insert the resultDiv inside the resultContainer
            const resultContainer = document.getElementById("resultContainer");
            resultContainer.appendChild(resultDiv);
        })
        .catch(error => console.log(error));
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
