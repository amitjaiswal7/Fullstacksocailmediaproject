const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/usermodel');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, message: 'Signup successful', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/singin', async (req,res) =>{

try {
  const {email , password} = req.body;
  const user = await User.findOne({email});
  if(!user) res.status(500).json({success:false,message:"Invalid Email Or Password cheak it"});
     
  const  isMatch =  await bcrypt.compare(password , user.password);
  if(!isMatch) res.status(500).json({success:false,message:'Invalid  mail or paasword '})

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.json({success:true,message:'Login SuccseFully',token,user});
} catch (error) {
  res.status(500).json({ success: false, message: err.message });
}


})


module.exports = router;