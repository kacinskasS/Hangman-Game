let ui = {
    word: document.getElementById('word'),
    loadingBar: document.getElementById('loadingBar'),
    message: document.getElementById('message'),
    buttons: {
        easy: document.getElementById('easy'),
        normal: document.getElementById('normal'),
        hard: document.getElementById('hard'),
    },
    body: document.getElementsByTagName('body')[0],
    sounds:{
        click: new Audio('./key.mp3'),
        clickWin: new Audio('./jackpot.mp3'),
        btn: new Audio('./beep.mp3'),
        win: new Audio('./winner.mp3'),
        lose: new Audio('./losing.mp3'),
    }
};

let game = {
    intervalID: 0,
    word: 'bomba',
    progress: 0,
    difficulty:10,
    waitornot:true,
    drawLetters() {
        ui.word.innerHTML = '';
        for (let i = 0; i < this.word.length; i++) {
            ui.word.innerHTML += `<div class="letter"></div>`;
        }
    },

    checkLetter(e) {
        if (this.waitornot)
            return;
        let letterFound = false;
        console.log(e.key);

        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i] === e.key) {
                //letter correct
                console.log('letter correct', i);

                letterFound = true;
                ui.word.children[i].innerHTML = e.key;
                ui.sounds.clickWin.play();

            }
        }
        if(!letterFound) {
            this.addProgress(this.difficulty);
            ui.sounds.click.play();
        }

        //if win

        for (let letter of ui.word.children) {
            if (!letter.innerHTML)
                return;
        }
        ui.message.innerHTML = 'You Win!!!';
        ui.sounds.win.play();
        ui.body.classList.add('imgconfeti');



        clearInterval(this.intervalID);
        this.waitornot = true;
        setTimeout(() => {
            ui.message.innerHTML = '';
            ui.body.classList.remove('imgconfeti')
            this.init();
    }, 2000);
    },
    addProgress(amount) {
        this.progress += amount;
        this.progress = Math.min(this.progress, 100);
        this.drawProgress();

        if (this.progress === 100) {
            ui.message.innerHTML = 'You loose, try next time...';
            ui.sounds.lose.play();
            ui.body.classList.add('imgexplode');

            clearInterval(this.intervalID);
            this.waitornot = true;
           setTimeout(() => {
               console.log('timeout');
                ui.message.innerHTML = '';
                ui.body.classList.remove('imgexplode');
                this.init();
            },
            2000);
        }},

    drawProgress() {
        ui.loadingBar.style.width = this.progress + '%';
    },

    init() {
        this.waitornot = false;

        let words = ['bomba', 'teroristas', 'apelsinas', 'grybas', 'miestas'];

        let randomIndex = Math.floor(Math.random() * words.length);

        this.word = words[randomIndex];
        this.drawLetters();
        this.progress = 0;
        this.drawProgress();

        this.intervalID = setInterval(() => {
            game.addProgress(0.5);
        }, 300);
    }
};

function difficultyButtons(difficulty, activeEl) {
    game.difficulty = difficulty;
    ui.sounds.btn.play();

    for (let button in ui.buttons) {
        ui.buttons[button].classList.remove('active');
    }

    activeEl.classList.add('active');
}

ui.buttons.easy.addEventListener("click", (e) => {
    difficultyButtons(5, ui.buttons.easy);

});
ui.buttons.normal.addEventListener("click", (e) => {
    difficultyButtons(10, ui.buttons.normal);
});
ui.buttons.hard.addEventListener("click", (e) => {
    difficultyButtons(15, ui.buttons.hard);
});

//starting game
game.init();

document.addEventListener('keyup', (e) => {
    game.checkLetter(e);
}
);

