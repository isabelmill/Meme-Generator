'use strict'



function renderImgs() {
    var strHTML = getImgsForDisplay().map(
        (img, idx) =>
        `<img class="gallery-img" data-id="${idx}" src="${img.url}" alt="" onclick="onImgSelect(this)">`
    );
    document.querySelector('.memes-gallery').innerHTML = strHTML.join('')
}


function toggleMenu() {
    document.body.classList.toggle("menu-open");
}