import api from './axios';

interface AGCreateData {
  status: boolean;
  _id: string;
  pseudo: string;
  firstName: string;
  lastName: string;
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

const updateAG = async (agData: AGCreateData, id:string) => {
  try {
    const response = await api.put(`ag/update/${id}`,agData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update AG");
  }
};

const getUserInfo = async (username: string) => {
  try {
    const response = await api.get(`/user/getByUsername/${username}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
};

const getUserNotifications = async (username: string) => {
  try {
    const response = await api.get(`/user/notifications/${username}`);
    if (response.data) {
      return response.data.notifications;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
}

const followAssociation = async (username: string, associationId: string) => {
  try {
    const response = await api.put(`/user/follow/${username}/${associationId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
}

const checkFollowing = async (username: string, associationId: string) => {
  try {
    const response = await api.get(`/user/isfollow/${username}/${associationId}`);
    if (response.data) {
      return response.data.isFollow;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
}

export { getAllAG, getAGById, createAG, updateAG, getUserInfo, getUserNotifications, followAssociation, checkFollowing };
