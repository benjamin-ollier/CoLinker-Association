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

export const getVote = async (voteId: string) => {
  const response = await api.get(`/vote/${voteId}`);
  return response.data;
};

export const getAllVote = async () => {
  const response = await api.get(`/vote`);
  return response.data;
};

export const submitVote = async (voteId: string, optionId: string) => {
  const response = await api.post(`/vote/submitVote/${voteId}`, { optionId });
  return response.data;
};

export { getVotesByAssociationId, createVote, getVoteById, updateVote };
