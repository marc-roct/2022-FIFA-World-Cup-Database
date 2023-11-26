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
dbTables.set('Stadium1', ['st_address','st_city']);
dbTables.set('Stadium2', ['s_name','address','s_capacity']);
dbTables.set('Match2', ['DATE','phase']);
dbTables.set('Match2', ['matchID','stadiumName','m_result','DATE','m_time']);
dbTables.set('Country', ['c_name','ranking','teamID']);
dbTables.set('Manager', ['','']);
dbTables.set('Team', ['','']);
dbTables.set('Player', ['','']);
dbTables.set('GoalDetails', ['','']);
dbTables.set('PlayIn', ['','']);
dbTables.set('Funds', ['','']);
dbTables.set('Sponsor', ['','']);
dbTables.set('Forward', ['','']);
dbTables.set('Midfield', ['','']);
dbTables.set('Goalkeeper', ['','']);
dbTables.set('Defender', ['','']);


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

export async function initiateCountryTable() {
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

export async function insertCountryTable(name, ranking) {
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

export async function initiateManagerTable() {
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

export async function insertManagerTable(managerID, name, age, nationality) {
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

export async function initiateTeamTable() {
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

export async function insertTeamTable(teamID, size, countryName, managerID) {
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
    oracledb.autoCommit = true;
    return await withOracleDB(async (connection) => {
        let result;
        let pkeys = new Map();
        let akeys = new Map();
        let toSet = [];
        let query = `UPDATE `

        switch (selectedTable) {
            case 'Stadium1':
                query += `Stadium1 SET `;
                let adrID = args.st_address;
                let newCity = args.city;
                if (newCity === "") {
                    oracledb.autoCommit = false;
                    throw new Error("Nothing to update");
                }
                query += `st_city = \'` + newCity +"\'";
                if (adrID === "") {
                    oracledb.autoCommit = false;
                    throw new Error("Missing Primary key");
                }
                query += ` WHERE st_address = \'` + adrID + "\'";
                result = await connection.execute(query);
                break;

            case 'Stadium2':
                query += `Stadium2 SET `;
                if (args.s_name === "") throw new Error("Missing Primary key");

                if (args.address !== "") akeys.set('address', args.address);
                if (args.s_capacity !== "") akeys.set('s_capacity', args.s_capacity);
                if (akeys.size === 0) throw new Error("Nothing to update");

                for (const key of akeys.keys()) {
                    if (typeof akeys.get(key) === "string") {
                        toSet.push(key + ` = \'` + akeys.get(key) + "\'");
                    } else {
                        toSet.push(key + ` = ` + akeys.get(key));
                    }
                }
                query += toSet.join(", ");
                query += ` WHERE st_address = \'` + args.address + "\'";
                result = await connection.execute(query);
                break;
            case 'Match1':
                query += `Match1 SET `;
                if (args.DATE === "") throw new Error("Missing Primary key");
                if (args.phase === "") throw new Error("Nothing to update");

                query += `phase = \'` + args.phase + "\'";
                query += ` WHERE DATE = \'` + args.DATE + "\'";
                result = await connection.execute(query);
                break;
            case 'Match2':
                break;
            case 'Country':
                break;
            case 'Manager':
                break;
            case 'Team':
                break;
            case 'Player':
                break;
            case 'GoalDetails':
                break;
            case 'PlayIn':
                break;
            case 'Funds':
                break;
            case 'Sponsor':
                break;
            case 'Forward':
                break;
            case 'Midfield':
                break;
            case 'Goalkeeper':
                break;
            case 'Defender':
                break;
            default:
                oracledb.autoCommit = false;
                throw Error("Invalid table name: " + selectedTable);
                break;

        }

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

module.exports = {
    testOracleConnection,
    initiateTables,
    selectTable,
    insertDemotable,
    updateNameDemotable: updateTable,
    countDemotable
};