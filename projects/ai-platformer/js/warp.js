const initWarpSketch = (parentSelector) => {
    return new p5((sketch) => {
        // ********** CONTROLS **********
        let DEPTH = 5.0;
        let MAX_SIZE = 10;
        let SPREAD = 1.5;
        let SPEED = 0.01;

        let light = [];
        let cx;
        let cy;

        sketch.setup = () => {
            // Create canvas and attach it to the parent element
            let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            if (parentSelector) {
                canvas.parent(parentSelector);
            }
            
            cx = sketch.width / 2;
            cy = sketch.height / 2;

            for (let i = 0; i < 750; i++) {
                light.push({
                    x: sketch.random(-sketch.width * SPREAD, sketch.width * SPREAD),
                    y: sketch.random(-sketch.height * SPREAD, sketch.height * SPREAD),
                    z: sketch.random(0, DEPTH),
                    r: sketch.random(75, 130),
                    g: 0,
                    b: sketch.random(75, 230)
                });
            }
            sketch.background(0);
        };

        sketch.draw = () => {
            sketch.background(0, 0, 0, 10);
            
            for (let p of light) {
                let tx = (p.x / p.z) + cx;
                let ty = (p.y / p.z) + cy;
                let lx = (p.x / (p.z + SPEED)) + cx;
                let ly = (p.y / (p.z + SPEED)) + cy;
                let scale = ((DEPTH - p.z) / DEPTH);
                let size = scale * MAX_SIZE;
                
                sketch.stroke(p.r, p.g, p.b);
                sketch.strokeWeight(size);
                sketch.line(tx, ty, lx, ly);

                p.z -= SPEED;
                if (p.z < 0) p.z = DEPTH;
            }
        };

        // Keeps things centered if the window scales
        sketch.windowResized = () => {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
            cx = sketch.width / 2;
            cy = sketch.height / 2;
        };
    });
};
