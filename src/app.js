const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const structureset = require('./api/structure/structure');
const tree = require('./api/tree/tree');
const properties = require('./api/properties/properties');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/api/htree.yml');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post('/pg/structure', structureset.setStructure);
router.get('/pg/structure', structureset.getStructureList);
router.post('/pg/tree/node', tree.setTreeNode);
router.get('/pg/tree/node/:id', tree.getTreeNode);
router.get('/pg/tree/:structureid', tree.getTree);
router.put('/pg/tree/node', tree.updateTreeNode);
router.delete('/pg/tree/node/:id', tree.deleteTreeNode);
router.post('/pg/property', properties.setProperty);
router.get('/pg/property/:treeid', properties.getProperty);
router.put('/pg/property', properties.updateProperty);
router.delete('/pg/property/:id', properties.deleteProperty);
router.get('/pg/property/types/:structureid', properties.getTypes);


app.use('/',router);

app.listen(process.env.SERVER_PORT,()=>console.log(`Listening on port ${process.env.SERVER_PORT}`))