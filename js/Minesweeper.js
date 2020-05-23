
'use strict'

const MINE = "💣";
const FLAG = "🚩";
const QUESTION_MARK = "❓";
const NORMAL = "🙂";
const LOS = "🤯";
const WIN = "😎";

var elSmiley = document.querySelector('.smiley');
var elTimer = document.querySelector('.timer');
var elNumsOfFlag = document.querySelector('.flag');
var elLife = document.querySelector('.life');
var elHint = document.querySelector('.Safe-click');

var audio = new Audio('mine.sound.mp3');


var gStartTimer;
var isFirstClick = false;
// במקום בתוך אובייקט יותר נוח משתנה בחוץ
var gFlagOnGame;
var gBoard;
var gClickedMineCount;
var gCountSafeCell;
var gGame = {
    isOn: true,
    shownCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
};
function ease() {
    gLevel = {
        SIZE: 4,
        MINES: 2
    };
    initGame()
}
function middle() {
    gLevel = {
        SIZE: 8,
        MINES: 12
    };
    initGame()
}
function hard() {
    gLevel = {
        SIZE: 12,
        MINES: 30
    };
    initGame()
}




function initGame() {

    resetVariables();
    gClickedMineCount = 0;
    gBoard = buildBoard();
    setMinesNegsCount();
    renderBoard(gBoard);

    console.table(gBoard);
    console.log(gBoard);

}


function cellClicked(elCell, i, j) {
    //  לחיצה ראשונה תמיד תהיה לא מוקש
    if (!isFirstClick && gBoard[i][j].isMine) {
        gBoard = buildBoard();
        setMinesNegsCount();
        renderBoard(gBoard);
        var idxI = i;
        var idxJ = j;
        var id = getSelector(idxI, idxJ);
        var elCellCopy = document.getElementById(id);
        cellClicked(elCellCopy,idxI, idxJ);
    }
    if (!gGame.isOn) return

    if (!isFirstClick) {
        gStartTimer = setInterval(Interval, 1000);
        isFirstClick = true;
    }

    if (elCell.innerText === FLAG || elCell.innerText === QUESTION_MARK) return;

    if (gBoard[i][j].isMine) {
        explode(i, j)
        return;
    }
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true;
    gGame.shownCount++
    checkGameOver();

    elCell.innerText = gBoard[i][j].minesAroundCount;
    elCell.style.backgroundColor = 'rgb(223, 216, 191)';

    if (elCell.innerText === '') {
        elCell.style.backgroundColor = 'rgb(223, 216, 191)';
        expandShown(gBoard, i, j);

    }
}


function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return;

    if (!isFirstClick) {
        gStartTimer = setInterval(Interval, 1000);
        isFirstClick = true;
    }
    if (gBoard[i][j].isShown) return;

    if (elCell.innerText === QUESTION_MARK) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        checkGameOver();
        return;
    }

    if (gBoard[i][j].isMarked) {
        elCell.innerText = QUESTION_MARK;
        gFlagOnGame--;
        elNumsOfFlag.innerText++;
        return;
    }
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    gFlagOnGame++;
    elNumsOfFlag.innerText--;
    checkGameOver()

}


function checkGameOver() {

    var flagOnMines = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var id = getSelector(i, j);
            var elCell = document.getElementById(id);
            if ((gBoard[i][j].isMine) && (elCell.innerText === FLAG)) flagOnMines++;
        }
    }
    if (flagOnMines === gLevel.MINES && gFlagOnGame === gLevel.MINES) {
        gGame.isOn = false;
        elSmiley.innerText = WIN;
        clearInterval(gStartTimer);
    }
    if (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) {
        gGame.isOn = false;
        elSmiley.innerText = WIN;
        clearInterval(gStartTimer);
    }
}

function expandShown(board, posI, posJ) {

    for (var i = (posI - 1); i <= (posI + 1); i++) {
        for (var j = (posJ - 1); j <= (posJ + 1); j++) {

            if (posI === i && posJ === j) continue;
            if (i < 0 || i >= board.length || j < 0 || j >= board.length) continue;
            var id = getSelector(i, j);
            var elCell = document.getElementById(id);
            cellClicked(elCell, i, j);
        }
    }
}




function explode(idxI, indJ) {

    if (gClickedMineCount < 2) {
        //   יש סאונד  תזהרו לא להבהל 
        // audio.play();
        if (gClickedMineCount === 0) elLife.innerText = '❤    ❤ ';
        if (gClickedMineCount === 1) elLife.innerText = '❤';
        gClickedMineCount++
        return;
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var id = getSelector(i, j);
            var elCell = document.getElementById(id);

            if (gBoard[i][j].isMine) {
                elCell.innerText = MINE;
                elCell.style.backgroundColor = 'rgb(223, 216, 191)';
                continue;
            }

            var id = getSelector(idxI, indJ);
            var elCellExplode = document.getElementById(id);
            elCellExplode.style.backgroundColor = 'red';
            gGame.isOn = false;
            elSmiley.innerText = LOS;
            clearInterval(gStartTimer);
        }
    }

}
function Interval() {
    gGame.secsPassed++
    elTimer.innerText = gGame.secsPassed;
}
function resetVariables() {
    gGame.shownCount = 0;
    gCountSafeCell = 0;
    elLife.innerText = '❤    ❤    ❤';
    elNumsOfFlag.innerText = gLevel.MINES;
    //  מוגדר בנוסף פה כדי שלא יהיו באגים.. כשמתרגל יראה אשאל למה
    clearInterval(gStartTimer);
    elTimer.innerText = 0;
    gGame.secsPassed = 0;
    isFirstClick = false;
    gFlagOnGame = 0;
    elSmiley.innerText = NORMAL;
    gGame.isOn = true;
}

function getSafeCell() {
    if (!gGame.isOn) return;

    if (gCountSafeCell > 2) {
        alert('you have no more safe click!');
        return;
    }
    var idxI = getRandomIntInclusive(0, (gBoard.length - 1));
    var idxJ = getRandomIntInclusive(0, (gBoard.length - 1));
    if (gBoard[idxI][idxJ].isMine || gBoard[idxI][idxJ].isShown) {
        return getSafeCell();

    }
    var id = getSelector(idxI, idxJ);
    var elCell = document.getElementById(id);

    elCell.classList.toggle('chang-color');
    setTimeout(function () {
        elCell.classList.toggle('chang-color');
    }, 500);
    gCountSafeCell++;
}