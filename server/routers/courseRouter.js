import express from 'express';
import mongoose from 'mongoose';
import CourseModel from '../models/courseModel.js';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';



const router = express.Router();

//  kullanıcıların kursa kayıt olmasını sağlar
router.post('/register', async (req, res) => {
    try {
        const courseId = req.body.courseId; // Kursun kimliği
        const userId = req.body.userId; // Kullanıcının kimliği

        // Kullanıcı ve kursu veritabanından alın
        const user = await UserModel.findById(userId);
        const course = await CourseModel.findById(courseId);

        // Kullanıcı ve kurs mevcutsa, kullanıcıyı kursa kaydet
        if (user && course) {
            // Eğer kullanıcı zaten kayıtlı değilse, kursa kayıt işlemini gerçekleştir
            if (!course.participants.includes(userId)) {
                course.participants.push(userId);
                await course.save();
                return res.status(200).json({ message: "Kursa başarıyla kayıt oldunuz" });
            } else {
                return res.status(400).json({ message: "Zaten bu kursa kayıtlısınız" });
            }
        } else {
            return res.status(404).json({ message: "Kullanıcı veya kurs bulunamadı" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Kursa kayıt olunamadı", error });
    }
});


//Bütün Kurslar
router.get('/courses', async (req, res) => {

    try {
        const courses = await CourseModel.find();
        return res.status(200).json(courses);
    }
    catch (error) {

        return res.status(500).json({ message: error.message })

    }

});
//branşa göre kurslar

router.get('/courses/:branche', async (req, res) => {
    try {
        const branche = req.params.branche;
        const courses = await CourseModel.find({ branche });

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;

