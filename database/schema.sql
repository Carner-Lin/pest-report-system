CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pest_reports (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT,
                              pest_id INT NULL,
                              custom_pest_name VARCHAR(100) NULL,
                              description TEXT,
                              location_name VARCHAR(255),
                              latitude DOUBLE,
                              longitude DOUBLE,
                              image_url TEXT,
                              report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES users(id),
                              FOREIGN KEY (pest_id) REFERENCES pests(id)
);

CREATE TABLE pests (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       organism_type VARCHAR(50) NOT NULL,
                       description TEXT,
                       regulatory_status VARCHAR(100),
                       notifiable BOOLEAN DEFAULT FALSE,
                       image_url TEXT
);

ALTER TABLE pest_reports
    ADD COLUMN pest_type VARCHAR(100) NULL,
    ADD COLUMN status_choice VARCHAR(50) NULL,
    ADD COLUMN notifiable_choice VARCHAR(50) NULL;

ALTER TABLE users
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE users
SET role = 'admin'
WHERE email = 'test@qq.com';

CREATE TABLE user_noted_reports (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT NOT NULL,
                                    report_id INT NOT NULL,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    UNIQUE KEY unique_user_report (user_id, report_id),
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                    FOREIGN KEY (report_id) REFERENCES pest_reports(id) ON DELETE CASCADE
);