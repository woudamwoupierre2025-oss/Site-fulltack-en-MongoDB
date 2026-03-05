const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const path = require('path');


module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/jpeg" && req.file.detectedMimeType != "image/png" &&
            req.file.detectedMimeType != "image/gif" && req.file.detectedMimeType != "image/webp")
            throw Error("invalid file");
        if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
        return res.status(201).json({ err });
    }

    const fileName = req.body.name + path.extname(req.file.originalname);
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );
};