-- Reset old tables in the correct dependency order.
DROP TABLE IF EXISTS user_noted_reports;
DROP TABLE IF EXISTS pest_reports;
DROP TABLE IF EXISTS pests;
DROP TABLE IF EXISTS users;

-- Create the users table.
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL DEFAULT 'user',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the pests table first because pest_reports depends on it.
CREATE TABLE pests (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       organism_type VARCHAR(50) NOT NULL,
                       description TEXT,
                       regulatory_status VARCHAR(100),
                       notifiable BOOLEAN DEFAULT FALSE,
                       image_url TEXT
);

-- Create the pest reports table with all final fields included.
CREATE TABLE pest_reports (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT,
                              pest_id INT NULL,
                              custom_pest_name VARCHAR(100) NULL,
                              pest_type VARCHAR(100) NULL,
                              description TEXT,
                              location_name VARCHAR(255),
                              latitude DOUBLE,
                              longitude DOUBLE,
                              image_url TEXT,
                              status_choice VARCHAR(50) NULL,
                              notifiable_choice VARCHAR(50) NULL,
                              report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                              FOREIGN KEY (pest_id) REFERENCES pests(id) ON DELETE SET NULL
);

-- Create the noted reports table.
CREATE TABLE user_noted_reports (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT NOT NULL,
                                    report_id INT NOT NULL,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    UNIQUE KEY unique_user_report (user_id, report_id),
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                    FOREIGN KEY (report_id) REFERENCES pest_reports(id) ON DELETE CASCADE
);

-- Optional: promote a specific existing user to admin after inserting users.
-- UPDATE users
-- SET role = 'admin'
-- WHERE email = 'test@qq.com';