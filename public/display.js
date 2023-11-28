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

async function displayTable() {
    const selectedDropDown = document.getElementById("DropDown").value;
    const tableElement = document.getElementById('displayTable')
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch(`/display-${selectedDropDown.toLowerCase()}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}