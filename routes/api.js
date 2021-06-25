const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, BlogPost, BlogPostComment } = require('../database/database');
const { findUser } = require('../utils/queries');

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await findUser(username);
	if (!user) {
		res.status(400).send({ error: 'Username or password not found' });
	} else {
		try {
			if (await bcrypt.compare(password, user.password)) {
				const { username } = user;

				req.session.user = username;
				res.redirect('/');
			} else {
				res.status(400).send({
					error: 'Username or password not found',
				});
			}
		} catch (err) {
			res.sendStatus(500);
		}
	}
});

router.post('/signup', async (req, res) => {
	const { username, password } = req.body;
	if (username.length <= 4) {
		res.status(400).send({ error: 'Username is too short' });
	} else if (password.length <= 4) {
		res.status(400).send({ error: 'Password is too short' });
	}
	const user = await findUser(username);
	if (user) {
		res.status(409).send({ error: 'Account already registered' });
	} else {
		bcrypt.hash(password, 10, async (err, hash) => {
			if (err) {
				res.status(400).send({ error: 'Please try again Later' });
			} else {
				const user = {
					username,
					password: hash,
				};
				const databaseUser = User.build(user);
				await databaseUser.save();

				req.session.user = user.username;
				res.redirect('/');
			}
		});
	}
});

router.post('/post', async (req, res) => {
	const { title, message, createdAt } = req.body;
	const date = new Date(createdAt).toLocaleDateString();
	const post = {
		title,
		message,
		createdBy: req.session.user,
		createdAt: date,
	};
	const databaseBlogPost = BlogPost.build(post);
	await databaseBlogPost.save();
	res.sendStatus(200);
});

router.delete('/post/:id', async (req, res) => {
	const { id } = req.params;
	const post = await BlogPost.findOne({ where: { id } });
	BlogPostComment.destroy({ where: { postId: id } });
	post.destroy();
	res.sendStatus(200);
});

router.put('/post/:id', async (req, res) => {
	const { id } = req.params;
	const { title, message } = req.body;
	try {
		await BlogPost.update(
			{
				title,
				message,
			},
			{
				where: { id },
			}
		);
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

router.post('/post/comments', async (req, res) => {
	const { id, message } = req.body;
	const date = new Date().toLocaleDateString();
	const comment = {
		message,
		createdBy: req.session.user,
		createdAt: date,
		postId: id,
	};
	try {
		const databaseComment = BlogPostComment.build(comment);
		await databaseComment.save();
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

router.post('/logout', async (req, res) => {
	if (req.session.user) {
		req.session.user = null;
		res.redirect(201, '/login');
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
