let currentStep = 0;

// Function to play background music continuously
function playBgMusic() {
  const music = document.getElementById('bgMusic');
  if (music && music.paused) {
    music.play().catch(err => {
      console.log('Autoplay waiting for user touch/click:', err);
    });
  }
}

// Play audio on first tap or click anywhere on screen
document.addEventListener('click', playBgMusic, { once: true });
document.addEventListener('touchstart', playBgMusic, { once: true });

function createBgHearts() {
  const container = document.getElementById('bgHearts');
  if (!container) return;
  container.innerHTML = '';
  const heartIcons = ['❤️', '💖', '🌸', '✨', '💕'];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'bg-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 90 + 'vw';
    heart.style.animationDuration = (4 + Math.random() * 4) + 's';
    heart.style.animationDelay = (Math.random() * 3) + 's';
    heart.style.fontSize = (16 + Math.random() * 14) + 'px';
    container.appendChild(heart);
  }
}

function buildDots() {
  const dotsNav = document.getElementById('dotsNav');
  if (!dotsNav) return;
  dotsNav.innerHTML = '';
  for (let i = 0; i <= 8; i++) {
    let dot = document.createElement('div');
    dot.className = `step-dot ${i === 0 ? 'active' : ''}`;
    dot.innerText = `0${i}`;
    dot.id = `dot-${i}`;
    dot.onclick = () => goToStep(i);
    dotsNav.appendChild(dot);
  }
}

function startLoading() {
  let progress = 0;
  const fill = document.getElementById('progressFill');
  const interval = setInterval(() => {
    progress += 5;
    if (fill) fill.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      goToStep(1);
    }
  }, 50);
}

function goToStep(stepNum) {
  if (stepNum < 0 || stepNum > 8) return;
  currentStep = stepNum;

  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  
  const targetStep = document.getElementById(`step${stepNum}`);
  if (targetStep) targetStep.classList.add('active');

  // Update Dots
  document.querySelectorAll('.step-dot').forEach((dot, idx) => {
    if (idx === stepNum) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Bottom Navigation Visibility
  const cuteNav = document.getElementById('cuteNav');
  if (cuteNav) {
    cuteNav.style.display = (stepNum > 0) ? 'flex' : 'none';
  }

  if (stepNum === 7) initCanvas();
}

function nextStep() {
  if (currentStep < 8) {
    goToStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

function replay() {
  goToStep(1);
}

function openLetter() {
  var env = document.getElementById('envelopeWrapper');
  var box = document.getElementById('letterBox');
  var btn = document.getElementById('letterNextBtn');
  if (env) env.style.display = 'none';
  if (box) box.style.display = 'block';
  if (btn) btn.style.display = 'inline-block';
}

function popBalloon(el, wish) {
  if (el.classList.contains('popped')) return;
  el.classList.add('popped');
  el.innerText = '✨ ' + wish;
}

function openAlbum(title) {
  document.getElementById('albumTitle').innerText = title;
  document.getElementById('videoModal').style.display = 'flex';
}

function closeAlbum() {
  document.getElementById('videoModal').style.display = 'none';
  const videos = document.querySelectorAll('#videoModal video');
  videos.forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

function initCanvas() {
  const canvas = document.getElementById('heartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#a4133c';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Drag mouse/finger here to draw hearts ✨', canvas.width / 2, canvas.height / 2);

  let isDrawing = false;

  const startDraw = () => { isDrawing = true; };
  const stopDraw = () => { isDrawing = false; };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'touchmove') return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.fillStyle = '#ff4d6d';
    ctx.font = '16px sans-serif';
    ctx.fillText('💖', x, y);
  };

  canvas.onmousedown = startDraw;
  canvas.onmouseup = stopDraw;
  canvas.onmousemove = draw;

  canvas.ontouchstart = startDraw;
  canvas.ontouchend = stopDraw;
  canvas.ontouchmove = draw;
}

window.onload = () => {
  createBgHearts();
  buildDots();
  startLoading();
};