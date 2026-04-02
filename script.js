/* ============================================
   Bui Xuan Bac — Portfolio JavaScript
   Animations, Particles, Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initNavbar();
    initScrollAnimations();
    initTitleRotator();
    initCountUp();
    initSmoothScroll();
    initMobileMenu();
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.008;
                    this.y -= dy * 0.008;
                }
            }

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.06 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   CURSOR GLOW
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    if (window.innerWidth < 768) {
        glow.style.display = 'none';
        return;
    }

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateGlow() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));

    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    projectCards.forEach(card => projectObserver.observe(card));
}

/* ============================================
   TITLE ROTATOR (improved with exit animation)
   ============================================ */
function initTitleRotator() {
    const texts = document.querySelectorAll('.rotator-text');
    if (!texts.length) return;

    let currentIndex = 0;

    setInterval(() => {
        // Exit current
        texts[currentIndex].classList.add('exit');
        texts[currentIndex].classList.remove('active');
        
        // After exit animation, clean up
        const prevIndex = currentIndex;
        setTimeout(() => {
            texts[prevIndex].classList.remove('exit');
        }, 500);

        // Enter next
        currentIndex = (currentIndex + 1) % texts.length;
        setTimeout(() => {
            texts[currentIndex].classList.add('active');
        }, 200);
    }, 3000);
}

/* ============================================
   COUNT-UP ANIMATION
   ============================================ */
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    setTimeout(update, 300);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 70;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }

            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

/* ============================================
   CV PDF GENERATOR (html2canvas + jsPDF)
   ============================================ */
function generateCV(e) {
    if (e) e.preventDefault();
    
    const btn = document.getElementById('downloadCvBtn');
    const btnSpan = btn.querySelector('span');
    const originalText = btnSpan.textContent;
    const body = document.body;
    
    // Show loading state
    btn.classList.add('downloading');
    btnSpan.textContent = 'Preparing PDF...';
    
    // Allow UI to update before long running task
    setTimeout(() => {
        try {
            // Let's prepare the page for capture
            // Hide things we don't want in PDF: like the navbar, fixed buttons, or animations
            const navbar = document.getElementById('navbar');
            const particleCanvas = document.getElementById('particleCanvas');
            const cursorGlow = document.getElementById('cursorGlow');
            
            if (navbar) navbar.style.display = 'none';
            if (particleCanvas) particleCanvas.style.display = 'none';
            if (cursorGlow) cursorGlow.style.display = 'none';
            
            btn.style.display = 'none'; // hide the download button itself

            // Capture the whole document body
            html2canvas(body, {
                scale: window.devicePixelRatio || 2, // Dynamically use device scale
                useCORS: true,
                allowTaint: false,
                backgroundColor: window.getComputedStyle(body).backgroundColor,
                windowWidth: Math.max(1200, window.innerWidth)
            }).then(canvas => {
                // Restore visibility of elements
                if (navbar) navbar.style.display = '';
                if (particleCanvas) particleCanvas.style.display = '';
                if (cursorGlow) cursorGlow.style.display = '';
                btn.style.display = '';
                
                try {
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    const { jsPDF } = window.jspdf;
                    
                    if (!jsPDF) {
                        throw new Error('jsPDF library not loaded correctly');
                    }
                    
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    
                    let heightLeft = pdfHeight;
                    let position = 0;
                    
                    // First page
                    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= pageHeight;
                    
                    // Subsequent pages
                    while (heightLeft > 0) {
                        position = heightLeft - pdfHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    pdf.save('BuiXuanBac_Portfolio_UI.pdf');
                } catch (pdfErr) {
                    console.error('PDF generation error:', pdfErr);
                    alert('PDF generation error: ' + pdfErr.message);
                }
                
                // Reset button
                btn.classList.remove('downloading');
                btnSpan.textContent = originalText;
                
            }).catch(err => {
                console.error('Canvas generation error:', err);
                alert('Canvas error: ' + (err.message || err.toString()));
                
                // Restore visibility on error
                if (navbar) navbar.style.display = '';
                if (particleCanvas) particleCanvas.style.display = '';
                if (cursorGlow) cursorGlow.style.display = '';
                btn.style.display = '';
                btn.classList.remove('downloading');
                btnSpan.textContent = originalText;
            });
            
        } catch (err) {
            console.error('PDF generation setup error:', err);
            alert('Could not start PDF generation. Please try again.');
            btn.classList.remove('downloading');
            btnSpan.textContent = originalText;
        }
    }, 100);
}
