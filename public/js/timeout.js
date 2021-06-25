const inactivityTime = () => {
	window.onload = resetTimer;
	document.onmousemove = resetTimer;
	document.onkeydown = resetTimer;
	function logout() {
		axios.post('/api/logout', {}, { withCredentials: true }).then(resp => {
			if (resp.status === 201) {
				location.href = '/login';
			}
		});
	}
	let time;
	function resetTimer() {
		clearTimeout(time);
		time = setTimeout(logout, 300000);
	}
};
window.onload = function () {
	inactivityTime();
};
