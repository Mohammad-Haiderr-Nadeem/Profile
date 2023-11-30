
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Image file is required' });
        }
        req.image = req.file.filename; 
        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = { uploadFile };