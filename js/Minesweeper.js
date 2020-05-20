
'use strict'

const MINE = "💣";
const FLAG = "🚩";


var gBoard;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



var gLevel = {
    SIZE: 4,
    MINES: 2
};




function initGame() {
    gBoard = buildBoard();
    setMinesNegsCount();
    renderBoard(gBoard);

    console.table(gBoard);
    console.log(gBoard);

}




function cellClicked(elCell, i, j) {
    if ((gBoard[i][j].isMine) && gGame.shownCount === 0){

        // initGame()
        //  cellClicked(elCell, i, j)
    }
    if (gGame.isOn) return;

      

    if (gBoard[i][j].isMine) {
        gGame.isOn = true;
        return;
    }
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true;

   gGame.shownCount++

    elCell.innerText = gBoard[i][j].minesAroundCount;
    elCell.style.backgroundColor = 'rgb(223, 216, 191)';

    if (elCell.innerText === '') {
        elCell.style.backgroundColor = 'rgb(223, 216, 191)';
        expandShown(gBoard, i, j);

    }


}


function cellMarked(elCell) {
    
}



// function checkGameOver() {
//     if(gBoard.isOn){
        


//     }

// }

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

function getSelector(i, j) {
    return 'cell-' + i + '-' + j;
}