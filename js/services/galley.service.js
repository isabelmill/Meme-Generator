'use strict'

var gImgs;
var imgId = 0;
_createImages()

function _createImages() {
    if (!gImgs || !gImgs.length) {
        gImgs = [
            _createImg(['Politics']),
            _createImg(['Animals']),
            _createImg(['Baby', 'Animals']),
            _createImg(['Animals']),
            _createImg(['Baby']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Funny', 'Baby']),
            _createImg(['Politics']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Politics']),
            _createImg(['Movie']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Movie']),
            _createImg(['Funny']),
            _createImg(['Movie']),
            _createImg(['Funny']),
            _createImg(['Funny']),

        ]
    }
}

function _createImg(keywords) {
    const img = {
        id: imgId++,
        url: `/img/${imgId}.jpg`,
        keywords,
    }
    return img
}

function getImgsForDisplay() {
    var imgsForDisplay = gImgs.slice()
    return imgsForDisplay
}