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
dbTables.set('Stadium2', ['st_address', 'city']);
dbTables.set('Stadium3', ['s_name', 'address', 's_capacity']);
dbTables.set('Match2', ['DATE', 'phase']);
dbTables.set('Match3', ['matchID', 'stadiumName', 'm_result', 'DATE', 'm_time']);
dbTables.set('Country', ['c_name', 'ranking', 'teamID']);
dbTables.set('Manager', ['', '']);
dbTables.set('Team', ['', '']);
dbTables.set('Player', ['', '']);
dbTables.set('GoalDetails', ['', '']);
dbTables.set('PlayIn', ['', '']);
dbTables.set('Funds', ['', '']);
dbTables.set('Sponsor', ['', '']);
dbTables.set('Forward', ['', '']);
dbTables.set('Midfield', ['', '']);
dbTables.set('Goalkeeper', ['', '']);
dbTables.set('Defender', ['', '']);


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
    return await withOracleDB(async (connection) => {
        // console.log('before execute');
        // const result = await connection.execute(
        //     `SELECT * from Stadium2`
        // );
        let tables = '';
        let columns;
        let availableColumns = [];

        // check if table names are valid
        for (const tbl of selectedTables) {
            if (!dbTables.has(tbl)) {
                throw new Error('Invalid Table Name: ' + tbl);
            } else {
                availableColumns = availableColumns.concat(dbTables.get(tbl));
            }
        }

        // check if column names are valid
        for (const colm of projections) {
            if (!availableColumns.includes(colm)) {
                throw new Error('Invalid Column Name: ' + colm);
            }
        }

        const query = `SELECT ` + projections.join(", ")
            + ` FROM ` + selectedTables.join(", ");
        const result = await connection.execute(query);
        // console.log('after execute');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


//
// BELOW HERE ARE ALL THE INITIATE AND INSERT FUNCTIONS
//

export async function initiateStadiumTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE STADIUM2`);
            await connection.execute(`DROP TABLE STADIUM1`);
        } catch (err) {
            console.log('Tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Stadium1
            (
                address VARCHAR(255) PRIMARY KEY,
                city    VARCHAR(255)
            )
        `);

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
    });
}

export async function insertStadiumTable(name, address, city, capacity) {
    return await withOracleDB(async (connection) => {

        const result1 = await connection.execute(
            `INSERT INTO STADIUM1 (address, city)
             VALUES (:address, :city)`,
            {address, city},
            {autoCommit: false}
        );

        const result2 = await connection.execute(
            `INSERT INTO STADIUM2 (name, address, capacity)
             VALUES (:name, :address, :capacity)`,
            {name, address, capacity},
            {autoCommit: true}
        );

        return result1.rowsAffected && result1.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(async (err) => {
        console.error('Error in insertStadiumTables:', err);
        await connection.rollback(); // Rollback in case of error
        return false;
    });
}

export async function initiateMatchTable() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop Match2 first due to its dependency on Match1
            await connection.execute(`DROP TABLE Match2`);
            await connection.execute(`DROP TABLE Match1`);
        } catch (err) {
            console.log('Match tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Match1
            (
                date  VARCHAR(255) PRIMARY KEY,
                phase VARCHAR(255)
            )
        `);

        await connection.execute(`
            CREATE TABLE Match2
            (
                matchID     INTEGER PRIMARY KEY,
                stadiumName VARCHAR(255),
                result      VARCHAR(255),
                date        VARCHAR(255),
                time        VARCHAR(255),
                FOREIGN KEY (stadiumName)
                    REFERENCES Stadium2 (name)
                        ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (date)
                    REFERENCES Match1 (date)
            )
        `);

        return true;
    }).catch((err) => {
        console.error('Error creating Match tables:', err);
        return false;
    });
}

export async function insertMatchTable(matchID, stadiumName, result, matchDate, time, phase) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Match1 first because of the foreign key dependency in Match2
            const result1 = await connection.execute(
                `INSERT INTO Match1 (date, phase)
                 VALUES (:date, :phase)`,
                [matchDate, phase],
                {autoCommit: false}
            );

            const result2 = await connection.execute(
                `INSERT INTO Match2 (matchID, stadiumName, result, date, time)
                 VALUES (:matchID, :stadiumName, :result, :date, :time)`,
                [matchID, stadiumName, result, matchDate, time],
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

export async function initiateCountryTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE COUNTRY`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Country
            (
                name    VARCHAR(255) PRIMARY KEY,
                ranking INTEGER
            )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating Country table:', err);
        return false;
    });
}

export async function insertCountryTable(name, ranking) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TEAM (name, ranking)
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

export async function initiateManagerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE MANAGER`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Manager
            (
                managerID   integer PRIMARY KEY,
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

export async function insertManagerTable(managerID, name, age, nationality) {
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

export async function initiateTeamTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE TEAM`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Team
            (
                teamID      INTEGER PRIMARY KEY,
                Size        INTEGER,
                countryName VARCHAR(100),
                managerID   VARCHAR(100),
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

export async function insertTeamTable(teamID, size, countryName, managerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TEAM (teamID, size, countryName, managerID)
             VALUES (:teamID, :size, :countryName, :managerID)`,
            {teamID, size, countryName, managerID},
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertTeamTable:', err);
        return false;
    });
}

export async function initiatePlayInTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PlayIn`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE PlayIn
            (
                matchID INTEGER,
                teamID  INTEGER,
                PRIMARY KEY (matchID, teamID),
                FOREIGN KEY (matchID)
                    REFERENCES Match2 (matchID)
                        ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID)
                        ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
        return true;
    }).catch((err) => {
        console.error('Error creating PlayIn table:', err);
        return false;
    });
}

export async function insertPlayInTable(matchID, teamID) {
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

export async function initiateSponsorTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Sponsor`);
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

export async function insertSponsorTable(sponsorID, name) {
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

export async function initiateFundsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Funds`);
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

export async function insertFundsTable(sponsorID, teamID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Sponsor (sponsorID, teamID)
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

export async function initiatePlayerTable() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop subclass tables first due to foreign key dependencies
            await connection.execute(`DROP TABLE Forward CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Midfield CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Goalkeeper CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Defender CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Player`);


            await connection.execute(`
                CREATE TABLE Player
                (
                    playerID integer PRIMARY KEY,
                    teamID   INTEGER,
                    Passes   INTEGER,
                    assists  INTEGER,
                    name     VARCHAR(255),
                    age      INTEGER,
                    FOREIGN KEY (teamID)
                        REFERENCES Team (teamID)
                )

            `);

            // Create subclass tables
            await connection.execute(`
                CREATE TABLE Forward
                (
                    playerID INTEGER PRIMARY KEY,
                    shots    INTEGER,
                    goals    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID)
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
                    FOREIGN KEY (playerID) REFERENCES Player (playerID)
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
                    FOREIGN KEY (playerID) REFERENCES Player (playerID)
                )

            `);


            await connection.execute(`
                CREATE TABLE Goalkeeper
                (
                    playerID INTEGER PRIMARY KEY,
                    saves    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID)
                )

            `);


            return true;
        } catch (err) {
            console.error('Error creating Player table:', err);
            return false;
        }
    });
}

export async function insertPlayerTable(playerType, playerData, subclassData) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Player table
            await connection.execute(
                `INSERT INTO Player (playerID, teamID, Passes, assists, name, age) VALUES (:playerID, :teamID, :Passes, :assists, :name, :age)`,
                { playerID: playerData.playerID, teamID: playerData.teamID, Passes: playerData.Passes, assists: playerData.assists, name: playerData.name, age: playerData.age },
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








async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            // `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            // [newName, oldName],
            // { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
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

module.exports = {
    testOracleConnection,
    initiateTables,
    selectTable,
    insertDemotable,
    updateNameDemotable,
    countDemotable
};