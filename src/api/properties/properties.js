const connect = require('../htreeconnection');

const setProperty = async (req,res) => {
    const {type, treeid, value} = req.body;
    let query = `insert into tree.properties (type, treeid, value) values ($1,$2,$3) returning id,type, treeid, value`
    try {
        let output = await connect.pool.query(query,[type, treeid, value]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const getProperty = async (req,res) => {
    const {treeid} = req.params;
    let query = `select id, type, treeid, value from tree.properties where treeid = $1`
    try {
        let output = await connect.pool.query(query,[treeid]);
        res.status(200).send(output.rows);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const updateProperty = async (req,res) => {
    const {id, type, treeid, value} = req.body;
    let query = `update tree.properties set type = $2,treeid=$3,value=$4  where id = $1 returning id,type, treeid, value`
    try {
        let output = await connect.pool.query(query,[id, type, treeid, value]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const deleteProperty = async (req,res) => {
    const {id} = req.params;
    let query = `delete from tree.properties where id = $1`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const getTypes = async (req,res) => {
    const {structureid} = req.params;
    let query = `select distinct p.type
                from tree.properties p
                where treeid in (select id from tree.tree where structureid = $1)`
    try {
        let output = await connect.pool.query(query,[structureid]);
        res.status(200).send(output.rows);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }                
}

module.exports = {
    setProperty,
    getProperty,
    updateProperty,
    deleteProperty,
    getTypes
}