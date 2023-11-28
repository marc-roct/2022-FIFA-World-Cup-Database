// function handleDisplayAPIResponse(responseHandle) {
//     try {
//         const tableArea = document.getElementById("result-table");
//         responseHandle.forEach(eachRow => {
//             const div = document.createElement('div');
//             for (const attribute in eachRow) {
//                 div.innerHTML += `<b>${attribute}:</b> ${eachRow[attribute]}`;
//             }
//         tableArea.appendChild(div);
//         })
//     } catch (error) {
//         console.error("Error: " + error)
//     }
//
// }
document.getElementById("confirm-button").addEventListener("click", displayTable);

const tableDisplayFields = {
    StadiumOne: ["address", "city"],
    StadiumTwo: ["name", "address", "capacity"],
    MatchOne: ["date", "phase"],
    MatchTwo: ["stadiumName", "result", "date", "time"],
    Country: ["name", "ranking"],
    Manager: ["managerID", "name", "age", "nationality"],
    Team: ["teamID", "size", "countryName", "managerID"],
    Sponsor: ["sponsorID", "name"],
    Funds: ["sponsorID", "teamID"],
    Player: ["playerID", "teamID", "passes", "assists", "name", "age"],
    GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
    PlayIn: ["matchID", "teamID"],
    Forward: ["playerID", "shots", "goals"],
    Midfield: ["playerID", "tackles", "shots", "goals", "interceptions"],
    Goalkeeper: ["playerID", "saves"],
    Defender: ["playerID", "tackles", "shots", "goals", "interceptions"],
}

async function displayTable() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableElement = document.getElementById('displayTable')
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/display-${selectedDropDown.toLowerCase()}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;
    const allFields = tableDisplayFields[selectedDropDown];

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(rowData => {
        const row = tableBody.insertRow();
        allFields.forEach(field => {
            const cell = row.insertCell();
            cell.textContent = rowData[field];
        });
    });
}

async function showTableHeaders() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableFieldsHolder = document.getElementById("tableHeadFields");
    tableFieldsHolder.innerHTML = "";
    const allFields = tableDisplayFields[selectedDropDown];
    generateHeaders(allFields, tableFieldsHolder);

    // const confirmButton = document.createElement("button");
    // confirmButton.type = "button";
    // confirmButton.textContent = "Confirm";
    // confirmButton.addEventListener("click", displayTable);
    // tableFieldsHolder.appendChild(confirmButton);
}

function generateHeaders(fields, tableFieldsHolder) {
    const tableRow = document.createElement("tr");
    fields.forEach(function (field) {
        const header = document.createElement("th");
        header.textContent = field;
        tableFieldsHolder.appendChild(header);
    });
    tableFieldsHolder.appendChild(tableRow);
}
