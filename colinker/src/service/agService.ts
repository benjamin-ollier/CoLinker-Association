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

const createAG = async (agData: AGCreateData, selectedAssociationId: String) => {
  try {
    const response = await api.post(`/ag/${selectedAssociationId}`, agData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create AG");
  }
};

const updateAG = async (agData: AGCreateData, id:string) => {
  try {
    const response = await api.put(`ag/update/${id}`,agData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update AG");
  }
};
const getByAssociationID = async (id: string) => {
  try {
    const response = await api.get(`/ag/byAssociation/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch AG");
  }
};

export const deleteAg = async (agId: string) => {
  try {
    const response = await api.delete(`/ag/${agId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update vote");
  }
};

export { getAllAG, getAGById, createAG, updateAG,getByAssociationID };
