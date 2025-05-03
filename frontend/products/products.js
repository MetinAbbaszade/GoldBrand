
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const collectionFilter = document.getElementById('collection-filter');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minPriceValue = document.getElementById('min-price-value');
const maxPriceValue = document.getElementById('max-price-value');
const noResults = document.getElementById('no-results');


let filters = {
    searchTerm: '',
    collection: '',
    minPrice: 100,
    maxPrice: 10000
};


document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

const fetchProducts = async () => {
    try {
        const response = await fetch('../main/data/featured-products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}


function setupEventListeners() {
    
    searchButton.addEventListener('click', () => {
        filters.searchTerm = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filters.searchTerm = searchInput.value.trim().toLowerCase();
            applyFilters();
        }
    });

    
    collectionFilter.addEventListener('change', () => {
        filters.collection = collectionFilter.value;
        applyFilters();
    });

    
    minPriceInput.addEventListener('input', () => {
        filters.minPrice = parseInt(minPriceInput.value);
        minPriceValue.textContent = formatPrice(filters.minPrice);

        
        if (filters.minPrice > filters.maxPrice) {
            maxPriceInput.value = filters.minPrice;
            filters.maxPrice = filters.minPrice;
            maxPriceValue.textContent = formatPrice(filters.maxPrice);
        }

        applyFilters();
    });

    
    maxPriceInput.addEventListener('input', () => {
        filters.maxPrice = parseInt(maxPriceInput.value);
        maxPriceValue.textContent = formatPrice(filters.maxPrice);

        
        if (filters.maxPrice < filters.minPrice) {
            minPriceInput.value = filters.maxPrice;
            filters.minPrice = filters.maxPrice;
            minPriceValue.textContent = formatPrice(filters.minPrice);
        }

        applyFilters();
    });

    
    const mobileToggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.menu');

    if (mobileToggle && menu) {
        mobileToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}


function applyFilters() {
    const filteredProducts = products.filter(product => {
        
        const matchesSearch = filters.searchTerm === '' ||
            product.name.toLowerCase().includes(filters.searchTerm);

        
        const matchesCollection = filters.collection === '' ||
            product.collection === filters.collection;

        
        const matchesPrice = product.price >= filters.minPrice &&
            product.price <= filters.maxPrice;

        
        return matchesSearch && matchesCollection && matchesPrice;
    });

    renderProducts(filteredProducts);
}


async function renderProducts() {
    const products = await fetchProducts();
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        console.log(products)
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-collection">${product.collection}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <a href="../productDetail/product-detail.html" class="product-btn">View Details</a>
                </div>
            `;

            productsContainer.appendChild(productCard);
        });
    }
}


function formatPrice(price) {
    return '$' + price.toLocaleString();
}


window.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.src = 'https://images.unsplash.com/photo-1618667074051-8da183ae7e32?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    }
}, true);
