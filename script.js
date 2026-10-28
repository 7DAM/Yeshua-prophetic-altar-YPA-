document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. PARTICLE BACKGROUND ENGINE
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ==========================================
    // 2. SCROLL FADE-IN ANIMATIONS
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    // ==========================================
    // 3. MOBILE NAVIGATION & ACCESSIBILITY
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isExpanded));
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // 4. DYNAMIC FOOTER YEAR
    // ==========================================
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 5. AI CONCIERGE LOGIC
    // ==========================================
    // Expert Fix: We wrap this in a function and delay it by 100ms.
    // This ensures components.js has finished injecting the AI widget HTML 
    // into the DOM before we try to attach event listeners to it.
    function initAIConcierge() {
        const floatBtn = document.getElementById('float-btn');
        const widget = document.getElementById('ai-widget');
        const closeBtn = document.getElementById('close-concierge');
        const openBtn = document.getElementById('open-concierge'); // Hero button
        const sendBtn = document.getElementById('send-btn');
        const input = document.getElementById('user-input');
        const chatBody = document.getElementById('chat-body');

        // If the AI widget isn't on this page, exit safely
        if (!floatBtn || !widget || !closeBtn || !sendBtn || !input || !chatBody) return;

        function toggleWidget() {
            widget.classList.toggle('hidden');
            floatBtn.classList.toggle('hidden');
            if (!widget.classList.contains('hidden')) {
                input.focus(); // Auto-focus input when opened
            }
        }

        floatBtn.addEventListener('click', toggleWidget);
        closeBtn.addEventListener('click', toggleWidget);
        
        if (openBtn) {
            openBtn.addEventListener('click', function() {
                widget.classList.remove('hidden');
                floatBtn.classList.add('hidden');
                input.focus();
            });
        }

        function addMessage(text, sender) {
            const msg = document.createElement('div');
            msg.className = 'chat-msg ' + sender;
            msg.innerText = text;
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function showTypingIndicator() {
            removeTypingIndicator(); // Prevent duplicates
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.id = 'typing';
            indicator.innerHTML = '<span></span><span></span><span></span>';
            chatBody.appendChild(indicator);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('typing');
            if (indicator) indicator.remove();
        }

        function handleSend() {
            const text = input.value.trim();
            if (!text) return;
            
            addMessage(text, 'user');
            input.value = '';
            showTypingIndicator();

            setTimeout(function () {
                removeTypingIndicator();
                let response = "I am processing your inquiry through the prophetic nexus. Please use the menu above or ask about prayer, vision, or teachings.";
                const lowerText = text.toLowerCase();

                if (lowerText.includes('prayer') || lowerText.includes('intercession') || lowerText.includes('help')) {
                    response = "The Apostolic team is standing by. Please visit the Contact page to submit your request directly to the altar.";
                } else if (lowerText.includes('prophet') || lowerText.includes('joshua') || lowerText.includes('lillian')) {
                    response = "Apostle Joshua and Prophetess Lillian are based in Nairobi, Kenya, broadcasting globally. Their mandate is the transformative anointing.";
                } else if (lowerText.includes('vision') || lowerText.includes('mandate') || lowerText.includes('about')) {
                    response = "Our mandate is to equip the saints and release the prophetic word to the nations. Visit the About page to learn more.";
                } else if (lowerText.includes('teaching') || lowerText.includes('word') || lowerText.includes('media')) {
                    response = "The Prophetic Archives contain our foundational matrices and directives. Visit the Media page to access the data.";
                } else if (lowerText.includes('give') || lowerText.includes('donate') || lowerText.includes('seed')) {
                    response = "Thank you for your heart to give. Visit the Give page for secure giving options.";
                } else if (lowerText.includes('event') || lowerText.includes('gather') || lowerText.includes('service')) {
                    response = "Visit the Events page to see upcoming prophetic gatherings and global broadcasts.";
                } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('peace')) {
                    response = "Peace be unto you. How may I assist your spiritual journey today?";
                }

                addMessage(response, 'bot');
            }, 1200);
        }

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Trigger AI initialization after a tiny delay to ensure injected DOM is ready
    setTimeout(initAIConcierge, 100);

    // ==========================================
    // 6. AJAX FORM SUBMISSION (Safe for all pages)
    // ==========================================
    const form = document.getElementById('prayerForm');
    if (form) {
        const successMsg = document.getElementById('formSuccess');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            if (submitBtn) {
                submitBtn.textContent = 'Transmitting...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(form);

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(function () {
                form.classList.add('hidden');
                if (successMsg) successMsg.classList.remove('hidden');
            })
            .catch(function () {
                alert('Transmission failed. Please try again.');
                if (submitBtn) {
                    submitBtn.textContent = 'Transmit Securely';
                    submitBtn.disabled = false;
                }
            });
        });
    }
});