create database if not exists htree

CREATE schema if not exists tree;

CREATE table if not exists tree."structure" (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT null,
	CONSTRAINT structure_pk PRIMARY KEY (id);
);

CREATE table if not exists tree.tree (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	structureid int4 NOT NULL,
	parentid int4 NULL,
	"name" varchar NULL,
	"order" int4 NOT NULL DEFAULT 1,
	CONSTRAINT tree_pk PRIMARY KEY (id),
	CONSTRAINT tree_fk FOREIGN KEY (structureid) REFERENCES tree."structure"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tree_fk_1 FOREIGN KEY (parentid) REFERENCES tree.tree(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE table if not exists tree.properties (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NULL,
	treeid int4 NOT NULL,
	value varchar NOT NULL,
	structureid int4 NOT NULL,
	"key" varchar NOT NULL,
	CONSTRAINT properties_pk PRIMARY KEY (id)
);
-- tree.properties foreign keys

ALTER TABLE tree.properties ADD CONSTRAINT properties_fk FOREIGN KEY (treeid) REFERENCES tree.tree(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE tree.properties ADD CONSTRAINT properties_struct_fk FOREIGN KEY (structureid) REFERENCES tree."structure"(id) ON DELETE CASCADE ON UPDATE CASCADE;

--DROP FUNCTION tree.setnodeorder(integer,integer)
CREATE OR REPLACE FUNCTION tree.setnodeorder(parid int4, structid int4)
	RETURNS int4
	LANGUAGE plpgsql
AS $function$
declare res int4;
	BEGIN
		select coalesce(max("order"),0)+1 into res
		from tree.tree
		where parentid = parid
		and structureid = structid;
		return res;
	END;
$function$;

--GRANT ALL ON SCHEMA tree TO test2;
--GRANT ALL ON TABLE tree.properties TO test2;
--GRANT ALL ON TABLE tree."structure" TO test2;
--GRANT ALL ON TABLE tree.tree TO test2;