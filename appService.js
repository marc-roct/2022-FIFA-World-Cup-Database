

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


//
// BELOW HERE ARE ALL THE INITIATE AND INSERT FUNCTIONS
//

export async function initiateStadiumTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE STADIUM2`);
            await connection.execute(`DROP TABLE STADIUM1`);
        } catch(err) {
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

        return true;
    }).catch((err) => {
        console.error('Error creating Stadium tables:', err);
        return false;
    });
}

export async function insertStadiumTable(name, address, city, capacity) {
    return await withOracleDB(async (connection) => {
        const result1 = await connection.execute(
            `INSERT INTO STADIUM1 (address, city) VALUES (:address, :city)`,
            {address, city},
            { autoCommit: false }
        );

        const result2 = await connection.execute(
            `INSERT INTO STADIUM2 (name, address, capacity) VALUES (:name, :address, :capacity)`,
            {name, address, capacity},
            { autoCommit: true }
        );

        return result1.rowsAffected && result1.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
    }).catch((err) => {
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
        } catch(err) {
            console.log('Match tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE Match1 (
                date VARCHAR(255) PRIMARY KEY,
                phase VARCHAR(255)
            )
        `);

        await connection.execute(`
            CREATE TABLE Match2 (
                matchID INTEGER PRIMARY KEY, 
                stadiumName VARCHAR(255), 
                result VARCHAR(255), 
                date VARCHAR(255), 
                time VARCHAR(255), 
                FOREIGN KEY (stadiumName)
                    REFERENCES Stadium2(name)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                FOREIGN KEY (date)
                    REFERENCES Match1(date)
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
                `INSERT INTO Match1 (date, phase) VALUES (:date, :phase)`,
                [matchDate, phase],
                { autoCommit: false }
            );

            const result2 = await connection.execute(
                `INSERT INTO Match2 (matchID, stadiumName, result, date, time) VALUES (:matchID, :stadiumName, :result, :date, :time)`,
                [matchID, stadiumName, result, matchDate, time],
                { autoCommit: true }
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


// END OF ALL INSERT FUNCTIONS

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