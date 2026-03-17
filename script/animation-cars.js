document.addEventListener('DOMContentLoaded', () => {
    const redCar = document.querySelector('.image-of-red-car');
    const yellowCar = document.querySelector('.image-of-yellow-car');
    const title = document.querySelector('.main-block_descript');
    const container = document.getElementById('main-container');

    let initial, animation;

    const calculateInitialParams = () => {
        const screenWidth = window.innerWidth;
        const carWidth = Math.min(485, screenWidth * 0.4);
        const carHeight = carWidth * (redCar.naturalHeight / redCar.naturalWidth);

        const titleBlock = document.querySelector('.main-block_title');
        const titleRect = titleBlock.getBoundingClientRect();
        const titleBottom = titleRect.bottom + window.scrollY;
        const redY = titleBottom + titleBlock.offsetHeight * 0.03;

        const redX = screenWidth * 0.1;
        const yellowX = redX + carWidth * 0.8;
        const yellowY = redY + carHeight * 0.1;

        return {
            red: { x: redX, y: redY, angle: 50 },
            yellow: { x: yellowX, y: yellowY, angle: 50 },
            carWidth: carWidth
        };
    };

    const calculateAnimationParams = (initial) => {
        const containerTop = container.getBoundingClientRect().top + window.scrollY;
        const containerHeight = container.offsetHeight;

        const titleTop = title.getBoundingClientRect().top + window.scrollY;

        const offsetFromTitle = containerHeight * 0.19;
        const targetY = titleTop - offsetFromTitle;
        const travelDistance = targetY - initial.red.y;

        const scrollDelay = window.innerHeight * 0.4; 

        return {
            scrollDelay: scrollDelay,
            turnDuration: 0.4,
            yellowDelay: 0.05,
            finalAngle: 90,
            waveAmplitudeX: Math.min(500, window.innerWidth * 0.4),
            waveAmplitudeY: 20,
            waveFrequency: 0.05,
            travelDistance: travelDistance
        };
    };


    const updateCarSizes = () => {
        redCar.style.width = `${initial.carWidth}px`;
        yellowCar.style.width = `${initial.carWidth}px`;
    };

    const updateCars = () => {
        const scrollY = window.scrollY;

        if (scrollY < animation.scrollDelay) {
            redCar.style.transform = `translate(${initial.red.x}px, ${initial.red.y}px) rotate(${initial.red.angle}deg)`;
            yellowCar.style.transform = `translate(${initial.yellow.x}px, ${initial.yellow.y}px) rotate(${initial.yellow.angle}deg)`;
            return;
        }

        const adjustedScroll = scrollY - animation.scrollDelay;
        const progress = Math.min(adjustedScroll / animation.travelDistance, 1);

        const turnProgress = Math.min(progress / animation.turnDuration, 1);
        const angleDiff = animation.finalAngle - initial.red.angle;
        const currentAngle = initial.red.angle + angleDiff * Math.sin(turnProgress * Math.PI / 2);

        let waveOffsetX = 0;
        let waveOffsetY = 0;

        if (progress > animation.turnDuration) {
            const waveTime = (progress - animation.turnDuration) * 100;
            waveOffsetX = Math.sin(waveTime * animation.waveFrequency) * animation.waveAmplitudeX * (1 - progress);
            waveOffsetY = Math.cos(waveTime * animation.waveFrequency) * animation.waveAmplitudeY * (1 - progress);
        }

        const redX = initial.red.x + waveOffsetX;
        const redY = initial.red.y + progress * animation.travelDistance + waveOffsetY;
        redCar.style.transform = `translate(${redX}px, ${redY}px) rotate(${currentAngle}deg)`;

        const yellowProgress = Math.max(0, progress - animation.yellowDelay);
        let yellowWaveOffsetX = 0;
        let yellowWaveOffsetY = 0;

        if (yellowProgress > animation.turnDuration) {
            const yellowWaveTime = (yellowProgress - animation.turnDuration) * 100;
            yellowWaveOffsetX = Math.sin(yellowWaveTime * animation.waveFrequency * 1.3) * animation.waveAmplitudeX * (1 - yellowProgress);
            yellowWaveOffsetY = Math.cos(yellowWaveTime * animation.waveFrequency * 1.3) * animation.waveAmplitudeY * (1 - yellowProgress);
        }

        const yellowX = initial.yellow.x + yellowWaveOffsetX;
        const yellowY = initial.yellow.y + yellowProgress * animation.travelDistance + yellowWaveOffsetY;
        yellowCar.style.transform = `translate(${yellowX}px, ${yellowY}px) rotate(${currentAngle}deg)`;
    };

    const handleResize = () => {
        initial = calculateInitialParams();
        animation = calculateAnimationParams(initial);
        updateCarSizes();
        updateCars();
    };

    const start = () => {
        initial = calculateInitialParams();
        animation = calculateAnimationParams(initial);
        updateCarSizes();
        updateCars();
    };

    if (redCar.complete && yellowCar.complete) {
        start();
    } else {
        yellowCar.onload = redCar.onload = start;
    }

    let animationId;
    window.addEventListener('scroll', () => {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(updateCars);
    }, { passive: true });

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(handleResize);
    });
});
