const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const email = require("emailjs")
const User = require('../models/User');
const Mailgun = require('mailgun-js');

const SMTPClient = email.SMTPClient



// For getting all records from Collection
router.get('/getallusers', async (req, res) => {
    try {
        const profiles = await User.find()
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})




// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
    '/register',
    check('firstName', 'Name is required').notEmpty(),
    check('lastName', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }

            const avatar = normalize(
                gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                }),
                { forceHttps: true }
            );

            user = new User({
                firstName,
                lastName,
                email,
                avatar,
                password
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



// @route    GET api/emailAuth
// @desc     email validation
// @access   Public
router.get('/auth/email', async (req, res) => {

    const client = new SMTPClient({
        user: 'postmaster@sunrisetechs.com',
        password: '3kh9umujora5',
        host: 'smtp.mailgun.org',
        ssl: true,
    });


    try {

        const message = await client.sendAsync({
            text: 'i hope this works',
            from: '<kamaleshsaravanan99@gmail.com>',
            to: '<joieeemithun98@gmail.com>',
            // cc: 'else <else@your-email.com>',
            subject: 'testing emailjs',
        });
        console.log(message);

        res.status(200).send("mail sent successfully")

    } catch (e) {

        console.error(e);
        res.status(400).send(e)
    }
})




// router.get('/auth/email', async (req, res) => {

//     try {

//         var api_key = 'e36e683fd083a4dee95e7192b16f6516-dbdfb8ff-75e69bd3';

//         var domain = 'dev@skippytoken.io';


//         var mailgun = new Mailgun({ apiKey: api_key, domain: domain, host: "api.eu.mailgun.net", });

//         var from_who = 'kamaleshsaravanan99@gmail.com';



//         //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
//         var data = {
//             //Specify email data
//             from: from_who,
//             //The email to contact
//             to: 'joieeemithun98@gmail.com',
//             //Subject and text data  
//             subject: 'Hello from Mailgun',
//             html: '<h1>Hello</h1>'
//         }
//         //Invokes the method to send emails given the above data with the helper library
//         mailgun.messages().send(data, function (err, body) {
//             //If there is an error, render the error pages
//             if (err) {
//                 res.status(400).send({ error: err });
//                 console.log("got an error: ", err);
//             }
//             //Else we can greet    and leave
//             else {
//                 //Here "submitted.jade" is the view file for this landing page 
//                 //We pass the variable "email" from the url parameter in an object rendered by Jade
//                 res.status(200).send('Mail sent to the respective person');
//                 console.log(body);
//             }
//         });
//     } catch (e) {

//         console.log(e)
//         res.status(500).send("Internal Server errors")


//     }


// })



// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/auth', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post(
    '/auth/admin/login',
    check('username', 'Please include a valid email').exists(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors.array())
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ firstName: username });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/auth/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



router.post('/search', async (req, res) => {
    try {

        console.log(req.body)
        const user = await User.find({ firstName: new RegExp('.*' + req.body.value + '.*') })
        res.json(user);

    } catch (e) {
        console.log(e)
        res.status(500).send("internal server error")
    }
})



module.exports = router;