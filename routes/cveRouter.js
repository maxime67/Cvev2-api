var express = require('express');
const {
    findByBaseScoreLimit,
    findById,
    findByCveId,
    findAll,
    findAllByProduct,
    findAllByVendor,
    findLastCreatedCVE,
    findByCveByChar,
    findAllByProductId
} = require("../controllers/cveController");
const {findByName} = require("../controllers/productController");
var router = express.Router();

/* GET home page. */
router.get('/last/:limit?', findLastCreatedCVE);
router.get('/', findAll);
router.get('/:id', findById);
router.get('/id/:id', findByCveId);
router.get('/completion/:id', findByCveByChar);
router.get('/basescore/:basescore', findByBaseScoreLimit);
router.get('/product/:product', findAllByProduct);
router.get('/product/id/:productId', findAllByProductId);
router.get('/vendor/:vendor', findAllByVendor);

module.exports = router;
