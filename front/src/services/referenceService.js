import axios from 'axios';

const API_URL = 'http://localhost:3000/references';

const createReference = () => {
  return axios.post(`${API_URL}/create`);
};

const listReferences = () => {
  return axios.get(API_URL);
};

const deleteReference = (referenceId) => {
  return axios.delete(`${API_URL}/${referenceId}`);
};

const useReference = (referenceData) => {
  return axios.post(`${API_URL}/use`, referenceData);
};

export { createReference, listReferences, deleteReference, useReference };
