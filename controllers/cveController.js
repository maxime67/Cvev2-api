const Product = require("../models/productSchema");
const CVE = require("../models/cveSchema");

// Create model if it doesn't exist (only if not already registered)

/**
 * Retourne toutes les Cve trié par date de création
 * @param {Int} id - id recherché
 * @returns {Promise<CVE>} - Objet CVE
 */
const findById = async (req, res) => {
    try {
        const cves = await CVE.findById(req.params.id).populate('products')
        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne une Cve à partir du Cve-id fournit
 * @param {Int} id - Cve-id recherché
 * @returns {Promise<CVE>} - Objet CVE
 */
const findByCveId = async (req, res) => {
    try {
        const cves = await CVE.findOne({id: req.params.id})

        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne une Cve à partir du Cve-id fournit, a
 * @param {String} id - Cve-id recherché
 * @returns {Promise<List<CVE>>} - Liste d'objet CVE
 */
const findByCveByChar = async (req, res) => {
    try {
        const { id } = req.params
        const searchRegex = new RegExp(id, 'i');

        // Recherche des produits dont le nom contient la chaîne de recherche
        const cves = await CVE.find({id: searchRegex})
            .select("id")
            .select("_id")
            .limit(30)

        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne toutes les Cve trié par date de création
 * @returns {Promise<List<CVE>>} - Liste de CVE
 */
const findAll = async (req, res) => {
    try {
        const cves = await CVE.find({})
            .sort({lastModified: -1})

        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne les CVE à partir du nom d'un produit
 * @param {String} product - nom du produit
 * @returns {Promise<List<CVE>>} - Liste de CVE
 */
const findAllByProduct = async (req, res) => {
    try {
        let product = await Product.findOne({name: req.params.product})
        const cves = await CVE.find({products: product._id})
            .sort({published: -1})
        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
        console.log(error)
    }
};

/**
 * Retourne toutes les CVE dont le base Score est supérieur à celui fournit
 * @param {Int} limit - limit inférieur du basescore recherché
 * @returns {Promise<List<CVE>>} - Liste de CVE
 */
const findByBaseScoreLimit = async (req, res) => {
    try {
        const cves = await CVE.find({
            "metrics.cvssMetric.baseScore": {$gt: req.params.basescore},
        })
            .populate('products')
            .sort({ "metrics.cvssMetric.baseScore": -1})
            .sort({ published: -1})
            .limit(20)

        res.json(await cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne les dernières cve crée
 * @param {int} limit - Nombre de valeurs maximum retournées
 * @returns {Promise<List<CVE>>} - Liste de CVE
 */
const findLastCreatedCVE = async (req, res) => {
    try {
        const cves = await CVE.find({})
            .populate('products')
            .sort({published: -1})
            .limit(req.params.limit || 50)
        res.json(await cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

/**
 * Retourne les CVE à partir du nom d'un vendor
 * @param {String} vendor - nom du vendor
 * @returns {Promise<List<CVE>>} - Liste de CVE
 */
const findAllByVendor = async (req, res) => {
    try {
        // Pour chercher par vendeur, on a besoin de trouver d'abord tous les produits associés
        // puis chercher les CVE qui référencent ces produits
        const products = await Product.find({vendor: req.params.vendor});
        const productIds = products.map(p => p._id);

        const cves = await CVE.find({products: {$in: productIds}})
            .sort({published: -1})

        res.json(cves);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des CVE',
            error: error.message
        });
    }
};

module.exports = {
    findByBaseScoreLimit,
    findByCveId,
    findById,
    findAll,
    findAllByVendor,
    findAllByProduct,
    findLastCreatedCVE,
    findByCveByChar
};