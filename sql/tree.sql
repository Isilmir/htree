create database if not exists htree

CREATE schema if not exists tree;

CREATE table if not exists tree."structure" (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT null,
	CONSTRAINT structure_pk PRIMARY KEY (id);
);

CREATE table if not exists tree.tree (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	structureid integer NOT NULL,
	parentid integer,
	CONSTRAINT tree_pk PRIMARY KEY (id),
	CONSTRAINT tree_fk FOREIGN KEY (structureid) REFERENCES tree."structure"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tree_fk_1 FOREIGN KEY (parentid) REFERENCES tree.tree(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tree.properties (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NOT NULL,
	treeid integer NOT NULL,
	value varchar NOT NULL,
	CONSTRAINT properties_pk PRIMARY KEY (id),
	CONSTRAINT properties_fk FOREIGN KEY (treeid) REFERENCES tree.tree(id) ON DELETE CASCADE ON UPDATE CASCADE
);