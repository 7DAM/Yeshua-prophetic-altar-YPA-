/* ==========================================
   TIER-1 MASTER EXECUTION ENGINE
   File: main.js
   Architecture: Vanilla JS, Modular, Zero-Dependency
   ========================================== */

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

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(138, 43, 226, 0.4)'; // Legacy purple, can be updated to var(--premium-gold) via JS if needed
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

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
        const fadeObserver = new IntersectionObserver(function (entries) {
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
            fadeObserver.observe(el);
        });
    }

    // ==========================================
    // 3. MOBILE NAVIGATION & ACCESSIBILITY
    // ==========================================
    setTimeout(function () {
        const hamburgerBtn = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburgerBtn && navLinks) {
            hamburgerBtn.addEventListener('click', function () {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', String(!isExpanded));
                navLinks.classList.toggle('active');
            });

            navLinks.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }, 150);

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
    function initAIConcierge() {
        const floatBtn = document.getElementById('float-btn');
        const widget = document.getElementById('ai-widget');
        const closeBtn = document.getElementById('close-concierge');
        const openBtn = document.getElementById('open-concierge');
        const sendBtn = document.getElementById('send-btn');
        const input = document.getElementById('user-input');
        const chatBody = document.getElementById('chat-body');

        if (!floatBtn || !widget || !closeBtn || !sendBtn || !input || !chatBody) return;

        function toggleWidget() {
            widget.classList.toggle('hidden');
            floatBtn.classList.toggle('hidden');
            if (!widget.classList.contains('hidden')) {
                input.focus();
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
            removeTypingIndicator();
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
                let response = "I am processing your inquiry through the Prophetic Concierge. Please use the menu above or ask about prayer, vision, or teachings.";
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
    setTimeout(initAIConcierge, 100);

    // ==========================================
    // 6. IMPACT DASHBOARD & PRAYER WALL
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (isNaN(target)) return;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    function animateBars() {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    const impactSection = document.getElementById('impact-dashboard');
    if (impactSection) {
        const impactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    animateBars();
                    impactObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        impactObserver.observe(impactSection);
    }

    document.querySelectorAll('.pray-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            const match = text.match(/\d+/);
            const currentCount = match ? parseInt(match[0]) : 0;
            
            this.innerHTML = `<i class="fas fa-check"></i> Prayed (${currentCount + 1})`;
            this.style.background = 'var(--premium-gold, #D4AF37)';
            this.style.color = 'var(--royal-purple, #2A0A4A)';
            
            setTimeout(() => {
                this.innerHTML = `<i class="fas fa-hands-praying"></i> Pray (${currentCount + 1})`;
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });

// ==========================================
// 7. DISCIPLESHIP MATRIX - SEO-OPTIMIZED CONTENT ENGINE
// Architecture: Progressive Disclosure + Semantic SEO
// ==========================================

const discipleshipMatrix = {
    id: 'matrix',
    icon: '<i class="fas fa-book-open"></i>',
    title: 'The Yeshua Discipleship Matrix',
    subtitle: 'A Premier Online Christian Discipleship Course',
    ctaText: 'Request Course Enrollment',
    ctaLink: '#connect',
    
    // SEO Meta Description (for search engines)
    metaDescription: 'Join the Yeshua Apostolic and Prophetic Altar online Christian discipleship course. Structured prophetic training for believers led by Apostle Joshua and Prophetess Lillian.',
    
    content: `
        <!-- SEO-RICH INTRODUCTION -->
        <p style="margin-bottom: 25px; font-size: 1.05rem; line-height: 1.8;">
            Welcome to the <strong>Yeshua Apostolic and Prophetic Altar's</strong> premier 
            <strong>online Christian discipleship course</strong>. Designed by 
            <strong>Apostle Joshua and Prophetess Lillian</strong> from Nairobi, Kenya, 
            this structured <strong>prophetic training for believers</strong> bridges the 
            gap between foundational Bible study and advanced spiritual maturity. Whether 
            you are a new believer seeking an <strong>apostolic biblical foundation</strong> 
            or a seasoned saint ready for <strong>Kingdom advancement</strong>, this 
            <strong>spiritual growth curriculum</strong> will equip you for your divine mandate.
        </p>

        <!-- CURRICULUM HEADER -->
        <h4 style="color: var(--premium-gold); margin: 30px 0 20px 0; font-family: var(--font-majestic); font-size: 1.4rem; text-align: center; letter-spacing: 1px;">
            THE 4-PHASE ARCHITECTURAL CURRICULUM
        </h4>

        <!-- PHASE 1 -->
        <ul class="archive-list">
            <li>
                <i class="fas fa-seedling"></i> 
                <div>
                    <strong>PHASE 1: Apostolic Biblical Foundation</strong><br>
                    <em style="color: var(--premium-gold); font-size: 0.85rem;">For New Believers</em><br>
                    <span style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 8px; display: block;">
                        Establish your <strong>apostolic biblical foundation</strong> through 
                        transformative teachings on salvation, your new identity in Yeshua, 
                        water baptism, and the essentials of hearing God's voice. This 
                        <strong>Bible study course online</strong> module lays the eternal 
                        groundwork for all future spiritual growth.
                    </span>
                </div>
            </li>

            <!-- PHASE 2 -->
            <li>
                <i class="fas fa-fire"></i> 
                <div>
                    <strong>PHASE 2: Holy Ghost Impartation</strong><br>
                    <em style="color: var(--premium-gold); font-size: 0.85rem;">Spiritual Activation</em><br>
                    <span style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 8px; display: block;">
                        Experience genuine <strong>Holy Ghost empowerment</strong> as you learn 
                        to activate the gifts of the Spirit, walk in the transformative 
                        anointing, and access breakthrough power. This phase is the heart of 
                        our <strong>prophetic training for believers</strong>, releasing you 
                        into supernatural ministry.
                    </span>
                </div>
            </li>

            <!-- PHASE 3 -->
            <li>
                <i class="fas fa-shield-alt"></i> 
                <div>
                    <strong>PHASE 3: Spiritual Warfare Protocols</strong><br>
                    <em style="color: var(--premium-gold); font-size: 0.85rem;">Advanced Training</em><br>
                    <span style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 8px; display: block;">
                        Master the advanced <strong>spiritual growth curriculum</strong> of 
                        binding strongholds, intercessory prayer, and maintaining spiritual 
                        authority. This <strong>spiritual warfare training</strong> module 
                        equips you to stand firm against every assignment of the enemy and 
                        legislate in the heavenly realms.
                    </span>
                </div>
            </li>

            <!-- PHASE 4 -->
            <li>
                <i class="fas fa-globe-africa"></i> 
                <div>
                    <strong>PHASE 4: Prophetic Deployment</strong><br>
                    <em style="color: var(--premium-gold); font-size: 0.85rem;">For Seasoned Saints</em><br>
                    <span style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 8px; display: block;">
                        Step into your divine mandate through apostolic alignment and 
                        <strong>Kingdom advancement</strong> strategies. Learn to carry the 
                        prophetic torch to your city, nation, and the ends of the earth, 
                        just as Apostle Joshua and Prophetess Lillian have done across 
                        6 continents.
                    </span>
                </div>
            </li>
        </ul>

        <!-- AUTHORITY ANCHOR -->
        <div class="archive-highlight">
            <i class="fas fa-quote-left" style="color: var(--premium-gold); margin-right: 10px;"></i>
            "Not by might, nor by power, but by my Spirit, saith the Lord of hosts." 
            <br><span style="font-size: 0.9rem; color: var(--premium-gold);">— Zechariah 4:6</span>
        </div>

        <!-- VALUE PROPOSITION -->
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--glass-border); padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h5 style="color: var(--premium-gold); margin-bottom: 15px; font-family: var(--font-majestic); text-align: center;">
                WHAT YOU RECEIVE
            </h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.95rem;">
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> HD Video Lessons</div>
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> Global Community Support</div>
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> Prophetic Prayer Coverage</div>
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> Certificate of Completion</div>
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> Lifetime Access</div>
                <div><i class="fas fa-check-circle" style="color: var(--premium-gold); margin-right: 8px;"></i> Apostolic Mentorship</div>
            </div>
        </div>

        <!-- CLOSING STATEMENT -->
        <p style="text-align: center; font-style: italic; color: var(--text-secondary); margin-top: 20px;">
            "Many persons attest to being discipled, mentored, and guided into their destiny 
            through the Yeshua Apostolic and Prophetic Altar."
        </p>
    `
};

// Initialize Discipleship Matrix Modal
function initDiscipleshipMatrix() {
    const matrixBtn = document.querySelector('[data-archive="matrix"]');
    const modal = document.getElementById('archive-modal');
    const closeBtn = document.querySelector('#archive-modal .modal-close');
    const mTitle = document.getElementById('archive-title');
    const mBody = document.getElementById('archive-body');
    const mIcon = document.getElementById('archive-icon');
    const mCta = document.getElementById('archive-cta');

    if (!matrixBtn || !modal) return;

    matrixBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Inject SEO-rich content
        if (mIcon) mIcon.innerHTML = discipleshipMatrix.icon;
        if (mTitle) mTitle.textContent = discipleshipMatrix.title;
        if (mBody) mBody.innerHTML = discipleshipMatrix.content;
        if (mCta) {
            mCta.textContent = discipleshipMatrix.ctaText;
            mCta.href = discipleshipMatrix.ctaLink;
        }

        // Update page meta description for SEO (advanced tactic)
        const metaTag = document.querySelector('meta[name="description"]');
        if (metaTag) metaTag.setAttribute('content', discipleshipMatrix.metaDescription);

        // Display modal with accessibility
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        if (closeBtn) closeBtn.focus();

        // Analytics tracking (forward-thinking)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_discipleship_matrix', {
                'event_category': 'Archives',
                'event_label': 'Matrix Modal Opened'
            });
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscipleshipMatrix);
} else {
    initDiscipleshipMatrix();
}

// ==========================================
// 8. PROPHETIC PRAYER TRIAGE ENGINE (CORRECTED)
// Architecture: Matches .quick-btn and data-prayer attributes
// ==========================================

function initPrayerTriage() {
    // 1. DATA PAYLOAD (The "Missing Information" & SEO-rich prompts)
    const propheticData = {
        anxious: {
            scripture: '"Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid." — John 14:27',
            prompt: "Father, I bring my anxiety and worry before You right now. Please calm the storms in my mind, replace my fear with Your perfect peace, and guide my next steps. I trust in Your sovereignty. Amen."
        },
        breakthrough: {
            scripture: '"Not by might nor by power, but by my Spirit, says the Lord Almighty." — Zechariah 4:6',
            prompt: "Lord, I stand on Your promise of breakthrough. Tear down every wall of resistance, release Your transformative anointing over my situation, and open doors that no man can shut. Amen."
        },
        healing: {
            scripture: '"He heals the brokenhearted and binds up their wounds." — Psalm 147:3',
            prompt: "Yeshua, I ask for Your restorative touch. Bring physical, emotional, and spiritual healing to my body and mind. Let Your life-giving power flow through me right now. Amen."
        },
        peace: {
            scripture: '"You will keep in perfect peace those whose minds are steadfast, because they trust in you." — Isaiah 26:3',
            prompt: "Holy Spirit, anchor my soul in Your presence. Silence the noise of the world and let the stillness of Your Spirit reign in my heart, my mind, and my home. Amen."
        }
    };

    // 2. DOM ELEMENTS (Matches your original HTML structure)
    const prayerBtns = document.querySelectorAll('.quick-btn');
    const scriptureBox = document.getElementById('ai-scripture-response');
    const injectedScripture = document.getElementById('injected-scripture');
    const textarea = document.getElementById('prayerMessage');
    const form = document.getElementById('prayerForm');
    const successMsg = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !textarea) return;

    // 3. PRAYER BUTTON INTERACTION (Using data-prayer attribute)
    prayerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prayerType = e.currentTarget.getAttribute('data-prayer');
            const data = propheticData[prayerType];

            // Visual Feedback: Reset all, highlight active
            prayerBtns.forEach(b => b.classList.remove('active-prayer'));
            e.currentTarget.classList.add('active-prayer');

            // Inject Scripture & Prompt
            if (scriptureBox && injectedScripture && data) {
                injectedScripture.textContent = data.scripture;
                scriptureBox.style.display = 'block';
                // Smooth scroll to form
                scriptureBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Pre-fill textarea with anointed prompt
            if (data) {
                textarea.value = data.prompt;
                textarea.focus();
            }
        });
    });

    // 4. FORM SUBMISSION HANDLING (Netlify Compatible)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Visual loading state
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting to the Altar...';
            submitBtn.disabled = true;
        }

        const formData = new FormData(form);

        // Submit to Netlify Forms
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            // Success State
            form.classList.add('hidden');
            document.querySelector('.ai-quick-actions').style.display = 'none';
            if (scriptureBox) scriptureBox.style.display = 'none';
            if (successMsg) {
                successMsg.classList.remove('hidden');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        })
        .catch(() => {
            alert('Transmission failed. Please try again or contact us directly via WhatsApp.');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Prayer Request';
                submitBtn.disabled = false;
            }
        });
    });

    // 5. PRAYER CERTIFICATE GENERATION (Client-Side)
    const certBtn = document.getElementById('download-cert-btn');
    if (certBtn) {
        certBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Dynamically load jsPDF only when needed
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                const altarId = 'YPA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const name = document.getElementById('prayerName').value || 'Believer';

                // PDF Design (Royal Purple & Gold)
                doc.setFillColor(42, 10, 74); 
                doc.rect(0, 0, 210, 40, 'F');
                
                doc.setTextColor(212, 175, 55); 
                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("YESHUA PROPHETIC ALTAR", 105, 20, null, null, "center");
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(12);
                doc.text("OFFICIAL PRAYER RECEIPT", 105, 30, null, null, "center");

                doc.setTextColor(50, 50, 50);
                doc.setFontSize(12);
                doc.text(`Received On Behalf Of: ${name}`, 20, 60);
                doc.text(`Date of Intercession: ${date}`, 20, 70);
                doc.text(`Altar Tracking ID: ${altarId}`, 20, 80);
                
                doc.setDrawColor(212, 175, 55);
                doc.setLineWidth(0.5);
                doc.line(20, 90, 190, 90);

                doc.setFontSize(11);
                doc.setTextColor(100, 100, 100);
                doc.text("Your request has been securely transmitted to our global intercession team.", 20, 105);
                doc.text('"Not by might, nor by power, but by my Spirit, says the Lord Almighty." - Zechariah 4:6', 20, 115);

                doc.save(`Prayer_Receipt_${altarId}.pdf`);
            };
            document.head.appendChild(script);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrayerTriage);
} else {
    initPrayerTriage();
}
    
// ==========================================
// 9. PROPHETIC ARCHIVE DATA ENGINE
// ==========================================
const archiveData = {
    matrix: {
        icon: '<i class="fas fa-book-open"></i>',
        title: 'The Yeshua Discipleship Matrix',
        ctaText: 'Request Course Enrollment',
        content: `
            <p style="margin-bottom: 20px;">
                Welcome to the <strong>Yeshua Apostolic and Prophetic Altar's</strong> premier <strong>online Christian discipleship course</strong>. Designed by Apostle Joshua and Prophetess Lillian, this structured <strong>prophetic training for believers</strong> bridges the gap between foundational Bible study and advanced spiritual maturity.
            </p>
            
            <h4 style="color: var(--premium-gold); margin: 25px 0 15px 0; font-family: var(--font-majestic);">The 4-Phase Architectural Curriculum:</h4>
            
            <ul class="archive-list">
                <li>
                    <i class="fas fa-seedling"></i> 
                    <div>
                        <strong>Phase 1: Apostolic Biblical Foundation</strong><br>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">For new believers: Salvation, identity in Yeshua, water baptism, and the basics of hearing God's voice.</span>
                    </div>
                </li>
                <li>
                    <i class="fas fa-fire"></i> 
                    <div>
                        <strong>Phase 2: Holy Ghost Impartation</strong><br>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">Activating the gifts of the Spirit, understanding the transformative anointing, and walking in breakthrough.</span>
                    </div>
                </li>
                <li>
                    <i class="fas fa-shield-alt"></i> 
                    <div>
                        <strong>Phase 3: Spiritual Warfare Protocols</strong><br>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">Advanced spiritual growth curriculum on binding strongholds, intercessory prayer, and maintaining spiritual authority.</span>
                    </div>
                </li>
                <li>
                    <i class="fas fa-globe-africa"></i> 
                    <div>
                        <strong>Phase 4: Prophetic Deployment</strong><br>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">For seasoned saints: Stepping into your divine mandate, apostolic alignment, and global kingdom impact.</span>
                    </div>
                </li>
            </ul>

            <div class="archive-highlight">
                <i class="fas fa-quote-left" style="color: var(--premium-gold); margin-right: 10px;"></i>
                "Not by might, nor by power, but by my Spirit, saith the Lord of hosts." — Zechariah 4:6
            </div>

            <p style="font-size: 0.9rem; color: var(--text-muted); text-align: center; margin-top: 20px;">
                <i class="fas fa-check-circle" style="color: var(--premium-gold);"></i> Includes video lessons, community support, and a certificate of completion.
            </p>
        `
    },
    directives: {
        icon: '<i class="fas fa-bullhorn"></i>',
        title: 'Current Seasonal Prophetic Directives',
        ctaText: 'Join the Apostolic Intelligence Network',
        content: `
            <div class="archive-highlight">
                "Shift from expansion to consolidation. Fortify the inner sanctum through dedicated fasting, prayer, and alignment with apostolic covering."
            </div>
            <p><strong>Key Focus Areas for this Season:</strong></p>
            <ul class="archive-list">
                <li><i class="fas fa-star"></i> <strong>North America:</strong> Prepare for a sudden harvest of souls. Strengthen local church foundations.</li>
                <li><i class="fas fa-star"></i> <strong>Global Markets:</strong> Execute the Nehemiah rebuild. Do not sign new partnerships without 3-voice counsel.</li>
                <li><i class="fas fa-star"></i> <strong>Africa:</strong> The mantle of the pioneer is returning. Expect unprecedented territorial shifts.</li>
            </ul>
        `
    },
    intercession: {
        icon: '<i class="fas fa-shield-alt"></i>',
        title: 'Intercession Protocols: Spiritual Warfare',
        ctaText: 'Request Prayer Team Support',
        content: `
            <p>Effective intercession is not just asking; it is legislating in the heavenly realms. Follow this 4-step protocol:</p>
            <ul class="archive-list">
                <li><i class="fas fa-shield-alt"></i> <strong>1. Identify:</strong> Discern the root stronghold or assignment of the enemy through the Word.</li>
                <li><i class="fas fa-tint"></i> <strong>2. Plead:</strong> Apply the Blood of Yeshua over your mind, family, and territory.</li>
                <li><i class="fas fa-scroll"></i> <strong>3. Declare:</strong> Speak the specific Scripture that contradicts the enemy's lie (e.g., Isaiah 54:17).</li>
                <li><i class="fas fa-praying-hands"></i> <strong>4. Stand:</strong> Maintain the posture of faith until the manifestation arrives. Do not retreat.</li>
            </ul>
        `
    }
};

// Initialize Archive Modal Logic
const archiveModal = document.getElementById('archive-modal');
const archiveCloseBtn = document.querySelector('#archive-modal .modal-close');
const aTitle = document.getElementById('archive-title');
const aBody = document.getElementById('archive-body');
const aIcon = document.getElementById('archive-icon');
const aCta = document.getElementById('archive-cta');

if (archiveModal) {
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = e.target.getAttribute('data-archive');
            const data = archiveData[key];

            if (data) {
                // Inject Data
                aIcon.innerHTML = data.icon;
                aTitle.textContent = data.title;
                aBody.innerHTML = data.content;
                aCta.textContent = data.ctaText;

                // Show Modal
                archiveModal.classList.add('active');
                archiveModal.setAttribute('aria-hidden', 'false');
                if (archiveCloseBtn) archiveCloseBtn.focus();
            }
        });
    });

    // Closure Logic
    const closeArchiveModal = () => {
        archiveModal.classList.remove('active');
        archiveModal.setAttribute('aria-hidden', 'true');
    };

    if (archiveCloseBtn) archiveCloseBtn.addEventListener('click', closeArchiveModal);
    
    archiveModal.addEventListener('click', (e) => {
        if (e.target === archiveModal) closeArchiveModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && archiveModal.classList.contains('active')) {
            closeArchiveModal();
        }
    });
}
    // ==========================================
    // 10. SCRIPTURE OF THE DAY & TICKER
    // ==========================================
    const scriptures = [
        { verse: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."', ref: 'Jeremiah 29:11' },
        { verse: '"I can do all things through Christ who strengthens me."', ref: 'Philippians 4:13' },
        { verse: '"Trust in the LORD with all your heart and lean not on your own understanding."', ref: 'Proverbs 3:5' },
        { verse: '"The LORD is my shepherd; I shall not want."', ref: 'Psalm 23:1' },
        { verse: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go."', ref: 'Joshua 1:9' }
    ];

    let currentVerseIndex = 0;
    const verseEl = document.getElementById('dailyVerse');
    const refEl = document.getElementById('dailyRef');
    const newVerseBtn = document.getElementById('newVerseBtn');
    const shareVerseBtn = document.getElementById('shareVerseBtn');

    if (newVerseBtn && verseEl && refEl) {
        newVerseBtn.addEventListener('click', () => {
            currentVerseIndex = (currentVerseIndex + 1) % scriptures.length;
            verseEl.textContent = scriptures[currentVerseIndex].verse;
            refEl.textContent = '— ' + scriptures[currentVerseIndex].ref;
        });
    }

    if (shareVerseBtn && verseEl && refEl) {
        shareVerseBtn.addEventListener('click', () => {
            const text = `${verseEl.textContent} ${refEl.textContent} - Yeshua Prophetic Altar`;
            if (navigator.share) {
                navigator.share({ text });
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Scripture copied to clipboard!');
                });
            }
        });
    }
    
    const tickerTrack = document.getElementById('tickerTrack');
    if (tickerTrack) {
        const items = tickerTrack.innerHTML;
        tickerTrack.innerHTML = items + items;
    }

    // ==========================================
    // 11. PROPHETIC INSIGHT ENGINE (NEW MERGED MODULE)
    // ==========================================
    const propheticInsights = {
        guidance: {
            icon: '<i class="fas fa-dove"></i>',
            title: 'Holy Ghost Guidance',
            scripture: '"However, when He, the Spirit of truth, has come, He will guide you into all truth; for He will not speak on His own authority, but whatever He hears He will speak." — John 16:13',
            description: 'The Holy Spirit is not a vague force, but a personal guide. He illuminates the written Word (Scripture) and confirms it through the spoken Word (Prophets), ensuring we never walk in darkness or confusion.'
        },
        vessels: {
            icon: '<i class="fas fa-crown"></i>',
            title: 'Chosen Vessels',
            scripture: '"Surely the Lord God does nothing, unless He reveals His secret to His servants the prophets." — Amos 3:7',
            description: 'God chooses ordinary men and women, sanctifies them, and entrusts them with divine blueprints. A true prophet does not speak their own opinions, but acts as a pure conduit for the mind and will of God.'
        },
        pattern: {
            icon: '<i class="fas fa-scroll"></i>',
            title: 'The Biblical Pattern',
            scripture: '"God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His Son." — Hebrews 1:1-2',
            description: 'From Samuel to Elijah, from John the Baptist to the modern apostolic movement, the pattern remains unbroken. God desires relationship and communication, and He uses prophets to maintain that covenant connection.'
        }
    };

    const modal = document.getElementById('insight-modal');
    const closeBtn = document.querySelector('.modal-close');
    const mTitle = document.getElementById('modal-title');
    const mScripture = document.getElementById('modal-scripture');
    const mDesc = document.getElementById('modal-description');
    const mIcon = document.getElementById('modal-icon');

    if (modal) {
        document.querySelectorAll('.insight-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const data = propheticInsights[id];

                if (data && mTitle && mScripture && mDesc && mIcon) {
                    mIcon.innerHTML = data.icon;
                    mTitle.textContent = data.title;
                    mScripture.textContent = data.scripture;
                    mDesc.textContent = data.description;

                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    if (closeBtn) closeBtn.focus();

                    e.target.textContent = 'Insight Viewed ✓';
                    e.target.style.borderColor = 'var(--premium-gold, #D4AF37)';
                    e.target.style.color = 'var(--premium-gold, #D4AF37)';
                    localStorage.setItem(`insight_${id}`, 'viewed');
                }
            });

            const id = btn.getAttribute('data-id');
            if (localStorage.getItem(`insight_${id}`) === 'viewed') {
                btn.textContent = 'Insight Viewed ✓';
                btn.style.borderColor = 'var(--premium-gold, #D4AF37)';
                btn.style.color = 'var(--premium-gold, #D4AF37)';
            }
        });

        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

// ==========================================
// 12. AI SCRIPTURE SEARCH ENGINE (Client-Side Semantic DB)
// Architecture: Zero-Latency, Zero-API-Cost, Fuzzy-Matching
// ==========================================

const scriptureDB = [
    { ref: "Philippians 4:6-7", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", keywords: ["anxiety", "anxious", "worry", "fear", "peace", "stress"] },
    { ref: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.", keywords: ["fear", "scared", "strength", "help", "anxiety", "courage"] },
    { ref: "Zechariah 4:6", text: "Not by might nor by power, but by my Spirit, says the Lord Almighty.", keywords: ["breakthrough", "power", "spirit", "strength", "miracle", "victory"] },
    { ref: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", keywords: ["future", "hope", "plan", "purpose", "destiny", "provision"] },
    { ref: "Psalm 103:2-3", text: "Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases.", keywords: ["healing", "sickness", "disease", "health", "forgiveness"] },
    { ref: "Matthew 6:33", text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", keywords: ["provision", "money", "financial", "needs", "worry", "kingdom"] },
    { ref: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", keywords: ["purpose", "good", "hard times", "struggle", "hope"] },
    { ref: "Isaiah 54:17", text: "No weapon forged against you will prevail, and you will refute every tongue that accuses you. This is the heritage of the servants of the Lord.", keywords: ["spiritual warfare", "protection", "enemy", "attack", "victory"] },
    { ref: "Psalm 23:4", text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.", keywords: ["depression", "darkness", "fear", "comfort", "sadness"] },
    { ref: "2 Corinthians 12:9", text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ’s power may rest on me.", keywords: ["weakness", "tired", "exhausted", "grace", "strength"] }
];

function initScriptureSearch() {
    const input = document.getElementById('scriptureInput');
    const searchBtn = document.getElementById('scriptureSearchBtn');
    const resultsContainer = document.getElementById('searchResults');
    const quickTags = document.querySelectorAll('.quick-tag');

    if (!input || !resultsContainer) return;

    // Core Search Algorithm
    function performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        if (!normalizedQuery) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Fuzzy matching: Check if query matches any keyword or is in the verse text
        const matches = scriptureDB.filter(verse => {
            const keywordMatch = verse.keywords.some(k => k.includes(normalizedQuery) || normalizedQuery.includes(k));
            const textMatch = verse.text.toLowerCase().includes(normalizedQuery);
            const refMatch = verse.ref.toLowerCase().includes(normalizedQuery);
            return keywordMatch || textMatch || refMatch;
        });

        renderResults(matches, normalizedQuery);
    }

    // Render Results to DOM
    function renderResults(matches, query) {
        resultsContainer.innerHTML = ''; // Clear previous

        if (matches.length > 0) {
            matches.forEach(verse => {
                const card = document.createElement('div');
                card.className = 'verse-result-card';
                card.innerHTML = `
                    <p class="verse-text">"${verse.text}"</p>
                    <p class="verse-ref">— ${verse.ref}</p>
                    <div class="verse-tags">
                        ${verse.keywords.slice(0, 3).map(k => `<span>${k}</span>`).join('')}
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
            // Tier-1 Tactic: Prophetic Fallback. If no exact match, give a powerful default word.
            resultsContainer.innerHTML = `
                <div class="prophetic-fallback">
                    <i class="fas fa-dove" style="font-size: 2rem; color: var(--premium-gold); margin-bottom: 15px;"></i>
                    <h4 style="color: var(--premium-gold); margin-bottom: 10px;">Prophetic Word for "${query}"</h4>
                    <p style="font-style: italic; margin-bottom: 15px;">"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."</p>
                    <p style="font-family: var(--font-majestic); color: var(--premium-gold);">— Jeremiah 29:11</p>
                    <p style="font-size: 0.9rem; margin-top: 15px; color: var(--text-muted);">
                        While our <strong>Christian AI scripture search</strong> indexes more verses, receive this foundational promise. 
                        <a href="#connect" style="color: var(--premium-gold); text-decoration: underline;">Connect with us</a> for personalized prayer.
                    </p>
                </div>
            `;
        }
    }

    // Event Listeners
    searchBtn.addEventListener('click', () => performSearch(input.value));
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(input.value);
    });

    // Live Search (Optional: triggers as user types for "AI-like" feel)
    input.addEventListener('input', (e) => {
        if (e.target.value.length > 2) {
            performSearch(e.target.value);
        } else if (e.target.value.length === 0) {
            resultsContainer.innerHTML = '';
        }
    });

    // Quick Tag Clicks
    quickTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const term = tag.getAttribute('data-term');
            input.value = term;
            performSearch(term);
        });
    });
}

// Initialize Search Engine
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScriptureSearch);
} else {
    initScriptureSearch();
    }

// ==========================================
// 13. M-PESA GIVING MODAL ENGINE
// Architecture: Zero-API, Clipboard Integration, WhatsApp Deep Linking
// ==========================================

function initMpesaModal() {
    const openBtn = document.getElementById('openMpesaModal');
    const modal = document.getElementById('mpesa-modal');
    const closeBtn = document.querySelector('#mpesa-modal .modal-close');
    const paybillText = document.getElementById('mpesa-paybill');

    if (!openBtn || !modal) return;

    // 1. Open Modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // 2. Close Modal Functions
    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 3. One-Tap Copy to Clipboard (The "Hidden Tactic")
    if (paybillText) {
        paybillText.addEventListener('click', () => {
            const number = paybillText.innerText.trim();
            navigator.clipboard.writeText(number).then(() => {
                // Show temporary success toast
                const toast = document.createElement('div');
                toast.className = 'copy-toast';
                toast.innerHTML = '<i class="fas fa-check-circle"></i> Paybill Copied!';
                document.body.appendChild(toast);
                
                // Remove toast after 2 seconds
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMpesaModal);
} else {
    initMpesaModal();
}

// ==========================================
// 14. GLOBAL PRAYER WALL BRIDGE ENGINE
// Architecture: Smooth Scroll, Auto-Focus, Visual Feedback
// ==========================================

function initPrayerWallBridge() {
    const addBtn = document.getElementById('addPrayerRequestBtn');
    const prayerSection = document.getElementById('prayer');
    const prayerTextarea = document.getElementById('prayerMessage');
    const prayerFormCard = document.querySelector('#prayerForm.glass-card') || document.querySelector('#prayer .glass-card');

    if (!addBtn || !prayerSection) return;

    addBtn.addEventListener('click', () => {
        // 1. Smooth Scroll to the master prayer form
        prayerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 2. Wait for scroll to finish, then focus and highlight
        setTimeout(() => {
            if (prayerTextarea) {
                prayerTextarea.focus();
                // Optional: Add a placeholder prompt to guide them
                prayerTextarea.placeholder = "Type your specific prayer request here... Our team is ready to stand with you.";
            }
            
            // 3. Visual Feedback: Pulse the form container to draw the eye
            if (prayerFormCard) {
                prayerFormCard.classList.add('form-highlight');
                // Remove the highlight class after animation completes
                setTimeout(() => {
                    prayerFormCard.classList.remove('form-highlight');
                }, 2000);
            }
        }, 800); // 800ms matches the smooth scroll duration
    });

    // BONUS: Make the "Praying" buttons on the wall interactive (Local UX only)
    document.querySelectorAll('.pray-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const countSpan = this.querySelector('.pray-count');
            let currentCount = parseInt(countSpan.textContent);
            
            // Visual feedback
            this.innerHTML = `<i class="fas fa-check"></i> <span class="pray-count">${currentCount + 1}</span> Prayed`;
            this.style.background = '#4CAF50'; // Green for success
            this.style.color = '#fff';
            
            // Revert after 2 seconds to allow re-engagement
            setTimeout(() => {
                this.innerHTML = `<i class="fas fa-hands-praying"></i> <span class="pray-count">${currentCount + 1}</span> Praying`;
                this.style.background = 'var(--premium-gold)';
                this.style.color = 'var(--royal-purple)';
            }, 2000);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrayerWallBridge);
} else {
    initPrayerWallBridge();
    }    
    
    // ==========================================
// 16. SECURE CONTACT FORM ENGINE (Netlify Native)
// Architecture: Fetch API, Zero-Page-Reload, Honeypot Defense
// ==========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop default page reload
        
        // 1. Visual Loading State
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting to the Altar...';
            submitBtn.disabled = true;
        }

        // 2. Package Form Data (Netlify requires URL-encoded format)
        const formData = new FormData(form);
        const data = new URLSearchParams(formData).toString();

        // 3. Send to Netlify Forms Backend
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        })
        .then(() => {
            // 4. Success State Transition
            form.classList.add('hidden'); // Hide the form
            if (successMsg) {
                successMsg.classList.remove('hidden'); // Show success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        })
        .catch((error) => {
            // 5. Error Handling
            console.error('Form submission error:', error);
            alert('Transmission failed. Please check your connection and try again, or reach out via WhatsApp.');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Transmit Securely';
                submitBtn.disabled = false;
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
    }

// ==========================================
// 17. WORSHIP AUDIO & MEDIA ENGINE
// Architecture: Browser-Compliant Autoplay, Lazy Loading
// ==========================================

function initMediaExperience() {
    const audio = document.getElementById('worshipAudio');
    const toggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioText = document.getElementById('audioText');

    if (!audio || !toggleBtn) return;

    // Set initial low volume for a gentle experience
    audio.volume = 0.4;

    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                // Success: Update UI
                audioIcon.className = 'fas fa-pause';
                audioText.textContent = 'Pause Worship Audio';
                toggleBtn.classList.add('audio-playing');
            }).catch(error => {
                console.log("Audio playback prevented by browser:", error);
            });
        } else {
            // Pause: Update UI
            audio.pause();
            audioIcon.className = 'fas fa-play';
            audioText.textContent = 'Enable Worship Audio';
            toggleBtn.classList.remove('audio-playing');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaExperience);
} else {
    initMediaExperience();
    }
    
    
    // ==========================================
    // 15. AJAX FORM SUBMISSION
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