document.getElementById("confirm-button").addEventListener("click", doDelete);
document.getElementById("DropDown").addEventListener("change", showPrimaryKeyInputField);

const tableDeletePKFields = {
    Stadium1: ["address"],
    Stadium2: ["name"],
    Match1: ["matchDate"],
    Match2: ["matchID"],
    GoalDetails: ["goalNumber", "matchID"],
    PlayIn: ["matchID", "teamID"],
    Team: ["teamID"],
    Country: ["name"],
    Manager: ["managerID"],
    Funds: ["sponsorID", "teamID"],
    Sponsor: ["sponsorID"],
    Player: ["playerID"]
}
async function showPrimaryKeyInputField() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const inputFieldElement = document.getElementById("inputFields");
    inputFieldElement.innerHTML = "";
    const fields = tableDeletePKFields[selectedDropDown];
    generateDeleteFields(fields, inputFieldElement);
}

async function doDelete() {
    const deletePrimaryKey = getDeleteData();
    console.log(deletePrimaryKey);
    await performDeleteFromAPI(deletePrimaryKey);
}

async function performDeleteFromAPI(deletePrimaryKey) {
    try {
        const dropDown = document.getElementById("DropDown").value;
        console.log(`/delete/${dropDown}`);
        console.log(JSON.stringify(deletePrimaryKey));
        const response = await fetch(`/delete/${dropDown}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletePrimaryKey),
        });
        const responseData = await response.json();
        handleDeleteAPIResponse(responseData);
    } catch (error) {
        console.error('Error: ', error)
    }
}

function handleDeleteAPIResponse(responseData) {
    if (responseData.success) {
        const messageElement = document.getElementById("deleteResultMsg");
        messageElement.textContent = "You have successfully deleted the data!";
        console.log("You have successfully deleted the data");
    } else {
        alert("Error deleting the data");
        console.log("Unfortunately, deletion is unsuccessful");
    }
}

function generateDeleteFields(fields, inputFieldElement) {
    fields.forEach(function (field) {
        const label = document.createElement("label");
        label.textContent = field;
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = field;
        inputFieldElement.appendChild(label);
        inputFieldElement.appendChild(inputField);
        const br = document.createElement("br");
        inputFieldElement.appendChild(br);
    });
}

function getDeleteData() {
    const fields = tableDeletePKFields[document.getElementById("DropDown").value];
    console.log(fields);
    const deleteBody = [];
    fields.forEach(function (field) {
        deleteBody.push(document.querySelector(`[name=${field}]`).value);
        console.log(document.querySelector(`[name=${field}]`).value);
    });
    console.log(deleteBody);
    return {
        toDelete: deleteBody,
    };
}