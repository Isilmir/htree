const connect = require('../htreeconnection');

const setTreeNode = async (req,res,next) => {
    let properties_out=[];
    const {structureid, parentid, name, properties=[]} = req.body;
    const query = `insert into tree.tree (structureid, parentid, "name", "order") 
                values ($1,$2,$3,tree.setnodeorder($2,$1)) 
                returning id,structureid,parentid,"name","order"`;
    try {
        let output = await connect.pool.query(query,[structureid, parentid, name]);
        if(properties) {
            for (property of properties) {
                const queryProp = `insert into tree.properties (type, treeid, structureid, value, key) 
                                    values ($1,$2,$3,$4,$5) returning id,type, treeid, structureid, value, key`;
                let prop_out = await connect.pool.query(queryProp,[property.type,output.rows[0].id,structureid,property.value,property.key]);
                properties_out.push({
                    "id": prop_out.rows[0].id,
                    "type": prop_out.rows[0].type,
                    "nodeid": prop_out.rows[0].treeid,
                    "value": prop_out.rows[0].value,
                    "key": prop_out.rows[0].key,
                })
            }
        }

        res.status(200).send({
            "id":output.rows[0].id,
            "structureid":output.rows[0].structureid,
            "parentid":output.rows[0].parentid,
            "name":output.rows[0].name,
            "order":output.rows[0].order,
            "properties":properties_out
        });
    } catch(err) {
        next(err);
    }
}

const getTreeNode = async (req,res,next) => {
    const {id} = req.params;
    let query = `select id,structureid,parentid,name from tree.tree where id = $1`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getTree = async (req,res,next) => {
    const {structureid} = req.params;
    let query = `select id,structureid,parentid,name from tree.tree where structureid = $1`
    try {
        let output = await connect.pool.query(query,[structureid]);
        res.status(200).send(output.rows);
    } catch(err) {
        next(err);
    }
}

const updateTreeNode = async (req,res,next) => {
    const {id, parentid, name} = req.body;
    let query = `update tree.tree set parentid = $2, name = $3 where id = $1 returning id,structureid,parentid,name`
    try {
        let output = await connect.pool.query(query,[id, parentid, name]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const deleteTreeNode = async (req,res,next) => {
    const {id} = req.params;
    let query = `delete from tree.tree where id = $1 returning id,structureid,parentid,name`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    setTreeNode,
    getTreeNode,
    updateTreeNode,
    getTree,
    deleteTreeNode
}