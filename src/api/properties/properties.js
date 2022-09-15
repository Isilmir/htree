const connect = require('../htreeconnection');

const setProperty = async (req,res,next) => {
    const {type, treeid, structureid, value, key} = req.body;
    let query = `insert into tree.properties (type, treeid, structureid, value, key) values ($1,$2,$3,$4,$5) returning id,type, treeid, structureid, value, key`
    try {
        let output = await connect.pool.query(query,[type, treeid, structureid, value,key]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getProperty = async (req,res,next) => {
    const {treeid} = req.params;
    let query = `select id, type, treeid, value from tree.properties where treeid = $1`
    try {
        let output = await connect.pool.query(query,[treeid]);
        res.status(200).send(output.rows);
    } catch(err) {
        next(err);
    }
}

const updateProperty = async (req,res,next) => {
    const {id, type, treeid, value} = req.body;
    let query = `update tree.properties set type = $2,treeid=$3,value=$4  where id = $1 returning id,type, treeid, value`
    try {
        let output = await connect.pool.query(query,[id, type, treeid, value]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const deleteProperty = async (req,res,next) => {
    const {id} = req.params;
    let query = `delete from tree.properties where id = $1`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getTypes = async (req,res,next) => {
    const {structureid} = req.params;
    let query = `select distinct p.type
                from tree.properties p
                where treeid in (select id from tree.tree where structureid = $1)`
    try {
        let output = await connect.pool.query(query,[structureid]);
        res.status(200).send(output.rows);
    } catch(err) {
        next(err);
    }                
}

module.exports = {
    setProperty,
    getProperty,
    updateProperty,
    deleteProperty,
    getTypes
}