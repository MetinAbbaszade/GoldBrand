document.addEventListener('DOMContentLoaded', function () {

    const searchIcon = document.querySelector('.nav-icons a[href="#search"]');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.querySelector('.search-form input[type="search"]');


    const openSearchOverlay = () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            searchInput.focus();
        }, 400);
    };


    const closeSearchOverlay = () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };


    if (searchIcon) {
        searchIcon.addEventListener('click', function (e) {
            e.preventDefault();
            openSearchOverlay();
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearchOverlay);
    }


    searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }
    });


    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });


    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {

                console.log('Searching for:', searchTerm);

                closeSearchOverlay();
            }
        });
    }

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'opacity 1s ease, transform 1s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 * (index + 1));
    });

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');

    for (let i = 1; i < testimonials.length; i++) {
        testimonials[i].style.display = 'none';
    }

    function showSlide(n) {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
            testimonial.style.opacity = '0';
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        testimonials[n].style.display = 'block';
        setTimeout(() => {
            testimonials[n].style.transition = 'opacity 0.5s ease';
            testimonials[n].style.opacity = '1';
        }, 50);
        dots[n].classList.add('active');

        currentSlide = n;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    setInterval(() => {
        let nextSlide = (currentSlide + 1) % testimonials.length;
        showSlide(nextSlide);
    }, 5000);

    const revealElements = document.querySelectorAll('section');
    const revealElementsOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 1s ease, transform 1s ease';
    });

    window.addEventListener('scroll', revealElementsOnScroll);

    revealElementsOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }

    class CollectionCarousel {
        constructor() {
            this.carousel = document.querySelector('.collection-carousel');
            this.container = document.querySelector('.collection-carousel-container');
            this.prevBtn = document.querySelector('.prev-arrow');
            this.nextBtn = document.querySelector('.next-arrow');
            this.indicatorsContainer = document.querySelector('.carousel-indicators');
            this.collections = [];
            this.currentIndex = 0;
            this.autoplayInterval = null;
            this.itemsPerView = this.getItemsPerView();
            this.touchStartX = 0;
            this.touchEndX = 0;

            this.init();
        }

        async init() {
            try {
                const response = await fetch('../collections/collections.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch collections data');
                }

                this.collections = await response.json();

                this.renderCollections();

                this.setupEventListeners();

                this.startAutoplay();

                this.updateCarousel();
            } catch (error) {
                console.error('Error initializing carousel:', error);

                this.handleFetchError();
            }
        }

        handleFetchError() {
            this.collections = [
                {
                    id: 1,
                    name: "Celestial",
                    description: "Inspired by the cosmos",
                    image: "https:wimages.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
                    link: "#celestial"
                },
                {
                    id: 2,
                    name: "Heritage",
                    description: "Timeless classics reimagined",
                    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
                    link: "#heritage"
                },
                {
                    id: 3,
                    name: "Bespoke",
                    description: "Customized to perfection",
                    image: "https://images.unsplash.com/photo-1635767798638-3665c941b304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
                    link: "#bespoke"
                }
            ];

            this.renderCollections();
            this.setupEventListeners();
            this.startAutoplay();
            this.updateCarousel();
        }

        getItemsPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1200) return 2;
            return 3;
        }

        renderCollections() {
            this.carousel.innerHTML = '';

            this.collections.forEach((collection, index) => {
                const item = document.createElement('div');
                item.onclick = () => {
                    window.location.href = '/frontend/collections/collections.html';
                }
                item.classList.add('collection-item');
                if (index < this.itemsPerView) item.classList.add('active');

                const imageStyle = `background-image: url('${collection.image}')`;

                item.innerHTML = `
                    <div class="collection-image" style="${imageStyle}"></div>
                    <h3>${collection.name}</h3>
                    <p>${collection.description}</p>
                    <a href="/frontend/collections/collections.html" class="view-collection">View Collection</a>
                `;

                this.carousel.appendChild(item);
            });

            this.indicatorsContainer.innerHTML = '';
            const totalSlides = Math.ceil(this.collections.length / this.itemsPerView);

            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                if (i === 0) indicator.classList.add('active');

                indicator.addEventListener('click', () => {
                    this.goToSlide(i);
                });

                this.indicatorsContainer.appendChild(indicator);
            }
        }

        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });

            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.resetAutoplay();
                }
            });

            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            this.carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });

            window.addEventListener('resize', () => {
                const newItemsPerView = this.getItemsPerView();
                if (newItemsPerView !== this.itemsPerView) {
                    this.itemsPerView = newItemsPerView;
                    this.renderCollections();
                    this.updateCarousel();
                }
            });

            this.container.addEventListener('mouseenter', () => {
                this.stopAutoplay();
            });

            this.container.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });
        }

        handleSwipe() {
            const swipeThreshold = 50;
            const diff = this.touchStartX - this.touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.resetAutoplay();
            }
        }

        nextSlide() {
            const totalSlides = Math.ceil(this.collections.length / this.itemsPerView);
            this.currentIndex = (this.currentIndex + 1) % totalSlides;
            this.updateCarousel();
        }

        prevSlide() {
            const totalSlides = Math.ceil(this.collections.length / this.itemsPerView);
            this.currentIndex = (this.currentIndex - 1 + totalSlides) % totalSlides;
            this.updateCarousel();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoplay();
        }

        updateCarousel() {
            const offset = -(this.currentIndex * 100);
            this.carousel.style.transform = `translateX(${offset}%)`;

            const items = this.carousel.querySelectorAll('.collection-item');
            const startIdx = this.currentIndex * this.itemsPerView;

            items.forEach((item, index) => {
                if (index >= startIdx && index < startIdx + this.itemsPerView) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
        }

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }

        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
            }
        }

        resetAutoplay() {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    if (document.querySelector('.collection-carousel')) {
        new CollectionCarousel();
    }


    class HeroProductCarousel {
        constructor() {
            this.carouselElement = document.querySelector('.hero-product-carousel');
            this.overlayElement = document.querySelector('.hero-product-overlay');
            this.indicatorsContainer = document.querySelector('.hero-product-indicators');
            this.prevButton = document.querySelector('.hero-nav-btn.prev-btn');
            this.nextButton = document.querySelector('.hero-nav-btn.next-btn');
            this.collectionNameElement = document.querySelector('.featured-collection-name');

            this.currentIndex = 0;
            this.autoplayInterval = null;
            this.products = [];
            this.filteredProducts = [];
            this.featuredCollection = 'Celestial';

            this.touchStartX = 0;
            this.touchEndX = 0;

            this.init();
        }

        async init() {
            try {

                this.showLoading(true);


                const response = await fetch('./data/featured-products.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }

                this.products = await response.json();


                this.filterProductsByCollection(this.featuredCollection);


                if (this.filteredProducts.length === 0) {
                    throw new Error('No products found for the featured collection');
                }


                this.collectionNameElement.textContent = `${this.featuredCollection} Collection`;


                this.renderProducts();


                this.setupEventListeners();


                this.startAutoplay();


                this.showLoading(false);
                this.showProduct(0);

            } catch (error) {
                console.error('Error initializing hero product carousel:', error);
                this.handleError(error);
            }
        }

        filterProductsByCollection(collectionName) {
            this.filteredProducts = this.products.filter(product =>
                product.collection.toLowerCase() === collectionName.toLowerCase()
            );
        }

        renderProducts() {

            const loadingElement = this.carouselElement.querySelector('.hero-loading');
            this.carouselElement.innerHTML = '';
            if (loadingElement) {
                this.carouselElement.appendChild(loadingElement);
            }


            this.filteredProducts.forEach((product) => {
                const productElement = document.createElement('div');
                productElement.classList.add('hero-product-item');
                productElement.innerHTML = `
                    <img src="${product.images[0]}" alt="${product.name}" class="hero-product-image">
                    <div class="hero-product-details">
                        <h3 class="hero-product-name">${product.name}</h3>
                        <div class="hero-product-price">$${product.price}</div>
                        <a href="#" class="hero-product-shop-btn" data-product-id="${product.id}">Shop Now</a>
                    </div>
                `;
                this.carouselElement.appendChild(productElement);
            });


            this.indicatorsContainer.innerHTML = '';
            this.filteredProducts.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('hero-indicator');
                indicator.dataset.index = index;

                indicator.addEventListener('click', () => {
                    this.goToProduct(index);
                    this.resetAutoplay();
                });

                this.indicatorsContainer.appendChild(indicator);
            });
        }

        setupEventListeners() {

            this.prevButton.addEventListener('click', () => {
                this.prevProduct();
                this.resetAutoplay();
            });


            this.nextButton.addEventListener('click', () => {
                this.nextProduct();
                this.resetAutoplay();
            });


            document.addEventListener('keydown', (e) => {
                if (this.isInViewport(this.carouselElement)) {
                    if (e.key === 'ArrowLeft') {
                        this.prevProduct();
                        this.resetAutoplay();
                    } else if (e.key === 'ArrowRight') {
                        this.nextProduct();
                        this.resetAutoplay();
                    }
                }
            });


            this.carouselElement.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            this.carouselElement.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });


            this.overlayElement.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });

            this.overlayElement.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });


            this.carouselElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('hero-product-shop-btn')) {
                    e.preventDefault();
                    const productId = e.target.dataset.productId;
                    this.handleProductClick(productId);
                }
            });


            window.addEventListener('resize', () => {
                this.updateCarouselHeight();
            });
        }

        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        handleSwipe() {
            const swipeThreshold = 50;
            const diff = this.touchStartX - this.touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextProduct();
                } else {
                    this.prevProduct();
                }
                this.resetAutoplay();
            }
        }

        updateCarouselHeight() {
            const windowHeight = window.innerHeight;
            this.carouselElement.style.height = `${windowHeight}px`;
        }

        prevProduct() {
            const newIndex = (this.currentIndex - 1 + this.filteredProducts.length) % this.filteredProducts.length;
            this.goToProduct(newIndex);
        }

        nextProduct() {
            const newIndex = (this.currentIndex + 1) % this.filteredProducts.length;
            this.goToProduct(newIndex);
        }

        goToProduct(index) {
            this.currentIndex = index;
            this.showProduct(index);
        }

        showProduct(index) {

            const productElements = this.carouselElement.querySelectorAll('.hero-product-item');
            productElements.forEach(product => {
                product.classList.remove('active');
                product.style.opacity = '0';
                product.style.visibility = 'hidden';
            });


            if (productElements[index]) {
                productElements[index].classList.add('active');
                productElements[index].style.opacity = '1';
                productElements[index].style.visibility = 'visible';
            }


            const indicators = this.indicatorsContainer.querySelectorAll('.hero-indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        startAutoplay() {
            this.pauseAutoplay();
            this.autoplayInterval = setInterval(() => {
                this.nextProduct();
            }, 6000);
        }

        pauseAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }

        resetAutoplay() {
            this.pauseAutoplay();
            this.startAutoplay();
        }

        showLoading(isLoading) {
            const loadingElement = this.carouselElement.querySelector('.hero-loading');
            if (loadingElement) {
                loadingElement.style.display = isLoading ? 'flex' : 'none';
            }
        }

        handleError(error) {
            console.error('Hero product carousel error:', error);
            this.showLoading(false);


            this.carouselElement.innerHTML = `
                <div class="hero-error">
                    <p>Unable to load featured products.</p>
                    <button class="retry-button">Retry</button>
                </div>
            `;


            const retryButton = this.carouselElement.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    this.init();
                });
            }
        }

        handleProductClick(productId) {

            const product = this.products.find(p => p.id.toString() === productId);

            if (product) {
                console.log('Product clicked:', product);







                if (typeof window.addToCart === 'function') {
                    window.addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
                        options: `${product.collection} Collection`
                    });
                }
            }
        }
    }


    if (document.querySelector('.hero-product-carousel')) {
        new HeroProductCarousel();
    }


    const cartIcon = document.querySelector('.nav-icons a[href="#cart"]');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');


    let cart = {
        items: [],
        subtotal: 0,
        total: 0
    };


    const openCartSidebar = () => {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    };


    const closeCartSidebar = () => {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    };


    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            openCartSidebar();
            renderCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCartSidebar);
    }


    cartSidebar.addEventListener('click', function (e) {
        if (e.target === cartSidebar) {
            closeCartSidebar();
        }
    });


    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            closeCartSidebar();
        }
    });


    const renderCart = () => {
        updateCartTotals();


        if (cart.items.length === 0) {
            emptyCart.style.display = 'flex';
            cartFooter.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartFooter.style.display = 'block';


        const cartItemElements = cartItems.querySelectorAll('.cart-item');
        cartItemElements.forEach(item => item.remove());


        cart.items.forEach((item, index) => {
            const cartItemElement = createCartItemElement(item, index);

            cartItems.insertBefore(cartItemElement, emptyCart);
        });
    };


    const createCartItemElement = (item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-options">${item.options || ''}</div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;

        return cartItem;
    };


    const updateCartTotals = () => {
        cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.total = cart.subtotal;

        if (cartSubtotal) cartSubtotal.textContent = `$${cart.subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${cart.total.toFixed(2)}`;
    };


    cartItems.addEventListener('click', (e) => {
        const target = e.target;


        if (target.classList.contains('decrease')) {
            const index = parseInt(target.dataset.index);
            if (cart.items[index].quantity > 1) {
                cart.items[index].quantity--;
                renderCart();
            }
        }


        if (target.classList.contains('increase')) {
            const index = parseInt(target.dataset.index);
            cart.items[index].quantity++;
            renderCart();
        }


        if (target.classList.contains('remove-item')) {
            const index = parseInt(target.dataset.index);
            cart.items.splice(index, 1);
            renderCart();
        }
    });


    window.addToCart = (product) => {

        const existingItemIndex = cart.items.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {

            cart.items[existingItemIndex].quantity++;
        } else {

            cart.items.push({
                ...product,
                quantity: 1
            });
        }


        openCartSidebar();
        renderCart();
    };


    const demoProducts = [
        {
            id: 1,
            name: "Celestial Diamond Ring",
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
            price: 1299.99,
            options: "18K Gold, Size 7"
        },
        {
            id: 2,
            name: "Heritage Pearl Necklace",
            image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
            price: 899.50,
            options: "Freshwater Pearls, 18\""
        },
        {
            id: 3,
            name: "Minimalist Gold Bracelet",
            image: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
            price: 499.99,
            options: "14K Gold, Adjustable"
        }
    ];



    const collectionItems = document.querySelectorAll('.collection-carousel .collection-item');
    if (collectionItems.length) {
        collectionItems.forEach((item, index) => {
            const viewCollectionLink = item.querySelector('.view-collection');
            if (viewCollectionLink) {
                viewCollectionLink.addEventListener('click', function (e) {
                    if (demoProducts[index % demoProducts.length]) {
                        e.preventDefault();
                        window.addToCart(demoProducts[index % demoProducts.length]);
                    }
                });
            }
        });
    }


    renderCart();
});
