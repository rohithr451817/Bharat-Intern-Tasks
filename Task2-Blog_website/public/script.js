document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const imageInput = form.querySelector('input[name="image"]');
            if (imageInput && !isValidURL(imageInput.value)) {
                event.preventDefault();
                alert('Please enter a valid image URL.');
            }
        });
    });
});

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}
