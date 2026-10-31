// ==========================================
// TIER-1 4D INTERACTIVE GLOBE ENGINE (MASTER MERGE)
// Architecture: Three.js r128 + Custom GLSL Shaders
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fail-safe: Ensure Three.js library is loaded
    if (typeof THREE === 'undefined') {
        console.error("Tier-1 Architecture Error: Three.js library not found in index.html.");
        return;
    }

    const container = document.getElementById('globe-canvas-container');
    if (!container) return;

    // --- ARCHITECTURAL STATE ---
    let scene, camera, renderer, globe, stars;
    let rings = [], hotspots = [];
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    // ==========================================
    // INITIALIZATION PROTOCOL
    // ==========================================
    function initGlobe() {
        // Scene Setup (Alpha true allows CSS background to show through)
        scene = new THREE.Scene();

        // Camera Setup
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer Setup (Antialias for smooth edges, Alpha for transparency)
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
        container.appendChild(renderer.domElement);

        // Build the World
        createGlobeCore();
        createContinents();
        createHolographicRings();
        createPrayerHotspots();
        createStarfield();
        createLighting();

        // Bind Events
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);

        // Ignite Engine
        animate();
    }

    // ==========================================
    // COMPONENT GENERATORS
    // ==========================================

    function createGlobeCore() {
        // Deep Royal Purple Core
        const geometry = new THREE.SphereGeometry(1.5, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2A0A4A, 
            emissive: 0x150524, 
            emissiveIntensity: 0.5,
            shininess: 15, 
            transparent: true, 
            opacity: 0.95
        });
        globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Gold Atmospheric Halo (Custom GLSL Shader)
        const atmGeo = new THREE.SphereGeometry(1.58, 64, 64);
        const atmMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
                    gl_FragColor = vec4(0.83, 0.68, 0.21, 1.0) * intensity; // Premium Gold
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        scene.add(new THREE.Mesh(atmGeo, atmMat));
    }

    function createContinents() {
        // All 7 Continents mapped to spherical coordinates
        const continentData = [
            { name: 'Africa', lat: 0, lon: 20 }, { name: 'Europe', lat: 50, lon: 10 },
            { name: 'Asia', lat: 35, lon: 100 }, { name: 'North America', lat: 45, lon: -100 },
            { name: 'South America', lat: -15, lon: -60 }, { name: 'Oceania', lat: -25, lon: 135 },
            { name: 'Antarctica', lat: -85, lon: 0 }
        ];

        continentData.forEach(cont => {
            const points = [];
            const particleCount = 300; // Increased density for richer look
            
            for (let i = 0; i < particleCount; i++) {
                const lat = cont.lat + (Math.random() - 0.5) * (cont.name === 'Antarctica' ? 15 : 35);
                const lon = cont.lon + (Math.random() - 0.5) * 45;
                const pos = latLonToVector3(lat, lon, 1.52);
                points.push(pos.x, pos.y, pos.z);
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const mat = new THREE.PointsMaterial({ 
                color: 0xD4AF37, // Premium Gold
                size: 0.02, 
                transparent: true, 
                opacity: 0.85, 
                blending: THREE.AdditiveBlending 
            });
            scene.add(new THREE.Points(geo, mat));
        });
    }

    function createHolographicRings() {
        // The "4D" Intersecting Orbital Rings
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.3 });
        
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.005, 16, 100), ringMat);
        ring1.rotation.x = Math.PI / 2.5;
        scene.add(ring1); rings.push(ring1);

        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.005, 16, 100), ringMat.clone());
        ring2.rotation.x = Math.PI / 1.5; ring2.rotation.y = Math.PI / 4;
        scene.add(ring2); rings.push(ring2);

        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.002, 16, 100), ringMat.clone());
        ring3.material.opacity = 0.15; ring3.rotation.x = Math.PI / 3;
        scene.add(ring3); rings.push(ring3);
    }

    function createPrayerHotspots() {
        // Injecting Metadata for Future Raycasting (Click-to-interact)
        const nodes = [ 
            { lat: -1.29, lon: 36.82, label: 'Nairobi', prayers: 847 }, 
            { lat: 40.71, lon: -74.00, label: 'New York', prayers: 423 }, 
            { lat: 51.50, lon: -0.12, label: 'London', prayers: 312 }, 
            { lat: 35.68, lon: 139.69, label: 'Tokyo', prayers: 256 }, 
            { lat: -33.87, lon: 151.21, label: 'Sydney', prayers: 189 } 
        ];

        nodes.forEach(node => {
            const pos = latLonToVector3(node.lat, node.lon, 1.53);
            
            // Solid White Core
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 16, 16), 
                new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
            );
            dot.position.copy(pos); 
            scene.add(dot);
            
            // Pulsing Gold Radar Ring
            const pulse = new THREE.Mesh(
                new THREE.RingGeometry(0.04, 0.07, 32), 
                new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
            );
            pulse.position.copy(pos); 
            pulse.lookAt(new THREE.Vector3(0, 0, 0)); 
            scene.add(pulse);
            
            // Store reference and data for future interaction
            hotspots.push({ dot, pulse, data: node });
        });
    }

    function createStarfield() {
        // Deep Space Parallax Background
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 2500; i++) {
            vertices.push((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 });
        stars = new THREE.Points(geometry, material);
        scene.add(stars);
    }

    function createLighting() {
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        
        // Directional light for specular highlights on the purple core
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 3, 5);
        scene.add(dirLight);

        // Thematic Point Lights
        const purpleLight = new THREE.PointLight(0x8A2BE2, 1.2, 10);
        purpleLight.position.set(-5, 2, 5);
        scene.add(purpleLight);

        const goldLight = new THREE.PointLight(0xD4AF37, 0.8, 10);
        goldLight.position.set(5, -2, 5);
        scene.add(goldLight);
    }

    // ==========================================
    // MATH & PHYSICS UTILITIES
    // ==========================================

    function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            (radius * Math.cos(phi)),
            (radius * Math.sin(phi) * Math.sin(theta))
        );
    }

    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    
    // ==========================================
    // THE ANIMATION LOOP (60 FPS Target)
    // ==========================================
    function animate() {
        requestAnimationFrame(animate);
        
        if (globe) {
            // Base continuous rotation
            globe.rotation.y += 0.0015;
            
            // Smooth Mouse Parallax (The "Lerp" Tactic from Old Code)
            targetRotationY = mouseX * 0.4;
            targetRotationX = mouseY * 0.2;
            
            globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.03;
            globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.03;
        }

        // Spin 4D Holographic Rings on independent axes
        rings.forEach((r, i) => { 
            r.rotation.z += 0.0015 * (i % 2 === 0 ? 1 : -1); 
        });

        // Slowly rotate starfield for deep parallax depth
        if (stars) {
            stars.rotation.y += 0.0002;
            stars.rotation.x += 0.0001;
        }

        // Pulse Prayer Hotspots (Sine wave offset by index for organic feel)
        const time = Date.now() * 0.002;
        hotspots.forEach((h, i) => {
            const scale = 1 + Math.sin(time + i) * 0.6;
            h.pulse.scale.set(scale, scale, scale);
            h.pulse.material.opacity = 0.8 - Math.sin(time + i) * 0.5;
        });

        renderer.render(scene, camera);
    }

    // Execute Initialization
    initGlobe();
});