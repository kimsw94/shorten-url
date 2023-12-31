-- migrate:up

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(1000) NOT NULL,
    password VARCHAR(1000) NOT NULL,
    nickname VARCHAR(1000) NOT NULL,
    phone VARCHAR(1000) DEFAULT NULL,
    ip VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY(id)
);

-- migrate:down

DROP TABLE users



