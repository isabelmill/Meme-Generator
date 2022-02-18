'use strict'

var gImgs;
var imgId = 0;
var gMapKeyWords;
_createImages()

function _createImages() {
    if (!gImgs || !gImgs.length) {
        gImgs = [
            _createImg(['Politics', 'Trump']),
            _createImg(['Animals', 'Puppy']),
            _createImg(['Baby', 'Animals', 'Puppy']),
            _createImg(['Animals', 'Cat']),
            _createImg(['Baby']),
            _createImg(['History']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Funny', 'Baby']),
            _createImg(['Politics']),
            _createImg(['Sports']),
            _createImg(['Israel']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Movie']),
            _createImg(['Politics', 'Putin']),
            _createImg(['Movie']),
            _createImg(['Funny']),
            _createImg(['Funny']),
            _createImg(['Movie']),
            _createImg(['Funny']),
            _createImg(['Movie']),
            _createImg(['Funny']),

        ]
    }
}

function _createImg(keywords) {
    const img = {
        id: imgId++,
        url: `./img/${imgId}.jpg`,
        keywords,
    }
    return img
}

function getImgsForDisplay() {
    var imgsForDisplay = gImgs.slice()
    return imgsForDisplay
}

function getKeysMap() {
    var imgs = getImgsForDisplay()
    var keys = [];
    imgs.map((img) => {
        img.keywords.forEach((key) => {
            keys.push(key)
        })
    })
    var keysMap = getWordCount(keys)
    gMapKeyWords = keysMap
    return gMapKeyWords
}

function getWordCount(array) {
    let map = {};
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        map[item] = (map[item] + 1) || 1;
    }
    return map;
}