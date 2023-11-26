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
dbTables.set('Stadium2', {p:['s_name'],a:['address','s_capacity']});
dbTables.set('Match2', {p:['DATE'],a:['phase']});
dbTables.set('Match2', {p:['matchID'],a:['stadiumName','m_result','DATE','m_time']});
dbTables.set('Country', {p:['c_name'],a:['ranking','teamID']});
dbTables.set('Manager', {p:['managerID'],a:['mng_name','age','nationality','teamID']});
dbTables.set('Team', {p:['teamID'],a:['SIZE','countryName','managerID']});
dbTables.set('Player', {p:['playerID'],a:['teamID','Passes','assists','p_name','age']});
dbTables.set('GoalDetails', {p:['goalNumber','matchID'],a:['playerID','goal_time','g_type']});
dbTables.set('PlayIn', {p:['matchID','teamID'],a:[]});
dbTables.set('Funds', {p:['sponsorID','teamID'],a:[]});
dbTables.set('Sponsor', {p:['sponsorID'],a:['sp_name']});
dbTables.set('Forward', {p:['playerID'],a:['shots','goals']});
dbTables.set('Midfield', {p:['playerID','tackles'],a:['shots','goals','interceptions']});
dbTables.set('Goalkeeper', {p:['playerID'],a:['saves']});
dbTables.set('Defender', {p:['playerID'],a:['tackles','shots','goals','interceptions']});

const sKeys = ['address','city','s_name','DATE','phase','stadiumName','m_result','DATE','m_time',
                'c_name','mng_name','nationality','countryName','p_name','goal_time','g_type','sp_name'];
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
    return await withOracleDB(async (connection) => {
        // console.log('before execute');
        // const result = await connection.execute(
        //     `SELECT * from Stadium2`
        // );
        let availableColumns = [];

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
        if (projections.size() === 0) {
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
        if (filter !== "") {
            query += ` WHERE ` + filter;
        }
        // console.log(query);
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
        // await connection.rollback(); // Rollback in case of error
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








async function updateTable(selectedTable, args) {
    // oracledb.autoCommit = true;
    return await withOracleDB(async (connection) => {
        let result;
        let toSet = [];
        let where = [];
        let query = `UPDATE ` + selectedTable;

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
        result = await connection.execute(query);
        // switch (selectedTable) {
        //     case 'Stadium1':
        //         query += `Stadium1 SET `;
        //         let adrID = args.address;
        //         let newCity = args.city;
        //         if (newCity === "") {
        //             oracledb.autoCommit = false;
        //             throw new Error("Nothing to update");
        //         }
        //         query += `city = \'` + newCity +"\'";
        //         if (adrID === "") {
        //             oracledb.autoCommit = false;
        //             throw new Error("Missing Primary key");
        //         }
        //         query += ` WHERE address = \'` + adrID + "\'";
        //         result = await connection.execute(query);
        //         break;
        //
        //     case 'Stadium2':
        //         query += `Stadium2 SET `;
        //         if (args.s_name === "") throw new Error("Missing Primary key");
        //
        //         if (args.address !== "") akeys.set('address', args.address);
        //         if (args.s_capacity !== "") akeys.set('s_capacity', Number(args.s_capacity));
        //         if (akeys.size === 0) throw new Error("Nothing to update");
        //
        //         for (const key of akeys.keys()) {
        //             if (typeof akeys.get(key) === "string") {
        //                 toSet.push(key + ` = \'` + akeys.get(key) + "\'");
        //             } else {
        //                 toSet.push(key + ` = ` + akeys.get(key));
        //             }
        //         }
        //         query += toSet.join(", ");
        //         query += ` WHERE address = \'` + args.address + "\'";
        //         result = await connection.execute(query);
        //         break;
        //     case 'Match1':
        //         query += `Match1 SET `;
        //         if (args.DATE === "") throw new Error("Missing Primary key");
        //         if (args.phase === "") throw new Error("Nothing to update");
        //
        //         query += `phase = \'` + args.phase + "\'";
        //         query += ` WHERE DATE = \'` + args.DATE + "\'";
        //         result = await connection.execute(query);
        //         break;
        //     case 'Match2':
        //         query += `Match2 SET `;
        //         if (args.matchID === "") {
        //             throw new Error("Missing Primary key");
        //         } else {
        //             pkeys.set('matchID', Number(args.matchID));
        //         }
        //
        //         if (args.stadiumName !== "") akeys.set('stadiumName', args.stadiumName);
        //         if (args.m_result !== "") akeys.set('m_result', args.m_result);
        //         if (args.DATE !== "") akeys.set('DATE', args.DATE);
        //         if (args.m_time !== "") akeys.set('m_time', args.m_time);
        //         if (akeys.size === 0) throw new Error("Nothing to update");
        //
        //         for (const key of akeys.keys()) {
        //             if (typeof akeys.get(key) === "string") {
        //                 toSet.push(key + ` = \'` + akeys.get(key) + "\'");
        //             } else {
        //                 toSet.push(key + ` = ` + akeys.get(key));
        //             }
        //         }
        //         for (const key of akeys.keys()) {
        //             if (typeof akeys.get(key) === "string") {
        //                 toSet.push(key + ` = \'` + akeys.get(key) + "\'");
        //             } else {
        //                 toSet.push(key + ` = ` + akeys.get(key));
        //             }
        //         }
        //         query += toSet.join(", ");
        //         query += ` WHERE matchID = \'` + args.matchID + "\'";
        //         result = await connection.execute(query);
        //         break;
        //     case 'Country':
        //         break;
        //     case 'Manager':
        //         break;
        //     case 'Team':
        //         break;
        //     case 'Player':
        //         break;
        //     case 'GoalDetails':
        //         break;
        //     case 'PlayIn':
        //         break;
        //     case 'Funds':
        //         break;
        //     case 'Sponsor':
        //         break;
        //     case 'Forward':
        //         break;
        //     case 'Midfield':
        //         break;
        //     case 'Goalkeeper':
        //         break;
        //     case 'Defender':
        //         break;
        //     default:
        //         oracledb.autoCommit = false;
        //         throw Error("Invalid table name: " + selectedTable);
        //         break;
        //
        // }

        oracledb.autoCommit = false;
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
    updateNameDemotable: updateTable,
    countDemotable
};