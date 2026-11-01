// ==========================================
// HEADER TEMPLATE
// ==========================================
const headerTemplate = `
    <nav class="glass-nav" role="navigation" aria-label="Main Navigation">
        <div class="logo">
            <a href="index.html" style="text-decoration:none;color:inherit;">
                   YESHUA <span class="accent">PROPHETIC</span> ALTAR
            </a>
        </div>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html">Altar</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="blog.html">Teachings</a></li>
            <li><a href="media.html">Media</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="donate.html">Give</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
        <button class="hamburger" id="hamburger" aria-controls="navLinks" aria-expanded="false" aria-label="Toggle navigation menu">
            <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
    </nav>
`;

// ==========================================
// FOOTER TEMPLATE
// ==========================================
const footerTemplate = `
    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>YESHUA <span class="accent">PROPHETIC</span> ALTAR</h4>
                    <p>A digital apostolic altar broadcasting from Nairobi, Kenya to the nations.</p>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about.html">About</a></li>
                        <li><a href="/media.html">Media</a></li>
                        <li><a href="/events.html">Events</a></li>
                        <li><a href="/donate.html">Give</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                        <li><a href="/nehemiah-protocol.html">Marketplace</a></li>
                        <li><a href="/three-voice-rule.html">Discernment</a></li>
                        <li><a href="/goliath-projects.html">Warfare</a></li>
                        <li><a href="/bloodline-audit.html">Generational Healing</a></li>
                        <li><a href="/executive-fast.html">Fasting</a></li>
                        <li><a href="/church-health.html">Church Health</a></li>
                        <li><a href="/blog.html">Blog</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <div class="social-icons">
                        <a href="https://facebook.com/yeshuapropheticaltar" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="https://youtube.com/@yeshuapropheticaltar" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="https://open.spotify.com" target="_blank" aria-label="Spotify"><i class="fab fa-spotify"></i></a>
                        <a href="https://wa.me/+254718501642" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        <a href="mailto:yeshuapropheticaltar7@gmail.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    </div>
                    
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="year"></span> YESHUA PROPHETIC ALTAR. All Rights Reserved.</p>
                <a href="#home" class="scroll-top"><i class="fas fa-arrow-up"></i> Scroll to Top</a>
            </div>
        </div>
    </footer>
`;

// ==========================================
// AI WIDGET TEMPLATE
// ==========================================
const aiWidgetTemplate = `
    <div id="ai-widget" class="hidden" role="dialog" aria-label="AI Concierge Chat" aria-modal="true">
        <div class="ai-header">
            <div class="ai-status">
                <span class="pulse-dot" aria-hidden="true"></span>    Prophetic Concierge AI ACTIVE
            </div>
            <button id="close-concierge" aria-label="Close Chat">&times;</button>
        </div>
        <div class="ai-body" id="chat-body" aria-live="polite">
            <div class="chat-msg bot">Greetings. I am the Prophetic Concierge. How may I assist your spiritual journey today?</div>
        </div>
        <div class="ai-input">
            <label for="user-input" class="sr-only">Ask the Oracle</label>
            <input type="text" id="user-input" placeholder="Ask the Oracle..." autocomplete="off">
            <button id="send-btn" aria-label="Send Message"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
        </div>
    </div>
    <button id="float-btn" class="ai-float-btn" aria-label="Open AI Concierge">
        <i class="fas fa-comment-dots" aria-hidden="true"></i>
    </button>
`;

// ==========================================
// INJECTION ENGINE
// ==========================================
function injectComponents() {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    const aiEl = document.getElementById('ai-container');

    if (headerEl) headerEl.innerHTML = headerTemplate;
    if (footerEl) footerEl.innerHTML = footerTemplate;
    if (aiEl) aiEl.innerHTML = aiWidgetTemplate;

    initHamburger();
    initYear();
    initAIWidget();
    initOpenConciergeBtn();
}

// ==========================================
// HAMBURGER MENU
// ==========================================
function initHamburger() {
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!isExpanded));
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ==========================================
// DYNAMIC YEAR
// ==========================================
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// OPEN CONCIERGE FROM HERO BUTTON
// ==========================================
function initOpenConciergeBtn() {
    const openBtn = document.getElementById('open-concierge');
    const widget = document.getElementById('ai-widget');
    const floatBtn = document.getElementById('float-btn');
    if (!openBtn || !widget || !floatBtn) return;

    openBtn.addEventListener('click', function () {
        widget.classList.remove('hidden');
        floatBtn.classList.add('hidden');
    });
}

// ==========================================
// FULL AI CHAT LOGIC
// ==========================================
function initAIWidget() {
    const floatBtn = document.getElementById('float-btn');
    const widget = document.getElementById('ai-widget');
    const closeBtn = document.getElementById('close-concierge');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');

    if (!floatBtn || !widget || !closeBtn || !sendBtn || !input || !chatBody) return;

    function toggleWidget() {
        widget.classList.toggle('hidden');
        floatBtn.classList.toggle('hidden');
    }

    floatBtn.addEventListener('click', toggleWidget);
    closeBtn.addEventListener('click', toggleWidget);

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ' + sender;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTyping() {
        const indicator = document.getElementById('typing');
        if (indicator) indicator.remove();
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        showTyping();

        setTimeout(function () {
            removeTyping();
            const lower = text.toLowerCase();
            let response = 'I am processing your inquiry. Please ask about prayer, vision, events, giving, or teachings.';

            if (lower.includes('prayer') || lower.includes('intercession') || lower.includes('help')) {
                response = 'The Apostolic team is standing by. Please visit the Contact page to submit your prayer request securely.';
            } else if (lower.includes('prophet') || lower.includes('joshua') || lower.includes('lillian') || lower.includes('apostle')) {
                response = 'Apostle Joshua and Prophetess Lillian are based in Nairobi, Kenya, broadcasting globally. Visit the About page to learn more.';
            } else if (lower.includes('vision') || lower.includes('mandate') || lower.includes('about')) {
                response = 'Our mandate is to equip the saints and release the prophetic word to the nations. Visit the About page for full details.';
            } else if (lower.includes('teaching') || lower.includes('sermon') || lower.includes('media') || lower.includes('word')) {
                response = 'The Prophetic Archives contain our teachings and sermons. Visit the Media page to access them.';
            } else if (lower.includes('give') || lower.includes('donate') || lower.includes('seed') || lower.includes('offering')) {
                response = 'Thank you for your heart to give. Visit the Give page for secure giving options including PayPal and bank transfer.';
            } else if (lower.includes('event') || lower.includes('service') || lower.includes('meeting') || lower.includes('gather')) {
                response = 'Visit the Events page to see upcoming prophetic gatherings and global broadcasts.';
            } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('peace')) {
                response = 'Peace be unto you. How may I assist your spiritual journey today?';
            }

            addMessage(response, 'bot');
        }, 1200);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSend();
    });
}

// ==========================================
// RELATED POSTS WIDGET - AUTO-INJECTING COMPONENT
// ==========================================

const ARTICLES_DATABASE = [
    {
        id: 'nehemiah-protocol',
        title: 'The Nehemiah Protocol',
        subtitle: 'How Christian Executives Navigate Market Volatility',
        category: 'marketplace',
        categoryLabel: 'Marketplace',
        icon: 'fas fa-chess-king',
        iconBg: 'marketplace-bg',
        readTime: '12 min read',
        date: 'Oct 30, 2026',
        excerpt: 'A 5-point biblical decision making framework for CEOs and marketplace leaders. Includes interactive Decision Matrix.',
        url: 'nehemiah-protocol.html',
        author: 'Apostle Joshua',
        keywords: ['christian business', 'biblical decision making', 'marketplace', 'ceo', 'nehemiah']
    },
    {
        id: 'three-voice-rule',
        title: 'The 3-Voice Rule',
        subtitle: 'How to Test a Prophetic Word Before You Act On It',
        category: 'discernment',
        categoryLabel: 'Discernment',
        icon: 'fas fa-dove',
        iconBg: 'discernment-bg',
        readTime: '14 min read',
        date: 'Oct 30, 2026',
        excerpt: 'How to hear God\'s voice clearly and test any prophetic word. Includes interactive Testing Lab and Scenario Simulator.',
        url: 'three-voice-rule.html',
        author: 'Prophetess Lillian',
        keywords: ['hear god', 'prophetic word', 'discernment', 'testing', '3-voice']
    },
    {
        id: 'goliath-projects',
        title: 'Identifying \'Goliath\' Projects',
        subtitle: 'When a Lucrative Opportunity is a Spiritual Trap',
        category: 'warfare',
        categoryLabel: 'Warfare',
        icon: 'fas fa-shield-alt',
        iconBg: 'warfare-bg',
        readTime: '16 min read',
        date: 'Oct 30, 2026',
        excerpt: 'Spiritual warfare in the workplace. Includes Goliath Project Radar and Warfare Prayer Generator.',
        url: 'goliath-projects.html',
        author: 'Apostle Joshua',
        keywords: ['spiritual warfare', 'workplace', 'toxic coworkers', 'goliath', 'business traps']
    },
    {
        id: 'bloodline-audit',
        title: 'The Bloodline Audit',
        subtitle: '5 Steps to Sever Generational Curses',
        category: 'healing',
        categoryLabel: 'Healing',
        icon: 'fas fa-dna',
        iconBg: 'healing-bg',
        readTime: '18 min read',
        date: 'Oct 30, 2026',
        excerpt: 'How to break generational curses. Includes Bloodline Pattern Analyzer and Healing Timeline.',
        url: 'bloodline-audit.html',
        author: 'Prophetess Lillian',
        keywords: ['generational curses', 'family patterns', 'bloodline', 'healing', 'deliverance']
    },
    {
        id: 'executive-fast',
        title: 'The Executive Fast',
        subtitle: 'A 3-Day Protocol for Divine Direction in Q4',
        category: 'fasting',
        categoryLabel: 'Fasting',
        icon: 'fas fa-fire',
        iconBg: 'fasting-bg',
        readTime: '20 min read',
        date: 'Oct 30, 2026',
        excerpt: 'How to fast for a breakthrough. Daniel Fast for business leaders. Includes Protocol Configurator and Progress Tracker.',
        url: 'executive-fast.html',
        author: 'Apostle Joshua & Prophetess Lillian',
        keywords: ['fasting', 'daniel fast', 'breakthrough', 'q4', 'divine direction']
    },
    {
        id: 'church-health',
        title: 'Apostolic Governance vs. Cult Leadership',
        subtitle: 'How to Protect Your Heart and Finances',
        category: 'healing',
        categoryLabel: 'Healing',
        icon: 'fas fa-heart-pulse',
        iconBg: 'church-bg',
        readTime: '22 min read',
        date: 'Oct 30, 2026',
        excerpt: 'Healing from church hurt. Includes Spiritual Health Diagnostic and Healing Journey Map.',
        url: 'church-health.html',
        author: 'Apostle Joshua & Prophetess Lillian',
        keywords: ['church hurt', 'toxic church', 'cult leadership', 'healing', 'spiritual abuse']
    }
];

function getCurrentPageId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename;
}

function getRelatedPosts(currentId, limit = 3) {
    const currentArticle = ARTICLES_DATABASE.find(a => a.id === currentId);
    if (!currentArticle) return [];
    
    // Filter out current article
    const others = ARTICLES_DATABASE.filter(a => a.id !== currentId);
    
    // Prioritize same category
    const sameCategory = others.filter(a => a.category === currentArticle.category);
    const otherCategory = others.filter(a => a.category !== currentArticle.category);
    
    // Combine: same category first, then others
    const related = [...sameCategory, ...otherCategory];
    
    return related.slice(0, limit);
}

function getAdjacentPosts(currentId) {
    const currentIndex = ARTICLES_DATABASE.findIndex(a => a.id === currentId);
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? ARTICLES_DATABASE[currentIndex - 1] : ARTICLES_DATABASE[ARTICLES_DATABASE.length - 1];
    const next = currentIndex < ARTICLES_DATABASE.length - 1 ? ARTICLES_DATABASE[currentIndex + 1] : ARTICLES_DATABASE[0];
    
    return { prev, next };
}

function generateRelatedPostsHTML() {
    const currentPageId = getCurrentPageId();
    
    // Only inject on article pages
    const articlePages = ARTICLES_DATABASE.map(a => a.id);
    if (!articlePages.includes(currentPageId)) return '';
    
    const currentArticle = ARTICLES_DATABASE.find(a => a.id === currentPageId);
    const relatedPosts = getRelatedPosts(currentPageId, 3);
    const { prev, next } = getAdjacentPosts(currentPageId);
    
    let html = `
    <!-- ========================================== -->
    <!-- RELATED POSTS WIDGET (AUTO-INJECTED) -->
    <!-- ========================================== -->
    <section class="related-posts-section" id="related-posts">
        <div class="container">
            
            <!-- Section Header -->
            <div class="related-header">
                <div class="related-badge"><i class="fas fa-route"></i> CONTINUE YOUR JOURNEY</div>
                <h2 class="related-title">Related Teachings</h2>
                <p class="related-subtitle">You're reading <strong>"${currentArticle.title}"</strong>. Explore these complementary teachings to deepen your understanding.</p>
            </div>
            
            <!-- Related Posts Grid -->
            <div class="related-grid">
    `;
    
    relatedPosts.forEach((post, index) => {
        html += `
                <article class="related-card" style="animation-delay: ${index * 0.1}s">
                    <div class="related-card-image ${post.iconBg}">
                        <div class="related-card-icon"><i class="${post.icon}"></i></div>
                        <div class="related-card-category">${post.categoryLabel}</div>
                    </div>
                    <div class="related-card-body">
                        <div class="related-card-meta">
                            <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <a href="${post.url}" class="related-card-link">
                            Read Article <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </article>
        `;
    });
    
    html += `
            </div>
            
            <!-- Previous / Next Navigation -->
            <div class="article-navigation">
                <a href="${prev.url}" class="nav-arrow nav-prev">
                    <div class="nav-arrow-icon"><i class="fas fa-arrow-left"></i></div>
                    <div class="nav-arrow-content">
                        <span class="nav-label">Previous Teaching</span>
                        <span class="nav-title">${prev.title}</span>
                    </div>
                </a>
                <a href="blog.html" class="nav-center">
                    <i class="fas fa-th-large"></i>
                    <span>All Teachings</span>
                </a>
                <a href="${next.url}" class="nav-arrow nav-next">
                    <div class="nav-arrow-content">
                        <span class="nav-label">Next Teaching</span>
                        <span class="nav-title">${next.title}</span>
                    </div>
                    <div class="nav-arrow-icon"><i class="fas fa-arrow-right"></i></div>
                </a>
            </div>
            
            <!-- Back to Blog CTA -->
            <div class="related-cta">
                <p>Want to explore all teachings, search by topic, or filter by category?</p>
                <a href="blog.html" class="btn-neon">
                    <i class="fas fa-book-open"></i> Browse the Full Teaching Library
                </a>
            </div>
            
        </div>
    </section>
    `;
    
    return html;
}

function injectRelatedPosts() {
    const relatedHTML = generateRelatedPostsHTML();
    if (!relatedHTML) return;
    
    // Find the insertion point: before the footer
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        footerContainer.insertAdjacentHTML('beforebegin', relatedHTML);
    }
}

// ==========================================
// RELATED POSTS STYLES (Injected Dynamically)
// ==========================================
function injectRelatedPostsStyles() {
    const styles = `
    <style id="related-posts-styles">
        /* ==========================================
           RELATED POSTS SECTION
           ========================================== */
        .related-posts-section {
            padding: 80px 20px;
            background: linear-gradient(180deg, transparent 0%, rgba(138,43,226,0.05) 100%);
            border-top: 1px solid var(--border);
        }

        .related-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .related-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(138,43,226,0.15);
            border: 1px solid var(--cyan);
            color: var(--cyan);
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        .related-title {
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            color: var(--gold);
            margin-bottom: 15px;
        }

        .related-subtitle {
            color: #94a3b8;
            font-size: 1.05rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .related-subtitle strong {
            color: var(--text);
        }

        /* Related Grid */
        .related-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            max-width: 1100px;
            margin: 0 auto 50px;
        }

        .related-card {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .related-card:hover {
            transform: translateY(-8px);
            border-color: var(--cyan);
            box-shadow: 0 20px 40px rgba(138,43,226,0.2);
        }

        .related-card-image {
            position: relative;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .marketplace-bg { background: linear-gradient(135deg, rgba(138,43,226,0.3), rgba(255,215,0,0.1)); }
        .discernment-bg { background: linear-gradient(135deg, rgba(0,243,255,0.2), rgba(138,43,226,0.2)); }
        .warfare-bg { background: linear-gradient(135deg, rgba(255,71,87,0.2), rgba(138,43,226,0.2)); }
        .healing-bg { background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(138,43,226,0.2)); }
        .fasting-bg { background: linear-gradient(135deg, rgba(255,140,0,0.2), rgba(138,43,226,0.2)); }
        .church-bg { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(138,43,226,0.2)); }

        .related-card-icon {
            font-size: 2.5rem;
            color: var(--gold);
        }

        .related-card-category {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(0,0,0,0.5);
            color: var(--gold);
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .related-card-body {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .related-card-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
            color: #94a3b8;
            font-size: 0.75rem;
        }

        .related-card-meta i {
            margin-right: 4px;
            color: var(--cyan);
        }

        .related-card-body h3 {
            font-size: 1.1rem;
            color: var(--text);
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .related-card-body > p {
            color: #94a3b8;
            font-size: 0.85rem;
            line-height: 1.5;
            margin-bottom: 15px;
            flex-grow: 1;
        }

        .related-card-link {
            color: var(--cyan);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: 0.3s;
        }

        .related-card-link:hover {
            color: var(--gold);
            gap: 12px;
        }

        /* ==========================================
           ARTICLE NAVIGATION (PREV / NEXT)
           ========================================== */
        .article-navigation {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;
            max-width: 900px;
            margin: 0 auto 40px;
        }

        .nav-arrow {
            display: flex;
            align-items: center;
            gap: 15px;
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            text-decoration: none;
            transition: 0.3s;
        }

        .nav-arrow:hover {
            border-color: var(--cyan);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(138,43,226,0.15);
        }

        .nav-prev {
            flex-direction: row;
            text-align: left;
        }

        .nav-next {
            flex-direction: row;
            text-align: right;
        }

        .nav-arrow-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, var(--cyan), var(--gold));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: var(--bg);
            flex-shrink: 0;
        }

        .nav-arrow-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .nav-label {
            color: #94a3b8;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .nav-title {
            color: var(--text);
            font-weight: 600;
            font-size: 0.9rem;
            line-height: 1.3;
        }

        .nav-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: var(--gold);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: 0.3s;
            padding: 15px;
        }

        .nav-center:hover {
            color: var(--cyan);
            transform: scale(1.1);
        }

        .nav-center i {
            font-size: 1.5rem;
        }

        /* ==========================================
           RELATED CTA
           ========================================== */
        .related-cta {
            text-align: center;
            padding: 30px;
            background: rgba(138,43,226,0.05);
            border: 1px solid var(--border);
            border-radius: 15px;
            max-width: 600px;
            margin: 0 auto;
        }

        .related-cta p {
            color: var(--text);
            margin-bottom: 20px;
        }

        .related-cta .btn-neon {
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        /* ==========================================
           RESPONSIVE
           ========================================== */
        @media (max-width: 900px) {
            .related-grid {
                grid-template-columns: 1fr;
                max-width: 500px;
            }
            
            .article-navigation {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .nav-center {
                order: -1;
                flex-direction: row;
                justify-content: center;
            }
            
            .nav-next {
                flex-direction: row-reverse;
                text-align: left;
            }
        }

        @media (max-width: 600px) {
            .related-posts-section {
                padding: 60px 15px;
            }
            
            .related-card-image {
                height: 120px;
            }
            
            .related-card-icon {
                font-size: 2rem;
            }
        }

        /* ==========================================
           PRINT STYLES
           ========================================== */
        @media print {
            .related-posts-section {
                display: none !important;
            }
        }
    </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ==========================================
// RUN INJECTION (UPDATED TO INCLUDE RELATED POSTS)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    injectComponents();
    injectRelatedPostsStyles();
    
    // Small delay to ensure header/footer are injected first
    setTimeout(function() {
        injectRelatedPosts();
    }, 100);
});