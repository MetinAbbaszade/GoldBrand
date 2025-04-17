document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {

            if (button.classList.contains('active')) return;


            tabButtons.forEach(btn => btn.classList.remove('active'));


            button.classList.add('active');


            const activeForm = document.querySelector('.form.active');


            activeForm.style.opacity = '0';
            activeForm.style.transform = 'translateY(10px)';

            setTimeout(() => {

                if (button.dataset.form === 'login') {
                    loginForm.classList.add('active');
                    signupForm.classList.remove('active');
                } else {
                    loginForm.classList.remove('active');
                    signupForm.classList.add('active');
                }


                document.querySelectorAll('.error-message').forEach(error => {
                    error.textContent = '';
                });


                document.querySelectorAll('form').forEach(form => {
                    if (!form.classList.contains('active')) {
                        form.reset();
                    }
                });


                const newActiveForm = document.querySelector('.form.active');
                const formGroups = newActiveForm.querySelectorAll('.form-group');

                formGroups.forEach((group, index) => {
                    group.style.opacity = '0';
                    group.style.transform = 'translateY(10px)';

                    setTimeout(() => {
                        group.style.opacity = '1';
                        group.style.transform = 'translateY(0)';
                    }, 100 * (index + 1));
                });
            }, 300);
        });
    });

    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');


            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                button.style.transform = 'translateY(-50%) rotate(360deg)';
                setTimeout(() => {
                    button.style.transform = 'translateY(-50%)';
                }, 300);
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                button.style.transform = 'translateY(-50%) rotate(-360deg)';
                setTimeout(() => {
                    button.style.transform = 'translateY(-50%)';
                }, 300);
            }
        });
    });

    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {

        input.setAttribute('placeholder', ' ');


        input.addEventListener('blur', validateInput);


        input.addEventListener('focus', () => {
            const label = input.parentElement.querySelector('label');
            label.style.color = 'var(--color-gold)';
        });

        input.addEventListener('blur', () => {
            const label = input.parentElement.querySelector('label');
            if (!input.value) {
                label.style.color = '#999';
            }
        });
    });

    function validateInput(event) {
        const input = event.target;
        const errorMessage = input.parentElement.querySelector('.error-message');
        let isValid = true;
        let message = '';


        errorMessage.textContent = '';
        input.classList.remove('invalid');


        if (input.value.trim() === '') {
            return true;
        }


        if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(input.value);
            if (!isValid) {
                message = 'Please enter a valid email address';
            }
        }


        if (input.type === 'password' && input.id.includes('password') && !input.id.includes('confirm')) {
            if (input.value.length < 8) {
                isValid = false;
                message = 'Password must be at least 8 characters long';
            } else if (!/[A-Z]/.test(input.value)) {
                isValid = false;
                message = 'Password must contain at least one uppercase letter';
            } else if (!/[0-9]/.test(input.value)) {
                isValid = false;
                message = 'Password must contain at least one number';
            }
        }


        if (input.id === 'confirm-password') {
            const password = document.getElementById('signup-password').value;
            if (input.value !== password) {
                isValid = false;
                message = 'Passwords do not match';
            }
        }


        if (!isValid) {
            errorMessage.textContent = message;
            input.classList.add('invalid');


            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = 'shake 0.5s ease';
            }, 10);


            errorMessage.style.animation = 'none';
            setTimeout(() => {
                errorMessage.style.animation = 'fadeIn 0.3s ease forwards';
            }, 10);
        } else {

            input.style.borderColor = 'var(--color-success)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 1000);
        }

        return isValid;
    }

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();


            const formInputs = form.querySelectorAll('input');
            let formIsValid = true;

            formInputs.forEach(input => {

                if (input.type !== 'checkbox') {

                    const inputEvent = new Event('blur');
                    input.dispatchEvent(inputEvent);


                    const errorMessage = input.parentElement.querySelector('.error-message');
                    if (errorMessage.textContent !== '') {
                        formIsValid = false;
                    }
                }
            });


            if (form.id === 'signup-form') {
                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox.checked) {
                    const errorMessage = termsCheckbox.parentElement.querySelector('.error-message') ||
                        document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'You must accept the Terms & Conditions';
                    termsCheckbox.parentElement.appendChild(errorMessage);
                    formIsValid = false;


                    termsCheckbox.style.animation = 'shake 0.5s ease';
                }
            }


            if (formIsValid) {

                const submitBtn = form.querySelector('.btn-submit');
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
                submitBtn.disabled = true;


                setTimeout(() => {

                    submitBtn.innerHTML = form.id === 'login-form' ? 'Sign In' : 'Create Account';
                    submitBtn.disabled = false;

                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = form.id === 'login-form' ?
                        'Login successful!' : 'Account created successfully!';
                    successMessage.style.color = 'var(--color-success)';
                    successMessage.style.padding = '1rem 0';
                    successMessage.style.opacity = '0';

                    form.querySelector('.btn-submit').insertAdjacentElement('afterend', successMessage);


                    setTimeout(() => {
                        successMessage.style.opacity = '1';
                        successMessage.style.transform = 'translateY(0)';
                    }, 10);


                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        successMessage.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            successMessage.remove();
                            form.reset();
                        }, 300);
                    }, 3000);
                }, 1500);
            }
        });
    });

    setTimeout(() => {
        document.querySelector('.container').style.opacity = '1';
        document.querySelector('.container').style.transform = 'translateY(0)';
    }, 100);
});
