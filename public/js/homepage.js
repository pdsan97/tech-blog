const message = document.getElementById('message-text');

const handleCommentSubmit = async ev => {
	const id = message.previousElementSibling.textContent.trim();
	const data = {
		id,
		message: message.value,
	};
	try {
		await axios.post('/api/post/comments', data, {
			withCredentials: true,
		});
		location.reload();
	} catch (err) {
		console.log(err);
	}
};

document
	.getElementById('submit')
	.addEventListener('click', handleCommentSubmit);

document.querySelectorAll('.add-comment').forEach(button => {
	button.addEventListener('click', () => {
		message.previousElementSibling.textContent =
			button.getAttribute('data-id');
	});
});
