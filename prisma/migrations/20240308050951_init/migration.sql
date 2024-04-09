-- CreateTable
CREATE TABLE `category` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(45) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(45) NULL,
    `PRICE` DECIMAL(10, 0) NULL,
    `Category_ID` INTEGER NOT NULL,
    `User_ID` INTEGER NOT NULL,
    `IsAdminApproved` TINYINT NULL,
    `Image` VARCHAR(200) NULL,
    `BookFile` VARCHAR(200) NULL,
    `Description` TEXT NULL,

    INDEX `fk_Items_Category_idx`(`Category_ID`),
    INDEX `fk_Items_User1_idx`(`User_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `TOTAL` VARCHAR(45) NULL,
    `Orderscol` VARCHAR(45) NULL,
    `USER_ID` INTEGER NOT NULL,
    `Payments_ID` INTEGER NOT NULL,

    INDEX `fk_Orders_Payments1_idx`(`Payments_ID`),
    INDEX `fk_Orders_Shopper1_idx`(`USER_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_has_items` (
    `Orders_ID` INTEGER NOT NULL,
    `Items_ID` INTEGER NOT NULL,

    INDEX `fk_Orders_has_Items_Items1_idx`(`Items_ID`),
    INDEX `fk_Orders_has_Items_Orders1_idx`(`Orders_ID`),
    PRIMARY KEY (`Orders_ID`, `Items_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `GatewayID` INTEGER NULL,
    `Amout` DECIMAL(5, 2) NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(45) NULL,
    `EMAIL` VARCHAR(45) NOT NULL,
    `MOBILE` VARCHAR(45) NULL,
    `ADDRESS` VARCHAR(45) NULL,
    `ZIPCODE` VARCHAR(45) NULL,
    `ROLE` VARCHAR(45) NULL,
    `GOOGLE_ID` VARCHAR(45) NULL,
    `PASSWORD` VARCHAR(200) NULL,
    `OTP` INTEGER NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `fk_Items_Category` FOREIGN KEY (`Category_ID`) REFERENCES `category`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `fk_Items_User1` FOREIGN KEY (`User_ID`) REFERENCES `user`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_Orders_Payments1` FOREIGN KEY (`Payments_ID`) REFERENCES `payments`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_Orders_Shopper1` FOREIGN KEY (`USER_ID`) REFERENCES `user`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders_has_items` ADD CONSTRAINT `fk_Orders_has_Items_Items1` FOREIGN KEY (`Items_ID`) REFERENCES `items`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders_has_items` ADD CONSTRAINT `fk_Orders_has_Items_Orders1` FOREIGN KEY (`Orders_ID`) REFERENCES `orders`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
