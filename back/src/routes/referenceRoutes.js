const express = require('express');
const { body } = require('express-validator');
const referenceController = require('../controllers/referenceController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * /references/create:
 *   post:
 *     summary: Create a new reference code
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Reference created successfully
 */
router.post('/create', isAuth, referenceController.createReference);

/**
 * @swagger
 * /references:
 *   get:
 *     summary: List all references for the authenticated user
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: References listed successfully
 */
router.get('/', isAuth, referenceController.listReferences);

/**
 * @swagger
 * /references/{referenceId}:
 *   delete:
 *     summary: Delete a reference by ID
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referenceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reference deleted successfully
 */
router.delete('/:referenceId', isAuth, referenceController.deleteReference);

/**
 * @swagger
 * /references/use:
 *   post:
 *     summary: Use a reference code to register a new user
 *     tags: [References]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid or already used reference code
 */
router.post('/use', [
  body('code').not().isEmpty().withMessage('Code is required.'),
  body('username').not().isEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], referenceController.useReference);

module.exports = router;
