-- migrate:up

CREATE TABLE urls (
    id INT NOT NULL AUTO_INCREMENT,
    originalUrl VARCHAR(10000) NOT NULL,
    newUrl VARCHAR(1000) DEFAULT NULL,
    ip VARCHAR(1000) NOT NULL,
    user_id INT NULL,
    product_id INT NULL,
    redirect INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY(id)
);

-- migrate:down

DROP TABLE urls

