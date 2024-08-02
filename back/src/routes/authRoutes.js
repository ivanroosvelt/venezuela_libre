const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               referredBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Validation error
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Por favor, ingrese un mail válido.'),
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Contraseña debe tener 4 números.'),
    body('password')
      .matches(/^\d+$/)
      .withMessage('Contraseña debe tener 4 números.'),
    body('referredBy')
      .optional()
      .isString()
      .withMessage('Debe ser un código de referido.')
  ],
  authController.register
);

/**
 * @swagger
 * /auth/confirm-email:
 *   post:
 *     summary: Confirm email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       404:
 *         description: User not found
 */
router.get('/confirm-email', authController.confirmEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: User not found or wrong password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/resend-confirmation:
 *   post:
 *     summary: Resend confirmation email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Confirmation email resent successfully
 *       404:
 *         description: User not found
 */
router.post(
  '/resend-confirmation',
  [body('email').isEmail().withMessage('Please enter a valid email.')],
  authController.resendConfirmationCode
);

/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 */
router.post(
  '/request-password-reset',
  [body('email').isEmail().withMessage('Please enter a valid email.')],
  authController.requestPasswordReset
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *       400:
 *         description: Invalid token or user not found
 */
router.post(
  '/reset-password',
  [
    body('token').not().isEmpty().withMessage('Token is required.'),
    body('newPassword')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.')
  ],
  authController.resetPassword
);

module.exports = router;
