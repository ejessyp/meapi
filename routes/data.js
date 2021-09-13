const express = require('express');
const router = express.Router();

const data = require("../models/data.js");
const auth = require("../models/auth.js");

router.get('/:filename',
    //(req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.getOne(res, req)
);

router.get('/',
    //(req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.getAll(res, req)
);



// router.get("/:filename", async (req, res) => {
//     let filename = req.params.filename;
//     const result = await data.getOne(filename);
//     res.json(result);
// });
router.post('/',
    // (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.createData(res, req)
);

router.put('/',
    // (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.updateData(res, req)
);

router.delete('/',
    // (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.deleteData(res, req)
);

module.exports = router;
