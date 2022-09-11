const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sql = require('mssql');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
let upload = multer({ storage: multer.memoryStorage() });
const WebSocket = require('ws');

const getTree = require('./methods/getTree.js');
const structureset = require('./api/structure/structureset');
const tree = require('./api/tree/tree');

const auth = require('./helpers/auth.js');
const preAuth = require('./helpers/preAuth.js');
const adminAuth = require('./helpers/adminAuth.js');
const authWithPermissions = require('./helpers/authWithPermissions.js');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('./swagger/index');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/api/htree.yml');

//const charactersFull_cache = require('../cache/charactersFull_cache.json')

//const privateKey  = fs.readFileSync('src/sslcert/35442480_localhost.key', 'utf8');
//const certificate = fs.readFileSync('src/sslcert/35442480_localhost.cert', 'utf8');
//const credentials = {key: privateKey, cert: certificate};

const app = express();
const router = express.Router();
const joinrpgRouter = express.Router();
const swaggerSpec = swaggerJSDoc.openapiSpecification;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

//const azureConnect=process.env.AzurConnect.split(';')
/*const sqlConfig={
	  user: azureConnect[0],//'admin',
		password: azureConnect[1],//'12345',
		server: azureConnect[2],//'localhost\\ILION', // You can use 'localhost\\instance' to connect to named instance
		database: azureConnect[3]
	}; 
*/
const PORT = process.env.PORT || 5000	

const wss = new WebSocket.Server({ port: 3000 ,clientTracking:true});

wss.on('connection', function connection(ws) {
	ws.name=Math.round(Math.random()*(10000))
	console.log('подключился клиент',ws.name)
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
		console.log(client.name,data.toString())
        client.send(data.toString())//(`<i>${(''+(new Date())).match(/\d\d:\d\d:\d\d/)[0]}</i> <b>${ws.name}</b>: ${data}`);
      }
    });
  });
});


//console.log(`Server started on port ${process.env.PORT || 8081}`);

//router.use(auth());

//joinrpgRouter.use(adminAuth());

router.get('/',(req,res)=>{
	res.send(`<h1>Дерево объектов</h1>
	<div>Та-да!</div>`);
})

router.get('/pg/getTree_',(req,res)=>{
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'htree',
		password: '!Q2w3e4r',
		port: 5432,
	  });
	client.connect();
	client.query(`SELECT * FROM public.testtree;`, (err, result) => {
	  if (err) throw err;
	  console.log(JSON.stringify(result.rows));
	  let page=`<html>
	  <head></head>
	  <body>
	  <script src="https://cdn.jsdelivr.net/npm/d3-hierarchy@3"></script>
	  <script>var d3h=d3</script>
	  <script src="http://d3js.org/d3.v3.min.js"></script>
	  <script>
	  /*var margin = {top: 20, right: 120, bottom: 20, left: 120},
	  width = 960 - margin.right - margin.left,
	  height = 500 - margin.top - margin.bottom;

	  var table = JSON.parse('${JSON.stringify(result.rows)}')
	  //const tree = d3.treemap();
	  console.log(table)

	  var root = d3.stratify()
	  .id(function(d) { return d.id; })
	  .parentId(function(d) { return d.parent_id; })
	  (table);
	  console.log(root)
	  
	  var hierarchy = d3.hierarchy(root)
	  console.log(hierarchy)
	});*/

	var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

	  //var svg = d3.select("svg")

	  var svg = d3.select("body").append("svg")
 .attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log('svg',svg)
    var width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(60,0)");
console.log('g',g)
	console.log(d3h.stratify)
var tree = d3.layout.tree()
    .size([height+300, width - 160]);

	var treeData = JSON.parse('${JSON.stringify(result.rows)}')

var stratify = d3h.stratify()
.id(function(d) { return d.id; })
.parentId(function(d) { return d.parent_id; })
(treeData);//d3h.stratify().parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
console.log(stratify)
  var root = stratify//d3h.hierarchy(stratify);
  console.log(root)
  tree(root);

  var link = g.selectAll(".link")
      .data(root.descendants().slice(1))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + d.y + "," + d.x
            + "C" + (d.parent.y ) + "," + d.x
            + " " + (d.parent.y ) + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
      })
	  .attr("fill", "transparent")
	  .attr("stroke", "red");
	  console.log('link',link)
  var node = g.selectAll(".node")
      .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")"; 
      })
console.log('node',node)
  node.append("circle")
      .attr("r", 3.5);

  node.append("text")
      .attr("dy", 3)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { 
		console.log(d)
        return d.data.name;
      });

	  </script>
	  </body>
	  </html>`
	  console.log(page);
	  res.send(page);
	  client.end();
	});
})
router.get('/pg/getTree',(req,res)=>{
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'htree',
		password: '!Q2w3e4r',
		port: 5432,
	  });
	client.connect();
	client.query(`SELECT * FROM public.testtree;`, (err, result) => {
	  if (err) throw err;
	  console.log(JSON.stringify(result.rows));
	  console.log(result.rows);
	  res.send(result.rows);
	  client.end();
	});
})
  /**
   * /setStructure:
   *   post:
   *     description: Create new structure
   *     tags: [Structure, Create]
   *     produces:
   *       - application/json
   *     parameters:
   *		- name: structure name
   *		  description: how you want to name your structure
   *		  in: formData
   *		  required: true
   *		  type: string
   *     responses:
   *       200:
   *         description: structure
   */
  /**
   * @swagger
   * /pg/setStructure:
   *   post:
   *     description: Create new structure
   *     tags: [Structure]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: how you want to name your structure
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: structure
   *         schema:
   *           type: object
   */  
router.post('/pg/structure', structureset.setStructure);
router.get('/pg/structure', structureset.getStructureList);
router.post('/pg/tree/node', tree.setTreeNode);
router.get('/pg/tree/node/:id', tree.getTreeNode);
router.get('/pg/tree/:structureid', tree.getTree);
router.put('/pg/tree/node', tree.updateTreeNode);
router.delete('/pg/tree/node/:id', tree.deleteTreeNode);

/*
router.get('/test',async (req,res)=>{
	
	await sql.connect(sqlConfig);
	
	const result = await sql.query(`select qr,active from objects`);

	sql.on('error',err=>console.log(err));
	sql.close();
	res.send(result.recordsets[0]);
})

router.get('/testAzure',async (req,res)=>{
	
	await sql.connect(sqlConfig);
	
	const result = await sql.query(`select * from objectTypes`);

	sql.on('error',err=>console.log(err));
	sql.close();
	res.send(result.recordsets[0]);
})

router.post('/test-action',authWithPermissions(null,['test-action']),adminAuth(),async (req,res)=>{
	
	await sql.connect(sqlConfig);
	
	let query =`update top(1) o
  set active=${+req.body.activationToggle}
    FROM [HermesTV].[dbo].[objects] o
  join objectTypes ot on ot.id=o.typeId
  where o.id=${req.body.id}
  and ot.name='${req.body.objectType}'`
	console.log(query);
	const result = await sql.query(query);
	
	res.send(`${req.body.activationToggle?'активировали':'деактивировали'} объект с типом ${req.body.objectType} и id ${req.body.id}`);
})

router.post('/pg/activation',async (req,res)=>{
	console.dir(req.body);
	const client = new Client({
	  connectionString: process.env.DATABASE_URL,
	  ssl: {
		rejectUnauthorized: false
	  }
	});
	let query =`UPDATE hermestv.objects o set active=${req.body.activationToggle?'TRUE':'FALSE'} from hermestv.objectTypes ot where ot.id=o.typeId and o.id=${req.body.id} and ot.name='${req.body.objectType}';`
	console.log(query); 
	client.connect();
	client.query(query, (err, result) => {
	  if (err) throw err;
	  res.send(`${req.body.activationToggle?'активировали':'деактивировали'} объект с типом ${req.body.objectType} и id ${req.body.id}`);
	  client.end();
	});
})

router.post('/sendMail'
,upload.array('attach')// название поля должно соответствовать названию в отправляемой форме
,sendMail());	

router.post('/setOrUpdateBjzi',setOrUpdateBjzi({sqlConfig:sqlConfig}));	
router.get('/faces',faces());
router.get('/faces/:filename',getFace());

router.post('/setOrUpdateDeed',adminAuth(),setOrUpdateDeed({sqlConfig:sqlConfig}));
router.post('/setOrUpdateTransaction',authWithPermissions(null,['setOrUpdateTransaction']),setOrUpdateTransaction({sqlConfig:sqlConfig}));
router.post('/changePlayerSquad',authWithPermissions(null,['changePlayerSquad']),changePlayerSquad({sqlConfig:sqlConfig}));
router.post('/setOrUpdateConfig',adminAuth(),setOrUpdateConfig({sqlConfig:sqlConfig}));
router.post('/setOrUpdateMessage',adminAuth(),setOrUpdateMessage({sqlConfig:sqlConfig}));
router.post('/setOrUpdateWarProgress',authWithPermissions(null,['setOrUpdateWarProgress']),setOrUpdateWarProgress({sqlConfig:sqlConfig}));
router.post('/setDeed/mass',adminAuth(),setDeed_mass({sqlConfig:sqlConfig}));
router.post('/setHonorforCheckpoint',adminAuth(),setHonorforCheckpoint({sqlConfig:sqlConfig}));
router.post('/setCheckpointState',adminAuth(),setCheckpointState({sqlConfig:sqlConfig}));
router.post('/deedTypes',adminAuth(),setOrUpdateDeedType({sqlConfig:sqlConfig}));
router.get('/getBjzi',getBjzi({sqlConfig:sqlConfig}));	
router.get('/messages/:messageId',getMessage({sqlConfig:sqlConfig}));	
router.get('/messages',adminAuth(),getMessages({sqlConfig:sqlConfig}));
router.post('/getHonorStatistic',adminAuth(),getHonorStatistic({sqlConfig:sqlConfig}));
router.get('/getTradeResources/:playerId',authWithPermissions(null,['setOrUpdateTransaction']),getTradeResources({sqlConfig:sqlConfig}));
router.get('/getReinforcements/:playerId',authWithPermissions(null,['makeReinforcementsArrived']),getReinforcements({sqlConfig:sqlConfig}));
router.get('/getBlesses',authWithPermissions(null,['makeBless']),getBlesses({sqlConfig:sqlConfig}));


router.get('/getWarProgress',adminAuth(),getWarProgress({sqlConfig:sqlConfig}));
router.post('/setOrUpdateStory',adminAuth(),setOrUpdateStory({sqlConfig:sqlConfig}));	
router.post('/setOrUpdateLink',adminAuth(),setOrUpdateLink({sqlConfig:sqlConfig}));
router.post('/deleteLink',adminAuth(),deleteLink({sqlConfig:sqlConfig}));
router.post('/deleteDeed',adminAuth(),deleteDeed({sqlConfig:sqlConfig}));
router.post('/deleteTransaction',adminAuth(),deleteTransaction({sqlConfig:sqlConfig}));
router.post('/deleteMessage',adminAuth(),deleteMessage({sqlConfig:sqlConfig}));
router.post('/processing/makeFuneral',authWithPermissions(null,['makeFuneral']),makeFuneral({sqlConfig:sqlConfig}));	
router.post('/processing/makeBjziTransfer',authWithPermissions(null,['makeBjziTransfer']),makeBjziTransfer({sqlConfig:sqlConfig}));	
router.post('/processing/makeReinforcementsAwaiting',adminAuth(),makeReinforcementsAwaiting({sqlConfig:sqlConfig}));	
router.post('/processing/makeReinforcementsArrived',authWithPermissions(null,['makeReinforcementsArrived']),makeReinforcementsArrived({sqlConfig:sqlConfig}));
router.post('/processing/makeNewPlayerFromBjzi',authWithPermissions(null,['makeNewPlayerFromBjzi']),makeNewPlayerFromBjzi({sqlConfig:sqlConfig}));
router.post('/processing/makeCure',authWithPermissions(null,['makeCure']),makeCure({sqlConfig:sqlConfig}));
router.post('/processing/makeRegistration',authWithPermissions(null,['makeRegistration']),makeRegistration({sqlConfig:sqlConfig}));
router.post('/processing/makeBless',authWithPermissions(null,['makeBless']),makeBless({sqlConfig:sqlConfig}));

router.delete('/deedTypes',adminAuth(),deleteDeedType({sqlConfig:sqlConfig}));
router.get('/getStories',adminAuth(),getStories({sqlConfig:sqlConfig}));	
router.get('/getPlayers',adminAuth(),getPlayers({sqlConfig:sqlConfig}));
router.get('/getPlayers_for_printform',adminAuth(),getPlayers_for_printform({sqlConfig:sqlConfig}));
router.get('/players/:playerId',authWithPermissions(null,['scanObject']),getPlayer({sqlConfig:sqlConfig}));
router.get('/bjzi/:bjziId',authWithPermissions(null,['scanObject']),getBjziSingle({sqlConfig:sqlConfig}));
router.get('/getDeedTypes',adminAuth(),getDeedTypes({sqlConfig:sqlConfig}));
router.get('/getConfig',adminAuth(),getConfig({sqlConfig:sqlConfig}));

app.post('/getDictionaries',getDictionaries({sqlConfig:sqlConfig}));
app.get('/getPlayers/honor',preAuth(),getPlayers_honor({sqlConfig:sqlConfig}));	
router.post('/getGraph',adminAuth(),getGraph({sqlConfig:sqlConfig}));
router.post('/objectActivation',authWithPermissions(null,['test-action']),objectActivation({sqlConfig:sqlConfig}));
router.get('/getLastUpdate',adminAuth(),getLastUpdate({sqlConfig:sqlConfig}));
app.get('/isAdmin',isAdmin());

											
app.post('/login',login({sqlConfig:sqlConfig}));		
*/
app.use('/',router);
router.use('/joinrpg',joinrpgRouter)

app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))

//httpServer.listen(process.env.PORT || 8081);
//httpsServer.listen(PORT,()=>console.log(`Listening on port ${PORT}`));

//app.listen(process.env.PORT || 8081); 
/*
function getCurSide(cur){
	return cur.allGroups.filter(el=>el.characterGroupId!=cur.groups[0].characterGroupId&&el.characterGroupId!=14905)[0]||cur.allGroups.filter(el=>el.characterGroupId!=14905)[0];
}
*/