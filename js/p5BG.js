const p5BG = (p) => {
    let container;
    let pixels = [];

    p.setup = () => {
        container = document.getElementById("p5bg-container");
        p.createCanvas(
            container.offsetWidth,
            container.offsetHeight
        );

        for (let i = 0; i < 100; i++) {
            let moveAngle = p.random(p.TWO_PI);
            let driftSpeed = p.random(5, 20); 

            pixels.push({
                x: p.random(p.width),
                y: p.random(p.height),
                baseSize: p.random(6, 14), 
                vx: Math.cos(moveAngle) * driftSpeed,
                vy: Math.sin(moveAngle) * driftSpeed,
                currentAngle: p.random(p.TWO_PI),
                rotSpeed: p.random(-0.8, 0.8), 
                phase: p.random(p.TWO_PI),
                pulseSpeed: p.random(0.3, 0.8)
            });
        }
    };

    p.draw = () => {
        p.clear();
        p.background(30, 10, 60, 50);

        const dt = p.deltaTime / 1000;
        const t = p.millis() / 1000;

        for (let pixel of pixels) {
            pixel.x += pixel.vx * dt;
            pixel.y += pixel.vy * dt;
            pixel.currentAngle += pixel.rotSpeed * dt;

            let pixelScale = p.map(Math.sin(t * pixel.pulseSpeed + pixel.phase), -1, 1, 0.6, 1.5);
            let currentPixelSize = pixel.baseSize * pixelScale;
            let cornerRadius = currentPixelSize * 0.35; 

            let maxGlowSize = currentPixelSize * 2.5; 
            let buffer = currentPixelSize + maxGlowSize;

            if (pixel.x < -buffer) pixel.x = p.width + buffer;
            if (pixel.x > p.width + buffer) pixel.x = -buffer;
            if (pixel.y < -buffer) pixel.y = p.height + buffer;
            if (pixel.y > p.height + buffer) pixel.y = -buffer;

            // --- GLOW PASS ---
            p.push();
            p.translate(pixel.x, pixel.y);
            p.rotate(pixel.currentAngle);
            p.rectMode(p.CENTER);
            p.noStroke();

            p.blendMode(p.SCREEN); 

            let glowLayers = 10;
            let maxGlowExpansion = currentPixelSize * 1.5; 

            for (let j = glowLayers; j > 0; j--) {
                let interpolation = j / glowLayers; 
                let currentGlowSize = currentPixelSize + (maxGlowExpansion * interpolation);
                let currentRadius = cornerRadius + (maxGlowExpansion * interpolation * 0.5);
                
                p.fill(255, 255, 255, 3); 
                p.rect(0, 0, currentGlowSize, currentGlowSize, currentRadius);
            }
            p.pop();
            p.push();
            p.translate(pixel.x, pixel.y);
            p.rotate(pixel.currentAngle);
            p.rectMode(p.CENTER);
            
            p.blendMode(p.BLEND); 
            p.noStroke();
            p.fill(255, 255, 255); 

            p.rect(
                0,
                0,
                currentPixelSize,
                currentPixelSize,
                cornerRadius
            );
            p.pop();
        }
    };
};

new p5(p5BG, "p5bg-container");