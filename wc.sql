DROP TABLE Stadium1 cascade constraints ;
DROP TABLE Stadium2 cascade constraints ;
DROP TABLE Match1 cascade constraints ;
DROP TABLE Match2 cascade constraints ;
DROP TABLE Country cascade constraints ;
DROP TABLE Manager cascade constraints ;
DROP TABLE Team cascade constraints ;
DROP TABLE Player cascade constraints ;
DROP TABLE GoalDetails cascade constraints ;
DROP TABLE PlayIn cascade constraints ;
DROP TABLE Funds cascade constraints ;
DROP TABLE Sponsor cascade constraints ;
DROP TABLE Forward cascade constraints ;
DROP TABLE Midfield cascade constraints ;
DROP TABLE Goalkeeper cascade constraints ;
DROP TABLE Defender cascade constraints ;


CREATE TABLE Stadium1 (
                    address VARCHAR(255) PRIMARY KEY,
                    city    VARCHAR(255)
                                      );

CREATE TABLE Stadium2 (
                    name     VARCHAR(255) PRIMARY KEY,
                    address  VARCHAR(255),
                    capacity INTEGER,
                    FOREIGN KEY (address)
                        REFERENCES Stadium1 (address));

CREATE TABLE Match1 (
                    matchDate  VARCHAR(255) PRIMARY KEY,
                    phase VARCHAR(255));



CREATE TABLE Match2(
                    matchID     INTEGER PRIMARY KEY,
                    stadiumName VARCHAR(255),
                    result      VARCHAR(255),
                    matchDate        VARCHAR(255),
                    time        VARCHAR(255),
                    FOREIGN KEY (stadiumName)
                        REFERENCES Stadium2 (name)
                            ON DELETE CASCADE,
                    FOREIGN KEY (matchDate)
                        REFERENCES Match1 (matchDate));


CREATE TABLE Country(
                name    VARCHAR(255) PRIMARY KEY,
                ranking INTEGER UNIQUE);

CREATE TABLE Manager(
                managerID   INTEGER PRIMARY KEY,
                name        VARCHAR(255),
                age         INTEGER,
                nationality VARCHAR(255));

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
                              );


CREATE TABLE Player (
                playerID integer PRIMARY KEY,
                teamID   INTEGER,
                passes   INTEGER,
                assists  INTEGER,
                name     VARCHAR(255),
                age      INTEGER,
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID));


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
                    ON DELETE SET NULL);

CREATE TABLE PlayIn (
                matchID INTEGER,
                teamID  INTEGER,
                PRIMARY KEY (matchID, teamID),
                FOREIGN KEY (matchID)
                    REFERENCES Match2 (matchID)
                        ON DELETE CASCADE,
                FOREIGN KEY (teamID)
                    REFERENCES Team (teamID)
                        ON DELETE CASCADE);



CREATE TABLE Funds(
                      sponsorID INTEGER,
                      teamID INTEGER,
                      PRIMARY KEY (sponsorID, teamID),
                      FOREIGN KEY (teamID)
                          REFERENCES Team(teamID));

CREATE TABLE Sponsor(
                        sponsorID INTEGER PRIMARY KEY,
                        sp_name  varchar(40));

CREATE TABLE Forward (
                    playerID INTEGER PRIMARY KEY,
                    shots    INTEGER,
                    goals    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE );

CREATE TABLE Midfield (
                    playerID      INTEGER PRIMARY KEY,
                    tackles       INTEGER,
                    shots         INTEGER,
                    goals         INTEGER,
                    interceptions INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE);

CREATE TABLE Goalkeeper (
                    playerID INTEGER PRIMARY KEY,
                    saves    INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE);

CREATE TABLE Defender (
                    playerID      INTEGER PRIMARY KEY,
                    tackles       INTEGER,
                    shots         INTEGER,
                    goals         INTEGER,
                    interceptions INTEGER,
                    FOREIGN KEY (playerID) REFERENCES Player (playerID) ON DELETE CASCADE);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 125 Street: 393 Zone: 74', 'Al Khor');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Al Bayt Stadium', 'Building Number: 125 Street: 393 Zone: 74', 68895);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 660 Street: 235 Zone: 69', 'Lusail');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Lusail Stadium', 'Building Number: 660 Street: 235 Zone: 69', 88966);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 306 Street: 1700 Zone: 51', 'Al Rayyan');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Ahmad bin Ali Stadium', 'Building Number: 306 Street: 1700 Zone: 51', 45032);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 71 Street: 2741 Zone: 52', 'Al Rayyan');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Education City Stadium', 'Building Number: 71 Street: 2741 Zone: 52', 44667);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 51 Street: 725 Zone: 54', 'Al Rayyan');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Khalifa International Stadium', 'Building Number: 51 Street: 725 Zone: 54', 45857);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 521 Street: 260 Zone: 46', 'Doha');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Al Thumama Stadium', 'Building Number: 521 Street: 260 Zone: 46', 44400);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 161 Street: 210 Zone: 29', 'Doha');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Stadium 974', 'Building Number: 161 Street: 210 Zone: 29', 44089);

INSERT
INTO Stadium1(address, city)
VALUES('Building Number: 1707 Street: 281 Zone: 91', 'Al Wakrah');

INSERT
INTO Stadium2(name, address, capacity)
VALUES('Al Janoub Stadium', 'Building Number: 1707 Street: 281 Zone: 91', 44325);


INSERT
INTO Match1(matchDate, phase)
VALUES('Dec 9 2022', 'Quarter-Finals');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 20 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 21 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 22 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 24 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 25 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Nov 26 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Dec 8 2022', 'Quarter-Finals');

INSERT
INTO Match1(matchDate, phase)
VALUES('Dec 7 2022', 'Quarter-Finals');

INSERT
INTO Match1(matchDate, phase)
VALUES('Dec 4 2022', 'Group Stage');

INSERT
INTO Match1(matchDate, phase)
VALUES('Dec 3 2022', 'Group Stage');


INSERT
INTO Country(name, ranking)
VALUES ('Germany', 15);

INSERT
INTO Country(name, ranking)
VALUES ('Argentina', 1);

INSERT
INTO Country(name, ranking)
VALUES ('Uruguay', 17);

INSERT
INTO Country(name, ranking)
VALUES ('Japan', 19);

INSERT
INTO Country(name, ranking)
VALUES ('France', 2);


INSERT
INTO Manager(managerID, name, age, nationality)
VALUES(1, 'Hansi Flick', 57, 'German');

INSERT
INTO Manager(managerID, name, age, nationality)
VALUES(2, 'Lionel SebastiAn Scaloni', 44, 'Argentina');

INSERT
INTO Manager(managerID, name, age, nationality)
VALUES(3, 'Marcelo Bielsa', 67, 'Argentina');

INSERT
INTO Manager(managerID, name, age, nationality)
VALUES(4, 'Hajime Moriyasu', 54, 'Japan');

INSERT
INTO Manager(managerID, name, age, nationality)
VALUES(5, 'Didier Claude Deschamps', 54, 'Japan');


INSERT
INTO Team (teamID, teamSize, countryName, managerID)
VALUES (015, 27, 'Germany', 001);

INSERT
INTO Team (teamID, teamSize, countryName, managerID)
VALUES (001, 27, 'Argentina', 002);

INSERT
INTO Team (teamID, teamSize, countryName, managerID)
VALUES (017, 28, 'Uruguay', 003);

INSERT
INTO Team (teamID, teamSize, countryName, managerID)
VALUES (019, 27, 'Japan', 004);

INSERT
INTO Team (teamID, teamSize, countryName, managerID)
VALUES (002, 26, 'France', 005);


INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(001, 'Al Bayt Stadium', 'France against Uruguay', 'Nov 20 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (001, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (001, 017);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(002, 'Khalifa International Stadium', 'F v U', 'Nov 21 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (002, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (002, 017);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(003, 'Ahmad bin Ali Stadium', 'F v A', 'Nov 21 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (003, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (003, 001);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(004, 'Lusail Stadium', 'A v U', 'Nov 22 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (004, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (004, 017);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(005, 'Education City Stadium', 'A v J', 'Dec 9 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (005, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (005, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(006, 'Lusail Stadium', 'A v G', 'Nov 24 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (006, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (006, 015);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(007, 'Al Bayt Stadium', 'A v J', 'Dec 8 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (007, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (007, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(008, 'Lusail Stadium', 'J v G', 'Nov 24 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (008, 019);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (008, 015);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(009, 'Khalifa International Stadium', 'G v F', 'Dec 7 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (009, 015);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (009, 002);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(010, 'Lusail Stadium', 'G v J', 'Nov 25 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (010, 015);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (010, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(011, 'Al Bayt Stadium', 'F v J', 'Dec 4 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (011, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (011, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(012, 'Khalifa International Stadium', 'G v A', 'Nov 26 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (012, 015);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (012, 001);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(013, 'Education City Stadium', 'J v U', 'Dec 4 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (013, 019);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (013, 017);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(014, 'Al Bayt Stadium', 'U v J', 'Nov 26 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (014, 017);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (014, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(015, 'Khalifa International Stadium', 'U v F', 'Dec 3 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (015, 017);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (015, 002);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(016, 'Education City Stadium', 'F v J', 'Dec 7 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (016, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (016, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(017, 'Lusail Stadium', 'F v A', 'Nov 25 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (017, 002);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (017, 001);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(018, 'Education City Stadium', 'J v G', 'Dec 4 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (018, 019);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (018, 015);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(019, 'Lusail Stadium', 'A v G', 'Nov 26 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (019, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (019, 015);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(020, 'Khalifa International Stadium', 'G v J', 'Dec 4 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (020, 015);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (020, 019);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(021, 'Al Bayt Stadium', 'U v F', 'Nov 26 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (021, 017);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (021, 002);

INSERT
INTO Match2(matchID, stadiumName, result, matchDate, time)
VALUES(022, 'Al Bayt Stadium', 'A v U', 'Dec 3 2022', '14:00');

INSERT
INTO PlayIn (matchID, teamID)
VALUES (022, 001);

INSERT
INTO PlayIn (matchID, teamID)
VALUES (022, 017);



INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(001, 'Coca-Cola');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(002, 'Adidas');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(003, 'Byju''s');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(004, 'Budweiser');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(005, 'Wanda');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(006, 'SBI');

INSERT
INTO Sponsor(sponsorID, sp_name)
VALUES(007, 'Hisense');


INSERT
INTO Funds(sponsorID, teamID)
VALUES(001, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(002, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(003, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(004, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(005, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(006, 001);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(007, 001);

INSERT
INTO Funds(sponsorID, teamID)
VALUES(001, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(002, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(003, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(004, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(005, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(006, 015);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(007, 015);

INSERT
INTO Funds(sponsorID, teamID)
VALUES(001, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(002, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(003, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(004, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(005, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(006, 017);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(007, 017);

INSERT
INTO Funds(sponsorID, teamID)
VALUES(004, 002);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(005, 002);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(001, 002);

INSERT
INTO Funds(sponsorID, teamID)
VALUES(005, 019);
INSERT
INTO Funds(sponsorID, teamID)
VALUES(002, 019);




INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(001, 015, 83, 0, 'Antonio Rudiger', 30);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(002, 015, 83, 1, 'David Raum', 25);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(003, 015, 83, 0, 'Matthias Ginter', 29);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(004, 015, 83, 0, 'Thilo Kehrer', 27);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(005, 015, 83, 0, 'Niklas Sule', 28);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(006, 015, 83, 0, 'Lukas Klostermann', 27);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(007, 015, 83, 0, 'Christian Gunter', 30);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(008, 015, 83, 0, 'Nico Schlotterbeck', 24);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(009, 015, 83, 0, 'Armel Bella-Kotchap', 21);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(010, 015, 83, 1, 'Joshua Kimmich', 28);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(011, 015, 83, 0, 'Kai Havertz', 24);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(012, 015, 83, 0, 'Leon Goretzka', 28);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(013, 015, 83, 0, 'Mario Götze', 31);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(014, 015, 83, 0, 'Julian Brandt', 27);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(015, 015, 83, 0, 'Jonas Hofmann', 26);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(016, 015, 83, 0, 'Ilkay Gundogan', 33);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(017, 015, 83, 1, 'Niclas Fullkrug', 30);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(018, 015, 83, 2, 'Serge Gnabry', 28);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(019, 015, 83, 0, 'Thomas Muller', 34);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(020, 015, 83, 1, 'Jamal Musiala', 20);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(021, 015, 83, 1, 'Leroy Sane', 27);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(022, 015, 83, 0, 'Karim Adeyemi', 21);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(023, 015, 83, 0, 'Youssoufa Moukoko', 29);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(024, 015, 83, 0, 'Manuel Neuer', 37);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(025, 015, 83, 0, 'Kevin Trapp', 33);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(026, 015, 83, 0, 'Marc-Andre ter Stegen', 31);



INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(001, 12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(002,  12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(003, 12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(004, 12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(005,  12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(006,  12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(007,  12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(008,  12, 3, 0, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(009,  12, 3, 0, 10);


INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(010, 12, 3, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(011, 12, 3, 2, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(012, 12, 3, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(013, 12, 3, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(014, 12, 3, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(015, 12, 3, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(016, 12, 3, 1, 10);


INSERT
INTO Forward(playerID, shots, goals)
VALUES(017, 4, 2);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(018, 4, 1);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(019, 4, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(020,  4, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(021,  4, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(022,  4, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(023,  4, 0);


INSERT
INTO Goalkeeper(playerID, saves)
VALUES(024, 8);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(025, 0);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(026, 0);


INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(027, 001, 54, 1, 'Lionel Messi', 35);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(028, 001, 54, 0, 'Julian Alvarez', 23);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(029, 001, 54, 1, 'Enzo Fernandez', 22);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(030, 001, 54, 0, 'Alexis Mac Allister', 24);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(031, 001, 54, 1, 'Nahuel Molina', 25);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(032, 001, 54, 1, 'Angel Di María', 35);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(033, 001, 54, 0, 'Emiliano Martínez', 31);


INSERT
INTO Forward(playerID, shots, goals)
VALUES(027, 12, 2);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(028, 4, 1);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(029, 12, 3, 1, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(030, 12, 2, 1, 10);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(031, 12, 2, 0, 10);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(032, 12, 2, 0, 10);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(033, 1);


INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(034, 017, 54, 3, 'DARWIN NUNEZ', 24);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(035, 017, 54, 2, 'NICOLAS DE LA CRUZ', 29);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(036, 017, 54, 0, 'AGUSTIN CANOBBIO', 33);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(037, 017, 54, 0, 'FEDERICO VALVERDE', 31);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(038, 017, 54, 0, 'MATHIAS OLIVERA', 24);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(039, 017, 54, 1, 'RONALD ARAUJO', 29);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(040, 017, 54, 1, 'MAXIMILIANO ARAUJO', 34);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(041, 017, 54, 0, 'SERGIO ROCHET', 31);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(034, 8, 5);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(035, 17, 5, 3, 12);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(036, 17, 5, 1, 12);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(037, 17, 5, 1, 12);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(038, 17, 5, 1, 12);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(039, 17, 5, 1, 12);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(040, 17, 5, 0, 12);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(041, 0);


INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(042, 019, 20, 0, 'Ritsu Doan', 25);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(043, 019, 20, 0, 'Takuma Asano', 29);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(044, 019, 20, 0, 'Ao Tanaka', 25);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(045, 019, 20, 1, 'Junya Ito', 30);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(046, 019, 20, 1, 'Ko Itakura', 26);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(047, 019, 20, 1, 'Kaoru Mitoma', 26);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(048, 019, 20, 0, 'Shuichi Gonda', 34);


INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(042, 019, 2, 2, 12);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(043, 3,1);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(044, 019, 2, 0, 12);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(045, 2,0);

INSERT
INTO Defender(playerID, tackles, shots, goals, interceptions)
VALUES(046, 019, 2, 0, 12);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(047, 019, 2, 0, 12);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(048, 3);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(049, 002, 54, 0, 'Kylian Mbappe', 38);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(050, 002, 54, 0, 'ADRIEN RABIOT', 28);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(051, 002, 54, 0, 'KARIM BENZEMA', 38);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(052, 002, 54, 1, 'OLIVIER GIROUD', 39);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(053, 002, 54, 1, 'ANTOINE GRIEZMANN', 27);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(054, 002, 54, 2, 'CHRISTOPHER NKUNKU', 25);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(055, 002, 54, 1, 'WISSAM BEN YEDDER', 26);

INSERT
INTO Player(playerID, teamID, passes, assists,name, age)
VALUES(056, 002, 54, 0, 'MIKE MAIGNAN', 27);


INSERT
INTO Forward(playerID, shots, goals)
VALUES(049, 5, 2);

INSERT
INTO Midfield(playerID, tackles, shots, goals, interceptions)
VALUES(050, 10, 5, 1, 18);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(051, 3, 1);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(052, 3, 1);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(053, 2, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(054, 1, 0);

INSERT
INTO Forward(playerID, shots, goals)
VALUES(055, 4, 0);

INSERT
INTO Goalkeeper(playerID, saves)
VALUES(056, 3);


INSERT
INTO  GoalDetails(goalNumber, matchID, playerID, time, type)
VALUES(1, 001, 001, '45:34', 'kick');

INSERT
INTO  GoalDetails(goalNumber, matchID, playerID, time, type)
VALUES(2, 001, 002, '34:23', 'penalty kick');

INSERT
INTO  GoalDetails(goalNumber, matchID, playerID, time, type)
VALUES(3, 001, 003, '76:23', 'headbutt');

INSERT
INTO  GoalDetails(goalNumber, matchID, playerID, time, type)
VALUES(1, 002, 001, '80:23', 'long kick');

INSERT
INTO  GoalDetails(goalNumber, matchID, playerID, time, type)
VALUES(2, 002, 004, '12:12', 'kick');


--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (001, 20, 3);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (002, 25, 4);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (003, 27, 5);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (004, 30, 2);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (005, 35, 1);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (006, 10, 1);
--
-- INSERT
-- INTO Forward(playerID, shots, goals)
-- VALUES (007, 21, 2);
--
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(020, 5, 10, 0, 13);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(021, 6, 11, 0, 14);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(022, 3, 12, 1, 16);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(023, 12, 3, 0, 19);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(024, 20, 0, 0, 3);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(025, 30, 5, 1, 12);
--
-- INSERT
-- INTO Midfield(playerID, tackles, shots, goals, interceptions)
-- VALUES(026, 8, 15, 2, 7);
--
--
-- INSERT
-- INTO Goalkeeper(playerID, saves)
-- VALUES(030, 5);
--
-- INSERT
-- INTO Goalkeeper(playerID, saves)
-- VALUES(031, 6);
--
-- INSERT
-- INTO Goalkeeper(playerID, saves)
-- VALUES(032, 3);
--
-- INSERT
-- INTO Goalkeeper(playerID, saves)
-- VALUES(033, 12);
--
-- INSERT
-- INTO Goalkeeper(playerID, saves)
-- VALUES(034, 20);
--
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(040, 15, 10, 0, 13);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(041,16, 11, 0, 14);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(042, 13, 12, 1, 16);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(043, 22, 3, 0, 19);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(044, 30, 0, 0, 3);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(045, 20, 5, 1, 12);
--
-- INSERT
-- INTO Defender(playerID, tackles, shots, goals, interceptions)
-- VALUES(046, 18, 15, 2, 7)

COMMIT;