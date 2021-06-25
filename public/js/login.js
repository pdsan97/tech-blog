const errorParagraph = document.querySelector('.error');

const handleSubmit = async ev => {
	ev.preventDefault();
	const [username, password] = ev.target.elements;
	if (username.value.length > 0 && password.value.length > 0) {
		const data = {
			username: username.value,
			password: password.value,
		};
		try {
			const response = await axios.post('/api/login', data, {
				withCredentials: true,
			});
			const location = response.request.responseURL;
			window.location.href = location;
		} catch (err) {
			if (err.response) {
				errorParagraph.textContent = err.response.data.error;
			}
		}
	} else {
		errorParagraph.textContent = 'Username or password too short';
	}
};
const form = document.getElementById('login');
form.addEventListener('submit', handleSubmit);
