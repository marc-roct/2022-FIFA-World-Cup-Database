function handleDisplayAPIResponse(responseHandle) {
    try {
        const tableArea = document.getElementById("result-table");
        responseHandle.forEach(eachRow => {
            const div = document.createElement('div');
            for (const attribute in eachRow) {
                div.innerHTML += `<b>${attribute}:</b> ${eachRow[attribute]}`;
            }
        tableArea.appendChild(div);
        })
    } catch (error) {
        console.error("Error: " + error)
    }

}

async function displayTable() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const projections = [];
    const filters = "";
    const displayParameters = {selectedDropDown, projections, filters};
    const response = await fetch('/demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(displayParameters),
    })
        .then(response => response.json())
        .then(responseHandle => handleDisplayAPIResponse(responseHandle))
        .catch(error => console.error('Error: ' + error));
}