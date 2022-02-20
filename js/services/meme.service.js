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

function addLineToMeme(isEmptyLines) {
    if (isEmptyLines) gIdLine = 0;
    var gCanvas = document.querySelector('.canvas');
    var yPos = (gMeme.lines.length === 1) ? gCanvas.height - 20 : gCanvas.height / 2;
    if (gMeme.lines.length === 0) yPos = 50;
    gMeme.lines.push({
        id: gIdLine++,
        text: 'Add text here',
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
    drawRect(gMeme.lines[gMeme.selectedLineIdx])

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

function getPos(lineIdx) {
    gCanvas = document.querySelector('.canvas');
    switch (gMeme.lines[lineIdx].align) {
        case 'start': {
            gMeme.x = 50;
            break;
        }
        case 'center': {
            gMeme.x = gCanvas.width / 2;
            break;
        }
        case 'end': {
            gMeme.x = gCanvas.width - 50;
            break;
        }
    }
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
    var x = memeLine.rectSize.pos.x;
    var y = memeLine.rectSize.pos.y;
    var height = (memeLine.isSticker) ? memeLine.sizeH : memeLine.size;
    var width = (memeLine.isSticker) ? memeLine.rectSize.width : gCanvas.width;
    gCtx.beginPath()
    gCtx.rect(x, y, width, height + 10)
    gCtx.fillStyle = '#aab5b83d'
    gCtx.fillRect(x, y, width, height + 10)
    gCtx.strokeStyle = 'black';
    gCtx.stroke()
}

function writeText(lineIdx, isText) {
    var meme = getgMeme();
    var currLine = meme.lines[lineIdx];
    if (!isText) {
        renderCanvas();
        drawRect(currLine);
    }
    gCtx.font = `${currLine.size}px ${currLine.font}`;
    gCtx.lineWidth = 2;
    gCtx.textBaseling = "middle"
    gCtx.strokeStyle = currLine.colorStroke;
    gCtx.textAlign = currLine.align;
    gCtx.fillStyle = currLine.color;
    gCtx.fillText(currLine.text, currLine.x, currLine.y);
    gCtx.strokeText(currLine.text, currLine.x, currLine.y);
    if (currLine.isSticker) {
        var img = new Image();
        img.src = currLine.img.src;
        gCtx.drawImage(img, currLine.x, currLine.y, currLine.sizeW, currLine.sizeH);
    }
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function isLineClicked(pos, line) {
    return pos.x > line.rectSize.pos.x &&
        pos.x < (line.rectSize.pos.x + line.rectSize.width) &&
        pos.y > line.rectSize.pos.y &&
        pos.y < (line.rectSize.pos.y + line.rectSize.height)
}

function moveLine(memeLine, dx, dy) {
    memeLine.x += dx;
    memeLine.y += dy;
    memeLine.rectSize.pos.x += dx;
    memeLine.rectSize.pos.y += dy;
}

function removeRect(line, elLink) {
    var currLine = line;
    console.log('currLine:', currLine);
    currLine.rectSize.width = 0
    renderCanvas();
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme.jpg'
    if (currLine.isSticker) {
        currLine.rectSize.width = 100
    } else currLine.rectSize.width = 310
}