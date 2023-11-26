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
async function  withOracleDB(action) {
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
        console.log(query);
        const result = await connection.execute(query);
        // console.log('after execute');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateTables() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            // `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            // [id, name],
            // { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function initiateCountryTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE COUNTRY`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Country
            (
                name    VARCHAR PRIMARY KEY,
                ranking INTEGER
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
            `INSERT INTO TEAM (name, ranking) VALUES (:name, :ranking)`,
            {name, ranking},
            { autoCommit: true }
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
            await connection.execute(`DROP TABLE MANAGER`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Manager
            (
                managerID   integer PRIMARY KEY,
                name        VARCHAR,
                age         INTEGER,
                nationality VARCHAR
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
            `INSERT INTO MANAGER (managerID, name, age, nationality) VALUES (:managerID, :name, :age, :nationality)`,
            {managerID, name, age, nationality},
            { autoCommit: true }
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
            await connection.execute(`DROP TABLE TEAM`);
        } catch(err) {
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

async function insertTeamTable(teamID, size, countryName, managerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TEAM (teamID, size, countryName, managerID) VALUES (:teamID, :size, :countryName, :managerID)`,
            {teamID, size, countryName, managerID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error in insertTeamTable:', err);
        return false;
    });
}

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
        console.log(query);
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

async function joinTable() {
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
    countDemotable,
    joinTable,
    initiateCountryTable,
    insertCountryTable,
    initiateManagerTable,
    insertManagerTable,
    initiateTeamTable,
};