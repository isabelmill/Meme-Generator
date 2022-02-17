'use strict'



function renderImgs(imgs = getImgsForDisplay()) {
    var strHTML = imgs.map(
        (img, idx) =>
        `<img class="gallery-img" data-id="${idx}" src="${img.url}" alt="" onclick="onImgSelect(this)">`
    );
    document.querySelector('.memes-gallery').innerHTML = strHTML.join('')
}


function moreKeyWord() {
    document.querySelector('.more-keywords-container').classList.toggle('hide');
}

function toggleMenu() {
    document.body.classList.toggle("menu-open");
}

function onFilter(value) {
    var map = getKeysMap()
    map[value]++
    console.log('map:', map);
    var imgs = getImgsForDisplay()
    var filtered = []
    imgs.filter((img) => {
        if (img.keywords.includes(value)) {
            filtered.push(img)
        }
    })
    renderImgs(filtered)
}