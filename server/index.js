import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import adminRouter from './routers/adminRouter.js';
import activityRouter from './routers/activityRouter.js';
import courseRouter from './routers/courseRouter.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/activity', activityRouter);
app.use('/course', courseRouter);



app.listen(5000, () => {
    mongoose.connect(process.env.DB_CONNECTION_STRING)
        .then(() => console.log('connected to database'))
        .catch((error) => console.log(error))
});












