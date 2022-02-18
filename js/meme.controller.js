'use strict'

var gCanvas;
var gCtx;
var gStartPos;
var gSavedMemes;


function init() {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs()
    renderFilterKeywords()
    renderKeywords()
    renderMoreKeywords()
    renderSavedMemes();
    resizeCanvas();
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

function onImgSelectFromGallery(elImg) {
    openSavedMemeEditor()
    var meme = getgMeme()
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (!meme || !meme.lines.length) {
        resizeCanvas();
        updateMeme(elImg);
        renderCanvas();
        return;
    } else updateMemeImg(elImg);
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




//Editor functions

function setLineTxt(text) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine();
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
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
    if (meme.lines.length === 1 && meme.lines[0].text === '') return;

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
    console.log('gMeme.selectedLineIdx:', gMeme.selectedLineIdx);
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    if (align === 'end') {}
    var posX = getPosXToWrite(gMeme.selectedLineIdx);
    gMeme.lines[gMeme.selectedLineIdx].x = posX;
    renderCanvas();
    drawRect(gMeme.lines[gMeme.selectedLineIdx]);
}


function clickChangeColor() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    var elColor = document.querySelector('.color-input');
    elColor.click();
}

function clickChangeColorStroke() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    var elColor = document.querySelector('.stroke-color-input');
    elColor.click();
}

function changeColor() {
    var elColor = document.querySelector('.color-input');
    gMeme.lines[gMeme.selectedLineIdx].color = elColor.value;
    renderCanvas();
}

function changeStrokeColor() {
    var elColor = document.querySelector('.stroke-color-input');
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = elColor.value;
    renderCanvas();
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme.jpg'
}

function onSetFont(font) {
    setFont(font)
}

function onStickerSelect(elSticker) {
    document.querySelector('.text-line').value = '';
    addSticker(elSticker);
    renderCanvas();
    var meme = getgMeme();
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