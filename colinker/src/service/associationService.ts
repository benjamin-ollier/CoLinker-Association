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

const getMembersNotInAssociation= async (associationid) => {
  try {
    const response = await api.get(`/association/membersNotInAssociation/${associationid}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
}

const getAssociationMembers = async (association) => {
  try {
    const response = await api.get(`/association/associationMembers/${association}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("get association members failed");
  }
}

const addUserToAssociation = async (data) => {
  try {
    const response = await api.post(`/association/addUserToAssociation`, data);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};






export { postAssociation, getUserCreatorAssociation, getUserAssociation, getMembersNotInAssociation,getAssociationMembers, addUserToAssociation };
