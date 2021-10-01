const express = require('express');
const auth = require("../models/auth.js");

const router = express.Router();

router.post('/login', (req, res) => auth.login(res, req.body));
router.post('/register', (req, res) => auth.register(res, req.body));

router.get('/', (req, res) => {
    auth.getAllusers(res, req.body);
});

module.exports = router;
