const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};




const dbTables = new Map();
dbTables.set('Stadium1', {p:['address'], a:['city']});
dbTables.set('Stadium2', {p:['name'],a:['address','capacity']});
dbTables.set('Match1', {p:['matchDate'],a:['phase']});
dbTables.set('Match2', {p:['matchID'],a:['stadiumName','result','matchDate','time']});
dbTables.set('Country', {p:['name'],a:['ranking']});
dbTables.set('Manager', {p:['managerID'],a:['name','age','nationality']});
dbTables.set('Team', {p:['teamID'],a:['teamSize','countryName','managerID']});
dbTables.set('Player', {p:['playerID'],a:['teamID','passes','assists','name','age']});
dbTables.set('GoalDetails', {p:['goalNumber','matchID'],a:['playerID','time','type']});
dbTables.set('PlayIn', {p:['matchID','teamID'],a:[]});
dbTables.set('Funds', {p:['sponsorID','teamID'],a:[]});
dbTables.set('Sponsor', {p:['sponsorID'],a:['name']});
dbTables.set('Forward', {p:['playerID'],a:['shots','goals']});
dbTables.set('Midfield', {p:['playerID'],a:['tackles','shots','goals','interceptions']});
dbTables.set('Defender', {p:['playerID'],a:['tackles','shots','goals','interceptions']});
dbTables.set('Goalkeeper', {p:['playerID'],a:['saves']});

let tableRelations;
function initializeTableRelations() {
    const tableRelations = new Map();
    tableRelations.set('Stadium1', {
        primaryKey: ['address'],
        foreignKey: {}
    });
    tableRelations.set('Stadium2', {
        primaryKey: ['name'],
        foreignKey: { 'address': 'Stadium1' }
    });

// Match tables
    tableRelations.set('Match1', {
        primaryKey: ['matchDate'],
        foreignKey: {}
    });
    tableRelations.set('Match2', {
        primaryKey: ['matchID'],
        foreignKey: { 'stadiumName': 'Stadium2', 'matchDate': 'Match1' }
    });

// Other tables
    tableRelations.set('Country', {
        primaryKey: ['name'],
        foreignKey: {}
    });
    tableRelations.set('Manager', {
        primaryKey: ['managerID'],
        foreignKey: {}
    });
    tableRelations.set('Team', {
        primaryKey: ['teamID'],
        foreignKey: { 'countryName': 'Country', 'managerID': 'Manager' }
    });
    tableRelations.set('Player', {
        primaryKey: ['playerID'],
        foreignKey: { 'teamID': 'Team' }
    });
    tableRelations.set('GoalDetails', {
        primaryKey: ['goalNumber', 'matchID'],
        foreignKey: { 'matchID': 'Match2', 'playerID': 'Player' }
    });
    tableRelations.set('PlayIn', {
        primaryKey: ['matchID', 'teamID'],
        foreignKey: { 'matchID': 'Match2', 'teamID': 'Team' }
    });
    tableRelations.set('Funds', {
        primaryKey: ['sponsorID', 'teamID'],
        foreignKey: { 'sponsorID': 'Sponsor', 'teamID': 'Team' }
    });
    tableRelations.set('Sponsor', {
        primaryKey: ['sponsorID'],
        foreignKey: {}
    });
    tableRelations.set('Forward', {
        primaryKey: ['playerID'],
        foreignKey: { 'playerID': 'Player' }
    });
    tableRelations.set('Midfield', {
        primaryKey: ['playerID'],
        foreignKey: { 'playerID': 'Player' }
    });
    tableRelations.set('Defender', {
        primaryKey: ['playerID'],
        foreignKey: { 'playerID': 'Player' }
    });
    tableRelations.set('Goalkeeper', {
        primaryKey: ['playerID'],
        foreignKey: { 'playerID': 'Player' }
    });

    return tableRelations;
}

tableRelations = initializeTableRelations();


const sKeys = ['address','city','s_name','DATE','phase','stadiumName','m_result','DATE','m_time',
                'c_name','mng_name','nationality','countryName','p_name','goal_time','g_type','sp_name','name'];
const nKeys = ['s_capacity','matchID','ranking','teamID','managerID','age','SIZE','playerID','passes',
                'assists','goalNumber','sponsorID','shots','goals','tackles','interceptions','saves'];

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function selectTable(selectedTables, projections, filter) {
    let pLen = projections.length;
    return await withOracleDB(async (connection) => {
        let availableColumns = [];
        console.log("appservice's projection is", projections);

        // check if table names are valid
        for (const tbl of selectedTables) {
            if (!dbTables.has(tbl)) {
                throw new Error('Invalid Table Name: ' + tbl);
            } else {
                availableColumns = availableColumns.concat(dbTables.get(tbl).p);
                availableColumns = availableColumns.concat(dbTables.get(tbl).a);
            }
        }

        // check if column names are valid
        if (projections.length === 0) {
            projections.push('*');
        } else {
            for (const colm of projections) {
                if (!availableColumns.includes(colm)) {
                    throw new Error('Invalid Column Name: ' + colm);
                }
            }
        }


        let query = `SELECT ` + projections.join(", ")
                        + ` FROM ` + selectedTables.join(", ");

        if (pLen === 0) {
            query += ` WHERE ` + getFilter(selectedTables, filter);
        }

         console.log('query is: ', query);
        const result = await connection.execute(query);
         console.log('after execute in appService');
        return result.rows;
    }).catch((err) => {
        console.error("There was an error in SPJ: ", err);
    });
}

function getFilter(selectedTables, filterArray) {
    let joinConditions = [];
    let userFilters = '';

    // Create join conditions based on FK-PK relationships
    selectedTables.forEach(table => {
        const tableInfo = tableRelations.get(table);
        if (tableInfo && tableInfo.foreignKey) {
            Object.keys(tableInfo.foreignKey).forEach(fk => {
                const refTable = tableInfo.foreignKey[fk];
                if (selectedTables.includes(refTable)) {
                    joinConditions.push(`${table}.${fk} = ${refTable}.${fk}`);
                }
            });
        }
    });

    // Process user specified filters
    filterArray.forEach((filter, index) => {
        const attribute = filter[0];
        const value = filter[1];
        const logicalOperator = filter[2]; // Can be 'AND' or 'OR', undefined for the last filter

        // Append the condition to the userFilters string
        userFilters += `${attribute} = '${value}'`;

        // Add AND/OR if it's not the last filter
        if (index < filterArray.length - 1 && logicalOperator) {
            userFilters += ` ${logicalOperator} `;
        }
    });

    // Combine join conditions and user filters
    let finalFilter = joinConditions.join(' AND ');
    if (finalFilter.length > 0 && userFilters.length > 0) {
        finalFilter += ' AND ';
    }
    finalFilter += userFilters;

    console.log("the final filter in the WHERE clause is: ", finalFilter);

    return finalFilter;
}


//
// BELOW HERE ARE ALL THE INITIATE AND INSERT FUNCTIONS
//

async function initiateStadiumTable() {
    return await withOracleDB(async (connection) => {
        try {
            console.log('Trying to Drop Stadium 2 and then 1');
            await connection.execute(`DROP TABLE Stadium2 CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Stadium1 CASCADE CONSTRAINTS`);
            console.log('Successfully dropped Both stadium tables!');
        } catch (err) {
            console.log('Stadium Tables might not exist, proceeding to create...');
        }

            await connection.execute(`
                CREATE TABLE Stadium1 (
                    address VARCHAR(255) PRIMARY KEY,
                    city    VARCHAR(255)
                                      )
            `);

            console.log("Finished creating stadium1");

            await connection.execute(`
                CREATE TABLE Stadium2
                (
                    name     VARCHAR(255) PRIMARY KEY,
                    address  VARCHAR(255),
                    capacity INTEGER,
                    FOREIGN KEY (address)
                        REFERENCES Stadium1 (address)
                )
            `);

            console.log("Finished creating stadium2");
            return true;

    }).catch((err) => {
        console.error("error creating Stadium tables", err)
        return false;
    });
}

async function insertStadiumTable(name, address, capacity, city) {
    return await withOracleDB(async (connection) => {

        const checkResult = await connection.execute(
            `SELECT * FROM Stadium1 WHERE address = :address`,
            {address}
        );

        if (checkResult.rows.length === 0) {

            await connection.execute(
                `INSERT INTO STADIUM1 (address, city)
                 VALUES (:address, :city)`,
                {address, city},
                {autoCommit: false}
            );
        }

        const result2 = await connection.execute(
            `INSERT INTO STADIUM2 (name, address, capacity)
             VALUES (:name, :address, :capacity)`,
            {name, address, capacity},
            {autoCommit: true}
        );

        return result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(async (err) => {
        console.error('Error in insertStadiumTables:', err);
        // await connection.rollback(); // Rollback in case of error
        return false;
    });
}

async function initiateMatchTable() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop Match2 first due to its dependency on Match1
            await connection.execute(`DROP TABLE Match2 CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Match1 CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Match tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Match1 (
                matchDate  VARCHAR(255) PRIMARY KEY,
                phase VARCHAR(255)
                                )
        `);

        console.log("Finished creating match1");

        await connection.execute(`
            CREATE TABLE Match2 (
                matchID     INTEGER PRIMARY KEY,
                stadiumName VARCHAR(255),
                result      VARCHAR(255),
                matchDate        VARCHAR(255),
                time        VARCHAR(255),
                FOREIGN KEY (stadiumName)
                    REFERENCES Stadium2 (name)
                        ON DELETE CASCADE,
                FOREIGN KEY (matchDate)
                    REFERENCES Match1 (matchDate)
                                )
        `);

        console.log("Finished creating match2");
        return true;
    }).catch((err) => {
        console.error('Error creating Match tables:', err);
        return false;
    });
}

async function insertMatchTable(matchID, stadiumName, result, matchDate, time, phase) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Match1 first because of the foreign key dependency in Match2
            console.log(matchDate);
            const result1 = await connection.execute(
                `INSERT INTO Match1 (matchDate, phase)
                 VALUES (:matchDate, :phase)`,
                {matchDate, phase},
                {autoCommit: false}
            );

            const result2 = await connection.execute(
                `INSERT INTO Match2 (matchID, stadiumName, result, matchDate, time)
                 VALUES (:matchID, :stadiumName, :result, :matchDate, :time)`,
                {matchID, stadiumName, result, matchDate, time},
                {autoCommit: true}
            );

            return result1.rowsAffected && result1.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
        } catch (err) {
            console.error('Error in insertMatchTables:', err);
            await connection.rollback(); // Rollback in case of error
            return false;
        }
    });
}

async function initiateGoalDetailsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE GoalDetails CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Match tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE GoalDetails (
                goalNumber INTEGER,
                matchID INTEGER,
                playerID INTEGER,
                time VARCHAR(255),
                type VARCHAR(255),
                PRIMARY KEY (goalNumber, matchID),
                FOREIGN KEY (matchID) REFERENCES Match2 (matchID)
                    ON DELETE CASCADE,
                FOREIGN KEY (playerID) REFERENCES Player (playerID)
                    ON DELETE SET NULL
                                     )
        `);

        return true;
    }).catch((err) => {
        console.error('Error creating GoalDetails table:', err);
        return false;
    });
}

async function insertGoalDetailsTable(goalNumber, matchID, playerID, time, type) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Match1 first because of the foreign key dependency in Match2
            const result = await connection.execute(
                `INSERT INTO GoalDetails (goalNumber, matchID, playerID, time, type)
                 VALUES (:goalNumber, :matchID, :playerID, :time, :type)`,
                {goalNumber, matchID, playerID, time, type},
                {autoCommit: true}
            );


            return result.rowsAffected && result.rowsAffected > 0;
        } catch (err) {
            console.error('Error in insertGoalDetailsTable:', err);
            return false;
        }
    });
}

async function initiateCountryTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Country CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Country
            (
                name    VARCHAR(255) PRIMARY KEY,
                ranking INTEGER UNIQUE
            )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating Country table:', err);
        return false;
    });
}

async function insertCountryTable(name, ranking) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Country (name, ranking)
             VALUES (:name, :ranking)`,
            {name, ranking},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertCountryTable:', err);
        return false;
    });
}

async function initiateManagerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Manager CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Manager
            (
                managerID   INTEGER PRIMARY KEY,
                name        VARCHAR(255),
                age         INTEGER,
                nationality VARCHAR(255)
            )

        `);
        return true;
    }).catch((err) => {
        console.error('Error creating Manager table:', err);
        return false;
    });
}

async function insertManagerTable(managerID, name, age, nationality) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO MANAGER (managerID, name, age, nationality)
             VALUES (:managerID, :name, :age, :nationality)`,
            {managerID, name, age, nationality},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertManagerTable:', err);
        return false;
    });
}

async function initiateTeamTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Team CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Team table might not exist, proceeding to create...');
        }

        console.log('trying to create Team table');
        await connection.execute(`
            CREATE TABLE Team (
                teamID INTEGER PRIMARY KEY,
                teamSize INTEGER,
                countryName VARCHAR(255) UNIQUE,
                managerID INTEGER UNIQUE,
                FOREIGN KEY (countryName)
                    REFERENCES Country (name)
                        ON DELETE CASCADE,
                FOREIGN KEY (managerID)
                    REFERENCES Manager (managerID)
                        ON DELETE CASCADE
                              )
        `);
        return true;

    }).catch((err) => {
        console.error('Error creating Team table:', err);
        return false;
    });
}

async function insertTeamTable(teamID, teamSize, countryName, managerID) {
    return await withOracleDB(async (connection) => {

        const checkQuery = `
            SELECT * FROM Team
            WHERE countryName = :countryName
            OR managerID = :managerID`;

        const checkResult = await connection.execute(checkQuery, {countryName, managerID});

        if (checkResult.rows.length > 0) {
            console.error('Error: Country or Manager already associated with another team.');
            return false;
        }

        const result = await connection.execute(
            `INSERT INTO Team (teamID, teamSize, countryName, managerID)
             VALUES (:teamID, :teamSize, :countryName, :managerID)`,
            {teamID, teamSize, countryName, managerID},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertTeamTable:', err);
        return false;
    });
}

async function initiatePlayInTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PlayIn CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE PlayIn (
                matchID INTEGER,
                teamID  INTEGER,
                PRIMARY KEY (matchID, teamID),
                FOREIGN KEY (matchID)
                    REFERENCES Match2 (matchID)
                        ON DELETE CASCADE,
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID)
                        ON DELETE CASCADE
                                )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating PlayIn table:', err);
        return false;
    });
}

async function insertPlayInTable(matchID, teamID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PlayIn (matchID, teamID)
             VALUES (:matchID, :teamID)`,
            {matchID, teamID},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertPlayInTable:', err);
        return false;
    });
}

async function initiateSponsorTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Sponsor CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Sponsor
            (
                sponsorID INTEGER PRIMARY KEY,
                name      VARCHAR(255)
            )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating Sponsor table:', err);
        return false;
    });
}

async function insertSponsorTable(sponsorID, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Sponsor (sponsorID, name)
             VALUES (:sponsorID, :name)`,
            {sponsorID, name},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertSponsorTable:', err);
        return false;
    });
}

async function initiateFundsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Funds CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Funds
            (
                sponsorID INTEGER,
                teamID    INTEGER,
                PRIMARY KEY (sponsorID, teamID),
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID)
            )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating Funds table:', err);
        return false;
    });
}

async function insertFundsTable(sponsorID, teamID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Funds (sponsorID, teamID)
             VALUES (:sponsorID, :teamID)`,
            {sponsorID, teamID},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertSponsorTable:', err);
        return false;
    });
}

async function initiatePlayerTable() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop subclass tables first due to foreign key dependencies
            await connection.execute(`DROP TABLE Forward CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Midfield CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Goalkeeper CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Defender CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Player CASCADE CONSTRAINTS`);

        } catch (err) {
            console.error('Player tables might not exist, proceeding to create');
        }

        await connection.execute(`
            CREATE TABLE Player (
                playerID integer PRIMARY KEY,
                teamID   INTEGER,
                passes   INTEGER,
                assists  INTEGER,
                name     VARCHAR(255),
                age      INTEGER,
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID)
                                )
        `);

        await connection.execute(`
                CREATE TABLE Forward (
                    playerID INTEGER PRIMARY KEY,
                    shots    INTEGER,
                    goals    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE 
                                     )
            `);

        await connection.execute(`
                CREATE TABLE Midfield
                (
                    playerID      INTEGER PRIMARY KEY,
                    tackles       INTEGER,
                    shots         INTEGER,
                    goals         INTEGER,
                    interceptions INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE
                )
            `);

        await connection.execute(`
                CREATE TABLE Defender
                (
                    playerID      INTEGER PRIMARY KEY,
                    tackles       INTEGER,
                    shots         INTEGER,
                    goals         INTEGER,
                    interceptions INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE
                )

            `);

        await connection.execute(`
                CREATE TABLE Goalkeeper
                (
                    playerID INTEGER PRIMARY KEY,
                    saves    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE
                )

            `);

            return true;

    }).catch((err) => {
        console.error('Error creating Player tables:', err);
        return false;
    });
}

async function insertPlayerTable(playerType, playerData, subclassData) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Player table
            await connection.execute(
                `INSERT INTO Player (playerID, teamID, passes, assists, name, age) VALUES (:playerID, :teamID, :passes, :assists, :name, :age)`,
                { playerID: playerData.playerID, teamID: playerData.teamID, passes: playerData.passes, assists: playerData.assists, name: playerData.name, age: playerData.age },
                { autoCommit: false }
            );

            // Insert into appropriate subclass table
            let insertQuery = '';
            switch(playerType) {
                case 'Forward':
                    insertQuery = `INSERT INTO Forward (playerID, shots, goals) VALUES (:playerID, :shots, :goals)`;
                    break;
                case 'Midfield':
                    insertQuery = `INSERT INTO Midfield (playerID, tackles, shots, goals, interceptions) VALUES (:playerID, :tackles,:shots, :goals, :interceptions)`;
                    break;
                case 'Defender':
                    insertQuery = `INSERT INTO Defender (playerID, tackles, shots, goals, interceptions) VALUES (:playerID, :tackles,:shots, :goals, :interceptions)`;
                    break;
                case 'Goalkeeper':
                    insertQuery = `INSERT INTO Goalkeeper (playerID, saves) VALUES (:playerID, :saves)`;
                    break;
                // Add cases for Midfield, Goalkeeper, Defender
            }

            await connection.execute(insertQuery, subclassData, { autoCommit: false });

            await connection.commit(); // Commit transaction
            return true;
        } catch (err) {
            await connection.rollback(); // Rollback in case of error
            console.error('Error in insertPlayerTable:', err);
            return false;
        }
    });
}



// END OF ALL INSERT FUNCTIONS







async function updateTable(selectedTable, args) {
    // oracledb.autoCommit = true;
    return await withOracleDB(async (connection) => {
        let result;
        let toSet = [];
        let where = [];
        let query = "";
        if (selectedTable === 'Stadium') {
            await updateTable('Stadium1', args);
            return await updateTable('Stadium2', args);

        } else if (selectedTable === 'Match') {
            await updateTable('Match1', args);
            return await updateTable('Match2', args);
        }

        query += `UPDATE ` + selectedTable;

        for (const pkey of dbTables.get(selectedTable).p) {
            if (args[pkey] === "") {
                throw new Error('Missing primary key');
            }
            if (sKeys.includes(pkey)) {
                where.push(pkey + ' = \'' + args[pkey] + '\'');
            } else {
                where.push(pkey + ' = ' +  Number(args[pkey]));
            }
        }

        for (const akey of dbTables.get(selectedTable).a) {
            if (args[akey] !== "") {
                if (sKeys.includes(akey)) {
                    toSet.push(akey + ' = \'' + args[akey] + '\'');
                } else {
                    toSet.push(akey + ' = ' + Number(args[akey]));
                }
            }
        }
        if (toSet.length === 0 ) throw new Error('Nothing to update');

        query += ` SET ` + toSet.join(", ");
        query += ` WHERE ` + where.join(", ");
        oracledb.autoCommit = true;
        console.log(query);
        console.log(toSet);
        result = await connection.execute(query);

        oracledb.autoCommit = false;
        console.log(result.rowsAffected);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.log(err);
        oracledb.autoCommit = false;
        return false;
    });
}

async function joinTable(projections, fromTable, joinTable, onStatement) {
    return await withOracleDB(async (connection) => {
        let query = `SELECT ` + projections + ` FROM ` + fromTable +
            ` INNER JOIN ` + joinTable + ` ON ` + onStatement;
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function divideTable() {
    return await withOracleDB(async (connection) => {
        let query = `
            SELECT * FROM Team tx
            WHERE NOT EXISTS (
                SELECT s.sponsorID FROM Sponsor s
                MINUS
                SELECT f.sponsorID FROM Funds f WHERE f.teamID = tx.teamID )
        `;

        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            // 'SELECT Count(*) FROM DEMOTABLE'
        );
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


async function fetchFromDb(tablename) {
    return await withOracleDB(async (connection) => {
        const query = `SELECT * FROM ${tablename}`;
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function deleteFromDb(tableName, primaryKeyValues) {
    console.log("tableName is: ", tableName);
    console.log("primary key(s) is: ", primaryKeyValues);
    console.log("primary key type is:", typeof primaryKeyValues[0]);

    const pkOfTable = dbTables.get(tableName).p;
    console.log("the primary key of this table is: ", pkOfTable);

    let query = `DELETE FROM ${tableName} WHERE `;
    const queryParams = {};

    primaryKeyValues.forEach((pkValue, index) => {
        const pkIndex = `primaryKeyValue${index + 1}`;
        if (!isNaN(pkValue)) {
            queryParams[pkIndex] = parseInt(pkValue);
        } else {
            queryParams[pkIndex] = pkValue;
        }
        query += `${pkOfTable[index]} = :${pkIndex}`;
        if (index < pkOfTable.length - 1) {
            query += ' AND ';
        }
    });

    return await withOracleDB(async (connection) => {

        const result = await connection.execute(query, queryParams, {autoCommit: true});
        console.log("Query executed:", query, "and queryParams: ", queryParams);
        return result.rowsAffected;
    }).catch((err) => {
        console.error("Error occured in appService delete: ", err);
        return false;
    });
}



module.exports = {
    testOracleConnection,
    selectTable,
    initiateCountryTable,
    initiatePlayerTable,
    initiateMatchTable,
    initiateStadiumTable,
    initiatePlayInTable,
    initiateFundsTable,
    initiateSponsorTable,
    initiateManagerTable,
    initiateGoalDetailsTable,
    initiateTeamTable,

    insertPlayerTable,
    insertPlayInTable,
    insertFundsTable,
    insertMatchTable,
    insertSponsorTable,
    insertStadiumTable,
    insertCountryTable,
    insertManagerTable,
    insertTeamTable,
    insertGoalDetailsTable,
    fetchFromDb,
    deleteFromDb,
    divideTable,

    updateTable,
    countDemotable
};