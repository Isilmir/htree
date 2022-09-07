--drop database if exists htree;
create database if not exists htree

CREATE SEQUENCE if not exists public.testtreeseq
   START 1
   INCREMENT 1;
   
CREATE TABLE if not exists public.testtree (id INTEGER DEFAULT nextval('testtreeseq') primary key,parent_id integer, name VARCHAR);


--INSERT INTO testtree(name)values('корень');
--INSERT INTO testtree(name,parent_id)values('lvl1 1',2);
--INSERT INTO testtree(name,parent_id)values('lvl1 2',2);
--INSERT INTO testtree(name,parent_id)values('lvl1 3',2);
--INSERT INTO testtree(name,parent_id)values('lvl2 1-1',3);
--INSERT INTO testtree(name,parent_id)values('lvl2 1-2',3);
--INSERT INTO testtree(name,parent_id)values('lvl2 2-1',4);
--INSERT INTO testtree(name,parent_id)values('lvl2 2-2',4);
--INSERT INTO testtree(name,parent_id)values('lvl2 3-1',5);

SELECT *
FROM public.testtree;