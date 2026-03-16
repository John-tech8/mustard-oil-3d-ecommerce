// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        initAnimations();
    }, 1500);
});

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});

// Mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active nav link on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkEls.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// ===== THREE.JS 3D BOTTLE =====
function initBottle3D() {
    const canvas = document.getElementById('bottleCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Create Mustard Oil Bottle using geometry
    const bottleGroup = new THREE.Group();

    // Bottle body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.85, 0.95, 3.2, 32, 1, false);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xC8960E,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.6,
        thickness: 1.5,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.45,
        envMapIntensity: 1.0,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    bottleGroup.add(body);

    // Bottle neck
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.55, 1.2, 32);
    const neckMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xC8960E,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.5,
        thickness: 1.0,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 2.2;
    neck.castShadow = true;
    bottleGroup.add(neck);

    // Shoulder (torus shape transition)
    const shoulderGeometry = new THREE.CylinderGeometry(0.55, 0.85, 0.4, 32);
    const shoulderMaterial = bodyMaterial.clone();
    const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    shoulder.position.y = 1.5;
    bottleGroup.add(shoulder);

    // Cap
    const capGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.5, 32);
    const capMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1B4332,
        metalness: 0.6,
        roughness: 0.25,
        clearcoat: 0.8,
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 3.05;
    cap.castShadow = true;
    bottleGroup.add(cap);

    // Cap ring
    const capRingGeometry = new THREE.TorusGeometry(0.38, 0.04, 8, 32);
    const capRingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xD4A012,
        metalness: 0.9,
        roughness: 0.1,
    });
    const capRing = new THREE.Mesh(capRingGeometry, capRingMaterial);
    capRing.position.y = 2.78;
    capRing.rotation.x = Math.PI / 2;
    bottleGroup.add(capRing);

    // Label (plane with texture)
    const labelGeometry = new THREE.CylinderGeometry(0.96, 1.06, 1.6, 32, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext('2d');

    // Draw label
    const labelGrad = ctx.createLinearGradient(0, 0, 0, 256);
    labelGrad.addColorStop(0, '#FFF8E7');
    labelGrad.addColorStop(1, '#F5ECD7');
    ctx.fillStyle = labelGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Label border
    ctx.strokeStyle = '#D4A012';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 492, 236);

    // Inner border
    ctx.strokeStyle = '#2D6A4F';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 476, 220);

    // Decorative top line
    ctx.fillStyle = '#D4A012';
    ctx.fillRect(30, 30, 452, 3);

    // "PURE HARVEST" text
    ctx.fillStyle = '#1B4332';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('PURE HARVEST', 256, 72);

    // Decorative divider
    ctx.fillStyle = '#D4A012';
    ctx.fillRect(160, 85, 192, 2);

    // "ORGANIC" text
    ctx.fillStyle = '#D4A012';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('★  O R G A N I C  ★', 256, 115);

    // "MUSTARD OIL" text
    ctx.fillStyle = '#1B4332';
    ctx.font = 'bold 38px Georgia, serif';
    ctx.fillText('MUSTARD OIL', 256, 160);

    // Bottom text
    ctx.fillStyle = '#8B7355';
    ctx.font = '14px sans-serif';
    ctx.fillText('COLD PRESSED  •  100% PURE  •  NATURAL', 256, 195);

    // Bottom decorative line
    ctx.fillStyle = '#D4A012';
    ctx.fillRect(30, 220, 452, 3);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: 0.4,
        metalness: 0.05,
        clearcoat: 0.3,
        side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = -0.2;
    bottleGroup.add(label);

    // Oil level inside (inner cylinder)
    const oilGeometry = new THREE.CylinderGeometry(0.78, 0.88, 2.8, 32);
    const oilMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xD4A012,
        metalness: 0.0,
        roughness: 0.1,
        transmission: 0.7,
        thickness: 2.0,
        transparent: true,
        opacity: 0.55,
        ior: 1.5,
    });
    const oil = new THREE.Mesh(oilGeometry, oilMaterial);
    oil.position.y = -0.1;
    bottleGroup.add(oil);

    // Bottom of bottle
    const bottomGeometry = new THREE.CylinderGeometry(0.95, 0.9, 0.15, 32);
    const bottomMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xC8960E,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
        clearcoat: 0.5,
    });
    const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottom.position.y = -1.68;
    bottleGroup.add(bottom);

    bottleGroup.position.y = -0.5;
    scene.add(bottleGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFF8E7, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xD4A012, 0.4);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x52B788, 0.3);
    backLight.position.set(0, -2, -5);
    scene.add(backLight);

    const rimLight = new THREE.PointLight(0xFFD700, 0.8, 15);
    rimLight.position.set(3, 5, 3);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0xD4A012, 0.3, 10);
    bottomLight.position.set(0, -4, 2);
    scene.add(bottomLight);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 60;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xD4A012,
        transparent: true,
        opacity: 0.4,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.set(0, 1, 7);
    camera.lookAt(0, 0.3, 0);

    // Mouse interaction for drag-rotate
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let autoRotate = true;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoRotate = false;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
        document.getElementById('dragHint').style.display = 'none';
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;
            targetRotationY += deltaX * 0.008;
            targetRotationX += deltaY * 0.005;
            targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { autoRotate = true; }, 3000);
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        setTimeout(() => { autoRotate = true; }, 3000);
    });

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        autoRotate = false;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
        document.getElementById('dragHint').style.display = 'none';
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaX = e.touches[0].clientX - previousMouseX;
            const deltaY = e.touches[0].clientY - previousMouseY;
            targetRotationY += deltaX * 0.008;
            targetRotationX += deltaY * 0.005;
            targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
            previousMouseX = e.touches[0].clientX;
            previousMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => { autoRotate = true; }, 3000);
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        if (autoRotate) {
            targetRotationY += 0.005;
        }

        // Smooth rotation
        bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.05;
        bottleGroup.rotation.x += (targetRotationX - bottleGroup.rotation.x) * 0.05;

        // Gentle floating animation
        bottleGroup.position.y = -0.5 + Math.sin(time * 1.5) * 0.15;

        // Particles rotation
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Light animation
        rimLight.position.x = Math.sin(time * 2) * 4;
        rimLight.position.z = Math.cos(time * 2) * 4;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handling
    function onResize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', onResize);
}

// ===== GSAP ANIMATIONS =====
function initAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Scroll-trigger animations for [data-animate] elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out',
            onComplete: () => el.classList.add('animated'),
        });
    });

    // Hero section entrance (without scroll trigger)
    const heroEls = document.querySelectorAll('.hero-content [data-animate]');
    heroEls.forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.5 + delay,
            ease: 'power3.out',
        });
    });

    const hero3d = document.querySelector('.hero-3d[data-animate]');
    if (hero3d) {
        gsap.to(hero3d, {
            opacity: 1,
            x: 0,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out',
        });
    }

    // Timeline items stagger
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item, 
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                },
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
            }
        );
    });

    // Product cards parallax
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'back.out(1.2)',
            }
        );
    });

    // Benefit cards
    gsap.utils.toArray('.benefit-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50, rotateY: 15 },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 1,
                y: 0,
                rotateY: 0,
                duration: 0.8,
                delay: i * 0.12,
                ease: 'power3.out',
            }
        );
    });

    // About cards
    gsap.utils.toArray('.about-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.1,
                ease: 'power3.out',
            }
        );
    });
}

// ===== HERO PARTICLES =====
function createHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('hero-particle');
        const size = Math.random() * 6 + 2;
        const colors = ['#D4A012', '#F2C94C', '#52B788', '#FFD700'];
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${6 + Math.random() * 6}s;
        `;
        container.appendChild(particle);
    }
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        goToSlide(currentSlide);
    });

    // Auto-slide
    setInterval(() => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        goToSlide(currentSlide);
    }, 5000);

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (diff > 50) {
            currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            goToSlide(currentSlide);
        } else if (diff < -50) {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            goToSlide(currentSlide);
        }
    });
}

// ===== CART FUNCTIONALITY =====
let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
    showToast(`${name} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-icon"><i class="fas fa-wine-bottle"></i></div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>₹${item.price.toLocaleString()} × ${item.qty}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        cartFooter.style.display = 'block';

        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        cartTotal.textContent = `₹${total.toLocaleString()}`;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

document.getElementById('cartBtn').addEventListener('click', toggleCart);
document.getElementById('cartOverlay').addEventListener('click', toggleCart);

function checkout() {
    showToast('Redirecting to checkout... (Demo)');
    setTimeout(() => {
        cart = [];
        updateCart();
        toggleCart();
    }, 1500);
}

// ===== QUICK VIEW MODAL =====
function quickView(name, price, size, imgSrc) {
    const modal = document.getElementById('quickViewModal');
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalPrice').textContent = `₹${price.toLocaleString()}`;
    
    // Update modal image
    const modalImg = document.getElementById('modalImg');
    if (imgSrc && modalImg) {
        modalImg.src = imgSrc;
        modalImg.alt = name;
    }

    const modalCartBtn = document.getElementById('modalCartBtn');
    modalCartBtn.onclick = () => {
        addToCart(name, price);
        closeModal();
    };

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('quickViewModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('quickViewModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== CONTACT FORM =====
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('#name').value;
    showToast(`Thank you, ${name}! We'll get back to you soon.`);
    form.reset();
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    createHeroParticles();
    initBottle3D();
    initTestimonialsSlider();
    initProductCardClicks();
});

// ===== PRODUCT CARD CLICK-TO-MODAL =====
function initProductCardClicks() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if Add to Cart or View Animation was clicked
            if (e.target.closest('.btn-add-cart') || e.target.closest('.btn-view-animation')) return;
            
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);
            const size = card.dataset.size;
            const img = card.dataset.img;
            quickView(name, price, size, img);
        });
    });
}

// ===== 3D PRODUCT VIEWER =====
let viewer3dScene, viewer3dCamera, viewer3dRenderer, viewer3dControls;
let viewer3dAnimationId = null;
let viewer3dMesh = null;
let viewer3dParticles = null;
let viewer3dResizeHandler = null;

// Bottle dimension configs per product size
const BOTTLE_CONFIGS = {
    '500ml': {
        bodyRadius: 0.55, bodyHeight: 2.4,
        neckRadius: 0.22, neckHeight: 0.9,
        shoulderHeight: 0.35,
        capRadius: 0.25, capHeight: 0.35,
        labelHeight: 1.3, labelOffset: -0.1,
        oilLevel: 2.1, scale: 1.0
    },
    '1litre': {
        bodyRadius: 0.65, bodyHeight: 3.0,
        neckRadius: 0.25, neckHeight: 1.0,
        shoulderHeight: 0.4,
        capRadius: 0.28, capHeight: 0.38,
        labelHeight: 1.5, labelOffset: -0.1,
        oilLevel: 2.6, scale: 1.0
    },
    '5litre': {
        bodyRadius: 0.9, bodyHeight: 2.8,
        neckRadius: 0.3, neckHeight: 0.7,
        shoulderHeight: 0.35,
        capRadius: 0.33, capHeight: 0.4,
        labelHeight: 1.6, labelOffset: -0.1,
        oilLevel: 2.5, scale: 1.0,
        isCanister: true
    }
};

function open3DViewer(sizeKey, productName, imagePath) {
    const overlay = document.getElementById('viewer3dOverlay');
    const canvas = document.getElementById('viewer3dCanvas');
    const titleEl = document.getElementById('viewer3dTitle');

    titleEl.innerHTML = `<i class="fas fa-cube"></i> ${productName} — 3D View`;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        init3DScene(canvas, sizeKey, imagePath);
    }, 150);
}

function createBottleGeometry(scene, config, imagePath, renderer) {
    const bottleGroup = new THREE.Group();

    // ===== GLASS BODY =====
    const bodyGeo = config.isCanister
        ? new THREE.BoxGeometry(config.bodyRadius * 1.8, config.bodyHeight, config.bodyRadius * 1.4, 4, 4, 4)
        : new THREE.CylinderGeometry(config.bodyRadius, config.bodyRadius + 0.05, config.bodyHeight, 48, 1, false);
    
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: config.isCanister ? 0xD4A012 : 0xC8960E,
        metalness: config.isCanister ? 0.7 : 0.05,
        roughness: config.isCanister ? 0.35 : 0.08,
        transmission: config.isCanister ? 0.0 : 0.65,
        thickness: config.isCanister ? 0.0 : 1.8,
        transparent: true,
        opacity: config.isCanister ? 1.0 : 0.82,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        ior: 1.5,
        envMapIntensity: 1.2,
        side: config.isCanister ? THREE.FrontSide : THREE.DoubleSide,
    });
    const body = new THREE.Mesh(bodyGeo, glassMat);
    body.castShadow = true;
    body.receiveShadow = true;
    bottleGroup.add(body);

    // ===== OIL FILL (inside glass) =====
    if (!config.isCanister) {
        const oilGeo = new THREE.CylinderGeometry(
            config.bodyRadius - 0.06,
            config.bodyRadius - 0.02,
            config.oilLevel,
            48
        );
        const oilMat = new THREE.MeshPhysicalMaterial({
            color: 0xD4A012,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 0.75,
            thickness: 2.5,
            transparent: true,
            opacity: 0.5,
            ior: 1.47,
        });
        const oil = new THREE.Mesh(oilGeo, oilMat);
        oil.position.y = -(config.bodyHeight - config.oilLevel) / 2 + 0.05;
        bottleGroup.add(oil);
    }

    // ===== SHOULDER =====
    const shoulderGeo = config.isCanister
        ? new THREE.BoxGeometry(config.bodyRadius * 1.8, config.shoulderHeight, config.bodyRadius * 1.4)
        : new THREE.CylinderGeometry(
            config.neckRadius + 0.08,
            config.bodyRadius,
            config.shoulderHeight,
            48
        );
    const shoulderMat = config.isCanister ? glassMat.clone() : glassMat.clone();
    const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulder.position.y = config.bodyHeight / 2 + config.shoulderHeight / 2;
    bottleGroup.add(shoulder);

    // ===== NECK =====
    const neckGeo = config.isCanister
        ? new THREE.CylinderGeometry(config.neckRadius, config.neckRadius + 0.05, config.neckHeight, 32)
        : new THREE.CylinderGeometry(config.neckRadius, config.neckRadius + 0.08, config.neckHeight, 48);
    const neckMat = config.isCanister
        ? new THREE.MeshPhysicalMaterial({
              color: 0xB8860B,
              metalness: 0.7,
              roughness: 0.3,
              clearcoat: 0.5,
          })
        : glassMat.clone();
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.y = config.bodyHeight / 2 + config.shoulderHeight + config.neckHeight / 2;
    bottleGroup.add(neck);

    // ===== CAP =====
    const capGeo = new THREE.CylinderGeometry(config.capRadius, config.capRadius, config.capHeight, 32);
    const capMat = new THREE.MeshPhysicalMaterial({
        color: 0x1B4332,
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 0.9,
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    const capY = config.bodyHeight / 2 + config.shoulderHeight + config.neckHeight + config.capHeight / 2 - 0.02;
    cap.position.y = capY;
    cap.castShadow = true;
    bottleGroup.add(cap);

    // ===== GOLD RING (between neck and cap) =====
    const ringGeo = new THREE.TorusGeometry(config.capRadius + 0.02, 0.03, 12, 36);
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.95,
        roughness: 0.05,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = config.bodyHeight / 2 + config.shoulderHeight + config.neckHeight - 0.02;
    ring.rotation.x = Math.PI / 2;
    bottleGroup.add(ring);

    // ===== BOTTOM =====
    const bottomGeo = config.isCanister
        ? new THREE.BoxGeometry(config.bodyRadius * 1.8, 0.08, config.bodyRadius * 1.4)
        : new THREE.CylinderGeometry(config.bodyRadius + 0.05, config.bodyRadius + 0.02, 0.1, 48);
    const bottomMat = new THREE.MeshPhysicalMaterial({
        color: config.isCanister ? 0xB8860B : 0xC8960E,
        metalness: config.isCanister ? 0.7 : 0.1,
        roughness: 0.2,
        clearcoat: 0.5,
    });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.position.y = -config.bodyHeight / 2 - 0.04;
    bottleGroup.add(bottom);

    // ===== HANDLE (for 5L canister) =====
    if (config.isCanister) {
        const handleCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.25, capY + 0.15, 0),
            new THREE.Vector3(-0.25, capY + 0.55, 0),
            new THREE.Vector3(0.25, capY + 0.55, 0),
            new THREE.Vector3(0.25, capY + 0.15, 0),
        ]);
        const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.04, 8, false);
        const handleMat = new THREE.MeshPhysicalMaterial({
            color: 0xB8860B,
            metalness: 0.8,
            roughness: 0.2,
        });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        bottleGroup.add(handle);
    }

    // ===== LABEL with product image =====
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imagePath, (texture) => {
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        if (renderer) {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }

        if (config.isCanister) {
            // For canister: flat label on front and back
            const labelGeo = new THREE.PlaneGeometry(
                config.bodyRadius * 1.6,
                config.labelHeight
            );
            const labelMat = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                side: THREE.FrontSide,
                roughness: 0.35,
                metalness: 0.0,
            });
            const frontLabel = new THREE.Mesh(labelGeo, labelMat);
            frontLabel.position.y = config.labelOffset;
            frontLabel.position.z = config.bodyRadius * 0.71;
            bottleGroup.add(frontLabel);

            const backLabel = new THREE.Mesh(labelGeo, labelMat.clone());
            backLabel.position.y = config.labelOffset;
            backLabel.position.z = -config.bodyRadius * 0.71;
            backLabel.rotation.y = Math.PI;
            bottleGroup.add(backLabel);
        } else {
            // For bottles: cylindrical wraparound label
            const labelGeo = new THREE.CylinderGeometry(
                config.bodyRadius + 0.06,
                config.bodyRadius + 0.1,
                config.labelHeight,
                48, 1, true,
                -Math.PI * 0.7, Math.PI * 1.4
            );
            const labelMat = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                roughness: 0.35,
                metalness: 0.0,
            });
            const label = new THREE.Mesh(labelGeo, labelMat);
            label.position.y = config.labelOffset;
            bottleGroup.add(label);
        }
    });

    // Center the bottle vertically
    const totalH = config.bodyHeight / 2 + config.shoulderHeight + config.neckHeight + config.capHeight;
    bottleGroup.position.y = -(totalH / 2) + config.bodyHeight / 4;

    scene.add(bottleGroup);
    return bottleGroup;
}

function init3DScene(canvas, sizeKey, imagePath) {
    cleanup3DViewer();

    const config = BOTTLE_CONFIGS[sizeKey] || BOTTLE_CONFIGS['500ml'];
    const wrap = canvas.parentElement;
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    // Scene
    viewer3dScene = new THREE.Scene();

    // Camera
    viewer3dCamera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    viewer3dCamera.position.set(0, 0.5, 5.5);

    // Renderer
    viewer3dRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    viewer3dRenderer.setSize(width, height);
    viewer3dRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewer3dRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    viewer3dRenderer.toneMappingExposure = 1.4;
    viewer3dRenderer.shadowMap.enabled = true;
    viewer3dRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ===== PREMIUM LIGHTING =====
    // Key light (warm white, from top-right)
    const keyLight = new THREE.DirectionalLight(0xFFF8E7, 1.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    viewer3dScene.add(keyLight);

    // Fill light (soft warm, from left)
    const fillLight = new THREE.DirectionalLight(0xD4A012, 0.5);
    fillLight.position.set(-4, 3, -3);
    viewer3dScene.add(fillLight);

    // Ambient fill (soft overall)
    const ambientLight = new THREE.AmbientLight(0xFAF3E0, 0.55);
    viewer3dScene.add(ambientLight);

    // Rim light (green accent, behind)
    const rimLight = new THREE.PointLight(0x52B788, 0.5, 12);
    rimLight.position.set(-2, 2, -5);
    viewer3dScene.add(rimLight);

    // Top spot (golden highlight)
    const spotLight = new THREE.SpotLight(0xFFD700, 0.7, 20, Math.PI / 5, 0.5);
    spotLight.position.set(0, 8, 3);
    viewer3dScene.add(spotLight);

    // Bottom bounce light
    const bounceLight = new THREE.PointLight(0xD4A012, 0.25, 8);
    bounceLight.position.set(0, -3, 2);
    viewer3dScene.add(bounceLight);

    // ===== CREATE BOTTLE =====
    viewer3dMesh = createBottleGeometry(viewer3dScene, config, imagePath, viewer3dRenderer);

    // ===== GOLDEN PARTICLES =====
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
        pPos[i] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xD4A012,
        transparent: true,
        opacity: 0.45,
    });
    viewer3dParticles = new THREE.Points(pGeo, pMat);
    viewer3dScene.add(viewer3dParticles);

    // ===== ORBIT CONTROLS =====
    viewer3dControls = new THREE.OrbitControls(viewer3dCamera, canvas);
    viewer3dControls.enableDamping = true;
    viewer3dControls.dampingFactor = 0.06;
    viewer3dControls.enableZoom = true;
    viewer3dControls.minDistance = 3;
    viewer3dControls.maxDistance = 8;
    viewer3dControls.enablePan = false;
    viewer3dControls.autoRotate = true;
    viewer3dControls.autoRotateSpeed = 2.5;
    viewer3dControls.target.set(0, 0.3, 0);
    viewer3dControls.update();

    // Resize handler
    viewer3dResizeHandler = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        viewer3dCamera.aspect = w / h;
        viewer3dCamera.updateProjectionMatrix();
        viewer3dRenderer.setSize(w, h);
    };
    window.addEventListener('resize', viewer3dResizeHandler);

    // ===== ANIMATION LOOP =====
    let time = 0;
    function animate3D() {
        viewer3dAnimationId = requestAnimationFrame(animate3D);
        time += 0.016;

        // Floating effect on bottle
        if (viewer3dMesh) {
            viewer3dMesh.position.y += (Math.sin(time * 1.0) * 0.06 - viewer3dMesh.position.y) * 0.03;
        }

        // Particles gentle drift
        if (viewer3dParticles) {
            viewer3dParticles.rotation.y += 0.0008;
            viewer3dParticles.rotation.x += 0.0002;
        }

        // Animated rim light orbit
        rimLight.position.x = Math.sin(time * 0.5) * 4;
        rimLight.position.z = Math.cos(time * 0.5) * 4;

        viewer3dControls.update();
        viewer3dRenderer.render(viewer3dScene, viewer3dCamera);
    }
    animate3D();
}

function cleanup3DViewer() {
    if (viewer3dAnimationId) {
        cancelAnimationFrame(viewer3dAnimationId);
        viewer3dAnimationId = null;
    }
    if (viewer3dControls) {
        viewer3dControls.dispose();
        viewer3dControls = null;
    }
    if (viewer3dRenderer) {
        viewer3dRenderer.dispose();
    }
    if (viewer3dScene) {
        viewer3dScene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (obj.material.map) obj.material.map.dispose();
                obj.material.dispose();
            }
        });
    }
    if (viewer3dResizeHandler) {
        window.removeEventListener('resize', viewer3dResizeHandler);
        viewer3dResizeHandler = null;
    }
    viewer3dScene = null;
    viewer3dCamera = null;
    viewer3dMesh = null;
    viewer3dParticles = null;
}

function close3DViewer() {
    const overlay = document.getElementById('viewer3dOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { cleanup3DViewer(); }, 500);
}

// Close on overlay click
document.getElementById('viewer3dOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) close3DViewer();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('viewer3dOverlay');
        if (overlay.classList.contains('active')) {
            close3DViewer();
        }
    }
});
