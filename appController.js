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

router.get('/select-table', async (req, res) => {
    const tableContent = await appService.selectTable(["Stadium2"], ["st_address","city"], 'asd');
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
    const { name, address, city, capacity } = req.body;
    const insertResult = await appService.insertStadiumTable(name, address, city, capacity);
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

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
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