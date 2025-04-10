var express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    findUserInteraction,
    saveInteraction,
    deleteInteraction,
    findAllUserInteractions
} = require("../controllers/userInteractionController");
var router = express.Router();


router.get('/:cveId',authenticateToken, findUserInteraction);
router.post('/save/:cveId',authenticateToken, saveInteraction);
router.delete('/delete/:cveId',authenticateToken, deleteInteraction);
router.get('/', authenticateToken, findAllUserInteractions);

module.exports = router;