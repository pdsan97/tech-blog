const logoutLink = document.getElementById('logout');
if (logoutLink) {
	logoutLink.onclick = async ev => {
		try {
			const response = await axios.post(
				'/api/logout',
				{},
				{
					withCredentials: true,
				}
			);
			// const location = response.request.responseURL;
			// console.log(location);
			// window.location.href = location;
			window.location.href = '/';
		} catch (err) {
			console.log(err);
		}
	};
}
