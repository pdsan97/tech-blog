const { User } = require('../database/database');

const findUser = async username => {
	const response = await User.findOne({ where: { username } });

	if (response) {
		return response.dataValues;
	}
	return null;
};

module.exports = {
	findUser,
};
