const connect = require('../htreeconnection');

const setTreeNode = async (req,res) => {
    const {structureid, parentid} = req.body;
    let query = `insert into tree.tree (structureid, parentid) values ($1,$2) returning id,structureid,parentid`
    try {
        let output = await connect.pool.query(query,[structureid, parentid]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const getTreeNode = async (req,res) => {
    const {id} = req.params;
    let query = `select id,structureid,parentid from tree.tree where id = $1`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const getTree = async (req,res) => {
    const {structureid} = req.params;
    let query = `select id,structureid,parentid from tree.tree where structureid = $1`
    try {
        let output = await connect.pool.query(query,[structureid]);
        res.status(200).send(output.rows);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const updateTreeNode = async (req,res) => {
    const {id, structureid, parentid} = req.body;
    let query = `update tree.tree set parentid = $3 where id = $1 and structureid = $2 returning id,structureid,parentid`
    try {
        let output = await connect.pool.query(query,[id, structureid, parentid]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

const deleteTreeNode = async (req,res) => {
    const {id} = req.params;
    let query = `delete from tree.tree where id = $1 returning id,structureid,parentid`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack);
        console.log(err);
    }
}

module.exports = {
    setTreeNode,
    getTreeNode,
    updateTreeNode,
    getTree,
    deleteTreeNode
}