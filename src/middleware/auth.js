const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try {
        // lấy token từ quền ng dùng
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token)
            // xác thực mã token
        const decore = jwt.verify(token, process.env.JWT_SECRET);
        // dùng token tìm người dùng
        const user = await User.findOne({ _id: decore._id, 'tokens.token': token })
        if (!user)
            throw new Error();

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(404).send('Please Authoriation');
    }

}

module.exports = auth;