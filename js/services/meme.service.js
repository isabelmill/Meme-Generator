'use strict'

var gCanvas;
var gMeme;
var gIdLine = 0;
var gSizeFont = 40;
var gFont = 'Impact'


function updateMeme(elImg) {
    gCanvas = document.querySelector('.canvas');
    gMeme = {
        selectedImgId: elImg.dataset.id,
        selectedLineIdx: 0,
        elImg,
        lines: [{
            id: gIdLine++,
            text: 'Add text here',
            size: gSizeFont,
            font: gFont,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            x: gCanvas.width / 2,
            y: 50,
            rectSize: {
                pos: {
                    x: 0,
                    y: 50 - gSizeFont
                },
                height: 65,
                width: gCanvas.width - 40
            },
            isSticker: false,
            isDrag: false
        }],
    }
}

function getgMeme() {
    return gMeme;
}

function updateMemeImg(elImg) {
    var meme = getgMeme();
    meme.elImg = elImg;
    return meme;
}

function drawArc(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, 7, 0, 2 * Math.PI)
    gCtx.fillStyle = 'blue'
    gCtx.fill()

}

function addLineToMeme(isEmptyLines) {
    if (isEmptyLines) gIdLine = 0;
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    var gCanvas = document.querySelector('.canvas');
    var yPos = (gMeme.lines.length === 1) ? gCanvas.height - 20 : gCanvas.height / 2;
    if (gMeme.lines.length === 0) yPos = 50;
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        size: gSizeFont,
        font: gFont,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        x: gCanvas.width / 2,
        y: yPos,
        rectSize: {
            pos: {
                x: 0,
                y: yPos - gSizeFont
            },
            height: 65,
            width: gCanvas.width - 40
        },
        isDrag: false,
        isSticker: false
    })
    if (!isEmptyLines) gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function changeIdLines(gMeme) {
    gMeme.lines.forEach(function (line, idx) {
        line.id = idx;
    })
    gIdLine = gMeme.lines.length;
}

function changeSizeToLine(size) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return;
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) {
        gMeme.lines[gMeme.selectedLineIdx].sizeH += size;
        gMeme.lines[gMeme.selectedLineIdx].sizeW += size;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.width += size;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].size += size;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.pos.y -= size;
        gMeme.lines[gMeme.selectedLineIdx].rectSize.height += size;
    }
}

function getPosXToWrite(lineIdx) {
    gCanvas = document.querySelector('.canvas');
    var xPos;
    switch (gMeme.lines[lineIdx].align) {
        case 'start': {
            xPos = 50;
            break;
        }
        case 'center': {
            xPos = gCanvas.width / 2;
            break;
        }
        case 'end': {
            xPos = gCanvas.width - 50;
            break;
        }
    }
    gMeme.x = xPos;
    return gMeme.x;
}

function setFont(font) {
    gFont = font
    var idx = gMeme.selectedLineIdx
    gMeme.lines[idx].font = gFont
    renderCanvas();
}

function addSticker(elSticker) {
    gCanvas = document.querySelector('.canvas');
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        isSticker: true,
        img: elSticker,
        x: gCanvas.width / 3,
        y: gCanvas.height / 3,
        sizeW: 100,
        sizeH: 100,
        size: 100,
        rectSize: {
            pos: {
                x: gCanvas.width / 3,
                y: gCanvas.height / 3
            },
            height: 100,
            width: elSticker.width + 40
        },
    })
    gMeme.selectedLineIdx = gMeme.lines[gMeme.lines.length - 1].id;
}

function drawRect(memeLine) {
    console.log('memeLine:', memeLine);
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

function writeText(lineIdx, isText) {
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
        gCtx.lineWidth = 2;
        gCtx.textAlign = memeLine.align;
        gCtx.fillStyle = memeLine.color;
        gCtx.font = `${memeLine.size}px ${memeLine.font}`;
        gCtx.fillText(memeLine.text, memeLine.x, memeLine.y);
        gCtx.strokeText(memeLine.text, memeLine.x, memeLine.y);
    }
}