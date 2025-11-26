// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función de inicialización
function initializeApp() {
    updateCartCount();
    setupEventListeners();
    checkUserStatus();
}

// Configurar event listeners
function setupEventListeners() {
    // Modal de login/registro
    const loginBtn = document.getElementById('login-btn');
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Formularios de autenticación
    const loginSubmit = document.getElementById('login-submit');
    const registerSubmit = document.getElementById('register-submit');
    
    if (loginSubmit) {
        loginSubmit.addEventListener('click', handleLogin);
    }
    
    if (registerSubmit) {
        registerSubmit.addEventListener('click', handleRegister);
    }
    
    // Botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.product-card');
            const productId = productElement.dataset.productId;
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productElement.querySelector('img').src;
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
    
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Funcionalidad del carrito
    setupCartFunctionality();
}

// Funciones de autenticación
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Simulación de login (en una aplicación real, esto sería una llamada a una API)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { email: user.email, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        checkUserStatus();
        document.getElementById('auth-modal').style.display = 'none';
        alert(`¡Bienvenido de nuevo, ${user.name}!`);
    } else {
        alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
}

function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // Simulación de registro (en una aplicación real, esto sería una llamada a una API)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('Este correo electrónico ya está registrado');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    checkUserStatus();
    document.getElementById('auth-modal').style.display = 'none';
    alert(`¡Registro exitoso! Bienvenido a Panadería Delicia, ${name}`);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    checkUserStatus();
    alert('Has cerrado sesión correctamente');
}

function checkUserStatus() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name;
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Funciones del carrito
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`${name} agregado al carrito`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function setupCartFunctionality() {
    // Solo ejecutar en la página del carrito
    if (window.location.pathname.includes('carrito.html')) {
        renderCartItems();
        
        // Botones de incrementar/decrementar cantidad
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('decrement')) {
                const id = e.target.closest('.cart-item').dataset.id;
                updateQuantity(id, -1);
            }
            
            if (e.target.classList.contains('increment')) {
                const id = e.target.closest('.cart-item').dataset.id;
                updateQuantity(id, 1);
            }
            
            if (e.target.classList.contains('remove-item')) {
                const id = e.target.closest('.cart-item').dataset.id;
                removeFromCart(id);
            }
        });
        
        // Aplicar código de descuento
        const applyDiscountBtn = document.getElementById('apply-discount');
        if (applyDiscountBtn) {
            applyDiscountBtn.addEventListener('click', applyDiscount);
        }
        
        // Finalizar compra
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-8">
                <p class="text-lg">Tu carrito está vacío</p>
                <a href="productos.html" class="text-primary hover:underline mt-2 inline-block">Ir a productos</a>
            </div>
        `;
        
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (discountElement) discountElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        
        return;
    }
    
    let subtotal = 0;
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item flex items-center justify-between gap-4 rounded-lg bg-background-light p-4 shadow-sm dark:bg-background-dark/50" data-id="${item.id}">
                <div class="flex items-center gap-4">
                    <img alt="${item.name}" class="h-20 w-20 rounded object-cover" src="${item.image}" />
                    <div>
                        <h3 class="font-bold">${item.name}</h3>
                        <p class="text-sm text-stone-500 dark:text-stone-400">$${item.price.toFixed(2)}</p>
                        <button class="remove-item mt-1 text-xs text-primary hover:underline">Eliminar</button>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="decrement flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">-</button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button class="increment flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">+</button>
                </div>
            </div>
        `;
    }).join('');
    
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElement) discountElement.textContent = `-$${discount.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function calculateDiscount(subtotal) {
    // Lógica simple de descuento: 10% en compras mayores a $50
    return subtotal > 50 ? subtotal * 0.1 : 0;
}

function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value;
    
    if (discountCode.toUpperCase() === 'DELICIA10') {
        alert('¡Código de descuento aplicado! 10% de descuento en tu compra.');
        // Aquí se aplicaría el descuento en el cálculo
        renderCartItems();
    } else if (discountCode) {
        alert('Código de descuento no válido');
    }
    
    document.getElementById('discount-code').value = '';
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (!currentUser) {
        alert('Por favor, inicia sesión para finalizar tu compra');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    
    // Simulación de proceso de pago
    const total = document.getElementById('total').textContent;
    alert(`¡Compra realizada con éxito! Total: ${total}\nGracias por tu compra, ${currentUser.name}`);
    
    // Vaciar carrito después de la compra
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animación de salida después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Funciones utilitarias
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

// Exportar funciones para uso global (si es necesario)
window.PanaderiaDelicia = {
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartCount,
    handleLogin,
    handleRegister,
    handleLogout
};
document.addEventListener('DOMContentLoaded', function () {
    const carouselSlides = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Función para actualizar el carrusel
    function updateCarousel() {
        carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('carousel-indicator-active');
                indicator.classList.remove('bg-white/40');
                indicator.classList.add('bg-white');
            } else {
                indicator.classList.remove('carousel-indicator-active');
                indicator.classList.add('bg-white/40');
                indicator.classList.remove('bg-white');
            }
        });
    }

    // Función para siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Función para slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners para botones
    nextBtn.addEventListener('click', function () {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', function () {
        prevSlide();
        resetAutoPlay();
    });

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            currentSlide = index;
            updateCarousel();
            resetAutoPlay();
        });
    });

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Pausar auto-play al hacer hover
    carouselSlides.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    carouselSlides.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Inicializar
    updateCarousel();
    startAutoPlay();
});