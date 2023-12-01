    document.getElementById("groupBy").addEventListener("click", doGroupByAggregation);
    document.getElementById("having").addEventListener("click", doHavingAggregation);


    const groupByTable = {
        attr: ["countryName", "passes"]
    }
    async function doHavingAggregation() {
        const tableElement = document.getElementById("havingTable");
        const tableBody = document.getElementById("havingBody");
        const tableHead = document.getElementById("havingHeadFields");
        tableHead.innerHTML = "";
        const allFields =  groupByTable.attr;
        generateGroupByHeaders(allFields, tableHead);
        const response = await fetch('/having-table', {
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


    async function doGroupByAggregation() {
        const tableElement = document.getElementById("groupByTable");
        const tableBody = document.getElementById("groupByBody");
        const tableHead = document.getElementById("groupByHeadFields");
        tableHead.innerHTML = "";
        const allFields =  groupByTable.attr;
        generateGroupByHeaders(allFields, tableHead);
        const response = await fetch('/group-by-table', {
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

    function generateGroupByHeaders(allFields, tableHead) {
        const tableRow = document.createElement("tr");
        allFields.forEach(function (field) {
            const header = document.createElement("th");
            header.textContent = field;
            tableRow.appendChild(header);
        });
        tableHead.appendChild(tableRow);
    }