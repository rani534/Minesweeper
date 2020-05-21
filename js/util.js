'use strict'



function buildBoard() {
    var board = [];

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {

            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }
    //   יוצרת מוקשים במיקום רנדומלי
    for (var i = 0; i < gLevel.MINES; i++) {
        var idxI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var idxJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (board[idxI][idxJ].isMine) return buildBoard();
        board[idxI][idxJ].isMine = true;
    }
    return board;

    
}


function setMinesNegsCount() {
    // ריצה על כל המטריצה שיצרנו לאחר ששמנו מוקשים
    for (var posI = 0; posI < gBoard.length; posI++) {
        for (var posJ = 0; posJ < gBoard.length; posJ++) {

            if (gBoard[posI][posJ].isMine) continue;


            for (var i = (posI - 1); i <= (posI + 1); i++) {
                for (var j = (posJ - 1); j <= (posJ + 1); j++) {

                    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
                    if (gBoard[i][j].isMine) gBoard[posI][posJ].minesAroundCount++;

                }
            }
        }
    }

}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var cell = '';

            strHTML += `<td id="cell-${i}-${j}" class="cell"  oncontextmenu="cellMarked(this,${i},${j})"
             onclick="cellClicked(this,${i},${j})" >${cell}</td>`
        }
        strHTML += '</tr>'
    }
    var table = document.querySelector('.game-board');
    table.innerHTML = strHTML;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelector(i, j) {
    return 'cell-' + i + '-' + j;
}


