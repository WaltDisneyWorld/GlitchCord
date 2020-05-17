const express     = require("express");
const User        = require("../models/user");

const router      = express.Router();

router.get("/", (req, res)=>{
    res.cookie('', 'john doe', { maxAge: 900000, httpOnly: true });
    if(req.user){
        User.findById(req.user._id).then(()=>res.redirect("/users/@me"))
        .catch((e)=>{
            console.log(e);
            return res.redirect("/users/login");
        });
    }else{
        res.redirect("/users/login");
    }
});


module.exports = router;
