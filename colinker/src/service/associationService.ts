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

const createDashboardAssociation = async (data) => {
  try {
    const response = await api.put(`/association/dashboard`, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw new Error("put association failed");
  }
};

const getUserAdminAssociation = async (username) => {
  try {
    const response = await api.get(`/association/getUserAdminAssociation/${username}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

const getAssociationFiles = async (associationId) => {
  try {
    const response = await api.get(`/association/files/list/${associationId}`);
    if (response.data) {
      const files = response.data.filter(obj => obj !== associationId + "/");
      return files.map((file: string) => file.replace(`${associationId}/`, ''));
    }
  } catch (error) {
    throw new Error("get association files failed");
  }
}

const downloadAssociationFile = (associationId, filename) => {
  try {
    const downloadUrl = api.getUri() + `association/files/download/${associationId}/${filename}`;
    window.location.href = downloadUrl;
  } catch (error) {
    throw new Error("download association file failed")
  }
}

const deleteAssociationFile = async (associationId, filename) => {
  try {
    const response = await api.delete(`/association/files/delete/${associationId}/${filename}`);
    return response.data;
  } catch (error) {
    throw new Error("delete association file failed")
  }
}

const uploadAssociationImage = async (associationId, formData) => {
  try {
    const url = `/association/files/upload/images/${associationId}`
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.status;
  } catch (error) {
    console.error("upload association file failed");
  }
}

const uploadAssociationFile = async (associationId, formData, folderName?: string) => {
  try {
    const url = folderName ? `/association/files/upload/${associationId}/${folderName}` : `/association/files/upload/${associationId}`
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.status;
  } catch (error) {
    console.error("upload association file failed");
  }
}

const createAssociationDirectory = async (associationId, folderName) => {
  try {
    const response = await api.post(`/association/files/makedir/${associationId}/${folderName}`);
    return response.status;
  } catch (error) {
    console.error("make dir failed");
  }
}

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
    console.log(data);
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


const getAllAsoociation = async () => {
  try {
    const response = await api.get(`/association/allAssociations`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

const getFollowedAssociations = async (username: string) => {
  try {
    const response = await api.get(`association/followed/${username}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("get followed associations failed");
  }
}

const getAssociationWithName = async (name) => {
  try {
    const response = await api.get(`/association/getAsoociationWithName/${name}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

export const getAssociationWithId = async (id) => {
  try {
    const response = await api.get(`/association/getAssociationWithId/${id}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("post association failed");
  }
};

export const getAssociationImage = async (id) => {
  try {
    const response = await api.get(`/association/getAssociationImage/${id}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("get association image failed");
  }
}

export const getUserRole = async (associationId,userId) => {
  try {
    const response = await api.get(`/association/getUserRole/${associationId}/${userId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("get association image failed");
  }
}




export { getAssociationWithName, getAllAsoociation, postAssociation, createDashboardAssociation, getUserAdminAssociation, getUserAssociation, getMembersNotInAssociation,getAssociationMembers, addUserToAssociation, removeUser, editUserInAssociation, getAssociationFiles, deleteAssociationFile, downloadAssociationFile, uploadAssociationFile, uploadAssociationImage, createAssociationDirectory, getFollowedAssociations };
