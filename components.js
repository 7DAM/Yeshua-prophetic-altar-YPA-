// ==========================================
// HEADER TEMPLATE
// ==========================================
const headerTemplate = `
    <nav class="glass-nav" role="navigation" aria-label="Main Navigation">
        <div class="logo">
            <a href="index.html" style="text-decoration:none;color:inherit;">
                YESHUA<span class="accent">.</span>NEXUS
            </a>
        </div>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html">Altar</a></li>
            <li><a href="about.html">About</a></li>
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
                    <h4>YESHUA<span class="accent">.</span>NEXUS</h4>
                    <p>A digital apostolic altar broadcasting from Nairobi, Kenya to the nations.</p>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="media.html">Media</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="donate.html">Give</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <div class="social-icons">
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook" aria-hidden="true"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="year"></span> Yeshua Prophetic Altar. All Rights Reserved.</p>
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
                <span class="pulse-dot" aria-hidden="true"></span> NEXUS AI ACTIVE
            </div>
            <button id="close-concierge" aria-label="Close Chat">&times;</button>
        </div>
        <div class="ai-body" id="chat-body" aria-live="polite">
            <div class="chat-msg bot">Greetings. I am the Nexus Concierge. How may I assist your spiritual journey today?</div>
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
// RUN INJECTION
// ==========================================
document.addEventListener('DOMContentLoaded', injectComponents);