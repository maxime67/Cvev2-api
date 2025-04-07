const Vendor = require('../models/vendorSchema');

/**
 * Retourne tous les vendors
 * @returns {Promise<List<Vendor>>} - Liste de vendor
 */
const findAll = async (req, res) => {
    try {
        const vendors = await Vendor.find({})
            .sort({name: 1})

        res.json(vendors);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des fournisseurs',
            error: error.message
        });
    }
};

/**
 * Retourne le vendor à partir de son identifiant
 * @param {int} id - identifiant recherché
 * @returns {Promise<Vendor>} - Objet vendor
 */
const findById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id)

        res.json(vendor);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des fournisseurs',
            error: error.message
        });
    }
};

/**
 * Retourne les derniers vendors crée
 * @param {int} limit - Nombre de valeurs maximum retournées
 * @returns {Promise<List<Vendor>>} - Liste de vendor
 */
const findLastCreatedVendor = async (req, res) => {
    try {
        const vendors = await Vendor.find({})
            .sort({createdAt: -1})
            .limit(req.params.limit || 50)
        res.json(await vendors);

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
        const {name} = req.params;
        const searchRegex = new RegExp(name, 'i');

        // Recherche des produits dont le nom contient la chaîne de recherche
        const vendors = await Vendor.find({name: searchRegex})
            .select('name products')
            .sort({name: 1}) // Tri par ordre alphabétique
            .limit(10);

        if (!vendors || vendors.length === 0) {
            return res.json([]);
        }

        // Correction de la méthode map pour retourner correctement les objets
        const vendorData = vendors.map(vendor => ({
            name: vendor.name,
            productsCount: vendor.products ? vendor.products.length : 0
        }));

        res.json(vendorData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

module.exports = {
    findById,
    findLastCreatedVendor,
    findAll,
    findByName,
};