document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters to load correct product
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // If no product ID is provided, load default product
    loadProductDetails(productId || 1);
    
    // Initialize tabs
    initTabs();
    
    // Initialize quantity selector
    initQuantitySelector();
    
    // Initialize image gallery
    initImageGallery();
    
    // Load related products
    loadRelatedProducts();
    
    // Handle recently viewed
    handleRecentlyViewed(productId || 1);
    
    // Handle add to cart
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    
    // Handle add to wishlist
    document.getElementById('add-to-wishlist').addEventListener('click', toggleWishlist);
    
    // Handle write review
    document.getElementById('write-review').addEventListener('click', showReviewForm);
});

// Product data - in a real application, this would come from a database
const products = [
    {
        id: 1,
        name: "Royal Diamond Pendant",
        images: [
            "images/products/pendant-1.jpg",
            "images/products/pendant-1-alt.jpg",
            "images/products/pendant-1-alt2.jpg"
        ],
        price: 1250,
        collection: "Royal",
        description: "This exquisite Royal Diamond Pendant showcases the finest craftsmanship and materials. The pendant features a brilliant-cut diamond centerpiece of exceptional clarity, set in 18-karat gold with meticulous attention to detail. The elegant design draws inspiration from royal jewels, creating a piece that is both timeless and sophisticated.",
        details: {
            metal: "18K Gold",
            diamond: "0.75 carat",
            clarity: "VS1",
            color: "G",
            chainLength: "18 inches",
            pendantSize: "12mm x 8mm",
            weight: "3.6g"
        },
        relatedProducts: [2, 5, 11, 6]
    },
    {
        id: 2,
        name: "Celestial Star Earrings",
        images: ["images/products/earrings-1.jpg"],
        price: 850,
        collection: "Celestial",
        description: "Inspired by the night sky, these Celestial Star Earrings capture the magic and wonder of the cosmos. Each earring features delicate star motifs crafted in 18K gold with subtle diamond accents that catch and reflect light beautifully.",
        details: {
            metal: "18K Gold",
            diamond: "0.25 carat total",
            clarity: "VS2",
            color: "F",
            length: "15mm",
            width: "12mm",
            weight: "2.8g"
        },
        relatedProducts: [5, 10, 1, 4]
    }
    // Additional products would be defined here
];

// Load product details based on ID
function loadProductDetails(productId) {
    // Convert to number
    productId = Number(productId);
    
    // Find product
    const product = products.find(p => p.id === productId) || products[0];
    
    // Update breadcrumb
    document.getElementById('product-breadcrumb').textContent = product.name;
    
    // Update product information
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = formatPrice(product.price);
    document.getElementById('product-collection').textContent = product.collection + ' Collection';
    
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Update gallery thumbnails
    const thumbnailGallery = document.querySelector('.thumbnail-gallery');
    thumbnailGallery.innerHTML = '';
    
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.setAttribute('data-image', image);
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${product.name} - View ${index + 1}`;
        
        thumbnail.appendChild(img);
        thumbnailGallery.appendChild(thumbnail);
    });
    
    // If not enough images, add placeholders
    while (thumbnailGallery.children.length < 3) {
        const placeholder = document.createElement('div');
        placeholder.className = 'thumbnail';
        placeholder.setAttribute('data-image', 'images/products/placeholder.jpg');
        
        const img = document.createElement('img');
        img.src = 'images/products/placeholder.jpg';
        img.alt = 'Placeholder Image';
        
        placeholder.appendChild(img);
        thumbnailGallery.appendChild(placeholder);
    }
    
    // Update description tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab && product.description) {
        descriptionTab.innerHTML = `<p>${product.description}</p>`;
    }
    
    // Update details tab
    const detailsTab = document.getElementById('details');
    if (detailsTab && product.details) {
        let detailsHtml = '<ul>';
        for (const [key, value] of Object.entries(product.details)) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            detailsHtml += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
        }
        detailsHtml += '</ul>';
        detailsTab.innerHTML = detailsHtml;
    }
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Activate selected tab
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize quantity selector
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
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 10) {
            quantityInput.value = 10;
        }
    });
}

// Initialize image gallery
function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const zoomBtn = document.querySelector('.zoom-btn');
    const modal = document.getElementById('zoom-modal');
    const modalImg = document.getElementById('zoom-image');
    const closeModal = document.querySelector('.close-modal');
    
    // Change main image when clicking thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            
            // Update main image
            const newImageSrc = thumbnail.getAttribute('data-image');
            mainImage.src = newImageSrc;
        });
    });
    
    // Image zoom functionality
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

// Load related products
function loadRelatedProducts() {
    const relatedProductsContainer = document.getElementById('related-products');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id')) || 1;
    const currentProduct = products.find(p => p.id === productId) || products[0];
    
    if (currentProduct && currentProduct.relatedProducts && relatedProductsContainer) {
        // Clear container
        relatedProductsContainer.innerHTML = '';
        
        // Get related products
        const relatedProductIds = currentProduct.relatedProducts;
        
        // Create sample related products (since we don't have full product data)
        const sampleRelated = [
            { id: 2, name: "Celestial Star Earrings", image: "images/products/earrings-1.jpg", price: 850, collection: "Celestial" },
            { id: 5, name: "Celestial Moon Necklace", image: "images/products/necklace-1.jpg", price: 1450, collection: "Celestial" },
            { id: 11, name: "Royal Ruby Necklace", image: "images/products/necklace-2.jpg", price: 4200, collection: "Royal" },
            { id: 6, name: "Royal Sapphire Ring", image: "images/products/ring-2.jpg", price: 2200, collection: "Royal" }
        ];
        
        sampleRelated.forEach(product => {
            const productCard = createProductCard(product);
            relatedProductsContainer.appendChild(productCard);
        });
    }
}

// Handle recently viewed products
function handleRecentlyViewed(productId) {
    // In a real app, this would use localStorage or similar
    const recentlyViewedContainer = document.getElementById('recently-viewed');
    
    if (recentlyViewedContainer) {
        // Sample recently viewed items
        const recentItems = [
            { id: 4, name: "Modern Minimalist Ring", image: "images/products/ring-1.jpg", price: 950, collection: "Modern" },
            { id: 7, name: "Heritage Filigree Earrings", image: "images/products/earrings-2.jpg", price: 1100, collection: "Heritage" },
            { id: 8, name: "Modern Gold Bangle", image: "images/products/bangle-1.jpg", price: 780, collection: "Modern" },
            { id: 10, name: "Celestial Sun Pendant", image: "images/products/pendant-2.jpg", price: 1250, collection: "Celestial" }
        ];
        
        recentlyViewedContainer.innerHTML = '';
        
        recentItems.forEach(product => {
            const productCard = createProductCard(product);
            recentlyViewedContainer.appendChild(productCard);
        });
    }
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
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

// Add to cart functionality
function addToCart() {
    const productName = document.getElementById('product-name').textContent;
    const quantity = document.getElementById('quantity').value;
    
    // Show confirmation
    alert(`Added ${quantity} × ${productName} to your cart!`);
    
    // In a real application, this would add the product to a cart object, 
    // potentially stored in localStorage or sent to a server
}

// Toggle wishlist
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
    
    // In a real application, this would update the wishlist in localStorage or on the server
}

// Show review form
function showReviewForm() {
    alert('Review form would open here!');
    // In a real implementation, this would show a modal or navigate to a review form
}

// Format price with currency symbol
function formatPrice(price) {
    return '$' + price.toLocaleString();
}

// Update product detail page from products page by modifying the js/products.js file
// Add click handler to product cards to navigate to product detail page
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
