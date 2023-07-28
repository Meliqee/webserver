import express from 'express';
import mongoose from 'mongoose';
import AdminModel from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import CourseModel from '../models/courseModel.js';
import UserModel from '../models/userModel.js';
import ActivityModel from '../models/activityModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authMiddleware from '../middlewares/middlewares.js';

const router = express.Router();
dotenv.config();

router.post('/signup', async (req, res) => {
    try {

        const { fullName, password, phoneNumber, email } = req.body;
        const adminExist = await AdminModel.findOne({ email })
        if (adminExist)
            return res.status(400).json({ message: 'admin already exist' })

        const hashedPassword = await bcrypt.hash(password, 15)

        const createdUser = await AdminModel.create({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            usertype: "ADMIN"
        })
        return res.status(201).json(createdUser);

    }
    catch (error) {
        console.log(error)
        return res.json({ message: 'admin oluşturulamadı' })
    }
});
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "admin bulunamadı" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Hatalı şifre" });
        }

        // Kullanıcının kimlik doğrulaması başarılı olduğunda JWT oluştur
        const accessToken = jwt.sign(
            { userId: admin._id, email: admin.email },
            process.env.SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            admin,
            accessToken, // Oluşturulan JWT'yi dön
            message: "Kimlik doğrulama başarılı"
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


//kurs ekleme

router.post('/addcourse',  async (req, res) => {
    try {

        const { title, branche, description, image, date, hour } = req.body;

        const createCourse = await CourseModel.create({
            title,
            branche,
            description,
            image,
            date,
            hour
        })
        return res.status(201).json(createCourse);

    }
    catch (error) {

        console.log(error);
        return res.status(500).json({ message: 'Kurs oluşturulamadı' });

    }

});


// Kurs güncelleme
router.put('/updatecourse/:id',  async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, branche, description, image, date, hour } = req.body;

        // Güncelleme işlemini burada gerçekleştirin
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {
            title,
            branche,
            description,
            image,
            date,
            hour
        }, { new: true });

        return res.status(200).json(updatedCourse);
    } catch (error) {
        return res.status(500).json({ message: 'Kurs güncellenemedi', error });
    }
});

//kurs silme
router.delete('/deletecourse/:id',  async (req, res) => {
    try {
        const courseId = req.params.id;

        // Silme işlemini burada gerçekleştirin
        await CourseModel.findByIdAndDelete(courseId);

        return res.status(200).json({ message: 'Kurs silindi' });
    } catch (error) {
        return res.status(500).json({ message: 'Kurs silinemedi', error });
    }
});

// Kursa kayıt olan kullanıcıları görme
router.get('/course/participants/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await CourseModel.findById(courseId).populate('participants');

        if (course) {
            return res.status(200).json({ participants: course.participants });
        } else {
            return res.status(404).json({ message: "Kurs bulunamadı" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Kullanıcılar getirilemedi", error });
    }
});

//KULLANICILARIN HEPSİ
router.get('/users',authMiddleware, async (req, res) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// BELİRLİ İD YE GÖRE KULLANICILAR 

router.get('/users/:id',  async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//KULLANICI GÜNCELLEME İSİM VE TELEFON
router.patch('/updateuser/:id',  async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullName, phoneNumber } = req.body;

        // Güncellenecek kullanıcıyı bulun
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Kullanıcının alanlarını güncelle
        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        // Güncellenmiş kullanıcıyı kaydet
        const updatedUser = await user.save();

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteuser/:id',  async (req, res) => {


    try {
        const userId = req.params.id;
        // Silme işlemini burada gerçekleştirin
        await UserModel.findByIdAndDelete(userId);

        return res.status(200).json({ message: 'Kurs silindi' });

    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'kullanıcı silinemedi' })
    }

});

//ETKİNLİKLER İÇİN ALANLAR
//etkinlik ekleme

router.post('/addactivity',  async (req, res) => {
    try {

        const { title, description, image, date } = req.body;

        const createActivity = await ActivityModel.create({
            title, 
            description,
            image,
            date,
            
        })
        return res.status(201).json(createActivity);

    }
    catch (error) {

        console.log(error);
        return res.status(500).json({ message: 'Etkinlik eklenemedi' });

    }

});

//Bütün Etkinlikler
router.get('/activites',  async (req, res) => {

    try {
        const activities = await ActivityModel.find();
        return res.status(200).json(activities);
    }
    catch (error) {

        return res.status(500).json({ message: error.message })

    }

});

// Etkinlik güncelleme
router.put('/updateactivity/:id',  async (req, res) => {
    try {
        const activityId = req.params.id;
        const { title,  description, image, date} = req.body;

        // Güncelleme işlemini burada gerçekleştirin
        const updatedActivity = await ActivityModel.findByIdAndUpdate(activityId, {
            title,
            description,
            image,
            date,
        }, { new: true });

        return res.status(200).json(updatedActivity);
    } catch (error) {
        return res.status(500).json({ message: 'Etkinlik güncellenemedi', error });
    }
});
//Etkinlik silme
router.delete('/deleteactivity/:id',  async (req, res) => {
    try {
        const activityId = req.params.id;

        // Silme işlemini burada gerçekleştirin
        await ActivityModel.findByIdAndDelete(activityId);

        return res.status(200).json({ message: 'Etkinlik silindi' });
    } catch (error) {
        return res.status(500).json({ message: 'Etkinlik silinemedi', error });
    }
});






export default router;

