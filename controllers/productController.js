const Product = require('../models/productSchema');
const Vendor = require("../models/vendorSchema");

/**
 * Retourne tous les produit
 * @returns {Promise<List<Product>>} - Liste de produit
 */
const findAll = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('vendor')
            .sort({ name: 1 })

        res.json(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

/**
 * Retourne un Produit à partir d'un identifiant
 * @param {int} id - Id recherché
 * @returns {Promise<Product>} - Objet Produit
 */
const findById = async (req, res) => {
    try {
        console.log(req.params.id);
        const products = await Product.findById(req.params.id)
            .populate('vendor')
        console.log(await products)

        res.json(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

/**
 * Retourne tous les produit à partir d'un nom de vendeur
 * @param {int} query - Nom du vendor
 * @returns {Promise<List<Product>>} - Liste de produit
 */
const findAllProductByVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ name: req.params.query})
        const products = await Product.find({vendor: await vendor._id })
            .populate('vendor')
            .sort({ name: 1 })

        res.json(await products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

/**
 * Retourne les derniers produit crée
 * @param {int} limit - Nombre de valeurs maximum retournées
 * @returns {Promise<List<Product>>} - Liste de produit
 */
const findLastCreatedProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('vendor')
            .sort({ createdAt: -1 })
            .limit(req.params.limit || 50)
        console.log(await products);

        res.json(await products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

/**
 * Retourne les noms et id des produits contenants la chaine de caractère passée en paramètre
 * @param {string} query - Nom recherché
 * @returns {Promise<List<Produit>>} - Liste de produit
 */
const findByName = async (req, res) => {
    try {
        const { query } = req.params
        console.log(req.params)
        const searchRegex = new RegExp(query, 'i');

        // Recherche des produits dont le nom contient la chaîne de recherche
        const products = await Product.find({ name: searchRegex })
            .select('name')
            .select('_id')
            .populate('vendor')
            .sort({ name: 1 }) // Tri par ordre alphabétique
            .limit(10);

        console.log(products);

        if (!products || products.length === 0) {
            return res.json([]);
        }
        const productNames = products.map(product => product.name);

        res.json(productNames);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
        console.log(error)
    }
}

module.exports = {
    findById,
    findLastCreatedProduct,
    findAll,
    findByName,
    findAllProductByVendor
};