const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: 'mysql',

		pool: {
			max: 5,
			min: 0,
			idle: 10000,
		},
	}
);

const User = sequelize.define(
	'users',
	{
		username: {
			type: Sequelize.STRING,
			field: 'username',
		},
		password: {
			type: Sequelize.STRING,
			field: 'password',
		},
	},
	{
		timestamps: false,
	}
);

const BlogPost = sequelize.define(
	'blog_posts',
	{
		title: {
			type: Sequelize.STRING,
			field: 'title',
		},

		message: {
			type: Sequelize.STRING,
			field: 'message',
		},

		createdBy: {
			type: Sequelize.STRING,
			field: 'created_by',
		},
		createdAt: {
			type: Sequelize.STRING,
			field: 'created_at',
		},
	},
	{
		timestamps: false,
	}
);

const BlogPostComment = sequelize.define(
	'blog_comments',
	{
		message: {
			type: Sequelize.STRING,
			field: 'message',
		},
		createdBy: {
			type: Sequelize.STRING,
			field: 'created_by',
		},
		createdAt: {
			type: Sequelize.STRING,
			field: 'created_at',
		},
		postId: {
			type: Sequelize.INTEGER,
			field: 'post_id',
		},
	},
	{
		timestamps: false,
	}
);

module.exports = {
	User,
	BlogPost,
	BlogPostComment,
};
