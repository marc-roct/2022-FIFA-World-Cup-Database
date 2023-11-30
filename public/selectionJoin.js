document.getElementById("confirm-table").addEventListener("click", developInputSection);
document.getElementById("confirm-button").addEventListener("click", confirmSJ);

const tableSJFields = {
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
function developInputSection() {
    const multiselectDropDown = document.getElementById("DropDown");
    const selectedTables = Array.from(multiselectDropDown.selectedOptions).map(option => option.value);
    const filterEnteringSection = document.getElementById("filterEnteringSection");
    selectedTables.forEach(table => {
        console.log(table);
        const attributes = tableSJFields[table];
        attributes.forEach(att => {
            const div = document.createElement("div");
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.name = att;
            const operatorInputField = document.createElement("input");
            operatorInputField.type = "text";
            operatorInputField.name = att + "operator";
            operatorInputField.placeholder = "AND or OR";
            // const operator = document.createElement("select");
            // operator.name = att + "operator";
            // const and = document.createElement("option");
            // and.value = "AND";
            // and.textContent = "AND";
            // const or = document.createElement("option");
            // or.value = "OR";
            // or.textContent = "OR";
            const attLabel = document.createElement("label");
            attLabel.textContent = att;
            // operator.appendChild(and);
            // operator.appendChild(or);
            div.appendChild(attLabel);
            div.appendChild(inputField);
            div.appendChild(operatorInputField);
            filterEnteringSection.appendChild(div);
        });
    });
}

function createSelectionJoinData() {
    const multiselectDropDown = document.getElementById("DropDown");
    const selectedTables = Array.from(multiselectDropDown.selectedOptions).map(option => option.value);
    const filter = [];
    selectedTables.forEach(table => {
        const attributes = tableSJFields[table];
        attributes.forEach(att => {
            console.log(document.querySelector(`[name=${att}]`).value);
            if (document.querySelector(`[name=${att}]`).value !== "") {
                const arrayToInsert = [];
                arrayToInsert.push(att);
                arrayToInsert.push(document.querySelector(`[name=${att}]`).value);
                if (document.querySelector(`[name=${att}operator]`) !== null) {
                    arrayToInsert.push(document.querySelector(`[name=${att}operator]`).value);
                }
                filter.push(arrayToInsert);
            }
        });
    });
    filter[filter.length - 1].pop();
    return {
        selectedTables: selectedTables,
        filter: filter,
    }
}

async function confirmSJ() {
    const sjData = createSelectionJoinData();
    await performSJAPI(sjData);
}

async function performSJAPI(data) {
    const multiselectDropDown = document.getElementById("DropDown");
    const selectedTables = Array.from(multiselectDropDown.selectedOptions).map(option => option.value);
    const tableElement = document.getElementById("SJTable");
    const SJTableBody = document.querySelector("tbody");
    const attributeArray = [];
    selectedTables.forEach(table => {
        const attributes = tableSJFields[table];
        attributes.forEach(att => {
            attributeArray.push(att);
        });
    });
    console.log(data);
    const tableHead = document.getElementById("SJFields");
    tableHead.innerHTML = "";
    console.log(attributeArray);
    generateSJHeaders(attributeArray, tableHead);
    const response = await fetch('/select-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const responseJson = await response.json();
    const content = responseJson.data;

    SJTableBody.innerHTML = '';
    content.forEach(rowArray => {
        const row = SJTableBody.insertRow();
        rowArray.forEach((cellData, index) => {
            const cell = row.insertCell();
            cell.textContent = cellData;
            console.log(`Column: ${rowArray[index]}, Value: ${cellData}`); // Debug log
        });
    });
}

function generateSJHeaders(attributeArray, tableHead) {
    const tableRow = document.createElement("tr");
    attributeArray.forEach(function (field) {
        const header = document.createElement("th");
        header.textContent = field;
        tableRow.appendChild(header);
    });
    tableHead.appendChild(tableRow);
}



