window.addEventListener('load', () => {
    const pfp = document.querySelector('#profilePicture');
    const img = document.querySelector('.user-img');
    const imgPath = document.querySelector('#pfpPath');

    pfp.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('pfp', file);

        fetch('/cadastro/upload-pfp', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                img.src = res.url;
                imgPath.value = res.url;
            })
            .catch(err => console.error(err));

    });
});
