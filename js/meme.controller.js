'use strict'


function init() {
    console.log('Hello');
    renderImgs()
}


function onImgSelect(elImg) {
    openEditor()
    console.log('elImg:', elImg);
}




function openEditor() {
    document.querySelector(".memes-gallery").classList.add('hide');
    document.querySelector(".about-me").classList.add('hide');
    document.querySelector(".btns").classList.add('hide');
    document.querySelector(".main-footer").classList.add('hide');
    document.querySelector('.meme-editor').classList.remove('hide');
}