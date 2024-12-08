CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_type_id INT,
    item_category_id INT,
    unit_id INT,
    unique_code VARCHAR(255) UNIQUE,
    code VARCHAR(255),
    wholesale_price DECIMAL(18, 2),
    wholesale_min_qty INT,
    unit_type VARCHAR(50),
    minimum_stock INT DEFAULT 0,
    FOREIGN KEY (item_category_id) REFERENCES categories(category_id),
    FOREIGN KEY (unit_id) REFERENCES units(unit_id)
);

CREATE TABLE item_type (
    item_type_id SERIAL PRIMARY KEY,
    item_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE stock (
    stock_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    as_of_date DATE NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

CREATE TABLE parties (
    party_id SERIAL PRIMARY KEY,
    party_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(255),
    billing_address TEXT
);

