// 3D Digital Globe using Three.js for BRL Welfare Trust website
// Procedurally generates a glowing, holographic digital globe showing Sindh/South Asia coordinates.
// No large external textures needed, ensuring lightning-fast load times.

(function() {
  const SCRIPT_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  
  // Dynamically load Three.js if not already present
  if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.onload = initGlobe;
    document.head.appendChild(script);
  } else {
    initGlobe();
  }
  
  function initGlobe() {
    const container = document.getElementById('globe-canvas-container');
    if (!container) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'globe-canvas';
    container.appendChild(canvas);
    
    // Scene details
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 240;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Groups for rotating
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    
    // Create a beautiful, digital wireframe sphere
    const radius = 80;
    const segments = 32;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    
    // Material with custom teal color and glow outline
    const material = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf, // Teal light
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    
    const globeMesh = new THREE.Mesh(geometry, material);
    globeGroup.add(globeMesh);
    
    // Create longitudinal / latitudinal helper rings for high-tech digital effect
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x0d9488, // Primary Teal
      transparent: true,
      opacity: 0.4
    });
    
    // Add rings along axis
    for (let i = 0; i < 6; i++) {
      const ringGeom = new THREE.BufferGeometry();
      const points = [];
      const angleStep = Math.PI * 2 / 64;
      const ringRadius = radius + 0.5;
      
      for (let j = 0; j <= 64; j++) {
        const theta = j * angleStep;
        points.push(new THREE.Vector3(Math.cos(theta) * ringRadius, 0, Math.sin(theta) * ringRadius));
      }
      
      ringGeom.setFromPoints(points);
      const ringMesh = new THREE.Line(ringGeom, ringMaterial);
      ringMesh.rotation.x = Math.PI / 6 * i;
      ringMesh.rotation.y = Math.PI / 6 * i;
      globeGroup.add(ringMesh);
    }
    
    // Plot glowing dots representing the active villages in Sindh
    // Sindh is roughly around latitude 25-28 N and longitude 67-70 E
    // Convert spherical coordinates to 3D Cartesian space
    const villagePositions = [
      { lat: 25.39, lon: 68.35, name: "Hyderabad" },
      { lat: 27.55, lon: 68.20, name: "Larkana" },
      { lat: 24.65, lon: 68.83, name: "Badin" },
      { lat: 26.73, lon: 67.77, name: "Dadu" },
      { lat: 24.74, lon: 67.92, name: "Thatta" },
      { lat: 28.01, lon: 68.98, name: "Sukkur" },
      { lat: 25.12, lon: 69.01, name: "Mirpur Khas" }
    ];
    
    const markerGeometry = new THREE.SphereGeometry(3, 8, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xea580c, // Secondary Warm Orange
      transparent: true,
      opacity: 0.95
    });
    
    // Aura/Glow material for markers
    const auraGeometry = new THREE.SphereGeometry(6, 8, 8);
    
    villagePositions.forEach(pos => {
      // Conversion from Lat/Lon to XYZ
      const phi = (90 - pos.lat) * (Math.PI / 180);
      const theta = (pos.lon + 180) * (Math.PI / 180);
      
      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      globeGroup.add(marker);
      
      // Dynamic pulsating aura
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0xf59e0b, // Amber Yellow
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      aura.position.set(x, y, z);
      globeGroup.add(aura);
      
      // Keep reference to animate aura scale
      marker.userData = { aura: aura, baseScale: 1.0 };
    });
    
    // Tilt the globe to bring Sindh/South Asia region into view initially
    globeGroup.rotation.x = 0.4;
    globeGroup.rotation.y = 2.4;
    
    // Lighting (subtle)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Interaction Variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    // Drag handlers
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });
    
    canvas.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };
      
      globeGroup.rotation.y += deltaMove.x * 0.006;
      globeGroup.rotation.x += deltaMove.y * 0.006;
      
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    
    window.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    // Window Resize handler
    window.addEventListener('resize', () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    });
    
    // Pulsating and Rotation Animation loop
    let clock = new THREE.Clock();
    
    function animate() {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Auto-spin if user is not actively dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.002;
      }
      
      // Pulsate the markers
      globeGroup.children.forEach(child => {
        if (child.userData && child.userData.aura) {
          const pulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.3;
          child.userData.aura.scale.set(pulse, pulse, pulse);
          child.userData.aura.material.opacity = 0.4 - Math.sin(elapsedTime * 4.0) * 0.15;
        }
      });
      
      renderer.render(scene, camera);
    }
    
    animate();
  }
})();
