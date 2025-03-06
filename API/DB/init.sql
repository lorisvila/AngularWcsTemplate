-- Create the user
CREATE USER 'apiUser'@'%' IDENTIFIED BY 'o2iNrzG#j61EJ1Go1jb8';

-- Grant SELECT and INSERT privileges on the database to the user
GRANT SELECT, INSERT ON web.* TO 'apiUser'@'%';

-- Flush privileges to ensure that the changes take effect
FLUSH PRIVILEGES;
