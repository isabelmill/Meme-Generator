'use strict'


function renderImgs(imgs = getImgsForDisplay()) {
    var strHTML = imgs.map(
        (img, idx) =>
        `<img class="gallery-img" data-id="${idx}" src="${img.url}" alt="" onclick="onImgSelect(this)">`
    );
    document.querySelector('.memes-gallery').innerHTML = strHTML.join('')
}

function renderFilterKeywords() {
    var strHTML = '';
    var keysMap = getKeysMap();
    var keys = Object.keys(keysMap)
    keys.forEach(key => {
        strHTML += `
      <option value="${key}"></option>
      `
    })
    strHTML += `
    <option value="ALL"></option>
    `
    document.querySelector('#keys').innerHTML = strHTML
}

function renderKeywords() {
    var keysMap = getKeysMap();
    var keys = Object.keys(keysMap)
    var values = Object.values(keysMap)
    var strHTML = ''

    for (var i = 0; i < keys.length; i++) {
        if (values[i] > 2)
            strHTML += `
    <button class="keyword-btn" onclick="onFilter(this.value)" value="${keys[i]}"  style="font-size:${(values[i] * 4.5)}px">${keys[i]}</button>
    `
    }
    strHTML += `
    <button class="keyword-btn" style="font-size:14px" onclick="toggleMoreKeyWords()">More...</button>
    `


    document.querySelector('.keywords-list').innerHTML = strHTML


}

function renderMoreKeywords() {
    var keysMap = getKeysMap();
    var keys = Object.keys(keysMap)
    var values = Object.values(keysMap)
    var strHTMLMore = ''
    for (var i = 0; i < keys.length; i++) {
        if (values[i] < 2)
            strHTMLMore += `
    <button class="keyword-btn" onclick="onFilter(this.value)" value="${keys[i]}"  style="font-size:${(values[i] * 13.5)}px">${keys[i]}</button>
    `
    }
    document.querySelector('.keywords-second-list').innerHTML = strHTMLMore
}

function toggleMoreKeyWords() {
    document.querySelector('.more-keywords-container').classList.toggle('hide');
}

function toggleMenu() {
    document.body.classList.toggle("menu-open");
}

function onFilter(value) {
    if (value === 'ALL') {
        renderImgs()
        return
    }
    var imgs = getImgsForDisplay()
    var filtered = []
    imgs.filter((img) => {
        if (img.keywords.includes(value)) {
            filtered.push(img)
        }
    })
    renderImgs(filtered)
    document.querySelector('input[name=filter]').value = ''

}

function renderSavedMemes() {
    var strHTML = '';
    var memes = getSavedFromStorage();
    memes.forEach((meme, idx) => {
        strHTML += `<img class="gallery-img" data-id="${idx}" src="${meme.url}" alt="" onclick="onImgSelect(this)">`;
    });
    var elContain = document.querySelector('.saved-container');
    elContain.innerHTML = strHTML;
}

//Navigation functions
function openEditor() {
    document.querySelector(".memes-gallery").classList.add('hide');
    document.querySelector(".about-me").classList.add('hide');
    document.querySelector(".btns").classList.add('hide');
    document.querySelector(".more-keywords-container").classList.add('hide');
    document.querySelector(".main-footer").classList.add('hide');
    document.querySelector('.saved-container').classList.add('hide');
    document.querySelector('.meme-editor').classList.remove('hide');
    document.querySelector('.rights').classList.remove('hide');
    document.querySelector('.about-li').classList.add('hide');
    document.querySelector('.saved-memes').classList.add('hide');
}

function openGallery() {
    onFilter('ALL')
    document.querySelector('.text-line').value = '';
    document.querySelector(".memes-gallery").classList.remove('hide');
    document.querySelector(".about-me").classList.remove('hide');
    document.querySelector(".btns").classList.remove('hide');
    document.querySelector(".main-footer").classList.remove('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.rights').classList.add('hide');
    document.querySelector('.saved-container').classList.add('hide');
    document.querySelector('.about-li').classList.remove('hide');
    document.querySelector('.saved-memes').classList.add('hide');
    gIdLine = 0;
    gMeme = null;
    document.querySelector('.text-line').value = '';
}

function openSavedMemes() {
    document.querySelector(".memes-gallery").classList.add('hide');
    document.querySelector(".about-me").classList.add('hide');
    document.querySelector(".btns").classList.add('hide');
    document.querySelector(".more-keywords-container").classList.add('hide');
    document.querySelector(".main-footer").classList.add('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.about-li').classList.add('hide');
    document.querySelector('.rights').classList.remove('hide');
    document.querySelector('.saved-container').classList.remove('hide');
    document.querySelector('.saved-memes').classList.remove('hide');
    renderSavedMemes();
    gIdLine = 0;
    gMeme = null;
}