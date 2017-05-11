/**
 * rem 基准，目前是以iPhone6 plus为基准的
 */
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';

    function getClientWidth() {
        var cw = docEl.clientWidth;
        (cw > 750) && (cw = 750);
        docEl.style.fontSize = cw / 7.5 + 'px';
    }
    if (!docEl.addEventListener) return;
    win.addEventListener(resizeEvent, getClientWidth, false);
    doc.addEventListener('DOMContentLoaded', getClientWidth, false);
})(document, window);
