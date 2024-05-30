import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Association from '../entities/association';
import User from '../entities/user';
import axios from 'axios';
import qs from 'qs';

const router = express.Router();


const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = "ARPqW928ZAbruMwiI7UTy9granfNLRbao8Hdsmg2ZIDtn0W2VZHEO8tcrQQRhCwqRbOPIAuHImpp8lGw";
const CLIENT_SECRET = "EBNhi8ShfL3yIaISv2CFXHnzTx_OlnFkdoLkY852RLsocjQ2EtmV-NGo1mQWlqZAYsbLRwR6BWSyMrM5";

async function getPayPalToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  try {
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, qs.stringify({ grant_type: 'client_credentials' }), {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to retrieve PayPal token');
  }
}

router.get('/paypal/token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await getPayPalToken();
    res.json({ token });
  } catch (error) {
    next(error);
  }
});


router.get('/paypal/transactions', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = await getPayPalToken();
  const startDate = '2023-01-01T00:00:00Z';
  const endDate = new Date().toISOString();
  
  const url = `https://api-m.sandbox.paypal.com/v1/reporting/transactions?start_date=2024-05-01T00:00:00-0700&end_date=${endDate}&fields=all`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching transactions:');
        throw error;
    }
});





export default router;
