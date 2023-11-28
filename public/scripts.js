    /*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */
const tableInsertInputFields = {
    Stadium: ["Name", "address", "capacity", "city"],
    Match: ["matchID", "stadiumName", "result", "date", "time", "phase"],
    GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
    PlayIn: ["matchID", "teamID"],
    Team: ["teamID", "size", "countryName", "managerID"],
    Country: ["name", "ranking", "teamID"],
    Manager: ["managerID", "name", "age", "nationality", "teamID"],
    Funds: ["sponsorID", "teamID"],
    Sponsor: ["sponsorID", "name"],
    Player: ["playerID", "teamID", "passes", "assists", "name", "age"],
    Forward: ["playerID", "shots", "goals"],
    Midfield: ["playerID", "tackles", "shots", "goals", "interceptions"],
    Goalkeeper: ["playerID", "saves"],
    Defender: ["playerID", "tackles", "shots", "goals", "interceptions"]
}


const tableDeleteInputFields = {
    Stadium: ["Name"],
    Match: ["matchID"],
    GoalDetails: ["goalNumber"],
    PlayIn: ["matchID"],
    Team: ["teamID"],
    Country: ["name"],
    Manager: ["managerID"],
    Funds: ["sponsorID", "teamID"],
    Sponsor: ["sponsorID"],
    Player: ["playerID"],
    Forward: ["playerID"],
    Midfield: ["playerID"],
    Goalkeeper: ["playerID"],
    Defender: ["playerID"]
}

function generateFields(fields, tableFieldsContainer) {
    fields.forEach(function (field) {
        const label = document.createElement("label");
        label.textContent = field;
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = field;
        tableFieldsContainer.appendChild(label);
        tableFieldsContainer.appendChild(inputField);
        const br = document.createElement("br");
        tableFieldsContainer.appendChild(br);
    });
}

async function showInsertFields() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableFieldsHolder = document.getElementById("inputFields")
    tableFieldsHolder.innerHTML = "";
    const allFields = tableInsertInputFields[selectedDropDown];
    generateFields(allFields, tableFieldsHolder);
    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = "Confirm";
    confirmButton.addEventListener("click", confirmInsert);
    tableFieldsHolder.appendChild(confirmButton);
}

async function showDeleteFields() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableFieldsHolder = document.getElementById("inputFields")
    tableFieldsHolder.innerHTML = "";
    const allFields = tableDeleteInputFields[selectedDropDown];
    generateFields(allFields, tableFieldsHolder);
    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = "Confirm";
    confirmButton.addEventListener("click", confirmDelete);
    tableFieldsHolder.appendChild(confirmButton);
}

async function showUpdateFields() {
    console.log('heyooo');
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableFieldsContainer = document.getElementById("inputFields")
    tableFieldsContainer.innerHTML = "";
    const allFields = tableInsertInputFields[selectedDropDown];
    generateFields(allFields, tableFieldsContainer);
    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = "Confirm";
    confirmButton.addEventListener("click", confirmUpdate);
    tableFieldsContainer.appendChild(confirmButton);
}
async function confirmInsert() {
        const insertedData = pullInsertData();

        await performInsertAPI(insertedData);
}
function pullInsertData() {
    const allFields = tableInsertInputFields[document.getElementById("DropDown").value];
    const insertedData = {};
    allFields.forEach(function (field) {
        insertedData[field] = document.querySelector("[name=${field}]");
    });
    return insertedData;
}

function pullUpdateData() {
    const allFields = tableInsertInputFields[document.getElementById("DropDown").value];
    let updateData = {};
    allFields.forEach(function (field) {
        updateData[field] = document.querySelector("[name=${field}]");
    });
    return updateData;
}

function performInsertAPI(insertedData) {
    fetch(`/insert-${dropDown.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertedData),
    })
        .then(response => response.json())
        .then(responseHandle => handleInsertAPIResponse(responseHandle))
        .catch(error => console.error('Error: ', error));
}

function performUpdateAPI(selectedTable, updateData) {
    fetch(`/update-table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {selectedTable: selectedTable,
            args: JSON.stringify(updateData)},
    })
        .then(response => {
            if (response.json().success) {
                console.log("You have successfully updated the data");
            } else {
                console.log("Unfortunately, update is unsuccessful");
            }
        })
        .catch(error => console.error('Error: ', error));
}

function handleInsertAPIResponse(responseHandle) {
    if (responseHandle.success) {
        console.log("You have successfully added the data");
    } else {
        console.log("Unfortunately, insertion is unsuccessful");
    }
}

async function confirmDelete() {
    // stub
}

async function confirmUpdate() {
    const updateData = pullUpdateData();
    const selectedTable = document.getElementById("DropDown").value;

    const response = await fetch(`/update-table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: {selectedTable: selectedTable,
            args: JSON.stringify(updateData)},
    });

    const responseData = await response.json();
    if (responseData.success) {
        console.log("You have successfully updated the data");
    } else {
        console.log("Update was unsuccessful");
    }
}

async function identifySPJ() {

}

