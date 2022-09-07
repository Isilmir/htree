const connect = require('./htreeconnection');

const setStructure = async (req,res) => {
    const {name} = req.body;
    let query = `insert into tree.structure (name) values ($1) returning id,name`
    let output = await connect.pool.query(query,[name]);
    res.status(200).send(output.rows);
}

module.exports = {
    setStructure,
}