'use strict'



function renderImgs() {
    var strHTML = getImgsForDisplay().map(
        (img) =>
        `<img class="gallery-img" data-id="${img.id}" src="${img.url}" alt="" onclick="onImgSelect(this)">`
    );
    document.querySelector('.memes-gallery').innerHTML = strHTML.join('')
}