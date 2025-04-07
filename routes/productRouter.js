var express = require('express');
const {
    findById,
    findAll,
    findByName,
    findAllProductByVendor,
    findLastCreatedProduct
} = require("../controllers/productController");
var router = express.Router();

/* GET home page. */
router.get('/', findAll);
router.get('/name/:query', findByName);
router.get('/vendor/:query', findAllProductByVendor);
router.get('/last/:limit?', findLastCreatedProduct);
/*
Dans ExpressJs l'ordre des routes est importante pour éviter les erreurs de routage
La requête vers last/:limit? pourrait etre routée vers /:id (avec 'last' comme id) si la valeur limit n'est pas spécifiée, les routes les plus courtes sont donc définies en dernier
 */
router.get('/:id', findById);

module.exports = router;