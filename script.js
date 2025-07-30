document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initialize3DBackground();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTypewriter();
    initializeCounters();
    initializeContactForm();
    initializeParticles();
});

// Three.js 3D Background
function initialize3DBackground() {
    const canvas = document.getElementById('threejs-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Floating geometries
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.ConeGeometry(0.7, 1.5, 8),
        new THREE.OctahedronGeometry(0.8),
        new THREE.TorusGeometry(0.7, 0.3, 16, 100)
    ];
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.4, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5, wireframe: true })
    ];
    const meshes = [];
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 40;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        scene.add(mesh);
        meshes.push(mesh);
    }
    camera.position.z = 20;
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    function animate() {
        requestAnimationFrame(animate);
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.005 + index * 0.001;
            mesh.rotation.y += 0.005 + index * 0.001;
            mesh.rotation.z += 0.002 + index * 0.0005;
            mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    });
}

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveLink() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) correspondingLink.classList.add('active');
            }
        });
    }
    function handleHeaderScroll() {
        if (window.scrollY > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', () => {
        highlightActiveLink();
        handleHeaderScroll();
    });
}

// Back to Top & Scroll Effects
function initializeScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === "#") return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Animations on scroll
function initializeAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.style.animationName = 'fadeInUp';
                entry.target.style.animationDuration = '0.8s';
                entry.target.style.animationFillMode = 'both';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.glass-morphism, .info-card, .contact-method').forEach(el => {
        observer.observe(el);
    });
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-tech');
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate(-50%, -50%) translateY(${yPos}px)`;
        });
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const roles = [
        'Cloud Technology Expert',
        'System Administrator',
        'Billing Systems Specialist',
        'Technical Support Engineer',
        'Computer Science Student',
        'Innovation Enthusiast'
    ];
    const roleElement = document.getElementById('roleText');
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    function typeRole() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(typeRole, typeSpeed);
    }
    setTimeout(typeRole, 1000);
}

// Stat Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observerOptions = { threshold: 0.5, rootMargin: '0px' };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Animate skill bars (progress)
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        if (progress) setTimeout(() => { bar.style.width = progress + '%'; }, 700);
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            if (!firstName || !lastName || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            setTimeout(() => {
                const mailtoLink = `mailto:mbarath2121@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoLink;
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Message sent successfully!', 'success');
            }, 1500);
        });
    }
    // CV Download
    const downloadButtons = document.querySelectorAll('#downloadCV, #footerDownloadCV');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resumeData = `
BARATH M
Computer Science Professional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 mbarath2121@gmail.com
📱 +91 9789223360
📍 Vellalore, Coimbatore - 641111
🔗 linkedin.com/in/barath-m-7044502a3

EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 B.Sc Computer Science with Cognitive Systems (2023-2026)
   DR. N. G. P. ARTS AND SCIENCE COLLEGE - CGPA: 6.7

🎓 HSC Computer Science (2022-2023)
   N.G.R.A. HR.SEC.SCHOOL - 54%

EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 Billing Expert - D Mart (2024 - Present)
   • Manage advanced POS systems
   • Deliver exceptional customer service
   • Maintain accurate transaction records

💼 Software & OS Installation Specialist
   Orange Computer Sales & Service (2022 - 2024)
   • OS installation and configuration
   • Technical support and troubleshooting
   • Documentation maintenance

CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Published Cloud and Virtualization Book Chapter
🏆 Cloud & Virtualization - Infosys Springboard
🏆 Operational Research - Infosys Springboard
🏆 Information Security - Infosys Springboard
🏆 Cyber Security - Infosys Springboard
🏆 Threat Analysis using Wireshark - PROMPT Infotech

SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Microsoft Office Suite
• Windows/Linux OS Installation
• System Configuration & Maintenance
• POS Systems Management
• Cloud Technologies (Azure, AWS)
• Network Security
• Technical Documentation
• Customer Service Excellence

LANGUAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• English (Fluent)
• Tamil (Native)
            `;
            const blob = new Blob([resumeData], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Barath_M_Resume.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showNotification('Resume downloaded successfully!', 'success');
        });
    });
}

// Button Particles (for 3D-style effect)
function initializeParticles() {
    const buttons = document.querySelectorAll('.btn-3d');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() { createParticles(this); });
    });
    function createParticles(element) {
        const particles = element.querySelector('.btn-particles');
        if (!particles) return;
        particles.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.animation = `particle-float ${Math.random() * 2 + 1}s ease-out forwards`;
            particles.appendChild(particle);
            setTimeout(() => {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, 3000);
        }
    }
}

// Notification popups
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px; right: 20px; background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }, 3000);
}

// Add required keyframe animations for particles and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% { transform: translateY(0) scale(0); opacity: 1; }
        100% { transform: translateY(-50px) scale(1); opacity: 0; }
    }
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Theme Color Change (optional)
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const colors = [
        { primary: '#00ffff', secondary: '#ff00ff', accent: '#ffff00' },
        { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#45b7d1' },
        { primary: '#96ceb4', secondary: '#ffeaa7', accent: '#dda0dd' },
        { primary: '#74b9ff', secondary: '#fd79a8', accent: '#fdcb6e' }
    ];
    let currentTheme = 0;
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = (currentTheme + 1) % colors.length;
            const theme = colors[currentTheme];
            document.documentElement.style.setProperty('--primary-neon', theme.primary);
            document.documentElement.style.setProperty('--secondary-neon', theme.secondary);
            document.documentElement.style.setProperty('--accent-neon', theme.accent);
            showNotification('Theme changed!', 'success');
        });
    }
}
setTimeout(initializeTheme, 1000);
