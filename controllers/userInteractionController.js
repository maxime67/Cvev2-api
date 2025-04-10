const Product = require('../models/productSchema');
const Vendor = require("../models/vendorSchema");
const User = require('../models/userSchema');
const UserCveInteraction = require('../models/userCveInteraction');
const CVE = require('../models/cveSchema');

/**
 * Retourne tous les produit
 * @returns {Promise<List<Product>>} - Liste de produit
 */
const findUserInteraction = async (req, res) => {
    try {
        const interactions = await UserCveInteraction.findOne({userId:  req.user.userId, cveId: req.params.cveId});
        res.json(interactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Récupère toutes les interactions d'un utilisateur
 * @returns {Promise<List<UserCveInteraction>>} - Liste d'interactions avec les CVEs correspondantes
 */
const findAllUserInteractions = async (req, res) => {
    try {
        const interactions = await UserCveInteraction.find({userId:  req.user.userId});

        // Récupérer les détails des CVEs correspondantes
        const cveIds = interactions.map(interaction => interaction.cveId);
        const cves = await CVE.find({ _id: { $in: cveIds } }).populate('products');

        // Fusionner les interactions avec leurs détails de CVE
        const result = interactions.map(interaction => {
            const cve = cves.find(c => c._id.toString() === interaction.cveId.toString());
            return {
                interaction,
                cve
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des interactions', error: err.message });
    }
};

/**
 * Supprime une interaction
 * @param {String} cveId - CveID concernée par l'interaction
 * @returns {String} - Message de bon fonctionnement
 */
const deleteInteraction = async (req, res) => {
    try {
        const interaction = await UserCveInteraction.findOne({
            userId: req.user.userId,
            cveId: req.params.cveId
        });

        if (!interaction) {
            return res.status(404).json({ msg: 'Interaction not found' });
        }

        await interaction.deleteOne({
            userId: req.user.userId,
            cveId: req.params.cveId
        });
        res.json({ msg: 'Interaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const saveInteraction = async (req, res) => {
    const {status, notes} = req.body;
    const {cveId} = req.params

    if (!['Follow', 'Mitigated', 'Patch'].includes(status)) {
        return res.status(400).json({msg: 'Invalid status'});
    }

    try {
        let interaction = await UserCveInteraction.findOne({
            userId: req.user.userId,
            cveId: cveId
        });

        if (interaction) {
            // Mettre à jour si l'interaction existe déjà
            interaction.status = status;
            if (notes !== undefined) {
                interaction.notes = notes;
            }
            interaction.updatedAt = Date.now();
        } else {
            // Créer une nouvelle interaction
            interaction = new UserCveInteraction({
                userId: req.user.userId,
                cveId,
                status,
                notes: notes || ''
            });
        }

        await interaction.save();
        res.json(interaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


module.exports = {
    findUserInteraction,
    saveInteraction,
    deleteInteraction,
    findAllUserInteractions
};