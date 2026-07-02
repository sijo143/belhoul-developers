// Dynamic fallback trigger for the brand logo
function handleLogoError() {
    const mainLogo = document.getElementById('mainLogo');
    const fallbackLogo = document.getElementById('fallbackLogo');
    
    // Switch directly to the embedded vector fallback
    mainLogo.classList.add('hidden');
    fallbackLogo.classList.remove('hidden');
}

// Background Parallax Shifting Control
const bgWrapper = document.getElementById('bgWrapper');
window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 60;
    const y = (window.innerHeight / 2 - e.clientY) / 60;
    bgWrapper.style.transform = `translate(${x}px, ${y}px)`;
});

// HTML5 Golden Dust Particle Engine
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 80;
const mouse = {
    x: null,
    y: null,
    radius: 120
};

// Canvas Resizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
resizeCanvas();

// Track Mouse coordinates for magnetic repulsion
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch controls support for mobile
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
});

window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle configuration class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height;
        this.size = Math.random() * 2.2 + 0.5;
        this.baseSpeedY = Math.random() * 0.45 + 0.1;
        this.speedY = this.baseSpeedY;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.angle = Math.random() * Math.PI * 2;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 160, 89, ${this.alpha})`;
        ctx.shadowColor = 'rgba(243, 229, 171, 0.4)';
        ctx.shadowBlur = this.size * 2;
        ctx.fill();
        ctx.restore();
    }

    update() {
        // Rise slowly
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.1;
        this.angle += 0.01;

        // Reset particle on off-screen escape
        if (this.y < -10) {
            this.y = canvas.height + 10;
            this.x = Math.random() * canvas.width;
            this.speedY = this.baseSpeedY;
        }

        // Particle repulsion around mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x += directionX * force * 3.5;
                this.y += directionY * force * 3.5;
            }
        }

        // Pulsate transparency
        this.alpha += this.pulseSpeed;
        if (this.alpha > 0.8 || this.alpha < 0.2) {
            this.pulseSpeed = -this.pulseSpeed;
        }
    }
}

// Instantiate particles array
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Particle Loop Render function
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

// Click to burst golden dust particles
window.addEventListener('click', (e) => {
    const burstCount = 12;
    for (let i = 0; i < burstCount; i++) {
        const p = new Particle();
        p.x = e.clientX;
        p.y = e.clientY;
        p.speedY = Math.random() * 2.5 - 1.25;
        p.speedX = Math.random() * 2.5 - 1.25;
        p.size = Math.random() * 3 + 1;
        p.alpha = 1.0;
        particlesArray.push(p);
        
        // Trim elements to keep performance high
        if (particlesArray.length > 150) {
            particlesArray.shift();
        }
    }
});

// Run animation on load
window.onload = function() {
    initParticles();
    animate();
};