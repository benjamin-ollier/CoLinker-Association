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

const putDashboardAssociation = async (data) => {
  try {
    const response = await api.put(`/association/dashboard`, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw new Error("put association failed");
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
      return response;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

const removeUser = async (associationId,username) => {
  try {
    const response = await api.delete(`/association/removeMember/${associationId}/${username}`);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw new Error("delete user association failed");
  }
};

const editUserInAssociation = async (associationId, userId, updates) => {
  try {
    const response = await api.patch(`/association/editMember/${associationId}/${userId}`, updates);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to edit user in association");
  }
};






export { postAssociation, putDashboardAssociation, getUserCreatorAssociation, getUserAssociation, getMembersNotInAssociation,getAssociationMembers, addUserToAssociation, removeUser, editUserInAssociation };
