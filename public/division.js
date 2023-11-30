    document.getElementById("confirm-button").addEventListener("click", performDivision);

    const teamAttTable =     {Team: ["teamID", "teamSize", "countryName", "managerID"]};
    async function performDivision() {
        const tableElement = document.getElementById("divisionTable");
        const tableBody = document.querySelector("tbody");
        const tableHead = document.getElementById("divisionFields");
        tableHead.innerHTML = "";
        const allFields = teamAttTable.Team;
        generateDivisionHeaders(allFields, tableHead);
        const response = await fetch('/divide-demotable', {
           method: 'GET'
        });
        const responseData = await response.json();
        const content = responseData.data;
        content.forEach(rowArray => {
            const row = tableBody.insertRow();
            rowArray.forEach((cellData, index) => {
                const cell = row.insertCell();
                cell.textContent = cellData;
                console.log(`Column: ${allFields[index]}, Value: ${cellData}`); // Debug log
            });
        });

    }

    function generateDivisionHeaders(allFields, tableHead) {
        const tableRow = document.createElement("tr");
        allFields.forEach(function (field) {
            const header = document.createElement("th");
            header.textContent = field;
            tableRow.appendChild(header);
        });
        tableHead.appendChild(tableRow);
    }
