-- Run this in phpMyAdmin (Import) or the MySQL CLI
CREATE DATABASE IF NOT EXISTS `expense_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `expense_db`;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `day` VARCHAR(15) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Existing data from expenses.json
INSERT INTO `expenses` (`title`, `amount`, `day`, `category`) VALUES
('Meal #1', 75.00, 'Monday', 'Food'),
('Clothes', 899.00, 'Sunday', 'Bills'),
('dgdhgfd', 42.00, 'Monday', 'Food');