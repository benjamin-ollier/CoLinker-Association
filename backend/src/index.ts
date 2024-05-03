import express from 'express';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import routes from './routes/routes';
import cors from 'cors';
import * as admin from 'firebase-admin';
dotenv.config();


const app = express();
const PORT: string | number = process.env.BackendPORT || 8000;

const serviceAccount = require('../pa-esgi-firebase-adminsdk-rxfgl-d294953297.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nodejs-cinema.appspot.com'
});
connectDB();

app.use(cors());
app.use(express.json());



app.use('/', routes);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
}));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
