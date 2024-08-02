const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const config = require('../config/config');
const { sendRegistrationEmail } = require('../utils/mailer');

exports.register = async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password, referredBy } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const confirmationCode = jwt.sign({ email }, config.jwtSecret, {
      expiresIn: '1h'
    });

    const user = await User.create({
      email,
      password: hashedPassword,
      confirmationCode,
      referredBy
    });

    // Enviar correo de confirmación
    try {
      await sendRegistrationEmail(email, confirmationCode);
    } catch (error) {
      return next(error.response ? error.response : error.name);
    }

    return res.status(201).json({
      message:
        'User registered! Please check your email to confirm your account.'
    });
  } catch (error) {
    return next(
      error.errors
        ? error.errors.map((err) => err.message).join(', ')
        : error.name
    );
  }
};

exports.confirmEmail = async (req, res, next) => {
  const { code } = req.query;

  try {
    const decoded = jwt.verify(code, config.jwtSecret);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully!' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({ message: 'Wrong password.' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user.id.toString() },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user.id.toString() });
  } catch (error) {
    next(error);
  }
};

exports.resendConfirmationCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.isConfirmed) {
      return res.status(400).json({ message: 'User is already confirmed.' });
    }

    const confirmationCode = jwt.sign({ email }, config.jwtSecret, {
      expiresIn: '1h'
    });
    user.confirmationCode = confirmationCode;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Confirmation Email',
      html: `<h1>Email Confirmation</h1>
        <p>Please confirm your email by clicking on the following link:</p>
        <a href="${process.env.THIS_HOST}/auth/confirm-email?code=${confirmationCode}">Confirm Email</a>`
    });

    res.status(200).json({ message: 'Confirmation email resent!' });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = jwt.sign({ email }, config.jwtSecret, {
      expiresIn: '1h'
    });
    user.resetToken = resetToken;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<h1>Password Reset</h1>
             <p>Please reset your password by clicking on the following link:</p>
             <a href="${process.env.THIS_HOST}/auth/reset-password?token=${resetToken}">Reset Password</a>`
    });

    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({
      where: { email: decoded.email, resetToken: token }
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid token or user not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset.' });
  } catch (error) {
    next(error);
  }
};
