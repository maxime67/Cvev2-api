var express = require('express');
const {
    findAll,
    findByName,
    findLastCreatedVendor,
    findById
} = require("../controllers/vendorController");
var router = express.Router();

/* GET home page. */
router.get('/', findAll);
router.get('/name/:name', findByName);
router.get('/last/:limit?', findLastCreatedVendor);
router.get('/:id', findById);

/*
Dans ExpressJs l'ordre des routes est importante pour éviter les erreurs de routage
La requête vers /last/:limit? pourrait etre routée vers /:id (avec 'last' comme id) si la valeur limit n'est pas spécifiée, les route les plus courte sont donc définies en dernier
 */
router.get('/:id', findById);


module.exports = router;
