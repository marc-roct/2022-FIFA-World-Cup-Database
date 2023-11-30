document.getElementById("confirm-button").addEventListener("click", doProjection);

const tableProjectAttributeFields = {
    Stadium1: ["address", "city"],
    Stadium2: ["name", "address", "capacity"],
    Match1: ["matchDate", "phase"],
    Match2: ["matchID", "stadiumName", "result", "matchDate", "time"],
    Country: ["name", "ranking"],
    Manager: ["managerID", "name", "age", "nationality"],
    Team: ["teamID", "teamSize", "countryName", "managerID"],
    Sponsor: ["sponsorID", "name"],
    Funds: ["sponsorID", "teamID"],
    Player: ["playerID", "teamID", "passes", "assists", "name", "age"],
    Forward: ["playerID", "teamID", "passes", "assists", "name", "age", "shots", "goals"],
    Midfield: ["playerID", "teamID", "passes", "assists", "name", "age", "tackles", "shots", "goals", "interceptions"],
    Defender: ["playerID", "teamID", "passes", "assists", "name", "age", "tackles", "shots", "goals", "interceptions"],
    Goalkeeper: ["playerID", "teamID", "passes", "assists", "name", "age", "saves"],
    GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
    PlayIn: ["matchID", "teamID"]
}

function displayAttributes() {
    const dropDown = document.getElementById("DropDown").value;
    const attributesContainer = document.getElementById("projectionAttributes");
    attributesContainer.innerHTML = "";
    const allFields = tableProjectAttributeFields[dropDown];
    generateDisplayFields(allFields, attributesContainer);
}

function createProjectionData(selectedAttributes) {
    const selectedTables = [];
    selectedTables.push(document.getElementById("DropDown").value);
    return {
        selectedTables: selectedTables,
        selectedAttributes: selectedAttributes,
        filter: ""
    };
}

async function performProjectionAPI(body) {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableElement = document.getElementById("projectionTable");
    const projectionTableBody = document.querySelector("tbody");
    const response = await fetch(`/select-table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    const responseJson = await response.json();
    console.log("Response Data:", responseJson); // Debug log

    const tableHead = document.getElementById("projectedFields");
    tableHead.innerHTML = "";
    const allFields = body.selectedAttributes;
    generateDisplayHeaders(allFields, tableHead);

    const tableContent = responseJson.data;

    projectionTableBody.innerHTML = '';
    tableContent.forEach(rowArray => {
        const row = projectionTableBody.insertRow();
        rowArray.forEach((cellData, index) => {
            const cell = row.insertCell();
            cell.textContent = cellData;
            console.log(`Column: ${allFields[index]}, Value: ${cellData}`); // Debug log
        });
    });
}

function generateDisplayHeaders(allFields, tableHead) {
    const tableRow = document.createElement("tr");
    allFields.forEach(function (field) {
        const header = document.createElement("th");
        header.textContent = field;
        tableRow.appendChild(header);
    });
    tableHead.appendChild(tableRow);
}

function handleProjectionResponse(responseData) {
    if (responseData.success) {
        const messageElement = document.getElementById("deleteResultMsg");
        messageElement.textContent = "You have successfully deleted the data!";
        console.log("You have successfully deleted the data");
    } else {
        alert("Error deleting the data");
        console.log("Unfortunately, deletion is unsuccessful");
    }
}

async function doProjection() {
    const selectedAttributes = formSelectedAttributeArray();
    console.log(selectedAttributes);
    const body = createProjectionData(selectedAttributes);
    console.log(body);
    await performProjectionAPI(body);
}

function formSelectedAttributeArray() {
    const projectionOptions = document.getElementById("projectionAttributes");
    return Array.from(projectionOptions.selectedOptions).map(option => option.value);
}


function generateDisplayFields(allFields, attributesContainer) {
    allFields.forEach(function (field) {
        // const label = document.createElement("label");
        // label.textContent = field;
        const attributeOption = document.createElement("option");
        attributeOption.value = field;
        attributeOption.textContent = field;
        // attributesContainer.appendChild(label);
        attributesContainer.appendChild(attributeOption);
        const br = document.createElement("br");
        attributesContainer.appendChild(br);
    });
}