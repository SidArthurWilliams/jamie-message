const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Runner = Matter.Runner;

const engine = Engine.create();
const runner = Runner.create();
engine.world.gravity.y = 0;

// Adjust engine parameters for smoother motion
engine.timing.timeScale = 0.5;

const svgPaths = [
    './assets/bg-squiggle-01.svg',
    './assets/bg-squiggle-02.svg',
    './assets/bg-squiggle-03.svg',
    './assets/bg-squiggle-04.svg',
    './assets/bg-squiggle-05.svg',
    './assets/bg-star-01-1.svg',
    './assets/bg-star-01.svg',
    './assets/bg-star-02.svg',
    './assets/bg-test-01.svg'
];

function createFloatingElement() {
    const element = document.createElement('div');
    element.className = 'svg-element';
    
    const randomSVG = svgPaths[Math.floor(Math.random() * svgPaths.length)];
    element.style.backgroundImage = `url('${randomSVG}')`;
    
    const size = 10;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    const body = Bodies.circle(x, y, size * 5, {
        friction: 0.0001,
        frictionAir: 0.001,
        restitution: 0.8,
        mass: 1,
        velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        }
    });

    element.body = body;
    document.getElementById('container').appendChild(element);
    World.add(engine.world, body);
    
    // Add constant force for perpetual motion
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);
    
    return { element, body };
}

// Create boundary walls with more bounce
const walls = [
    Bodies.rectangle(window.innerWidth/2, -10, window.innerWidth, 20, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(window.innerWidth/2, window.innerHeight+10, window.innerWidth, 20, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(-10, window.innerHeight/2, 20, window.innerHeight, { isStatic: true, restitution: 1 }),
    Bodies.rectangle(window.innerWidth+10, window.innerHeight/2, 20, window.innerHeight, { isStatic: true, restitution: 1 })
];
World.add(engine.world, walls);

// Create floating elements
const elementCount = Math.floor((window.innerWidth * window.innerHeight) / 40000);
const elements = [];
for(let i = 0; i < elementCount; i++) {
    elements.push(createFloatingElement());
}

// Animation loop with continuous motion
function updateElements() {
    elements.forEach(({ element, body }) => {
        // Add small random impulse to maintain motion
        if (Math.random() < 0.02) {
            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.0001,
                y: (Math.random() - 0.5) * 0.0001
            });
        }
        
        element.style.transform = `translate(${body.position.x}px, ${body.position.y}px) 
                                 rotate(${body.angle}rad) scale(0.75)`;
    });
    requestAnimationFrame(updateElements);
}

// Start the physics engine and animation
Runner.run(runner, engine);
updateElements();

// Handle resize
window.addEventListener('resize', () => {
    elements.forEach(({ element, body }) => {
        World.remove(engine.world, body);
        element.remove();
    });
    elements.length = 0;
    
    const newCount = Math.floor((window.innerWidth * window.innerHeight) / 40000);
    for(let i = 0; i < newCount; i++) {
        elements.push(createFloatingElement());
    }
});

// Add after existing code

function typeText() {
    const text = "I love jamie...He is a BABY! ;)";
    const element = document.getElementById('typing-text');
    element.style.opacity = '1';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 5000 / text.length); // Distribute 5 seconds across all characters
        } else {
            // Text is fully typed, wait 10 seconds then fade out
            setTimeout(() => {
                element.style.animation = 'fadeOut 1s forwards';
                // Reset and restart after fadeout
                setTimeout(() => {
                    element.textContent = '';
                    element.style.animation = '';
                    element.style.opacity = '0';
                    setTimeout(() => {
                        typeText(); // Restart the sequence
                    }, 1000);
                }, 1000);
            }, 10000);
        }
    }

    // Start typing after 1 second delay
    setTimeout(type, 1000);
}

// Start the typing animation
typeText();