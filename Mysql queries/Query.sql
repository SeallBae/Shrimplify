CREATE DATABASE thesis;

use thesis;

create table USER (
    name varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    password varchar(255) NOT NULL,
    refreshToken varchar(255),
    accessToken varchar(255),
    isAdmin boolean NOT NULL
);

create table POND (
    id varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    userName varchar(255) NOT NULL,
    name varchar(255) UNIQUE NOT NULL,
    area float NOT NULL,
    deep float NOT NULL,
    startDate date NOT NULL,
    FOREIGN KEY (userName) references USER(name)
);

create table CROP (
    id varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    pondId varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    number int,
    startDate date NOT NULL,
    FOREIGN KEY (pondId) references POND(Id)

);

create table STAT (
    id varchar(20) UNIQUE NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    from_stat float,
    to_stat float
);

CREATE TABLE IOT_DEVICE (
    id int UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

create table CROP_STAT (
    cropId varchar(255) NOT NULL,
    statId varchar(20) NOT NULL,
    FOREIGN KEY (cropId) references CROP(id)
,
    FOREIGN KEY (statId) references STAT(id)
,
    isActive boolean NOT NULL,
    iotId int,
    FOREIGN KEY (iotId) references IOT_DEVICE(id)

);

create table DAILY_HISTORY (
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    cropId varchar(255) NOT NULL,
    statId varchar(20) NOT NULL,
    history_date datetime NOT NULL,
    num_stat float NOT NULL,
    isDanger boolean NOT NULL,
    description varchar(1000),
    FOREIGN KEY (cropId) references CROP(id),
    FOREIGN KEY (statId) references STAT(id)
);

create table DATASET (
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    statId varchar(20) NOT NULL,
    history_date datetime NOT NULL,
    num_stat float NOT NULL,
    FOREIGN KEY (statId) references STAT(id)
);

INSERT INTO STAT (ID, name, from_stat, to_stat) VALUES (1,"temperature",25,35);
