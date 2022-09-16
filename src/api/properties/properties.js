const connect = require('../htreeconnection');

const setProperty = async (req,res,next) => {
    const {type, nodeid, structureid, value, key} = req.body;
    let query = `insert into tree.properties (type, treeid, structureid, value, key) values ($1,$2,$3,$4,$5) returning id,type, treeid, structureid, value, key`
    try {
        let output = await connect.pool.query(query,[type, nodeid, structureid, value,key]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getProperty = async (req,res,next) => {
    const {nodeid} = req.params;
    let query = `select id, type, treeid, structureid, value, key from tree.properties where treeid = $1`
    try {
        let output = await connect.pool.query(query,[nodeid]);
        res.status(200).send(output.rows);
    } catch(err) {
        next(err);
    }
}

const updateProperty = async (req,res,next) => {
    const {id, type, nodeid, structureid, value, key} = req.body;
    let query = `update tree.properties set type = $2,treeid=$3, structureid=$4,value=$5, key=$6  where id = $1 
                returning id, type, treeid, structureid, value, key`
    try {
        let output = await connect.pool.query(query,[id, type, nodeid, structureid, value, key]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const deleteProperty = async (req,res,next) => {
    const {id} = req.params;
    let query = `delete from tree.properties where id = $1 returning id, type, treeid, structureid, value, key`
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