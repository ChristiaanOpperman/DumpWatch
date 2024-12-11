-- db/init.sql
USE dumpwatch;

CREATE TABLE
    User(
        UserId VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
        UserType ENUM('Community', 'Organisation') NOT NULL,
        CommunityName VARCHAR(255),
        Category ENUM(
            'Volunteer Group',
            'Non-Governmental Organization',
            'Community Organisation',
            'Municipality'
        ),
        FirstName VARCHAR(100),
        LastName VARCHAR(100),
        Email VARCHAR(255) UNIQUE NOT NULL,
        CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    Report (
        ReportId VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
        CreatedById VARCHAR(36) NOT NULL,
        CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        LastModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        Description TEXT,
        Latitude DECIMAL(10, 8) NOT NULL,
        Longitude DECIMAL(11, 8) NOT NULL,
        ImageURL VARCHAR(255),
        FOREIGN KEY (CreatedById) REFERENCES User(UserId),
    );