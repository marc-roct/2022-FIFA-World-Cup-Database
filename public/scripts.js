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
    Stadium: ["name", "address", "capacity", "city"],
    Match: ["matchID", "stadiumName", "result", "matchDate", "time", "phase"],
    Country: ["name", "ranking"],
    Manager: ["managerID", "name", "age", "nationality"],
    Team: ["teamID", "size", "countryName", "managerID"],
    Sponsor: ["sponsorID", "name"],
    Funds: ["sponsorID", "teamID"],
    Forward: ["playerID", "teamID", "passes", "assists", "name", "age", "shots", "goals"],
    Midfield: ["playerID", "teamID", "passes", "assists", "name", "age", "tackles", "shots", "goals", "interceptions"],
    Defender: ["playerID", "teamID", "passes", "assists", "name", "age", "tackles", "shots", "goals", "interceptions"],
    Goalkeeper: ["playerID", "teamID", "passes", "assists", "name", "age", "saves"],
    GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
    PlayIn: ["matchID", "teamID"]
}

    const tableResetFields = {
        Stadium: ["name", "address", "capacity", "city"],
        Match: ["matchID", "stadiumName", "result", "matchDate", "time", "phase"],
        Country: ["name", "ranking"],
        Manager: ["managerID", "name", "age", "nationality"],
        Team: ["teamID", "size", "countryName", "managerID"],
        Sponsor: ["sponsorID", "name"],
        Funds: ["sponsorID", "teamID"],
        Player: ["playerID", "teamID", "passes", "assists", "name", "age"],
        GoalDetails: ["goalNumber", "matchID", "playerID", "time", "type"],
        PlayIn: ["matchID", "teamID"]
    }


// const tableDeleteInputFields = {
//     Stadium: ["Name"],
//     Match: ["matchID"],
//     GoalDetails: ["goalNumber"],
//     PlayIn: ["matchID"],
//     Team: ["teamID"],
//     Country: ["name"],
//     Manager: ["managerID"],
//     Funds: ["sponsorID", "teamID"],
//     Sponsor: ["sponsorID"],
//     Player: ["playerID"]
// }
    // async function checkDbConnection() {
    //     const statusElem = document.getElementById('dbStatus');
    //     const loadingGifElem = document.getElementById('loadingGif');
    //
    //     const response = await fetch('/check-db-connection', {
    //         method: "GET"
    //     });
    //
    //     // Hide the loading GIF once the response is received.
    //     // loadingGifElem.style.display = 'none';
    //     // Display the statusElem's text in the placeholder.
    //     // statusElem.style.display = 'inline';
    //
    //     response.text()
    //         .then((text) => {
    //             statusElem.textContent = text;
    //         })
    //         .catch((error) => {
    //             statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    //         });
    // }

    // This function resets or initializes the demotable.
    async function resetDemotable() {
        for (const tableName in tableResetFields) {
            console.log(`/initiate-${tableName.toLowerCase() + "table"}`);
            const response = await fetch(`/initiate-${tableName.toLowerCase() + "table"}`, {
                method: 'POST'
            });

            const responseData = await response.json();

            if (responseData.success) {
                const messageElement = document.getElementById('resetResultMsg');
                messageElement.textContent = tableName + "demotable initiated successfully!";
            } else {
                alert("Error initiating the table" + tableName);
            }
        }
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

// async function showDeleteFields() {
//     const selectedDropDown = document.getElementById("DropDown").value;
//     const tableFieldsHolder = document.getElementById("inputFields")
//     tableFieldsHolder.innerHTML = "";
//     const allFields = tableDeleteInputFields[selectedDropDown];
//     generateFields(allFields, tableFieldsHolder);
//     const confirmButton = document.createElement("button");
//     confirmButton.type = "button";
//     confirmButton.textContent = "Confirm";
//     confirmButton.addEventListener("click", confirmDelete);
//     tableFieldsHolder.appendChild(confirmButton);
// }

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
        const insertedData = pullInsertData();
        await performInsertAPI(insertedData);
}
function pullInsertData() {
    const allFields = tableInsertInputFields[document.getElementById("DropDown").value];
    console.log(allFields);
    const insertedData = {};
    allFields.forEach(function (field) {
        insertedData[field] = document.querySelector(`[name=${field}]`).value;
    });
    return insertedData;
}

async function performInsertAPI(insertedData) {
    try {
        const dropDown = document.getElementById("DropDown").value;
        console.log(insertedData);
        const response = await fetch(`/insert-${dropDown.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insertedData),
        })
        const responseData = await response.json();
        handleInsertDeleteAPIResponse(responseData);
    } catch (error) {
        console.error("error: " + error);
    }
}

    async function performUpdateAPI(updateData) {
        try {
            const dropDown = document.getElementById("DropDown").value;
            const response = await fetch(`/update-table`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectedTable: dropDown,
                    args: updateData}),
            });
            // const responseData = await response.json();
            // if (responseData.success) {
            //     console.log("You have successfully updated the data");
            // } else {
            //     console.log("Unfortunately, update is unsuccessful");
            // }
        } catch (error) {
            console.error("error: " + error);
        }
    }

function handleInsertDeleteAPIResponse(responseHandle) {
    if (responseHandle.success) {
        console.log("You have successfully added the data");
    } else {
        console.log("Unfortunately, insertion is unsuccessful");
    }
}

    // function pullDeleteData() {
    //     const field = tableDeleteInputFields[document.getElementById("DropDown").value];
    //     const dataToDelete = {};
    //     dataToDelete[field] = document.querySelector(`[name=${field}]`).value;
    //     return dataToDelete;
    // }

    // async function confirmDelete() {
    //     const dataToDelete = pullDeleteData();
    //     await performDeleteAPI(dataToDelete);
    // }

    // async function performDeleteAPI(dataToDelete) {
    //     try {
    //         const dropDown = document.getElementById("DropDown").value;
    //         const response = await fetch(`/delete-${dropDown.toLowerCase()}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(dataToDelete),
    //         })
    //         const responseJson = response.json();
    //         handleInsertDeleteAPIResponse(responseJson);
    //     } catch (error) {
    //         console.error("error: " + error);
    //     }
    // }

async function confirmUpdate() {
    console.log('beforePullData');
    const updateData = pullInsertData();
    console.log(updateData);

    await performUpdateAPI(updateData);
    console.log('afterPerformUpdatePai');
}

async function identifySPJ() {

}

    window.onload = function() {
        // checkDbConnection();
        const button = document.getElementById("resetDemotable");
        console.log("got here");
        if (button != null) {
            console.log("got here");
            button.addEventListener("click", resetDemotable);
        }
    };

