document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    getData(productId)
        .then(data => {
            if (data.length > 0) {
                loadProductDetails(data[0]);
                initTabs();
                initQuantitySelector();
                initImageGallery();
                loadRelatedProducts(data[0]);
                handleRecentlyViewed(data[0]);
            } else {
                console.error('Product not found');
            }
        })

    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    document.getElementById('add-to-wishlist').addEventListener('click', toggleWishlist);
    document.getElementById('write-review').addEventListener('click', showReviewForm);
});

const fetchAllProducts = async () => {
    const response = await fetch('../main/data/featured-products.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}


const getData = async (productId) => {
    const response = await fetch('../main/data/featured-products.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.filter(product => product.id === Number(productId));
}


function loadProductDetails(productData) {

    document.getElementById('product-breadcrumb').textContent = (productData.name).replaceAll(' ', '-');
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = formatPrice(productData.price);
    document.getElementById('product-collection').textContent = productData.collection + ' Collection';


    const mainImage = document.getElementById('main-product-image');
    mainImage.src = productData.images[0];
    mainImage.alt = productData.name;


    const thumbnailGallery = document.querySelector('.thumbnail-gallery');
    thumbnailGallery.innerHTML = '';

    productData.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.setAttribute('data-image', image);

        const img = document.createElement('img');
        img.src = image;
        img.alt = `${productData.name} - View ${index + 1}`;

        thumbnail.appendChild(img);
        thumbnailGallery.appendChild(thumbnail);
    });


    while (thumbnailGallery.children.length < 3) {
        const placeholder = document.createElement('div');
        placeholder.className = 'thumbnail';
        placeholder.setAttribute('data-image', 'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

        const img = document.createElement('img');
        img.src = 'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        img.alt = 'Placeholder Image';

        placeholder.appendChild(img);
        thumbnailGallery.appendChild(placeholder);
    }


    const descriptionTab = document.getElementById('description');
    if (descriptionTab && productData.description) {
        descriptionTab.innerHTML = `<p>${productData.description}</p>`;
    }


    const detailsTab = document.getElementById('details');
    if (detailsTab && productData.details) {
        let detailsHtml = '<ul>';
        for (const [key, value] of Object.entries(productData.details)) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            detailsHtml += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
        }
        detailsHtml += '</ul>';
        detailsTab.innerHTML = detailsHtml;
    }
}


function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));


            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}


function initQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 5) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 5) {
            quantityInput.value = 5;
        }
    });
}


function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const zoomBtn = document.querySelector('.zoom-btn');
    const modal = document.getElementById('zoom-modal');
    const modalImg = document.getElementById('zoom-image');
    const closeModal = document.querySelector('.close-modal');


    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {

            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');


            const newImageSrc = thumbnail.getAttribute('data-image');
            mainImage.src = newImageSrc;
        });
    });


    zoomBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = mainImage.src;
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}


async function loadRelatedProducts(productData) {
    const relatedProductsContainer = document.getElementById('related-products');
    const currentProduct = productData;

    if (currentProduct && currentProduct.relatedProducts && relatedProductsContainer) {

        relatedProductsContainer.innerHTML = '';
        const relatedProductIds = currentProduct.relatedProducts;
        const allProducts = await fetchAllProducts();
        const filteredProducts = allProducts.filter(product => relatedProductIds.includes(product.id));
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            relatedProductsContainer.appendChild(productCard);
        });
    }
}


async function handleRecentlyViewed(productData) {

    const recentlyViewedContainer = document.getElementById('recently-viewed');
    if (recentlyViewedContainer && productData && productData.recentlyViewed) {
        const allProducts = await fetchAllProducts();
        const recentItems = allProducts.filter(product => productData.recentlyViewed.includes(product.id));
        recentlyViewedContainer.innerHTML = '';
        recentItems.forEach(product => {
            const productCard = createProductCard(product);
            recentlyViewedContainer.appendChild(productCard);
        });
    }
}


function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="product-collection">${product.collection}</div>
        </div>
        <div class="card-info">
            <h3 class="card-name">${product.name}</h3>
            <p class="card-price">${formatPrice(product.price)}</p>
            <a href="product-detail.html?id=${product.id}" class="product-btn">View Details</a>
        </div>
    `;

    return card;
}


function addToCart() {
    const productName = document.getElementById('product-name').textContent;
    const quantity = document.getElementById('quantity').value;
    alert(`Added ${quantity} × ${productName} to your cart!`);
}


function toggleWishlist(e) {
    const btn = e.currentTarget;
    const isInWishlist = btn.classList.contains('in-wishlist');

    if (isInWishlist) {
        btn.classList.remove('in-wishlist');
        btn.innerHTML = '<i class="far fa-heart"></i>';
        alert('Removed from wishlist!');
    } else {
        btn.classList.add('in-wishlist');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        alert('Added to wishlist!');
    }


}


function showReviewForm() {
    alert('Review form would open here!');

}


function formatPrice(price) {
    return '$' + price.toLocaleString();
}



function attachProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        const viewDetailsBtn = card.querySelector('.product-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        }
    });
}
