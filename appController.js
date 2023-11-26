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
router.get('/select-table', async (req, res) => {
    const {selectedTables, projections, filter} = req.body;
    const tableContent = await appService.selectTable(["Stadium2"], ["st_address","st_city"],
        'st_address = \'Building Number: 125 Street: 393 Zone: 74\'');
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
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

router.post("/insert-teamtable", async (req, res) => {
    const { teamID, size, countryName, managerID } = req.body;
    const insertResult = await appService.insertTeamTable(teamID, size, countryName, managerID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable("Stadium2", {
        st_address: oldName,
        city: newName
    });
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