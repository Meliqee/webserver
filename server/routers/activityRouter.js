import express from 'express';
import mongoose from 'mongoose';
import ActivityModel from '../models/activityModel.js';
import bcrypt from 'bcryptjs';
const router=express.Router();

router.get('/activites', async (req, res) => {
    try {  
        const activities = await ActivityModel.find();
        return res.status(200).json(activities);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



export default router;

