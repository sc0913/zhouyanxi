// ================== 弹球逻辑 ==================
const canvas = document.getElementById('ball-canvas');
const ctx = canvas.getContext('2d');
let balls = [];
let animationId;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Ball {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 10; // 随机水平速度
        this.vy = (Math.random() - 0.5) * 10; // 随机垂直速度
        this.radius = Math.random() * 15 + 5; // 随机大小
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`; // 随机颜色
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        // 碰到边缘反弹
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.vx = -this.vx;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.vy = -this.vy;
        this.x += this.vx; 
        this.y += this.vy;
        this.draw();
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    balls.push(new Ball(x, y));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
    animationId = requestAnimationFrame(animate);
}
animate();

// ================== 扫雷逻辑 ==================
const boardSize = 9; // 9x9 网格
const mineCount = 10; // 10个雷
let board = [];
let gameOver = false;
const gridEl = document.getElementById('minesweeper');

function initGame() {
    gameOver = false;
    gridEl.innerHTML = '';
    board = [];
    
    // 初始化空白棋盘
    for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push({ isMine: false, revealed: false, flag: false, count: 0, el: null });
        }
        board.push(row);
    }

    // 随机埋雷
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let r = Math.floor(Math.random() * boardSize);
        let c = Math.floor(Math.random() * boardSize);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // 计算每个格子周围的雷数
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isMine) continue;
            let count = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    let ni = i + x, nj = j + y;
                    if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && board[ni][nj].isMine) count++;
                }
            }
            board[i][j].count = count;
        }
    }

    // 渲染扫雷网格到页面上
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = i;
            cell.dataset.c = j;
            // 左键点击翻开
            cell.addEventListener('click', () => revealCell(i, j));
            // 右键点击插旗
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if(gameOver || board[i][j].revealed) return;
                board[i][j].flag = !board[i][j].flag;
                cell.textContent = board[i][j].flag ? '🚩' : '';
            });
            board[i][j].el = cell;
            gridEl.appendChild(cell);
        }
    }
}

function revealCell(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flag) return;
    
    const cell = board[r][c];
    cell.revealed = true;
    cell.el.classList.add('revealed');

    // 踩到雷了
    if (cell.isMine) {
        cell.el.classList.add('mine');
        cell.el.textContent = '💥';
        gameOver = true;
        setTimeout(() => alert('Game Over! 你踩到雷了！'), 100);
        return;
    }

    // 显示周围雷数
    if (cell.count > 0) {
        cell.el.textContent = cell.count;
        // 给不同数字上不同颜色
        cell.el.style.color = ['', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'][cell.count] || '#fff';
    } else {
        // 如果周围没雷，自动展开周围的格子
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let ni = r + x, nj = c + y;
                if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && !board[ni][nj].revealed) {
                    revealCell(ni, nj);
                }
            }
        }
    }
}

// 绑定重新开始按钮
document.getElementById('restart-btn').addEventListener('click', initGame);
// 页面加载时初始化游戏
initGame();