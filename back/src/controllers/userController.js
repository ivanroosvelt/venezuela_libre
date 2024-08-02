const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.userId }, attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { firstName, lastName, identification, referredBy } = req.body;
  try {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.identification = identification;
    user.referredBy = referredBy;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    next(error);
  }
};
