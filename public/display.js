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
document.getElementById("DropDown").addEventListener("change", showTableHeaders);

const tableDisplayFields = {
    Stadium1: ["address", "city"],
    Stadium2: ["name", "address", "capacity"],
    Match1: ["date", "phase"],
    Match2: ["stadiumName", "result", "date", "time"],
    Country: ["name", "ranking"],
    Manager: ["managerID", "name", "age", "nationality"],
    Team: ["teamID", "size", "countryName", "managerID"],
    Sponsor: ["sponsorID", "name"],
    Funds: ["sponsorID", "teamID"],
    Player: ["playerID", "teamID", "passes", "assists", "name", "age"],
    Forward: ["playerID", "shots", "goals"],
    Midfield: ["playerID", "tackles", "shots", "goals", "interceptions"],
    Goalkeeper: ["playerID", "saves"],
    Defender: ["playerID", "tackles", "shots", "goals", "interceptions"],
    GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
    PlayIn: ["matchID", "teamID"]

}

async function displayTable() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableElement = document.getElementById('displayTable')
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/display/${selectedDropDown}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log("Response Data:", responseData); // Debug log

    const tableContent = responseData.data;
    const allFields = tableDisplayFields[selectedDropDown];

    tableBody.innerHTML = '';


    tableContent.forEach(rowArray => {
        const row = tableBody.insertRow();
        rowArray.forEach((cellData, index) => {
            const cell = row.insertCell();
            cell.textContent = cellData;
            console.log(`Column: ${allFields[index]}, Value: ${cellData}`); // Debug log
        });
    });
}

async function showTableHeaders() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableHead = document.getElementById("tableHeadFields");
    tableHead.innerHTML = "";
    const allFields = tableDisplayFields[selectedDropDown];
    generateHeaders(allFields, tableHead);

}

function generateHeaders(fields, tableHead) {
    const tableRow = document.createElement("tr");
    fields.forEach(function (field) {
        const header = document.createElement("th");
        header.textContent = field;
        tableRow.appendChild(header);
    });
    tableHead.appendChild(tableRow);
}

window.onload = showTableHeaders;