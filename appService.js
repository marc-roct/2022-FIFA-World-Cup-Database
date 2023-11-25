

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
dbTables.set('Stadium2', ['st_address','city']);
dbTables.set('Stadium3', ['s_name','address','s_capacity']);
dbTables.set('Match2', ['DATE','phase']);
dbTables.set('Match3', ['matchID','stadiumName','m_result','DATE','m_time']);
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

        const query = `SELECT ` + projections.join(", ")
                        + ` FROM ` + selectedTables.join(", ");
        const result = await connection.execute(query);
        // console.log('after execute');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateTables() {
    return await withOracleDB(async (connection) => {
        // try {
        //     await connection.execute(`DROP TABLE Stadium2 cascade constraints ;
        //     DROP TABLE Stadium3 cascade constraints ;
        //     DROP TABLE Match2 cascade constraints ;
        //     DROP TABLE Match3 cascade constraints ;
        //     DROP TABLE Country cascade constraints ;
        //     DROP TABLE Manager cascade constraints ;
        //     DROP TABLE Team cascade constraints ;
        //     DROP TABLE Player cascade constraints ;
        //     DROP TABLE GoalDetails cascade constraints ;
        //     DROP TABLE PlayIn cascade constraints ;
        //     DROP TABLE Funds cascade constraints ;
        //     DROP TABLE Sponsor cascade constraints ;
        //     DROP TABLE Forward cascade constraints ;
        //     DROP TABLE Midfield cascade constraints ;
        //     DROP TABLE Goalkeeper cascade constraints ;
        //     DROP TABLE Defender cascade constraints ;
        //     `);
        // } catch(err) {
        //     console.log('Table might not exist, proceeding to create...');
        // }

//         try {
//             const result = await connection.execute(`
// CREATE TABLE Stadium2 (
//                           st_address varchar(60) PRIMARY KEY,
//                           city varchar(40));
//
// CREATE TABLE Stadium3 (
//                           s_name varchar(40) PRIMARY KEY,
//                           address varchar(60),
//                           s_capacity INTEGER,
//                           FOREIGN KEY (address)
//                               REFERENCES Stadium2(st_address));
//
// CREATE TABLE Match2 (
//                         "DATE" varchar(40) PRIMARY KEY,
//                         phase varchar(40));
//
//
//
// CREATE TABLE Match3(
//                         matchID INTEGER PRIMARY KEY,
//                         stadiumName  varchar(40),
//                         m_result  varchar(40),
//                         "DATE" varchar(40),
//                         m_time  varchar(40),
//                         FOREIGN KEY (stadiumNAME)
//                             REFERENCES Stadium3(s_name)
//                                 ON DELETE CASCADE,
//                         FOREIGN KEY ("DATE")
//                             REFERENCES Match2("DATE"));
//
//
// CREATE TABLE Country(
//                         c_name varchar(40) PRIMARY KEY,
//                         ranking INTEGER,
//                         teamID INTEGER UNIQUE);
//
// CREATE TABLE Manager(
//                         managerID integer PRIMARY KEY,
//                         mng_name varchar(40),
//                         age INTEGER,
//                         nationality  varchar(40),
//                         teamID INTEGER UNIQUE NOT NULL);
//
// CREATE TABLE Team (
//                       teamID INTEGER PRIMARY KEY,
//                       "SIZE" INTEGER,
//                       countryName varchar(40) UNIQUE NOT NULL,
//                       managerID integer UNIQUE NOT NULL);
//
// ALTER TABLE Country
//     ADD CONSTRAINT c_fk FOREIGN KEY (teamID) REFERENCES Team(teamID)
//         ON DELETE SET NULL
//         DEFERRABLE INITIALLY DEFERRED;
//
// ALTER TABLE Manager
//     ADD CONSTRAINT m_fk FOREIGN KEY (teamID) REFERENCES Team(teamID)
//         ON DELETE CASCADE
//         DEFERRABLE INITIALLY DEFERRED;
//
// ALTER TABLE Team
//     ADD CONSTRAINT t_cfk FOREIGN KEY (countryName) REFERENCES Country(c_name)
//         DEFERRABLE INITIALLY DEFERRED
//     ADD CONSTRAINT t_mfk FOREIGN KEY (managerID) REFERENCES Manager(managerID)
//         DEFERRABLE INITIALLY DEFERRED;
//
// CREATE TABLE Player (
//                         playerID integer PRIMARY KEY,
//                         teamID INTEGER NOT NULL,
//                         Passes INTEGER,
//                         assists INTEGER,
//                         p_name  varchar(40),
//                         age INTEGER,
//                         FOREIGN KEY (teamID)
//                             REFERENCES Team(teamID));
//
// -- --Constraint to check whether each row of team exists in player
// -- ALTER TABLE Player
// --     ADD CONSTRAINT p_fk CHECK (
// --         (SELECT teamID
// --         FROM Team
// --         EXCEPT
// --         SELECT teamID
// --         FROM Team)
// --     DEFERRABLE INITIALLY DEFERRED;
//
// CREATE TABLE GoalDetails (
//                              goalNumber INTEGER,
//                              matchID INTEGER,
//                              playerID INTEGER NOT NULL,
//                              goal_time  varchar(40),
//                              g_type varchar(40),
//                              PRIMARY KEY (goalNumber, matchID),
//                              FOREIGN KEY (matchID)
//                                  REFERENCES Match3(matchID)
//                                      ON DELETE CASCADE,
//                              FOREIGN KEY (playerID)
//                                  REFERENCES Player(playerID)
//                                      ON DELETE CASCADE);
//
// CREATE TABLE PlayIn (
//                         matchID INTEGER NOT NULL,
//                         teamID INTEGER NOT NULL,
//                         PRIMARY KEY (matchID, teamID));
//
// ALTER TABLE PlayIn
//     ADD CONSTRAINT pi_mfk FOREIGN KEY (matchID) REFERENCES Match3(matchID)
//         ON DELETE CASCADE
//         DEFERRABLE INITIALLY DEFERRED
//     ADD CONSTRAINT pi_tfk FOREIGN KEY (teamID) REFERENCES Team(teamID)
//         ON DELETE CASCADE
//         DEFERRABLE INITIALLY DEFERRED;
//
// CREATE TABLE Funds(
//                       sponsorID INTEGER,
//                       teamID INTEGER,
//                       PRIMARY KEY (sponsorID, teamID),
//                       FOREIGN KEY (teamID)
//                           REFERENCES Team(teamID));
//
// CREATE TABLE Sponsor(
//                         sponsorID INTEGER PRIMARY KEY,
//                         sp_name  varchar(40));
//
// CREATE TABLE Forward (
//                          playerID INTEGER PRIMARY KEY,
//                          shots INTEGER,
//                          goals INTEGER,
//                      FOREIGN KEY (playerID) REFERENCES Player(playerID)
//                         ON DELETE CASCADE );
//
// CREATE TABLE Midfield (
//                           playerID INTEGER PRIMARY KEY,
//                           tackles INTEGER,
//                           shots INTEGER,
//                           goals INTEGER,
//                           interceptions INTEGER,
//                           FOREIGN KEY (playerID) REFERENCES Player(playerID)
//                               ON DELETE CASCADE );
//
// CREATE TABLE Goalkeeper (
//                             playerID INTEGER PRIMARY KEY,
//                             saves INTEGER,
//                             FOREIGN KEY (playerID) REFERENCES Player(playerID)
//                                 ON DELETE CASCADE );
//
// CREATE TABLE Defender (
//                           playerID INTEGER PRIMARY KEY,
//                           tackles INTEGER,
//                           shots INTEGER,
//                           goals INTEGER,
//                           interceptions INTEGER,
//                           FOREIGN KEY (playerID) REFERENCES Player(playerID)
//                               ON DELETE CASCADE );
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 125 Street: 393 Zone: 74', 'Al Khor');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Al Bayt Stadium', 'Building Number: 125 Street: 393 Zone: 74', 68895);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 660 Street: 235 Zone: 69', 'Lusail');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Lusail Stadium', 'Building Number: 660 Street: 235 Zone: 69', 88966);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 306 Street: 1700 Zone: 51', 'Al Rayyan');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Ahmad bin Ali Stadium', 'Building Number: 306 Street: 1700 Zone: 51', 45032);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 71 Street: 2741 Zone: 52', 'Al Rayyan');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Education City Stadium', 'Building Number: 71 Street: 2741 Zone: 52', 44667);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 51 Street: 725 Zone: 54', 'Al Rayyan');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Khalifa International Stadium', 'Building Number: 51 Street: 725 Zone: 54', 45857);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 521 Street: 260 Zone: 46', 'Doha');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Al Thumama Stadium', 'Building Number: 521 Street: 260 Zone: 46', 44400);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 161 Street: 210 Zone: 29', 'Doha');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Stadium 974', 'Building Number: 161 Street: 210 Zone: 29', 44089);
//
// INSERT
// INTO Stadium2(st_address, city)
// VALUES('Building Number: 1707 Street: 281 Zone: 91', 'Al Wakrah');
//
// INSERT
// INTO Stadium3(s_name, address, s_capacity)
// VALUES('Al Janoub Stadium', 'Building Number: 1707 Street: 281 Zone: 91', 44325);
//
//
// INSERT
// INTO Match2("DATE", phase)
// VALUES('Dec 9 2022', 'Quarter-Finals');
//
// INSERT
// INTO Match2("DATE", phase)
// VALUES('Nov 20 2022', 'Group Stage');
//
// INSERT
// INTO Match2("DATE", phase)
// VALUES('Nov 21 2022', 'Group Stage');
//
// INSERT
// INTO Match2("DATE", phase)
// VALUES('Nov 22 2022', 'Group Stage');
//
// INSERT
// INTO Match2("DATE", phase)
// VALUES('Nov 23 2022', 'Group Stage');
//
//
// INSERT
// INTO Match3(matchID, stadiumName, m_result, "DATE", m_time)
// VALUES(001, 'Al Bayt Stadium', 'Qatar won against Ecuador 2-0', 'Nov 20 2022', '14:00');
//
// INSERT
// INTO Match3(matchID, stadiumName, m_result, "DATE", m_time)
// VALUES(002, 'Khalifa International Stadium', 'England won against Iran 6-2', 'Nov 21 2022', '14:00');
//
// INSERT
// INTO Match3(matchID, stadiumName, m_result, "DATE", m_time)
// VALUES(003, 'Ahmad bin Ali Stadium', 'USA tied Wales 1-1', 'Nov 21 2022', '14:00');
//
// INSERT
// INTO Match3(matchID, stadiumName, m_result, "DATE", m_time)
// VALUES(004, 'Lusail Stadium', 'Saudi Arabia won against Argentina 2-1', 'Nov 22 2022', '14:00');
//
// INSERT
// INTO Match3(matchID, stadiumName, m_result, "DATE", m_time)
// VALUES(005, 'Education City Stadium', 'Croatia tied Brazil 1-1', 'Dec 9 2022', '14:00');
//
//
// INSERT
// INTO  GoalDetails(goalNumber, matchID, playerID)
// VALUES(1, 001, 001);
//
// INSERT
// INTO  GoalDetails(goalNumber, matchID, playerID)
// VALUES(2, 001, 002);
//
// INSERT
// INTO  GoalDetails(goalNumber, matchID, playerID)
// VALUES(3, 001, 003);
//
// INSERT
// INTO  GoalDetails(goalNumber, matchID, playerID)
// VALUES(1, 002, 001);
//
// INSERT
// INTO  GoalDetails(goalNumber, matchID, playerID)
// VALUES(2, 002, 004);
//
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (001, 001);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (002, 002);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (003, 003);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (004, 004);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (005, 005);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (006, 006);
//
// INSERT
// INTO PlayIn (matchID, teamID)
// VALUES (007, 007);
//
//
// INSERT
// INTO Team (teamID, "SIZE", countryName, managerID)
// VALUES (015, 27, 'Germany', 001);
//
// INSERT
// INTO Team (teamID, "SIZE", countryName, managerID)
// VALUES (001, 27, 'Argentina', 002);
//
// INSERT
// INTO Team (teamID, "SIZE", countryName, managerID)
// VALUES (017, 28, 'Uruguay', 003);
//
// INSERT
// INTO Team (teamID, "SIZE", countryName, managerID)
// VALUES (019, 27, 'Japan', 004);
//
// INSERT
// INTO Team (teamID, "SIZE", countryName, managerID)
// VALUES (002, 26, 'France', 005);
//
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Germany', 15,  015);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Argentina', 1,  001);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Uruguay', 17,  017);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Japan', 19,  019);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('France', 2,  002);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Brazil', 3,  003);
//
// INSERT
// INTO Country(c_name, ranking, teamID)
// VALUES ('Croatia', 6,  006);
//
//
// INSERT
// INTO Manager(managerID, mng_name, age, nationality, teamID)
// VALUES(1, 'Hansi Flick', 57, 'German', 1);
//
// INSERT
// INTO Manager(managerID, mng_name, age, nationality, teamID)
// VALUES(2, 'Lionel Sebastián Scaloni', 44, 'Argentina', 2);
//
// INSERT
// INTO Manager(managerID, mng_name, age, nationality, teamID)
// VALUES(3, 'Marcelo Bielsa', 67, 'Argentina', 3);
//
// INSERT
// INTO Manager(managerID, mng_name, age, nationality, teamID)
// VALUES(4, 'Hajime Moriyasu', 54, 'Japan', 4);
//
// INSERT
// INTO Manager(managerID, mng_name, age, nationality, teamID)
// VALUES(5, 'Didier Claude Deschamps', 54, 'Japan', 5);
//
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(001, 001);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(002, 015);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(003, 017);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(004, 002);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(005, 019);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(006, 003);
//
// INSERT
// INTO Funds(sponsorID, teamID)
// VALUES(007, 006);
//
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(001, 'Coca-Cola');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(002, 'Adidas');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(003, 'Byju''s');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(004, 'Budweiser');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(005, 'Wanda');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(006, 'SBI');
//
// INSERT
// INTO Sponsor(sponsorID, sp_name)
// VALUES(007, 'Hisense');
//
//
// INSERT
// INTO Player(playerID, teamID, passes, assists, p_name, age)
// VALUES(001, 001, 54, 2, 'Lionel Messi', 35);
//
// INSERT
// INTO Player(playerID, teamID, passes, assists, p_name, age)
// VALUES(002, 001, 8, 0, 'Paulo Dybala', 30);
//
// INSERT
// INTO Player(playerID, teamID, passes, assists, p_name, age)
// VALUES(003, 003, 54, 5, 'Kylian Mbappe', 24);
//
// INSERT
// INTO Player(playerID, teamID, passes, assists, p_name, age)
// VALUES(004, 001, 20, 2, 'Lisandro Martinez', 26);
//
// INSERT
// INTO Player(playerID, teamID, passes, assists, p_name, age)
// VALUES(007, 002, 54, 2, 'Cristiano Ronaldo', 38);
//
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (001, 20, 3);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (002, 25, 4);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (003, 27, 5);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (004, 30, 2);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (005, 35, 1);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (006, 10, 1);
// --
// -- INSERT
// -- INTO Forward(playerID, shots, goals)
// -- VALUES (007, 21, 2);
// --
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(020, 5, 10, 0, 13);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(021, 6, 11, 0, 14);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(022, 3, 12, 1, 16);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(023, 12, 3, 0, 19);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(024, 20, 0, 0, 3);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(025, 30, 5, 1, 12);
// --
// -- INSERT
// -- INTO Midfield(playerID, tackles, shots, goals, interceptions)
// -- VALUES(026, 8, 15, 2, 7);
// --
// --
// -- INSERT
// -- INTO Goalkeeper(playerID, saves)
// -- VALUES(030, 5);
// --
// -- INSERT
// -- INTO Goalkeeper(playerID, saves)
// -- VALUES(031, 6);
// --
// -- INSERT
// -- INTO Goalkeeper(playerID, saves)
// -- VALUES(032, 3);
// --
// -- INSERT
// -- INTO Goalkeeper(playerID, saves)
// -- VALUES(033, 12);
// --
// -- INSERT
// -- INTO Goalkeeper(playerID, saves)
// -- VALUES(034, 20);
// --
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(040, 15, 10, 0, 13);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(041,16, 11, 0, 14);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(042, 13, 12, 1, 16);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(043, 22, 3, 0, 19);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(044, 30, 0, 0, 3);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(045, 20, 5, 1, 12);
// --
// -- INSERT
// -- INTO Defender(playerID, tackles, shots, goals, interceptions)
// -- VALUES(046, 18, 15, 2, 7)
// `);
//         } catch (err) {
//             console.log(err);
//         }
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