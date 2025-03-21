use dumpwatch;

CREATE TABLE UserType (
    UserTypeId INT AUTO_INCREMENT PRIMARY KEY,
    UserType VARCHAR(50) NOT NULL,
    Category VARCHAR(100) NULL
);

CREATE TABLE User (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PasswordHash VARCHAR(255) NOT NULL,
    UserTypeId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    CONSTRAINT FK_User_UserType FOREIGN KEY (UserTypeId) REFERENCES UserType(UserTypeId) ON DELETE CASCADE
);

CREATE TABLE Place (
    PlaceId INT AUTO_INCREMENT PRIMARY KEY,
    CountryCode VARCHAR(2) NOT NULL,
    PlaceName VARCHAR(180) NOT NULL,
    CONSTRAINT UQ_Place_Country_PlaceName UNIQUE (CountryCode, PlaceName)
);

CREATE TABLE PlaceDetails (
    PlaceDetailId INT AUTO_INCREMENT PRIMARY KEY,
    PlaceId INT NOT NULL,
    PostalCode VARCHAR(20) NOT NULL,
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL,
    Accuracy INT NULL,
    CONSTRAINT FK_PlaceDetails_Place FOREIGN KEY (PlaceId) REFERENCES Place(PlaceId) ON DELETE CASCADE
);

CREATE TABLE Report (
    ReportId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    Status ENUM('Open', 'Scheduled', 'Resolved') NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Description TEXT NULL,
    ImageURL VARCHAR(255) NULL,
    PlaceDetailId INT NOT NULL,
    CONSTRAINT FK_Report_User FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_Report_PlaceDetails FOREIGN KEY (PlaceDetailId) REFERENCES PlaceDetails(PlaceDetailId) ON DELETE CASCADE
);

CREATE TABLE Comment (
    CommentId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Message TEXT NOT NULL,
    ReportId INT NOT NULL,
    CONSTRAINT FK_Comment_User FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_Comment_Report FOREIGN KEY (ReportId) REFERENCES Report(ReportId) ON DELETE CASCADE
);

CREATE TABLE UserPlaceDetails (
    UserPlaceDetailsId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    PlaceDetailId INT NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_place (UserId, PlaceDetailId),
    CONSTRAINT FK_UserPlaceDetails_User FOREIGN KEY (UserId) 
        REFERENCES User(UserId) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_UserPlaceDetails_PlaceDetail FOREIGN KEY (PlaceDetailId) 
        REFERENCES PlaceDetails(PlaceDetailId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert default UserType data
INSERT INTO UserType (UserTypeId, UserType, Category) VALUES
(1, 'Organisation', 'Volunteer Group'),
(2, 'Organisation', 'Non-Governmental Organization'),
(3, 'Organisation', 'Community Organisation'),
(4, 'Organisation', 'Municipality'),
(5, 'Community Member', 'User');
