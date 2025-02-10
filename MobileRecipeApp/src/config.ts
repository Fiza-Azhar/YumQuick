// src/config.ts
//const BASE_URL = 'http://192.168.16.123:5000';
const BASE_URL2 = 'http://192.168.16.112:3000';
const BASE_URL = 'https://1fe9-182-191-78-8.ngrok-free.app';

const config = {
  auth: {
    signUp: `${BASE_URL}/auth/signup`,
    verify: `${BASE_URL}/auth/verify`,
    login: `${BASE_URL}/auth/login`,    

  },
  upload: `${BASE_URL}/upload`,
  recipes: `${BASE_URL}`,
  wallet: `${BASE_URL2}`,
};

export default config;
