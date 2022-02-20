'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gCanvas;
var gCtx;
var gStartPos;
var gSavedMemes;
var gStartPos;


function init() {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs()
    renderFilterKeywords()
    renderKeywords()
    renderMoreKeywords()
    renderSavedMemes();
    resizeCanvas();
    addMouseListeners()
    addTouchListeners()
}

function onImgSelect(elImg) {
    openEditor()
    var meme = getgMeme()
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (!meme || !meme.lines.length) {
        resizeCanvas();
        updateMeme(elImg);
        renderCanvas();
        return;
    } else updateMemeImg(elImg);
    meme.lines.forEach((line, idx) => writeText(idx, true))
}

// Canvas functions

function renderCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    var meme = getgMeme();
    if (meme) onImgSelect(meme.elImg);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetWidth;
    renderCanvas();
}

function onDown(ev) {
    const pos = getEvPos(ev)
    var meme = getgMeme();
    var memeLine = meme.lines[meme.selectedLineIdx];
    if (!isLineClicked(pos, memeLine)) return
    setLineDrag(true)
    gStartPos = pos
}

function onMove(ev) {
    const meme = getgMeme();
    const memeLine = meme.lines[meme.selectedLineIdx];
    if (memeLine.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(memeLine, dx, dy)
        gStartPos = pos
        drawRect(memeLine);
        renderCanvas()
        drawRect(gMeme.lines[gMeme.selectedLineIdx])
    }
}

function onUp() {
    setLineDrag(false)
}

//Event Listeners

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

//Editor functions

function setLineTxt(text) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine();
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
}

function addLine() {
    var meme = getgMeme();
    document.querySelector('.text-line').value = '';
    addLineToMeme();
    renderCanvas();
    drawRect(meme.lines[meme.selectedLineIdx])
}

function switchLine() {
    var meme = getgMeme();
    if ((meme.selectedLineIdx === 0)) meme.selectedLineIdx = meme.lines.length - 1;
    else meme.selectedLineIdx--;
    renderCanvas();
    drawRect(meme.lines[meme.selectedLineIdx]);
    document.querySelector('.text-line').value = meme.lines[meme.selectedLineIdx].text;
}

function deleteLine() {
    document.querySelector('.text-line').value = '';
    var meme = getgMeme();
    var currlineIdx = meme.selectedLineIdx;
    meme.lines.splice(currlineIdx, 1);
    if (meme.lines.length) {
        renderCanvas()
        changeIdLines(meme);
        if (currlineIdx) {
            drawRect(meme.lines[currlineIdx - 1])
            meme.selectedLineIdx = currlineIdx - 1;
        } else {
            drawRect(meme.lines[0])
            meme.selectedLineIdx = 0;
        }
    } else {
        addLineToMeme(true);
        renderCanvas()
    }
}


function changeFontSize(size) {
    changeSizeToLine(size);
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}

function setAlign(align) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    gMeme.lines[gMeme.selectedLineIdx].x = getPos(gMeme.selectedLineIdx);
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}



function changeColor() {
    var elColor = document.querySelector('.color-input');
    gMeme.lines[gMeme.selectedLineIdx].color = elColor.value;
    renderCanvas();
}

function changeStrokeColor() {
    var elColor = document.querySelector('.stroke-color-input');
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = elColor.value;
    clickChangeColorStroke()
    renderCanvas();
}

function clickChangeColor() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    document.querySelector('.color-input').click();
}

function clickChangeColorStroke() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    document.querySelector('.stroke-color-input').click();
}

function onDownloadMeme(elLink) {
    var meme = getgMeme();
    meme.lines.forEach((line, idx) => removeRect(line, elLink))
    renderCanvas();
}

function onSetFont(font) {
    setFont(font)
}

function onStickerSelect(elSticker) {
    document.querySelector('.text-line').value = '';
    addSticker(elSticker);
    var meme = getgMeme();
    renderCanvas();
    drawRect(meme.lines[meme.selectedLineIdx]);
}

function onSaveMeme() {
    gSavedMemes = loadFromStorage('SavedMemesNum');
    if (!gSavedMemes) {
        saveToStorage('SavedMemesNum', 1);
        gSavedMemes = 1;
    } else gSavedMemes++;
    renderCanvas();
    var url = gCanvas.toDataURL();
    saveToStorage(`meme-${gSavedMemes}`, {
        gMeme,
        url
    });
    saveToStorage('SavedMemesNum', gSavedMemes);
    openSavedMemes()
}