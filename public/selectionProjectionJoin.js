    function checkSelected() {
        const dropDown = document.getElementById("DropDown");
        return dropDown.selectedIndex !== -1;
    }

    function showSPJFields() {
        if (checkSelected()) {
            const selectedDropDown = document.getElementById("DropDown");
            if (selectedDropDown.value === "selectionProjection") {
                const selectionInputFieldElement = document.getElementById("selectionInputFields");
                const projectionInputFieldElement = document.getElementById("projectionInputFields");
                const filterInputFieldElement = document.getElementById("filterInputFields");
                selectionInputFieldElement.innerHTML = "";
                projectionInputFieldElement.innerHTML = "";
                filterInputFieldElement.innerHTML = "";
            } else {
                const joinInputFieldElement = document.getElementById("joinInputFields");
                joinInputFieldElement.innerHTML = "";
            }
        } else {
            console.log("dropDown not selected yet");
        }
    }