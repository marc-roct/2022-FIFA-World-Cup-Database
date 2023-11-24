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
    const tableFieldsContainer = document.getElementById("inputFields")
    tableFieldsContainer.innerHTML = "";
    const allFields = tableInsertInputFields[selectedDropDown];
    generateFields(allFields, tableFieldsContainer);
    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = "Confirm";
    confirmButton.addEventListener("click", confirmInsert);
    tableFieldsContainer.appendChild(confirmButton);
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
    // stub
}

async function confirmDelete() {
    // stub
}

async function confirmUpdate() {
        // stub
}

async function identifySPJ() {

}


