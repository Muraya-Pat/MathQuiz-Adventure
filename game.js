let score = 0;
let currentQuestion;
let selectedOperation = 'add';
let gameScene;

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 500,
    parent: 'game',
    backgroundColor: '#ffffff',
    dom: {
        createContainer: true
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load assets if needed
}

function create() {
    gameScene = this;

    // Create game container
    const gameContainer = this.add.container(0, 0);

    // Create game title
    this.add.text(180, 30, 'Math Quiz Adventure', {
        fontSize: '28px',
        fill: '#4a00e0',
        fontFamily: 'Poppins, sans-serif'
    });

    // Question display
    const questionDisplay = this.add.text(50, 100, '', {
        fontSize: '36px',
        fill: '#333',
        fontFamily: 'Poppins, sans-serif',
        wordWrap: { width: 500 }
    }).setOrigin(0.5, 0);
    questionDisplay.x = 300;

    // Input field
    const answerInput = this.add.dom(300, 280, 'input', {
        type: 'number',
        placeholder: 'Your answer...',
        class: 'answer-input'
    });
    answerInput.setOrigin(0.5);

    // Submit button
    const submitBtn = this.add.dom(300, 370, 'button', {
        class: 'submit-btn'
    }, 'Submit Answer');
    submitBtn.setOrigin(0.5);

    // Next button (initially hidden)
    const nextBtn = this.add.dom(300, 370, 'button', {
        class: 'next-btn'
    }, 'Next Question →');
    nextBtn.setOrigin(0.5);
    nextBtn.setVisible(false);

    // Feedback text
    const feedbackText = this.add.text(300, 380, '', {
        fontSize: '24px',
        fill: '#4a00e0',
        fontStyle: 'bold',
        fontFamily: 'Poppins, sans-serif'
    }).setOrigin(0.5);

    // Set up event listeners
    submitBtn.addListener('click');
    submitBtn.on('click', () => {
        checkAnswer();
    });

    nextBtn.addListener('click');
    nextBtn.on('click', () => {
        nextBtn.setVisible(false);
        submitBtn.setVisible(true);
        feedbackText.setText('');
        generateQuestion();
    });

    // Store references
    gameScene.questionDisplay = questionDisplay;
    gameScene.answerInput = answerInput;
    gameScene.submitBtn = submitBtn;
    gameScene.nextBtn = nextBtn;
    gameScene.feedbackText = feedbackText;

    // Set up operation buttons from HTML
    document.querySelectorAll('.op-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedOperation = btn.dataset.op;
            generateQuestion();
        });
    });

    generateQuestion();
}

function update() {}

function generateQuestion() {
    let a, b, question, answer;
    a = Phaser.Math.Between(1, 10);
    b = Phaser.Math.Between(1, 10);

    switch(selectedOperation) {
        case 'add':
            question = `What is ${a} + ${b}?`;
            answer = a + b;
            break;
        case 'sub':
            if (b > a) [a, b] = [b, a];
            question = `What is ${a} - ${b}?`;
            answer = a - b;
            break;
        case 'mul':
            a = Phaser.Math.Between(1, 6);
            b = Phaser.Math.Between(1, 6);
            question = `What is ${a} × ${b}?`;
            answer = a * b;
            break;
        case 'div':
            answer = Phaser.Math.Between(1, 5);
            b = Phaser.Math.Between(1, 5);
            a = answer * b;
            question = `What is ${a} ÷ ${b}?`;
            break;
    }

    currentQuestion = { question, answer };
    gameScene.questionDisplay.setText(question);
    gameScene.answerInput.node.value = '';
    gameScene.feedbackText.setText('');
    gameScene.answerInput.node.focus();
}

function checkAnswer() {
    const userInput = parseInt(gameScene.answerInput.node.value);
    const feedbackPopup = document.getElementById('feedback-popup');

    if (isNaN(userInput)) {
        gameScene.feedbackText.setText('Please enter a number!');
        gameScene.feedbackText.setFill('#ff0000');
        return;
    }

    if (userInput === currentQuestion.answer) {
        score++;
        document.getElementById('score').textContent = score;

        // Show success feedback
        feedbackPopup.textContent = 'Correct! 🎉';
        feedbackPopup.className = 'correct animate__animated animate__bounceIn';
        setTimeout(() => {
            feedbackPopup.classList.add('animate__bounceOut');
            setTimeout(() => {
                feedbackPopup.className = 'hidden';
            }, 500);
        }, 1500);

        // Create enhanced confetti
        createEnhancedConfetti(gameScene);

        // Show next button
        gameScene.submitBtn.setVisible(false);
        gameScene.nextBtn.setVisible(true);
    } else {
        // Show error feedback
        feedbackPopup.textContent = `Oops! Not correct`;
        feedbackPopup.className = 'incorrect animate__animated animate__shakeX';
        setTimeout(() => {
            feedbackPopup.className = 'hidden';
        }, 2000);

        //gameScene.feedbackText.setText('Try again!');
        gameScene.feedbackText.setFill('#ff0000');
    }
}

function createEnhancedConfetti(scene) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < 100; i++) {
        const confetti = scene.add.dom(
            Phaser.Math.Between(100, 500),
            Phaser.Math.Between(50, 200),
            'div',
            `background-color: ${colors[Math.floor(Math.random() * colors.length)]};
             width: ${Phaser.Math.Between(8, 16)}px;
             height: ${Phaser.Math.Between(8, 16)}px;
             border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
             position: absolute;
             transform: rotate(${Phaser.Math.Between(0, 360)}deg);`
        );

        scene.tweens.add({
            targets: confetti.node,
            y: Phaser.Math.Between(400, 600),
            x: confetti.x + Phaser.Math.Between(-100, 100),
            alpha: 0,
            rotation: Phaser.Math.Between(0, 360),
            duration: Phaser.Math.Between(1000, 2000),
            ease: 'Power2',
            onComplete: () => confetti.destroy()
        });
    }
}