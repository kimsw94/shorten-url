-- migrate:up

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(10000) NOT NULL,
    description VARCHAR(1000) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY(id)
);

-- migrate:down

DROP TABLE products



