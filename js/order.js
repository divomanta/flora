document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            let isValid = true;

            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');

            if (name.value.trim() === '') {
                name.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                name.parentElement.classList.remove('invalid');
            }

            const phoneRegex = /^[0-9\+\-\s]{8,15}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                phone.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                phone.parentElement.classList.remove('invalid');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                email.parentElement.classList.remove('invalid');
            }

            if (!isValid) {
                e.preventDefault();
            }
        });

        const inputs = orderForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('invalid');
            });
        });
    }
});