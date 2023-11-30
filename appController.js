const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// selectedTables should be a string list of tables
// projections should be a string list of selected columns from the tables
// filter should be a valid string of the where clause
router.post('/select-table', async (req, res) => {
    const {selectedTables, projections, filter} = req.body;
    // const tableContent = await appService.selectTable(["Stadium2"], ["st_address","st_city"],
    //     'st_address = \'Building Number: 125 Street: 393 Zone: 74\'');
    const tableContent = await appService.selectTable(selectedTables, projections, filter);
    res.json({data: tableContent});
});


// Maybe turn object into array
router.get('/projection', async (req, res) => {
    const {selectedTable, projections} = req.body;
    // const tableContent = await appService.selectTable(["Stadium2"], ["st_address","st_city"],
    //     'st_address = \'Building Number: 125 Street: 393 Zone: 74\'');
    const tableContent = await appService.selectTable(selectedTable, projections, '');
    res.json({data: tableContent});
});


router.post("/initiate-stadiumtable", async (req, res) => {
    const initiateResult = await appService.initiateStadiumTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-stadium", async (req, res) => {
    const { name, address, capacity, city } = req.body;
    const insertResult = await appService.insertStadiumTable(name, address, capacity, city);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-matchtable", async (req, res) => {
    const initiateResult = await appService.initiateMatchTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-match", async (req, res) => {
    const { matchID, stadiumName, result, matchDate, time, phase } = req.body;
    const insertResult = await appService.insertMatchTable(matchID, stadiumName, result, matchDate, time, phase);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-goaldetailstable", async (req, res) => {
    const initiateResult = await appService.initiateGoalDetailsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-goaldetails", async (req, res) => {
    const { goalNumber, matchID, playerID, time, type } = req.body;
    const insertResult = await appService.insertGoalDetailsTable(goalNumber, matchID, playerID, time, type);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/initiate-countrytable", async (req, res) => {
    const initiateResult = await appService.initiateCountryTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-country", async (req, res) => {
    const { name, ranking } = req.body;
    const insertResult = await appService.insertCountryTable(name, ranking);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-managertable", async (req, res) => {
    const initiateResult = await appService.initiateManagerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-manager", async (req, res) => {
    const { managerID, name, age, nationality } = req.body;
    const insertResult = await appService.insertManagerTable(managerID, name, age, nationality);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-teamtable", async (req, res) => {
    const initiateResult = await appService.initiateTeamTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-team", async (req, res) => {
    const { teamID, size, countryName, managerID } = req.body;
    const insertResult = await appService.insertTeamTable(teamID, size, countryName, managerID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-playintable", async (req, res) => {
    const initiateResult = await appService.initiatePlayInTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-playin", async (req, res) => {
    const { matchID, teamID } = req.body;
    const insertResult = await appService.insertPlayInTable(matchID, teamID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-sponsortable", async (req, res) => {
    const initiateResult = await appService.initiateSponsorTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-sponsor", async (req, res) => {
    const { sponsorID, name } = req.body;
    const insertResult = await appService.insertSponsorTable(sponsorID, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-fundstable", async (req, res) => {
    const initiateResult = await appService.initiateFundsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-funds", async (req, res) => {
    const { sponsorID, teamID } = req.body;
    const insertResult = await appService.insertFundsTable(sponsorID, teamID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-playertable", async (req, res) => {
    const initiateResult = await appService.initiatePlayerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-forward", async (req, res) => {
    const { playerID, teamID, passes, assists, name, age, shots, goals } = req.body;

    let playerData = {
        playerID: playerID,
        teamID: teamID,
        passes: passes,
        assists: assists,
        name: name,
        age: age
    };

    let subclassData = {
        playerID: playerID,
        shots: shots,
        goals: goals
    };

    const insertResult = await appService.insertPlayerTable("Forward", playerData, subclassData);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-midfield", async (req, res) => {
    const { playerID, teamID, passes, assists, name, age, tackles, shots, goals, interceptions } = req.body;

    let playerData = {
        playerID: playerID,
        teamID: teamID,
        passes: passes,
        assists: assists,
        name: name,
        age: age
    };

    let subclassData = {
        playerID: playerID,
        tackles: tackles,
        shots: shots,
        goals: goals,
        interceptions: interceptions
    };

    const insertResult = await appService.insertPlayerTable("Midfield", playerData, subclassData);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-defender", async (req, res) => {
    const { playerID, teamID, passes, assists, name, age, tackles, shots, goals, interceptions } = req.body;

    let playerData = {
        playerID: playerID,
        teamID: teamID,
        passes: passes,
        assists: assists,
        name: name,
        age: age
    };

    let subclassData = {
        playerID: playerID,
        tackles: tackles,
        shots: shots,
        goals: goals,
        interceptions: interceptions
    };

    const insertResult = await appService.insertPlayerTable("Defender", playerData, subclassData);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-goalkeeper", async (req, res) => {
    const { playerID, teamID, passes, assists, name, age, saves } = req.body;

    let playerData = {
        playerID: playerID,
        teamID: teamID,
        passes: passes,
        assists: assists,
        name: name,
        age: age
    };

    let subclassData = {
        saves: saves
    };

    const insertResult = await appService.insertPlayerTable("Goalkeeper", playerData, subclassData);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/display/:tableName', async (req, res) => {
    const tableName = req.params.tableName;
    try {
        const tableContent = await appService.fetchFromDb(tableName);
        res.json({ data: tableContent });
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        res.status(500).json({ message: `Error fetching data from ${tableName}` });
    }
});

// primaryKeyValuesArray should be an array of PK values
// eg. Team might be [001]
// eg. Funds might be [001, 003], since it has composite PK
router.delete('/delete/:tableName', async (req, res) => {
    try {
        const tableName = req.params.tableName;
        const primaryKeyValues = req.body;
        const primaryKeyValuesArray = primaryKeyValues.toDelete;
        const deleteResult = await appService.deleteFromDb(tableName, primaryKeyValuesArray);
        if (deleteResult > 0) {
            res.json({ success: true, message: 'Record deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'No record found to delete.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/update-table", async (req, res) => {
    console.log('helllo app controller');
    const { selectedTable, args } = req.body;
    console.log(args);
    const updateResult = await appService.updateTable(selectedTable, args);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

module.exports = router;