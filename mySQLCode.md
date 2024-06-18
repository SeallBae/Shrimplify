create table POND (
	ID varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    name varchar(255) UNIQUE NOT NULL,
    area float NOT NULL,
    deep float NOT NULL,
    startDate date NOT NULL
);

create table CROP (
	ID varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    pondID varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
	number int,
    startDate date NOT NULL,
    FOREIGN KEY (pondID) references POND(ID)
);

create table STAT (
	ID varchar(20) UNIQUE NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    from_stat float,
    to_stat float
);

create table CROP_STAT (
	cropID varchar(255) NOT NULL,
    statID varchar(20) NOT NULL,
    FOREIGN KEY (cropID) references CROP(ID),
    FOREIGN KEY (statID) references STAT(ID)
);

create table DAILY_HISTORY (
	ID varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    cropID varchar(255) NOT NULL,
    statID varchar(20) NOT NULL,
    history_date datetime NOT NULL,
    num_stat float NOT NULL,
    isDanger boolean NOT NULL,
    description varchar(1000),
    FOREIGN KEY (cropID) references CROP(ID),
    FOREIGN KEY (statID) references STAT(ID)
);
