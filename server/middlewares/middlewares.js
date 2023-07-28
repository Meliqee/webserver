import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AdminModel from '../models/adminModel.js';

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Erişim reddedildi. Token yok.' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.log(err); // Hatanın detaylarını yazdır
            return res.status(403).json({ message: 'Geçersiz token.' });
        }

        req.admin = decoded;

        const usertype = decoded.usertype;
        console.log(usertype);
        console.log(decoded); // Burada decoded değişkenini kullanın
        // Kullanıcı "ADMIN" ise, işlem yapmasına izin ver
        if (usertype === "ADMIN") {
            return next();
        }

        // Kullanıcı "ADMIN" değilse, izin verme ve hata yanıtı döndür
        return res.status(403).json({ message: 'Yetkisiz erişim. Sadece ADMIN kullanıcıları izinlidir.' });
    });
};


export default authMiddleware;
