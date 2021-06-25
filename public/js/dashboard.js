const message = document.getElementById('message-text');
const title = document.getElementById('title-name');
const modalTitle = document.getElementById('edit-title-text');
const modalMessage = document.getElementById('edit-message-text');

const handleSumbit = async ev => {
	if (message.value.length > 0 && title.value.length > 0) {
		const data = {
			title: title.value,
			message: message.value,
			createdAt: new Date().getTime(),
		};
		try {
			await axios.post('/api/post', data, { withCredentials: true });
			message.value = '';
			title.value = '';
			location.reload();
		} catch (err) {
			console.log(err);
		}
	}
};

document.querySelectorAll('.add-comment').forEach(button => {
	button.addEventListener('click', () => {
		const container = button.parentElement.parentElement.parentElement;
		const title = container.querySelector('.title').textContent;
		const message = container.querySelector('.message').textContent;
		modalTitle.value = title.trim();
		modalMessage.value = message.trim();
		document.getElementById('edit-id').textContent =
			button.getAttribute('data-id');
	});
});

document.querySelectorAll('.delete-comment').forEach(button => {
	button.addEventListener('click', async () => {
		const id = button.getAttribute('data-id');
		try {
			await axios.delete(`/api/post/${id}`, { widthCredentials: true });
			location.reload();
		} catch (err) {
			console.log(err);
		}
	});
});

const handleSumbitEdited = async ev => {
	const postId = modalTitle.previousElementSibling.textContent.trim();
	const data = {
		title: modalTitle.value,
		message: modalMessage.value,
	};
	try {
		await axios.put(`/api/post/${postId}`, data, { withCredentials: true });
		location.reload();
	} catch (err) {
		console.log(err);
	}
};

document
	.getElementById('submit-edited-post')
	.addEventListener('click', handleSumbitEdited);

const sumbitButton = document.getElementById('submit');
sumbitButton.addEventListener('click', handleSumbit);
