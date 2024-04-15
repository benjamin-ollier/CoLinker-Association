const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

});

const AssociationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  siret: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  information: {
    type: String,
    required: false
  },
  member: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      required: true,
      enum: ['Président', 'Créateur' ,'Vice-Président', 'Secrétaire', 'Trésorier', 'Membre du Conseil d\'Administration', 'Responsable des Communications', 'Bénévole', 'Membre Actif', 'Membre Bienfaiteur', 'Responsable des Événements', 'Coordinateur des Bénévoles', 'Responsable des Partenariats']
    }
  }]
});

const Association = mongoose.model('Association', AssociationSchema);

export default Association;
