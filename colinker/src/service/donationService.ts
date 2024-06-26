import api from './axios';

export const createDonation = async (amount: number, type: string) => {
  try {
    const data  = await api.post('/donation', { amount, type });
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getDonations = async (type) => {
  try {
      const response = await api.get(`/donation/${type}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
  }
};