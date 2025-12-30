 const db = require('../config/database');
 const express = require("express");
 const router = express.Router();
 const bcrypt = require('bcryptjs'); 
 const User = require("../models/userModel");
 const { protected } = require("../utils/protected");


 const { generateToken, verifyPasswordResetToken } = require("../utils/tokens");
 const { transporter, createPasswordResetUrl, passwordResetTemplate, passwordResetConfirmationTemplate } = require("../utils/email");


 //signup request
 router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        //validate
        if(!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({
                message: 'All fields are required',
                type: 'error'
            });
        }

        //check if user exists
        const existingUsername = await User.findByUsername(username);
        if(existingUsername)
            return res.status(400).json({
                message: "Usename already exists",
                type: 'error',
            });

        //check if email exists
        const existingEmail = await User.findByEmail(email);
        if(existingEmail)
            return res.status(400).json({
                message: "Email already exists",
                type: 'error',
            });

        //hash password
        const passwordHash = await bcrypt.hash(password, 10);
        //create user
        const userId = await User.create({
            username,
            email,
            password: passwordHash,
            first_name,
            last_name
        });

        //send the response
        res.status(200).json({
            message: "User created succesfully! Waiting for admin approval",
            type: "success",
            userId
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            type: "error",
            message: "Error creating user",
            error: error.message,
        });
    }
 });

 //sign in request
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

         console.log('🔍 Login attempt:', { username, password: password ? '***' : 'missing' });
        //if user doesnt exist, return error
        if(!username || !password)
            return res.status(400).json({
                message: 'User doesnt exist.',
                type: 'error',
            });
        
        //find user 
        const user = await User.findByUsername(username);
        
        if(!user)
            return res.status(401).json({
                message: 'Invalid credentials',
                type: 'error'
            });
        console.log('🔍 User active:', user.is_active);
        //check if activated
        if(!user.is_active) {
            return res.status(403).json({
                message: 'Account not activated yet. Please wait for admin approval',
                type: 'error'
            });
        }

        //if user exists, check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔍 Password match:', isMatch);

        //if is password is incorrect return error
        if(!isMatch)
            return res.status(401).json({
                message: 'Invalid credentials.',
                type: 'error',
            });
            
            console.log('🔍 Creating token with payload:', {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });

            console.log('🔍 user.id type:', typeof user.id, 'value:', user.id);
            console.log('🔍 Creating token with payload:', {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });

            //if password is correct, create the tokens
            const accessToken = generateToken({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });

            console.log('🔍 Token created:', accessToken);
            
            res.json({
                message: 'Sign in successful',
                type: 'success',
                accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                }
            });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            type: 'error',
            message: 'Error signing in',
            error: error.message,
        });
    }
});

//protected route
router.get('/profile', protected, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user)
        return res.status(404).json({
                message: 'User not found',
                type: 'error',
            });
        
        res.json({
            type: 'success',
            user
        });
    } catch (error) {
        res.status(500).json({
            type: 'error',
            message: 'Error getting profile',
            error: error.message,
        });
    }
});


router.post('/logout', (_req, res) => {
    return res.json({
        message: 'Logged out successully!',
        type: 'success',
    });
});

router.post('/send-password-reset-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if(!email) {
            return res.status(400).json({
                message: 'Email is rewuired',
                type: 'error',
            });
        }
    //find user by email
    const user = await User.findByEmail(email);
    if(!user) {
        res.json({
            message: 'If that email exists, a password reset link has been sent to that address',
            type: 'success'
        });
    }

    //create a password reset token
    const token = createPasswordResetToken({ 
        id: user.id,
        email: user.email
     });

    //create password reset url
    const url = createPasswordResetUrl(user.id, token);
    //send the email
    const mailOptions = passwordResetTemplate(user, url);
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Email send error: ', err);
            return res.status(500).json({
                message: 'Error sending email. Try agai',
                type: 'error',
            });
        }
        return res.json({
            message: 'Password reset link has been sent to your email!',
            type: 'success',
        });
    });
    } catch (error) {
        console.error('Password reset request error: ', error);
        res.status(500).json({
            type: 'error',
            message: 'Error processing passworf reset request',
            error: error.message
        });
    }
});

//reset password
router.post('/reset-password/:id/:token', async (req, res) => {
    try {
        //get the user details from the url
        const { id, token } = req.params;
        //get the new password the req body
        const { newPassword } = req.body;

        if(!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long',
                type: 'error',
            });
        }

        //verify token
        const decoded = verifyPasswordResetToken(token);
        if(!decoded || decoded.id !== parseInt(id)) {
            return res.status(400).json({
                message: 'Invalid or expired token',
                type: 'error',
            });
        }
        //find the user by id
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({
                message: 'User doesnt exist',
                type: 'error',
            });
        }
            //hash new password
            const hashed = await bcrypt.hash(newPassword, 10);

            //update password in database
            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
        
    
            const mailOptions = passwordResetConfirmationTemplate(user);
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Confirmation email error:', err);
                }
    
            });
            res.json({
                message: 'Password reset successful',
                type: 'success',
            });

        } catch (error) {
            console.error('Password reset error: ', error);
            res.status(500).json({
                type: 'error',
                message: 'Error resetting password',
                error: error.message,
            });
        }
});

// TEST ROUTE - Add this before module.exports
router.post('/test-token', async (req, res) => {
    const testPayload = {
        id: 999,
        username: "test",
        email: "test@test.com",
        role: "ADMIN"
    };
    
    console.log('🔍 Test payload:', testPayload);
    const token = generateToken(testPayload);
    console.log('🔍 Test token:', token);
    
    res.json({
        payload: testPayload,
        token: token
    });
});

module.exports = router;

