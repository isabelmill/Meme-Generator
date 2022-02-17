'use strict'

var gCanvas;
var gCtx;
var gStartPos;


function init() {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs()
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
    }
    meme.lines.forEach((line, idx) => writeText(idx, true))
}


// canvas functions 

function renderCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    var meme = getgMeme();
    console.log('meme:', meme);
    if (meme) onImgSelect(meme.elImg);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetWidth;
    renderCanvas();
}


function writeText(lineIdx, isText = false) {
    var meme = getgMeme();
    var memeLine = meme.lines[lineIdx];
    if (!isText) {
        renderCanvas();
        drawRect(memeLine);
    }
    if (memeLine.isSticker) {
        var img = new Image();
        img.src = memeLine.img.src;
        gCtx.drawImage(img, memeLine.x, memeLine.y, memeLine.sizeW, memeLine.sizeH);
    } else {
        gCtx.strokeStyle = memeLine.colorStroke;
        gCtx.lineWidth = 1;
        gCtx.textAlign = memeLine.align;
        gCtx.fillStyle = memeLine.color;
        gCtx.font = `${memeLine.size}px ${memeLine.font}`;
        gCtx.fillText(memeLine.text, memeLine.x, memeLine.y);
        gCtx.strokeText(memeLine.text, memeLine.x, memeLine.y);
    }
}

//Opens the Editor when clicking on a meme
function openEditor() {
    document.querySelector(".memes-gallery").classList.add('hide');
    document.querySelector(".about-me").classList.add('hide');
    document.querySelector(".btns").classList.add('hide');
    document.querySelector(".main-footer").classList.add('hide');
    document.querySelector('.meme-editor').classList.remove('hide');
    document.querySelector('.rights').classList.remove('hide');
}

//Opens the Gallery when clicking on Logo or gallery nav
function openGallery() {
    gIdLine = 0;
    document.querySelector('.text-line').value = '';
    document.querySelector(".memes-gallery").classList.remove('hide');
    document.querySelector(".about-me").classList.remove('hide');
    document.querySelector(".btns").classList.remove('hide');
    document.querySelector(".main-footer").classList.remove('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.rights').classList.add('hide');
}

function setLineTxt(text) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine();
    gMeme.lines[gMeme.selectedLineIdx].text = text;
    writeText(gMeme.selectedLineIdx);
}

function addLine() {
    document.querySelector('.text-line').value = '';
    document.querySelector('.text-line').focus();
    addLineToMeme(false);
}

function drawRect(memeLine) {
    var x = memeLine.rectSize.pos.x;
    var y = memeLine.rectSize.pos.y;
    var width = (memeLine.isSticker) ? memeLine.rectSize.width : gCanvas.width;
    var height = (memeLine.isSticker) ? memeLine.sizeH : memeLine.size;
    gCtx.beginPath()
    gCtx.rect(x, y, width, height + 10)
    gCtx.fillStyle = '#aab5b83d'
    gCtx.fillRect(x, y, width, height + 10)
    gCtx.strokeStyle = 'black';
    gCtx.stroke()
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
        addLineTogMeme(true);
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