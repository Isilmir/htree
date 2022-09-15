const connect = require('../htreeconnection');

const setStructure = async (req,res,next) => {
    const {name} = req.body;
    let query = `insert into tree.structure (name) values ($1) returning id,name`
    try {
        let output = await connect.pool.query(query,[name]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getStructureList = async (req,res,next) => {
    let query = `select id, name from tree.structure`
    try {
        let output = await connect.pool.query(query);
        res.status(200).send(output.rows);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    setStructure,
    getStructureList,
}