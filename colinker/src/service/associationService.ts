import api from './axios';


const postAssociation = async (data) => {
  try {
    const response = await api.post(`/association`, data);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

const getUserCreatorAssociation = async (username) => {
  try {
    const response = await api.get(`/association/${username}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

const getUserAssociation = async (username) => {
  try {
    const response = await api.get(`/association/userAssociation/${username}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};





export { postAssociation, getUserCreatorAssociation, getUserAssociation };
