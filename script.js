document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const profileForm = document.getElementById('profileForm');
    const editButtons = document.querySelectorAll('.profile__edit-btn');
    const saveButton = document.getElementById('saveBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userInitials = document.getElementById('userInitials');
    const avatarImage = document.getElementById('avatarImage');
    const logoutButton = document.querySelector('.profile__logout-btn');
    const membershipTier = document.getElementById('membershipTier');
    const tabButtons = document.querySelectorAll('.profile__tab');
    const tabPanes = document.querySelectorAll('.profile__tab-pane');

    // Sample user data (would normally come from API/backend)
    const userData = {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        address: '123 Luxury Lane, Beverly Hills, CA 90210',
        tier: 'Platinum',
        avatarUrl: '' // Empty for fallback to initials
    };

    // Track which fields are being edited
    const editingFields = {
        fullName: false,
        email: false,
        address: false
    };

    // Initialize user data
    function initUserData() {
        document.getElementById('fullName').value = userData.fullName;
        document.getElementById('email').value = userData.email;
        document.getElementById('address').value = userData.address;
        membershipTier.textContent = userData.tier;

        // Handle avatar or initials
        if (userData.avatarUrl) {
            avatarImage.src = userData.avatarUrl;
            avatarImage.hidden = false;
            userInitials.hidden = true;
        } else {
            const initials = getInitials(userData.fullName);
            userInitials.textContent = initials;
            userInitials.hidden = false;
            avatarImage.hidden = true;
        }
    }

    // Get initials from full name
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    // Setup tab functionality
    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // Show corresponding tab content
                tabPanes.forEach(pane => {
                    if (pane.dataset.tabContent === targetTab) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    }

    // Setup edit buttons
    function setupEditButtons() {
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const fieldId = button.dataset.field;
                const inputField = document.getElementById(fieldId);

                // Toggle edit state
                editingFields[fieldId] = !editingFields[fieldId];

                if (editingFields[fieldId]) {
                    // Enable editing
                    inputField.disabled = false;
                    inputField.focus();
                    button.innerHTML = '<span class="icon">✓</span>';

                    // Enable save button if any field is being edited
                    saveButton.disabled = false;
                } else {
                    // Disable editing
                    inputField.disabled = true;
                    button.innerHTML = '<span class="icon">✎</span>';

                    // Check if any fields are still being edited
                    const stillEditing = Object.values(editingFields).some(value => value);
                    saveButton.disabled = !stillEditing;
                }
            });
        });
    }

    // Form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        saveButton.classList.add('saving');
        saveButton.disabled = true;

        // Collect form data
        const updatedData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        // Simulate API call with timeout
        setTimeout(() => {
            // Update user data
            Object.assign(userData, updatedData);

            // Reset editing state
            editButtons.forEach(button => {
                const fieldId = button.dataset.field;
                editingFields[fieldId] = false;
                document.getElementById(fieldId).disabled = true;
                button.innerHTML = '<span class="icon">✎</span>';
            });

            // Update initials if name changed
            if (!userData.avatarUrl) {
                userInitials.textContent = getInitials(userData.fullName);
            }

            // Reset save button
            saveButton.classList.remove('saving');
            saveButton.disabled = true;

            // Show success message
            showNotification('Profile updated successfully!');
        }, 1500);
    });

    // Logout button
    logoutButton.addEventListener('click', () => {
        showNotification('Logging out...');

        // Simulate logout action
        setTimeout(() => {
            window.location.href = '#'; // Would redirect to login page
        }, 1500);
    });

    // Setup wishlist remove buttons
    function setupWishlistButtons() {
        const removeButtons = document.querySelectorAll('.wishlist__remove');
        const addToCartButtons = document.querySelectorAll('.wishlist__add-to-cart');

        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const wishlistItem = button.closest('.wishlist__item');
                wishlistItem.style.opacity = '0';

                setTimeout(() => {
                    wishlistItem.style.display = 'none';
                    showNotification('Item removed from wishlist');
                }, 300);

                e.stopPropagation();
            });
        });

        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productName = button.closest('.wishlist__item').querySelector('.wishlist__name').textContent;
                showNotification(`${productName} added to cart`);
            });
        });
    }

    // Setup settings form
    function setupSettingsForm() {
        const settingsForm = document.querySelector('.settings__form');

        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get password values
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                // Simple validation
                if (newPassword && newPassword !== confirmPassword) {
                    showNotification('New passwords don\'t match', 'error');
                    return;
                }

                // Simulate form submission
                const submitBtn = settingsForm.querySelector('.settings__submit-btn');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Updating...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Clear password fields
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';

                    showNotification('Settings updated successfully');
                }, 1500);
            });
        }
    }

    // Simple notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Set appropriate color based on type
        const bgColor = type === 'error' ? '#ff6b6b' : 'var(--color-gold-primary)';

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius-sm);
            box-shadow: var(--shadow-medium);
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after timeout
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize everything
    initUserData();
    setupTabs();
    setupEditButtons();
    setupWishlistButtons();
    setupSettingsForm();

    // Setup order buttons
    const orderButtons = document.querySelectorAll('.order__btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            showNotification(`Action initiated: ${action}`);
        });
    });
});
