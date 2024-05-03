import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

message.config({
  top: 70,
  duration: 2,
  maxCount: 3,
});

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method;
    if (method && method !== 'get') {
      if(method == 'post'){
        const messageText = `Les modifications ont bien été apportés`;
        message.success(messageText);
      }
      if(method == 'delete'){
        const messageText = `Les éléments ont bien été supprimé`;
        message.success(messageText);
      }
    }
    return response;
  },
  (error) => {
    if (error.config && error.config.method !== 'get') {
      let messageText = 'Erreur dans la requête.';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            messageText = 'La requête a échoué : Données invalides.';
            break;
          case 401:
            messageText = 'La requête a échoué : Non autorisé.';
            break;
          case 403:
            messageText = 'La requête a échoué : Accès refusé.';
            break;
          case 404:
            messageText = 'La requête a échoué : Ressource non trouvée.';
            break;
          case 500:
            messageText = 'La requête a échoué : Erreur interne du serveur.';
            break;
          default:
            messageText = `La requête a échoué : Erreur ${error.response.status}.`;
        }
      }
      message.error(messageText);
    }
    return Promise.reject(error);
  }
);

export default api;
