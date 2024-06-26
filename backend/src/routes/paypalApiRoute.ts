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
  //const startDate = '2024-06-01T00:00:00-0700';
  // const endDate = new Date().toISOString();
  // const startDate = new Date();
  // startDate.setMonth(startDate.getMonth() - 1);
  // const isoStartDate = startDate.toISOString();

  
  // const url = `https://api-m.sandbox.paypal.com/v1/reporting/transactions?start_date=${startDate}&end_date=${endDate}&fields=all`;
  //   try {
  //       const response = await axios.get(url, {
  //           headers: {
  //               'Authorization': `Bearer ${accessToken}`,
  //               'Content-Type': 'application/json'
  //           }
  //       });
  //       return res.json(response.data);
        
  //   } catch (error) {
  //       console.error('Error fetching transactions:');
  //   }


    let transactions = [];
    let currentDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    while (currentDate <= endDate) {
        let monthEnd = new Date(currentDate);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(monthEnd.getDate() - 1);
        if (monthEnd > endDate) {
            monthEnd = endDate;
        }

        try {
            const data = await fetchTransactions(accessToken, currentDate, monthEnd);
            if (data.transaction_details) {
                transactions.push(...data.transaction_details);
            } else {
                console.log(`No transactions available for period starting ${currentDate.toISOString()}`);
            }
        } catch (error) {
            console.error(`Error fetching transactions for period starting ${currentDate.toISOString()}:`, error);
            // Optionally, handle the error based on your application needs
        }

        currentDate = new Date(monthEnd);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json(transactions);
});

async function fetchTransactions(accessToken:string, start:Date, end:Date) {
  const url = `https://api-m.sandbox.paypal.com/v1/reporting/transactions?start_date=${start.toISOString()}&end_date=${end.toISOString()}&fields=all`;
  try {
      const response = await axios.get(url, {
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching transactions:');
      throw error;
  }
}






export default router;
