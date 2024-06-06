import axios from 'axios';
import qs from 'qs';
import api from './axios';

const clientID = 'ARPqW928ZAbruMwiI7UTy9granfNLRbao8Hdsmg2ZIDtn0W2VZHEO8tcrQQRhCwqRbOPIAuHImpp8lGw';
const clientSecret = 'ARPqW928ZAbruMwiI7UTy9granfNLRbao8Hdsmg2ZIDtn0W2VZHEO8tcrQQRhCwqRbOPIAuHImpp8lGw';
const TOKEN_ENDPOINT = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

// const getPayPalToken = async () => {
//     try {
//         const response = await axios({
//             method: 'post',
//             url: TOKEN_ENDPOINT,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             auth: {
//                 username: clientID,
//                 password: clientSecret
//             },
//             data: ({
//                 grant_type: 'client_credentials'
//             })
//         });

//         console.log("Token d'accès PayPal:", response.data.access_token);
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Erreur lors de l\'obtention du token PayPal:');
//         throw error;
//     }
// };


const getClientTransactions = async () => {
    try {
        const response = await api.get(`/donation/paypal/transactions`);
        if (response) {
        return response.data;
        }
    } catch (error) {
        throw new Error("Registration failed");
    }
};

export { getClientTransactions };
