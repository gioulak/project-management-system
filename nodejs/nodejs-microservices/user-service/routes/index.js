const express = require("express");
//Creating a router
const router = express.Router();
//configuting routes
router.get("/", function(_req, res) {
     res.send("Hello!");
});
module.exports = router;