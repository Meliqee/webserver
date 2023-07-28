import express from 'express';
import mongoose from 'mongoose';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

//KAYIT İŞLEMİ
router.post('/signup', async (req, res) => {
    try {

        const { fullName, password, phoneNumber, email } = req.body;

        const userExist = await UserModel.findOne({ email })
        if (userExist)
            return res.status(400).json({ message: 'user already exist' })

        const hashedPassword = await bcrypt.hash(password, 15)

        const createdUser = await UserModel.create({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber
        })
        return res.status(201).json(createdUser);

    }
    catch (error) {
        console.log(error)
        return res.json({ message: 'kullanıcı oluşturulamadı' })

    }

});

//GİRİŞ İŞLEMİ
router.post('/signin', async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user)
            return res.status(400).json({ message: "kullanıcı yok" })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "wrong password" })

        return res.status(200).json({ user, message: "kimlik doğrulama başarılı" })

    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }

});



export default router;





