/* ============================================
   Bui Xuan Bac — Portfolio JavaScript
   Animations, Particles, Interactivity, CV PDF
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
            if (targetId === '#') return; // skip CV button
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
   CV PDF GENERATOR (jsPDF)
   ============================================ */
function generateCV(e) {
    e.preventDefault();
    
    const btn = document.getElementById('downloadCvBtn');
    const btnSpan = btn.querySelector('span');
    const originalText = btnSpan.textContent;
    
    // Show loading state
    btn.classList.add('downloading');
    btnSpan.textContent = 'Generating...';
    
    // Small delay so user sees the animation
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const margin = 20;
            const contentWidth = pageWidth - margin * 2;
            let y = 20;

            // Color definitions
            const navy = [10, 25, 47];
            const cyan = [100, 255, 218];
            const darkText = [30, 30, 30];
            const grayText = [100, 100, 100];
            const white = [255, 255, 255];

            // === HEADER BAR ===
            doc.setFillColor(...navy);
            doc.rect(0, 0, pageWidth, 52, 'F');

            // Accent line
            doc.setFillColor(...cyan);
            doc.rect(0, 52, pageWidth, 2, 'F');

            // Name
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(26);
            doc.setTextColor(...white);
            doc.text('BUI XUAN BAC', margin, 22);

            // Title
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(180, 220, 210);
            doc.text('Full-Stack Developer | Unity Game Developer', margin, 32);

            // Contact info in header
            doc.setFontSize(9);
            doc.setTextColor(200, 210, 220);
            doc.text('bacb436@gmail.com  |  github.com/bactiger1508  |  Vietnam', margin, 44);

            y = 62;

            // === HELPER FUNCTIONS ===
            function sectionTitle(title) {
                doc.setFillColor(...navy);
                doc.rect(margin, y - 1, contentWidth, 8, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(...white);
                doc.text(title.toUpperCase(), margin + 3, y + 5);
                y += 14;
            }

            function bodyText(text, indent = 0) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(...darkText);
                const lines = doc.splitTextToSize(text, contentWidth - indent);
                doc.text(lines, margin + indent, y);
                y += lines.length * 5;
            }

            function bulletPoint(text, indent = 5) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(...grayText);
                const lines = doc.splitTextToSize(text, contentWidth - indent - 5);
                doc.setTextColor(...darkText);
                doc.text('•', margin + indent, y);
                doc.setTextColor(...grayText);
                doc.text(lines, margin + indent + 5, y);
                y += lines.length * 4.5 + 1;
            }

            function subHeader(left, right) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10.5);
                doc.setTextColor(...darkText);
                doc.text(left, margin, y);
                if (right) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(...grayText);
                    doc.text(right, pageWidth - margin, y, { align: 'right' });
                }
                y += 5.5;
            }

            function companyLine(text) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(9);
                doc.setTextColor(80, 130, 120);
                doc.text(text, margin, y);
                y += 5.5;
            }

            // === PROFESSIONAL SUMMARY ===
            sectionTitle('Professional Summary');
            bodyText('Versatile Full-Stack Developer and Unity Game Designer with hands-on experience in enterprise-level digital transformation, cross-platform mobile development, and interactive game design. Adept at end-to-end software development—from requirements documentation (SRS) to deployment. Seeking a remote internship to contribute technical skills and grow with an innovative team.');
            y += 4;

            // === SKILLS ===
            sectionTitle('Technical Skills');
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...darkText);
            doc.text('Frontend:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayText);
            doc.text('HTML5, CSS3, JavaScript, Dart, Flutter', margin + 22, y);
            y += 5.5;

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkText);
            doc.text('Backend:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayText);
            doc.text('C# / .NET, SQL Server, RESTful APIs, JWT Authentication, SignalR', margin + 22, y);
            y += 5.5;

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkText);
            doc.text('Game Dev:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayText);
            doc.text('Unity Engine, C# Scripting, 2D/3D Game Design, Level Design', margin + 22, y);
            y += 5.5;

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkText);
            doc.text('Tools:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayText);
            doc.text('Figma, Git/GitHub, Agile/Scrum, Technical Documentation (SRS)', margin + 22, y);
            y += 8;

            // === EXPERIENCE ===
            sectionTitle('Professional Experience');
            
            subHeader('Software Development Intern', '2025 — Present');
            companyLine('VNPT — Vietnam Posts and Telecommunications Group');
            bulletPoint('Contributed to the development and deployment of digital transformation solutions for provincial and district-level government agencies');
            bulletPoint('Collaborated with cross-functional teams to gather requirements, design system architectures, and implement software modules');
            bulletPoint('Gained hands-on experience with large-scale enterprise systems, database management, and secure API development');
            bulletPoint('Authored technical documentation including Software Requirements Specifications (SRS) and system design documents');
            y += 4;

            // === PROJECTS ===
            sectionTitle('Featured Projects');

            subHeader('QR Banking Restaurant', 'C# / .NET, SQL Server, SignalR');
            bulletPoint('Built a comprehensive restaurant management web application that streamlines dining through QR code technology');
            bulletPoint('Implemented real-time order processing with SignalR, JWT authentication, and RESTful APIs');
            bulletPoint('Enabled customers to scan table-specific QR codes to browse menus, place orders, and process payments');
            y += 3;

            subHeader('Shadow Swap (Unity Game)', 'Unity, C#, 2D Physics');
            bulletPoint('Designed and developed an atmospheric puzzle game with innovative light/shadow swap mechanics');
            bulletPoint('Engineered unique character ability system where physical and shadow forms offer distinct gameplay strategies');
            y += 3;

            subHeader('Personal Health Record', 'Flutter/Dart, REST API, Material Design');
            bulletPoint('Developed a cross-platform mobile application for managing medical records digitally');
            bulletPoint('Implemented patient profile creation, family member linking, and document management for lab results and prescriptions');
            y += 4;

            // === EDUCATION ===
            sectionTitle('Education');
            subHeader('Software Engineering', '');
            bodyText('Coursework: Software Development, Database Systems, Mobile Development, Game Design, Project Management');
            y += 4;

            // === STRENGTHS ===
            sectionTitle('Strengths');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...grayText);
            const strengths = 'Versatile Tech Stack  •  Self-Driven Learner  •  Strong Documentation Skills  •  Problem Decomposition  •  Agile Methodology  •  Cross-Platform Development';
            const sLines = doc.splitTextToSize(strengths, contentWidth);
            doc.text(sLines, margin, y);
            y += sLines.length * 5;

            // === FOOTER ===
            doc.setFontSize(7.5);
            doc.setTextColor(160, 160, 160);
            doc.text('Generated from buixuanbac.dev portfolio — Last updated April 2026', pageWidth / 2, 290, { align: 'center' });

            // Save the PDF
            doc.save('BuiXuanBac_CV.pdf');
            
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Could not generate PDF. Please try again.');
        }
        
        // Reset button
        btn.classList.remove('downloading');
        btnSpan.textContent = originalText;
    }, 600);
}
