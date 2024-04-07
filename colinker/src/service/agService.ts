import api from './axios';

interface AGCreateData {
  status: boolean;
  _id: string;
  titre: string;
  description: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  estFermee: boolean;
  ordreDuJour: string[];
  lieu: string;
  membres: string[];
  votes: {
    membre: string;
    choix: string;
    _id: string;
  }[];
  documents: {
    titre: string;
    url: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const getAllAG = async () => {
  try {
    const response = await api.get('/ag');
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch AGs");
  }
};

const getAGById = async (id: string) => {
  try {
    const response = await api.get(`/ag/getById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch AG");
  }
};

const createAG = async (agData: AGCreateData) => {
  try {
    const response = await api.post('/ag', agData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create AG");
  }
};

export { getAllAG, getAGById, createAG };
