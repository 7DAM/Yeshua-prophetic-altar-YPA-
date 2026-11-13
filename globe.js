/* ============================================================
   YPA 4D GLOBE — REPAIRED BUILD
   Fixes: mobile scroll-lock, rotation math, sizing, empty panel
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('globe-canvas-container');
    const overlay = document.querySelector('.globe-ui-overlay');
    if (!container) return;

    // Graceful fallback if Three.js failed to load
    if (typeof THREE === 'undefined') {
        container.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 2000 : 8000;
    const PIXEL_RATIO = isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2);

    // Real hotspot data (single source of truth — also fills the UI panel)
    const NODES = [
        { lat: -1.29, lon: 36.82, label: 'Nairobi (Source)', prayers: 847 },
        { lat: 40.71, lon: -74.00, label: 'New York', prayers: 423 },
        { lat: 51.50, lon: -0.12, label: 'London', prayers: 312 },
        { lat: 35.68, lon: 139.69, label: 'Tokyo', prayers: 256 }
    ];

    let scene, camera, renderer, globeGroup, globeCore, globeWireframe, atmHalo;
    let rings = [], hotspots = [], stars;
    let spinY = 0, parX = 0, parY = 0, tParX = 0, tParY = 0;
    let rafId = 0, running = false;

    function getSize() {
        return {
            w: container.clientWidth || window.innerWidth,
            h: container.clientHeight || window.innerHeight
        };
    }

    function init() {
        const { w, h } = getSize();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
        camera.position.z = isMobile ? 8 : 6;

        renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(PIXEL_RATIO);
        renderer.domElement.style.pointerEvents = 'none';
        container.appendChild(renderer.domElement);

        // One group so core + wireframe + halo + cities rotate together
        globeGroup = new THREE.Group();
        scene.add(globeGroup);

        createGlobeCore();
        createHolographicRings();
        createPrayerHotspots();
        createStarfield();
        createLighting();
        populatePanel();

        // Desktop parallax
        document.addEventListener('mousemove', onMouseMove);
        // FIX: passive touch listeners — NEVER preventDefault, so the page scrolls freely
        document.addEventListener('touchstart', onTouch, { passive: true });
        document.addEventListener('touchmove', onTouch, { passive: true });
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
        window.addEventListener('pagehide', dispose);

        start();
    }

    function createGlobeCore() {
        globeCore = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, isMobile ? 32 : 64, isMobile ? 32 : 64),
            new THREE.MeshPhongMaterial({ color: 0x2A0A4A, emissive: 0x150524, emissiveIntensity: 0.6, shininess: 20, transparent: true, opacity: 0.95 })
        );
        globeGroup.add(globeCore);

        globeWireframe = new THREE.Mesh(
            new THREE.SphereGeometry(1.52, isMobile ? 16 : 32, isMobile ? 16 : 32),
            new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.15 })
        );
        globeGroup.add(globeWireframe);

        atmHalo = new THREE.Mesh(
            new THREE.SphereGeometry(1.65, isMobile ? 32 : 64, isMobile ? 32 : 64),
            new THREE.ShaderMaterial({
                vertexShader: 'varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
                fragmentShader: 'varying vec3 vNormal; void main(){ float i = pow(0.65 - dot(vNormal, vec3(0.0,0.0,1.0)), 2.5); gl_FragColor = vec4(0.83,0.68,0.21,1.0) * i; }',
                blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true
            })
        );
        globeGroup.add(atmHalo);
    }

    function createHolographicRings() {
        const mat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.3 });
        const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.008, 16, 100), mat);
        r1.rotation.x = Math.PI / 2.5; scene.add(r1); rings.push(r1);
        const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.008, 16, 100), mat.clone());
        r2.rotation.x = Math.PI / 1.5; r2.rotation.y = Math.PI / 4; scene.add(r2); rings.push(r2);
    }

    function createPrayerHotspots() {
        NODES.forEach(node => {
            const pos = latLonToVector3(node.lat, node.lon, 1.55);
            const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
            dot.position.copy(pos); globeGroup.add(dot);
            const pulse = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.1, 32), new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
            pulse.position.copy(pos); pulse.lookAt(pos.clone().multiplyScalar(2)); globeGroup.add(pulse);
            hotspots.push({ dot, pulse });
        });
    }

    function createStarfield() {
        const geo = new THREE.BufferGeometry();
        const v = [];
        for (let i = 0; i < STAR_COUNT; i++) v.push((Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
        stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: isMobile ? 0.2 : 0.15, transparent: true, opacity: 0.6 }));
        scene.add(stars);
    }

    function createLighting() {
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const d = new THREE.DirectionalLight(0xffffff, 0.8); d.position.set(5, 3, 5); scene.add(d);
        const p = new THREE.PointLight(0x8A2BE2, 1.5, 15); p.position.set(-5, 2, 5); scene.add(p);
        const g = new THREE.PointLight(0xD4AF37, 1.2, 15); g.position.set(5, -2, 5); scene.add(g);
    }

    function latLonToVector3(lat, lon, r) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    }

    // Fill the empty glass panel with the real hotspot data
    function populatePanel() {
        const panel = document.querySelector('.globe-ui-overlay .ui-panel');
        if (!panel) return;
        const total = NODES.reduce((s, n) => s + n.prayers, 0);
        panel.innerHTML =
            '<h3>Live Prayer <span class="gold-text">Hotspots</span></h3>' +
            '<div class="continent-list">' +
            NODES.map(n => '<div class="continent-item"><span class="pulse-dot"></span>' + n.label + ' · ' + n.prayers + '</div>').join('') +
            '</div>' +
            '<div class="ui-stats">' +
            '<div class="stat"><span class="stat-num">' + total.toLocaleString() + '</span><span class="stat-label">Prayers</span></div>' +
            '<div class="stat"><span class="stat-num">' + NODES.length + '</span><span class="stat-label">Nations</span></div>' +
            '</div>';
    }

    function onMouseMove(e) {
        tParY = ((e.clientX / window.innerWidth) * 2 - 1) * 0.4;
        tParX = (-(e.clientY / window.innerHeight) * 2 + 1) * 0.2;
    }
    function onTouch(e) {
        if (e.touches.length === 1) {
            tParY = ((e.touches[0].clientX / window.innerWidth) * 2 - 1) * 0.4;
            tParX = (-(e.touches[0].clientY / window.innerHeight) * 2 + 1) * 0.2;
        }
    }

    function onResize() {
        const { w, h } = getSize();
        camera.aspect = w / h; camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    function animate() {
        rafId = requestAnimationFrame(animate);
        // FIX: continuous spin is separate from mouse parallax (they no longer fight)
        spinY += 0.0015;
        parY += (tParY - parY) * 0.03;
        parX += (tParX - parX) * 0.03;
        globeGroup.rotation.y = spinY + parY;
        globeGroup.rotation.x = parX;

        rings.forEach((r, i) => { r.rotation.z += 0.0015 * (i % 2 === 0 ? 1 : -1); });
        if (stars) { stars.rotation.y += 0.0002; stars.rotation.x += 0.0001; }

        const t = Date.now() * 0.002;
        hotspots.forEach((h, i) => {
            const s = 1 + Math.sin(t + i) * 0.6;
            h.pulse.scale.set(s, s, s);
            h.pulse.material.opacity = 0.8 - Math.sin(t + i) * 0.5;
        });

        renderer.render(scene, camera);
    }

    function start() { if (!running) { running = true; animate(); } }
    function stop() { running = false; cancelAnimationFrame(rafId); }
    function dispose() {
        stop();
        if (renderer) { renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
    }

    init();
});

/* ============================================================
   YPA GLOBAL HARDENING JS
   Load this AFTER script.js and globe.js
   ============================================================ */

(function () {
  "use strict";

  if (window.__ypaHardeningLoaded) return;
  window.__ypaHardeningLoaded = true;

  var report = {
    viewport: false,
    navSticky: false,
    imagesGuarded: 0,
    duplicatesHidden: 0,
    overflowFixed: 0,
    contrastFixed: 0,
    tapTargetsFixed: 0
  };

  var uid = 0;

  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  function emit() {
    try {
      document.dispatchEvent(
        new CustomEvent("ypa:hardening", { detail: report })
      );
    } catch (e) {}
  }

  /* ---------- 1. Viewport ---------- */

  function ensureViewport() {
    var meta = document.querySelector('meta[name="viewport"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }

    if (!/width\s*=\s*device-width/i.test(meta.content || "")) {
      meta.content =
        "width=device-width, initial-scale=1.0, viewport-fit=cover";
    }

    report.viewport = true;
  }

  /* ---------- 2. Sticky navigation ---------- */

  function setupNav() {
    var nav = document.querySelector(
      '.ypa-nav, header.site-header, body > header, body > nav, .navbar, .site-header'
    );

    if (!nav) return;

    var style = getComputedStyle(nav);

    if (style.position === "static" || style.position === "relative") {
      nav.style.position = "sticky";
      nav.style.top = "0";
      nav.style.zIndex = "1000";
    }

    var height = nav.getBoundingClientRect().height;

    if (height > 0) {
      document.documentElement.style.setProperty("--ypa-nav-h", height + "px");
    }

    report.navSticky = true;
  }

  /* ---------- 3. Broken image guard ---------- */

  function makeFallbackSVG(alt, width, height) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    var id = "ypaFallback" + ++uid;

    svg.setAttribute("viewBox", "0 0 400 300");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", alt || "Image");
    svg.classList.add("ypa-img-fallback");

    if (width && height) {
      svg.style.aspectRatio = width + "/" + height;
    }

    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="' + id + 'bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#1f1530"/>' +
          '<stop offset="1" stop-color="#0a0612"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + id + 'gold" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#f5d061"/>' +
          '<stop offset="1" stop-color="#c026d3"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="400" height="300" fill="url(#' + id + 'bg)"/>' +
      '<path d="M110 280 V140 Q110 60 200 60 Q290 60 290 140 V280" fill="none" stroke="url(#' + id + 'gold)" stroke-width="2.5" opacity=".6"/>' +
      '<path d="M200 90 C216 114 224 130 224 146 A24 24 0 0 1 176 146 C176 130 184 114 200 90 Z" fill="url(#' + id + 'gold)"/>' +
      '<g fill="#f5d061" opacity=".6">' +
        '<circle cx="120" cy="80" r="2"/>' +
        '<circle cx="280" cy="70" r="2"/>' +
        '<circle cx="300" cy="180" r="1.6"/>' +
        '<circle cx="100" cy="190" r="1.6"/>' +
      '</g>';

    return svg;
  }

  function guardImages() {
    var images = document.querySelectorAll("img");

    images.forEach(function (img) {
      if (img.__ypaGuarded) return;

      img.__ypaGuarded = true;
      report.imagesGuarded++;

      function replaceBrokenImage() {
        if (img.__ypaReplaced) return;
        img.__ypaReplaced = true;

        var rect = img.getBoundingClientRect();
        var fallback = makeFallbackSVG(img.alt, rect.width, rect.height);
        fallback.style.width = "100%";

        if (img.parentNode) {
          img.parentNode.replaceChild(fallback, img);
        }
      }

      img.addEventListener("error", replaceBrokenImage, { once: true });

      if (img.complete && img.naturalWidth === 0) {
        replaceBrokenImage();
      }
    });
  }

  /* ---------- 4. Duplicate audio button guard ---------- */

  function dedupeAudioButtons() {
    var hidden = 0;
    var groups = new Map();

    var buttons = document.querySelectorAll(
      'button, a[class*="btn"], [role="button"], input[type="button"], input[type="submit"]'
    );

    buttons.forEach(function (el) {
      var text = (el.value || el.textContent || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

      if (!/^(enable|mute)\s+(worship\s+)?audio$/.test(text)) return;

      var scope =
        el.closest("section, article, .ypa-live, .ypa-media-section") ||
        document.body;

      if (!groups.has(scope)) {
        groups.set(scope, Object.create(null));
      }

      var seen = groups.get(scope);

      if (seen[text]) {
        el.style.display = "none";
        el.setAttribute("data-ypa-dedupe", "true");
        hidden++;
      } else {
        seen[text] = true;
      }
    });

    report.duplicatesHidden = hidden;
  }

  /* ---------- 5. Horizontal overflow repair ---------- */

  function repairOverflow() {
    var viewportWidth = document.documentElement.clientWidth;
    var fixed = 0;

    var selector =
      "section, article, div, p, h1, h2, h3, h4, h5, h6, img, video, iframe, table, ul, ol, figure, a, button, span";

    var nodes = document.body.querySelectorAll(selector);

    for (var i = 0; i < nodes.length && i < 1200; i++) {
      var el = nodes[i];

      if (el.closest('[aria-hidden="true"]')) continue;

      var style = getComputedStyle(el);
      if (style.position === "fixed") continue;

      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      if (rect.right > viewportWidth + 1 || rect.left < -1) {
        el.style.maxWidth = "100%";
        el.style.overflowWrap = "anywhere";

        if (
          el.tagName === "IMG" ||
          el.tagName === "VIDEO" ||
          el.tagName === "IFRAME"
        ) {
          el.style.height = "auto";
        }

        fixed++;
      }
    }

    report.overflowFixed = fixed;
  }

  /* ---------- 6. Contrast repair ---------- */

  function parseColor(value) {
    if (!value || value === "transparent") return null;

    var match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;

    var parts = match[1].split(",").map(function (part) {
      return parseFloat(part);
    });

    if (parts.length < 3 || isNaN(parts[0])) return null;

    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts.length > 3 ? parts[3] : 1
    };
  }

  function luminance(color) {
    function channel(v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    return (
      0.2126 * channel(color.r) +
      0.7152 * channel(color.g) +
      0.0722 * channel(color.b)
    );
  }

  function contrastRatio(a, b) {
    var l1 = luminance(a);
    var l2 = luminance(b);

    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  function effectiveBackground(el) {
    var node = el;

    while (node && node !== document.documentElement) {
      var color = parseColor(getComputedStyle(node).backgroundColor);

      if (color && color.a > 0.5) {
        return color;
      }

      node = node.parentElement;
    }

    return (
      parseColor(getComputedStyle(document.body).backgroundColor) || {
        r: 10,
        g: 6,
        b: 18,
        a: 1
      }
    );
  }

  function repairContrast() {
    var fixed = 0;

    var selector =
      "p, h1, h2, h3, h4, h5, h6, span, a, li, button, label, small, strong, em, figcaption, td, th";

    var nodes = document.body.querySelectorAll(selector);

    for (var i = 0; i < nodes.length && i < 1000; i++) {
      var el = nodes[i];

      if (el.closest('[aria-hidden="true"]')) continue;

      var hasText = false;

      for (var j = 0; j < el.childNodes.length; j++) {
        if (
          el.childNodes[j].nodeType === 3 &&
          el.childNodes[j].textContent.trim()
        ) {
          hasText = true;
          break;
        }
      }

      if (!hasText) continue;

      var style = getComputedStyle(el);

      if (style.display === "none" || style.visibility === "hidden") continue;
      if (
        style.webkitTextFillColor === "rgba(0, 0, 0, 0)" ||
        style.backgroundClip === "text"
      ) {
        continue;
      }

      var foreground = parseColor(style.color);
      if (!foreground || foreground.a < 0.5) continue;

      var background = effectiveBackground(el);
      var fontSize = parseFloat(style.fontSize);
      var weight = style.fontWeight;
      var bold =
        weight === "bold" ||
        weight === "bolder" ||
        parseInt(weight, 10) >= 700;

      var required =
        fontSize >= 24 || (fontSize >= 18.66 && bold) ? 3 : 4.5;

      if (contrastRatio(foreground, background) < required) {
        el.style.color = luminance(background) > 0.45 ? "#120a1f" : "#f2edfa";
        fixed++;
      }
    }

    report.contrastFixed = fixed;
  }

  /* ---------- 7. Tap target repair ---------- */

  function repairTapTargets() {
    var fixed = 0;

    var selector =
      'button, [role="button"], .btn, a[class*="btn"], input[type="submit"], input[type="button"], select';

    document.querySelectorAll(selector).forEach(function (el) {
      var rect = el.getBoundingClientRect();

      if (rect.height > 0 && rect.height < 44) {
        el.style.minHeight = "44px";
        fixed++;
      }
    });

    report.tapTargetsFixed = fixed;
  }

  /* ---------- Run everything ---------- */

  function run() {
    ensureViewport();
    setupNav();
    guardImages();
    dedupeAudioButtons();
    repairOverflow();
    repairContrast();
    repairTapTargets();
    emit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  var resizeHandler = debounce(function () {
    setupNav();
    repairOverflow();
    emit();
  }, 250);

  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", resizeHandler);

  if ("MutationObserver" in window) {
    var observer = new MutationObserver(
      debounce(function () {
        guardImages();
        dedupeAudioButtons();
        repairOverflow();
        emit();
      }, 300)
    );

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.YPAHardening = {
    report: function () {
      return Object.assign({}, report);
    },
    run: run
  };
})();