'use strict'


function saveToStorage(key, val) {
    const str = JSON.stringify(val)
    localStorage.setItem(key, str)
}

function loadFromStorage(key) {
    const str = localStorage.getItem(key)
    const val = JSON.parse(str)
    return val
}

function getSavedFromStorage() {
    var memes = [];
    for (var i = 1; i <= loadFromStorage('SavedMemesNum'); i++) {
        memes.push(loadFromStorage(`meme-${i}`));
    }
    return memes
}