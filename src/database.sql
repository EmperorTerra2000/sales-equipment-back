create TABLE category(id SERIAL PRIMARY KEY,code INTEGER,name VARCHAR(255));

create TABLE product(id SERIAL PRIMARY KEY,name VARCHAR(255),price DECIMAL(10, 2),category_id INTEGER,FOREIGN KEY (category_id) REFERENCES category(id),);