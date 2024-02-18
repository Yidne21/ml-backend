import axios from 'axios';
import { chapaSecretKey, chapaBaseUrl } from '../config/environments';

export const initializePayment = async (data) => {
  try {
    const response = await axios.post(
      `${chapaBaseUrl}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyPayment = async (txRef) => {
  try {
    const response = await axios.get(
      `${chapaBaseUrl}/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

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
    const response = await axios.post(`${chapaBaseUrl}/transfers`, data, {
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyTransfer = async (txRef) => {
  try {
    const response = await axios.get(
      `${chapaBaseUrl}/transfers/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
