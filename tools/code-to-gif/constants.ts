export const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a2e;
    overflow: hidden;
    font-family: sans-serif;
  }
  .container {
    display: flex;
    gap: 20px;
  }
  .orb {
    width: 50px;
    height: 50px;
    background: #e94560;
    border-radius: 50%;
    animation: bounce 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    box-shadow: 0 0 20px #e94560, 0 0 40px #e94560;
  }
  .orb:nth-child(2) {
    animation-delay: 0.2s;
    background: #16213e;
    box-shadow: 0 0 20px #0f3460, 0 0 40px #0f3460;
  }
  .orb:nth-child(3) {
    animation-delay: 0.4s;
    background: #533483;
    box-shadow: 0 0 20px #533483, 0 0 40px #533483;
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-50px);
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>
</body>
</html>`;

export const GIF_SETTINGS = {
  FPS: 24,
  DURATION_SECONDS: 2,
  DEFAULT_WIDTH: 500,
  DEFAULT_HEIGHT: 500,
  QUALITY: 10,
};
