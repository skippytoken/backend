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
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { authenticate } = require('../middleware/authenticate');

const SMTPClient = email.SMTPClient;

const transporter = nodemailer.createTransport(smtpTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}));


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

        const { firstName, lastName, email, password, role } = req.body;

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
                password,
                role
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

                    const mailOptions = {
                        from: process.env.EMAIL_AUTH_USER,
                        // to: user.email,
                        to: "hemal.hansda25@gmail.com",
                        subject: 'Skippy email verification',
                        html: `
                            <html>
                                <body>
                                    <p>You are receiving this because you have registered in Skippy.
                                    Please click on the following link, or paste this into your browser to complete the process.</p>
                                    <br/>
                                    <a href="${process.env.SKIPPY_API_URL}/user/verify/${user._id}">
                                        ${process.env.SKIPPY_API_URL}/user/verify/${user._id}
                                    </a>
                                </body>
                            </html>
                        `,
                    };
            
                    transporter.sendMail(mailOptions, err => {
                        console.log(err)
                    });
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

    if (!req.query.email) {
        res.status(400).send({err: 'Please provide email ID'});
    }

    const user = await User.findOne({email: req.query.email});

    if (!user) {
        res.status(400).send({err: 'No account found with that email.'});
        return;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_AUTH_USER,
            to: req.query.email,
            subject: 'Password Reset',
            html: 'Your new password is: abce123',
        };

        transporter.sendMail(mailOptions, err => {
            console.log(err)
        });

        res.status(200).send("mail sent successfully")

    } catch (e) {

        console.error(e);
        res.status(400).send(e)
    }
})

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
            let user = await User.findOne({ firstName: username, role: 'admin' });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'You might not have permission for admin!' }] });
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

            const token = await user.generateAuthToken();
            const result = {
                userData: user,
                token,
            };
            
            res.json(result).status(200);
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
                    .json({ errors: { msg: 'User not found!' }, status: 'NOT_FOUND' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: { msg: 'Password is wrong!' } });
            }

            if (!user.verified) {
                return res
                    .status(400)
                    .json({ errors: { msg: 'User is not verified!' }, status: 'NOT_VERIFIED' });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            const token = await user.generateAuthToken();
            const result = {
                userData: user,
                token,
            };
            
            res.json(result).status(200);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

router.post('/logout', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        return res.json({success: true}).status(200);
    } catch (err) {
        return res.json(err).status(401);
    }
})

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

router.get('/verify/:id', async (req, res) => {
    try {
        const userId = req.params.id || '';

        const user = await User.findOne({_id: userId});

        if (!user) {
            res.set('Content-Type', 'text/html');
            res.status(200).send(Buffer.from(`
                <html>
                    <body>
                    </body>
                    <script type="text/javascript">
                        (
                            function () {
                                alert('Invalid ID!');
                                window.location.href = '${process.env.SKIPPY_URL}';
                            }
                        )()
                    </script>
                </html>
            `));
            return;
        }

        await User.updateOne({_id: userId}, { $set: { verified: true } });

        res.set('Content-Type', 'text/html');
        res.status(200).send(Buffer.from(`
            <html>
                <body>
                </body>
                <script type="text/javascript">
                    (
                        function () {
                            window.location.href = '${process.env.SKIPPY_URL}/login';
                        }
                    )()
                </script>
            </html>
        `));
    } catch (err) {
        res.set('Content-Type', 'text/html');
        res.status(200).send(Buffer.from(`
            <html>
                <body>
                </body>
                <script type="text/javascript">
                    (
                        function () {
                            alert('Page not exist!');
                            window.location.href = '${process.env.SKIPPY_URL}';
                        }
                    )()
                </script>
            </html>
        `));
    }
})



module.exports = router;