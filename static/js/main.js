// 浮遊する図形を生成
function createFloatingShapes() {
    const shapes = document.getElementById('shapes');
    for (let i = 0; i < 20; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.width = Math.random() * 50 + 20 + 'px';
        shape.style.height = shape.style.width;
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 5 + 's';
        shapes.appendChild(shape);
    }
}

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentQuestion = 1;
let correctAnswers = 0;
let targetNumber = 0;

// キャンバスの初期設定
ctx.strokeStyle = 'black';
ctx.lineWidth = 20;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// マウスイベントの設定
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// タッチイベントの設定
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove') {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('result').textContent = '結果: ?';
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? '⭕' : '❌';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.opacity = '1';
    setTimeout(() => {
        feedback.style.opacity = '0';
    }, 1000);
}

function nextQuestion() {
    currentQuestion++;
    document.getElementById('progress').textContent = `問題: ${currentQuestion}/5`;
    clearCanvas();
    document.getElementById('result').textContent = '結果: ?';
    document.getElementById('nextButton').style.display = 'none';
    generateNewTarget();
}

function generateNewTarget() {
    targetNumber = Math.floor(Math.random() * 10);
    document.getElementById('currentTarget').textContent = targetNumber;
}

function restartQuiz() {
    currentQuestion = 1;
    correctAnswers = 0;
    document.getElementById('progress').textContent = '問題: 1/5';
    document.getElementById('congratulations').style.display = 'none';
    generateNewTarget();
    clearCanvas();
}

async function predict() {
    const imageData = canvas.toDataURL('image/png').split(',')[1];
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData
            })
        });
        
        const data = await response.json();
        const prediction = data.prediction;
        const isCorrect = prediction === targetNumber;
        
        document.getElementById('result').textContent = `結果: ${prediction}`;
        showFeedback(isCorrect);
        
        if (isCorrect) {
            correctAnswers++;
            if (currentQuestion < 5) {
                document.getElementById('nextButton').style.display = 'inline-block';
            } else {
                document.getElementById('congratulations').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'エラーが発生しました';
    }
}

// 初期化
createFloatingShapes();
generateNewTarget(); 