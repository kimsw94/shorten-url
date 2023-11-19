-- migrate:up

CREATE TABLE URLS (
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(1000000000) NOT NULL,
    newUrl VARCHAR(1000) DEFAULT NULL,
    ip VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

-- migrate:down

DROP TABLE URLS