create TABLE category(id SERIAL PRIMARY KEY,code INTEGER,name VARCHAR(255));

create TABLE product(id SERIAL PRIMARY KEY,name VARCHAR(255),price DECIMAL(10, 2),category_id INTEGER,FOREIGN KEY (category_id) REFERENCES category(id),);

create TABLE category(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	created_at timestamp,
	image VARCHAR(255),
	name_en VARCHAR(255),
	global_category_id INTEGER,
	FOREIGN KEY (global_category_id) REFERENCES global_category(id)
);

DROP TABLE table_name;