const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('ERREUR: La variable d\'environnement MONGODB_URI n\'est pas définie');
            console.error('Veuillez créer un fichier .env avec MONGODB_URI=votre_uri_mongodb');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connexion à MongoDB établie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;