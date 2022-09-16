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
    let query = `select id,structureid,parentid,name,order from tree.tree where id = $1`
    try {
        let output = await connect.pool.query(query,[id]);
        res.status(200).send(output.rows[0]);
    } catch(err) {
        next(err);
    }
}

const getTree = async (req,res,next) => {
    let output = [];
    const {structureid} = req.params;
    let query = `select id,structureid,parentid,name,order from tree.tree where structureid = $1`
    let queryProps = `select id, type, treeid, structureid, value, key from tree.properties where structureid = $1`
    try {
        let nodes = await connect.pool.query(query,[structureid]);
        let properties = await connect.pool.query(queryProps,[structureid]);

        for (let node of nodes.rows) {
            const nodeprops = properties.rows.filter((element)=>{
                return node.id === element.treeid;
            })
            output.push({
                "id":node.id,
                "structureid":node.structureid,
                "parentid":node.parentid,
                "name":node.name,
                "order":node.order,
                "properties":nodeprops
            })
        }
        res.status(200).send(output);
    } catch(err) {
        next(err);
    }
}

const getTreebyNodeId = async (req,res,next) => {
    let output = [];
    const {structureid, nodeid} = req.params;
    console.log(req.params);
    let query = `	WITH RECURSIVE cte_name AS(
                select  t.id ,t.structureid ,t.parentid ,t."name" ,t."order" , 1 as lev from tree.tree t where t.id = $2 and t.structureid=$1 
                UNION ALL
                select t2.id ,t2.structureid ,t2.parentid ,t2."name" ,t2."order", c.lev+1
                from cte_name c
                join tree.tree t2 on t2.parentid = c.id 
                ) SELECT id ,structureid ,parentid ,"name" ,"order" from cte_name`
    let queryProps = `select id, type, treeid, structureid, value, key from tree.properties where structureid = $1`
    try {
        let nodes = await connect.pool.query(query,[structureid, nodeid]);
        let properties = await connect.pool.query(queryProps,[structureid]);

        for (let node of nodes.rows) {
            const nodeprops = properties.rows.filter((element)=>{
                return node.id === element.treeid;
            })
            output.push({
                "id":node.id,
                "structureid":node.structureid,
                "parentid":node.parentid,
                "name":node.name,
                "order":node.order,
                "properties":nodeprops
            })
        }
        res.status(200).send(output);
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
    deleteTreeNode,
    getTreebyNodeId
}