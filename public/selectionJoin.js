document.getElementById("confirm-table").addEventListener("click", developInputSection);

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
            const operator = document.createElement("select");
            const and = document.createElement("option");
            and.value = "AND";
            and.textContent = "AND";
            const or = document.createElement("option");
            or.value = "OR";
            or.textContent = "OR";
            const attLabel = document.createElement("label");
            attLabel.textContent = att;
            operator.appendChild(and);
            operator.appendChild(or);
            div.appendChild(attLabel);
            div.appendChild(inputField);
            div.appendChild(operator);
            filterEnteringSection.appendChild(div);
        });
    });
}

function createSelectionJoinData() {
    const multiselectDropDown = document.getElementById("DropDown");
    const selectedTables = Array.from(multiselectDropDown.selectedOptions).map(option => option.value);
}