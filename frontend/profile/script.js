document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('page-loaded');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            
            this.classList.add('active');

            
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            
            const orderCard = this.closest('.order-card');
            const orderDetails = orderCard.querySelector('.order-details');

            
            orderDetails.classList.toggle('active');

            
            if (orderDetails.classList.contains('active')) {
                this.textContent = 'Hide Details';
            } else {
                this.textContent = 'View Details';
            }
        });
    });

    
    const editProfileBtn = document.querySelector('.edit-profile-btn');

    editProfileBtn.addEventListener('click', function () {
        alert('This feature is coming soon!');
    });

    
    const editPhoto = document.querySelector('.edit-photo');

    editPhoto.addEventListener('click', function () {
        alert('Profile photo upload feature is coming soon!');
    });
});
