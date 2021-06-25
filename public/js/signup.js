const errorParagraph = document.querySelector('.error');

const handleSubmit = async ev => {
	ev.preventDefault();
	const [username, password, confirmedPassword] = ev.target.elements;
	if (
		username.value.length > 4 &&
		password.value.length > 4 &&
		confirmedPassword.value.length > 4
	) {
		if (password.value === confirmedPassword.value) {
			const data = {
				username: username.value,
				password: password.value,
			};
			try {
				const response = await axios.post('/api/signup', data, {
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
			errorParagraph.textContent = 'Passwords do not match';
		}
	} else {
		errorParagraph.textContent = 'Username or password too short';
	}
};
const form = document.getElementById('signup');
form.addEventListener('submit', handleSubmit);
