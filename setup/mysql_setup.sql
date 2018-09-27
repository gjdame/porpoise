-- prepares a MySQL server for the project
CREATE DATABASE IF NOT EXISTS `porpoise`;
CREATE USER IF NOT EXISTS 'greg'@'localhost' IDENTIFIED BY 'gregpassword';
GRANT USAGE ON *.* TO 'greg'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'greg'@'localhost';
GRANT ALL PRIVILEGES ON `porpoise`.* TO 'greg'@'localhost';
FLUSH PRIVILEGES;