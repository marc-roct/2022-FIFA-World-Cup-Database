

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
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


async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};