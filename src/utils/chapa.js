import axios from 'axios';
import { chapaSecretKey, chapaBaseUrl } from '../config/environments';

export const getListOfBanks = async () => {
  try {
    const response = await axios.get(`${chapaBaseUrl}/banks`, {
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const transferToBank = async (data) => {
  try {
    const response = await axios.post(`${chapaBaseUrl}/transfer`, data, {
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
