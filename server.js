require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const options = require('./utils/options');
const api = require('./routes/api');
const { BlogPost, BlogPostComment } = require('./database/database');
const sessionStore = new MySQLStore(options);
const USER_SESSION = 'user.session';
const IS_PROD = process.env.NODE_ENV === 'production';

const app = express()
	.set('trust proxy', 1)
	.use(
		cors({
			credentials: true,
		})
	)
	.use(express.json({ limit: 50000000 }))
	.use(
		session({
			secret: process.env.SESSION_SECRET || 'DASHBOARD',
			name: USER_SESSION,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				signed: true,
				maxAge: 1000 * 60 * 10,
				secure: IS_PROD ? true : false,
				sameSite: IS_PROD ? 'none' : 'lax',
			},
			store: sessionStore,
		})
	);

app.use(express.static(path.join(__dirname, 'public'), {}));
app.use('/api', api);
app.set('views', './public');
app.set('view engine', 'handlebars');
app.engine(
	'handlebars',
	exphbs({ layoutsDir: 'public', partialsDir: 'public' })
);

app.get('/login', (req, res) => {
	const isLoggedIn = req.session.user ? true : false;
	res.render('login', {
		isLoggedIn,
	});
});

app.get('/signup', (req, res) => {
	const isLoggedIn = req.session.user ? true : false;
	res.render('signup', {
		isLoggedIn,
	});
});

app.get('/dashboard', async (req, res) => {
	if (!req.session.user) {
		res.redirect('/login');
	} else {
		const user = req.session.user;
		const posts = await BlogPost.findAll({
			where: {
				createdBy: req.session.user,
			},
		});
		const realPosts = posts.map(curr => curr.dataValues);
		const isLoggedIn = req.session.user ? true : false;
		res.render('dashboard', {
			isLoggedIn,
			posts: realPosts.reverse(),
			hasPosts: realPosts.length > 0,
			user: user,
		});
	}
});

app.get('/', async (req, res) => {
	const isLoggedIn = req.session.user ? true : false;
	const BlogPosts = await Promise.all(
		(
			await BlogPost.findAll()
		)
			.map(curr => curr.dataValues)
			.map(async post => {
				const comments = (
					await BlogPostComment.findAll({
						where: {
							postId: post.id,
						},
					})
				).map(curr => curr.dataValues);
				return {
					...post,
					comments: comments,
				};
			})
	);
	res.render('homepage', {
		isLoggedIn: isLoggedIn,
		posts: BlogPosts.reverse(),
		hasPosts: BlogPosts.length > 0,
	});
});

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
