import api from './axios';

const getVotesByAssociationId = async (associationId) => {
  try {
    const response = await api.get(`/vote/byAssociation/${associationId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch vote");
  }
};

const createVote = async (associationId, voteData) => {
  try {
    const response = await api.post(`/vote/${associationId}`, voteData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create vote");
  }
};

const getVoteById = async (id) => {
  try {
    const response = await api.get(`/vote/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch vote details");
  }
};

const updateVote = async (id, voteData) => {
  try {
    const response = await api.put(`/vote/${id}`, voteData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update vote");
  }
};

export { getVotesByAssociationId, createVote, getVoteById, updateVote };
