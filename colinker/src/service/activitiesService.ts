import api from './axios';

const getActivitiesByAssociationId = async (associationId) => {
  try {
    const response = await api.get(`/activities/byAssociation/${associationId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    throw new Error("Failed to fetch activities");
  }
};

const createActivity = async (associationId, activityData) => {
  try {
    const response = await api.post(`/activities/${associationId}`, activityData);
    return response.data;
  } catch (error) {
    console.error("Failed to create activity:", error);
    throw new Error("Failed to create activity");
  }
};

const getActivityById = async (id) => {
  try {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    throw new Error("Failed to fetch activity");
  }
};

const updateActivity = async (id, activityData) => {
  try {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  } catch (error) {
    console.error("Failed to update activity:", error);
    throw new Error("Failed to update activity");
  }
};

const deleteActivity = async (id) => {
  try {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete activity:", error);
    throw new Error("Failed to delete activity");
  }
};

export { getActivitiesByAssociationId, createActivity, getActivityById, updateActivity, deleteActivity };
