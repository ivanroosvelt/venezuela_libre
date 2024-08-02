const { nanoid } = require('nanoid');
const User = require('../models/User');
const Reference = require('../models/Reference');

exports.createReference = async (req, res, next) => {
  const userId = req.userId; // assuming userId is added to req by auth middleware
  const code = nanoid(10);

  try {
    const reference = await Reference.create({
      code,
      userId
    });

    res.status(201).json({ message: 'Reference created!', code: reference.code });
  } catch (error) {
    next(error);
  }
};

exports.listReferences = async (req, res, next) => {
  const userId = req.userId; // assuming userId is added to req by auth middleware

  try {
    const references = await Reference.findAll({
      where: { userId },
      include: [{ model: User, as: 'usedByUser', attributes: ['username'] }]
    });

    res.status(200).json(references);
  } catch (error) {
    next(error);
  }
};

exports.deleteReference = async (req, res, next) => {
  const { referenceId } = req.params;

  try {
    await Reference.destroy({ where: { id: referenceId } });

    res.status(200).json({ message: 'Reference deleted!' });
  } catch (error) {
    next(error);
  }
};

exports.useReference = async (req, res, next) => {
  const { code, username, email, password } = req.body;

  try {
    const reference = await Reference.findOne({ where: { code, used: false } });
    if (!reference) {
      return res.status(400).json({ message: 'Invalid or already used reference code.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      referredBy: reference.userId
    });

    reference.used = true;
    reference.usedBy = user.id;
    await reference.save();

    res.status(201).json({ message: 'User registered!', userId: user.id });
  } catch (error) {
    next(error);
  }
};
