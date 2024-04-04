const express = require('express');
const { register, login } = require('../app/controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.use('/user', userRoutes);

module.exports = router;