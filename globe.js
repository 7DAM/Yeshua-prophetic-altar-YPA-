document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error("Tier-1 Architecture Error: Three.js library not found.");
        return;
    }

    const container = document.getElementById('globe-canvas-container');
    if (!container) return;

    // --- PERFORMANCE ARBITRAGE: Detect Mobile ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 2000 : 8000; // Save mobile GPU, maintain desktop fidelity
    const PIXEL_RATIO = isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2);

    let scene, camera, renderer;
    let globeCore, globeWireframe, atmHalo;
    let rings = [], hotspots = [], stars;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    function initGlobe() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = isMobile ? 5.5 : 6; // Slightly closer on mobile for better impact

        renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true }); // Disable AA on low-end mobile for performance
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(PIXEL_RATIO); 
        container.appendChild(renderer.domElement);

        createGlobeCore();
        createHolographicRings();
        createPrayerHotspots();
        createStarfield();
        createLighting();

        // Desktop Events
        document.addEventListener('mousemove', onMouseMove);
        // Mobile Touch Events
        document.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        
        window.addEventListener('resize', onWindowResize);

        animate();
    }

    function createGlobeCore() {
        const coreGeometry = new THREE.SphereGeometry(1.5, isMobile ? 32 : 64, isMobile ? 32 : 64);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0x2A0A4A, emissive: 0x150524, emissiveIntensity: 0.6,
            shininess: 20, transparent: true, opacity: 0.95
        });
        globeCore = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(globeCore);

        const wireGeometry = new THREE.SphereGeometry(1.52, isMobile ? 16 : 32, isMobile ? 16 : 32);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.15 });
        globeWireframe = new THREE.Mesh(wireGeometry, wireMaterial);
        scene.add(globeWireframe);

        // Note: Custom shaders can be heavy on old mobiles. We keep it, but rely on lower geometry counts above.
        const atmGeo = new THREE.SphereGeometry(1.65, isMobile ? 32 : 64, isMobile ? 32 : 64);
        const atmMat = new THREE.ShaderMaterial({
            vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5); gl_FragColor = vec4(0.83, 0.68, 0.21, 1.0) * intensity; }`,
            blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true
        });
        atmHalo = new THREE.Mesh(atmGeo, atmMat);
        scene.add(atmHalo);
    }

    function createHolographicRings() {
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.3 });
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.008, 16, 100), ringMat);
        ring1.rotation.x = Math.PI / 2.5; scene.add(ring1); rings.push(ring1);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.008, 16, 100), ringMat.clone());
        ring2.rotation.x = Math.PI / 1.5; ring2.rotation.y = Math.PI / 4; scene.add(ring2); rings.push(ring2);
    }

    function createPrayerHotspots() {
        const nodes = [ 
            { lat: -1.29, lon: 36.82, label: 'Nairobi (Source)', prayers: 847 }, 
            { lat: 40.71, lon: -74.00, label: 'New York', prayers: 423 }, 
            { lat: 51.50, lon: -0.12, label: 'London', prayers: 312 }, 
            { lat: 35.68, lon: 139.69, label: 'Tokyo', prayers: 256 } 
        ];

        nodes.forEach((node) => {
            const pos = latLonToVector3(node.lat, node.lon, 1.55);
            const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
            dot.position.copy(pos); scene.add(dot);
            
            const pulse = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.1, 32), new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
            pulse.position.copy(pos); pulse.lookAt(new THREE.Vector3(0, 0, 0)); scene.add(pulse);
            hotspots.push({ dot, pulse, data: node });
        });
    }

    function createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            vertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: isMobile ? 0.2 : 0.15, transparent: true, opacity: 0.6 });
        stars = new THREE.Points(geometry, material);
        scene.add(stars);
    }

    function createLighting() {
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 3, 5); scene.add(dirLight);
        const purpleLight = new THREE.PointLight(0x8A2BE2, 1.5, 15);
        purpleLight.position.set(-5, 2, 5); scene.add(purpleLight);
        const goldLight = new THREE.PointLight(0xD4AF37, 1.2, 15);
        goldLight.position.set(5, -2, 5); scene.add(goldLight);
    }

    function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(-(radius * Math.sin(phi) * Math.cos(theta)), (radius * Math.cos(phi)), (radius * Math.sin(phi) * Math.sin(theta)));
    }

    // --- INTERACTION HANDLERS ---
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onTouchStart(event) {
        if (event.touches.length === 1) {
            mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }

    function onTouchMove(event) {
        // Prevent default scrolling when interacting with the globe
        event.preventDefault(); 
        if (event.touches.length === 1) {
            mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (globeCore && globeWireframe && atmHalo) {
            const rotationSpeed = 0.0015;
            globeCore.rotation.y += rotationSpeed;
            globeWireframe.rotation.y += rotationSpeed;
            atmHalo.rotation.y += rotationSpeed;
            
            targetRotationY = mouseX * 0.4;
            targetRotationX = mouseY * 0.2;
            
            globeCore.rotation.y += (targetRotationY - globeCore.rotation.y) * 0.03;
            globeCore.rotation.x += (targetRotationX - globeCore.rotation.x) * 0.03;
            
            globeWireframe.rotation.x = globeCore.rotation.x;
            atmHalo.rotation.x = globeCore.rotation.x;
        }

        rings.forEach((r, i) => { r.rotation.z += 0.0015 * (i % 2 === 0 ? 1 : -1); });
        if (stars) { stars.rotation.y += 0.0002; stars.rotation.x += 0.0001; }

        const time = Date.now() * 0.002;
        hotspots.forEach((h, i) => {
            const scale = 1 + Math.sin(time + i) * 0.6;
            h.pulse.scale.set(scale, scale, scale);
            h.pulse.material.opacity = 0.8 - Math.sin(time + i) * 0.5;
        });

        renderer.render(scene, camera);
    }

    initGlobe();
});