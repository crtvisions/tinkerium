import type { Filters } from './types';

export const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro Lofi Welcome</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-top: #1a113c;
            --bg-bottom: #3e2f75;
            --text-color: #ff7ac6;
            --robot-color: #76d1d5;
            --floor-color: #110c29;
        }

        /* The body inside the iframe should not have margin */
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'VT323', monospace;
        }

        .scene {
            position: relative;
            width: 500px;
            height: 350px;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.2);
            background: var(--bg-top);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        /* Lofi visual effects */
        .scene::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px);
            opacity: 0.7;
            pointer-events: none;
            animation: flicker 0.15s infinite;
        }

        .welcome-text {
            color: var(--text-color);
            font-size: 6rem;
            text-align: center;
            margin-bottom: 2rem;
            animation: glow 3s ease-in-out infinite alternate;
            z-index: 2;
        }

        .floor {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40%;
            background: var(--floor-color);
            z-index: 0;
        }

        .robot-container {
            display: flex;
            position: absolute;
            bottom: 30px;
            z-index: 1;
        }
        
        .robot {
            width: 60px;
            height: 80px;
            margin: 0 20px;
            position: relative;
            animation: dance 2s ease-in-out infinite;
        }

        .robot .head {
            width: 50px;
            height: 40px;
            background: var(--robot-color);
            border-radius: 8px 8px 4px 4px;
            margin: 0 auto;
            position: relative;
        }

        .robot .head::after { /* Eye */
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: var(--text-color);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--text-color);
        }

        .robot .body {
            width: 60px;
            height: 40px;
            background: var(--robot-color);
            border-radius: 4px;
            margin-top: 5px;
        }

        /* Stagger the animations */
        .robot:nth-child(2) {
            animation-delay: -0.5s;
        }

        .robot:nth-child(3) {
            animation-delay: -1s;
        }

        /* Animations */
        @keyframes flicker {
            0% { opacity: 0.7; }
            50% { opacity: 0.8; }
            100% { opacity: 0.7; }
        }

        @keyframes glow {
            from {
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px var(--text-color), 0 0 40px var(--text-color);
            }
            to {
                text-shadow: 0 0 20px #fff, 0 0 30px var(--text-color), 0 0 40px var(--text-color), 0 0 50px var(--text-color);
            }
        }

        @keyframes dance {
            0%, 100% {
                transform: translateY(0) rotate(0);
            }
            25% {
                transform: translateY(-15px) rotate(-5deg);
            }
            75% {
                transform: translateY(0px) rotate(5deg);
            }
        }
    </style>
</head>
<body>
    <div class="scene">
        <div class="welcome-text">WELCOME</div>
        <div class="floor"></div>
        <div class="robot-container">
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
        </div>
    </div>
</body>
</html>`;

export const GIF_SETTINGS = {
    FPS: 24,
    DURATION_SECONDS: 3,
    DEFAULT_WIDTH: 500,
    DEFAULT_HEIGHT: 350,
    QUALITY: 10,
};

export const initialFilters: Filters = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, invert: 0 };
