function newPlayer() {
    // https://my.oschina.net/u/554046/blog/297523
    var fileUrl = 'http://record2.a8.com/mp4/1464140837199179.mp4',
        // fileUrl = 'http://record2.inke.cn/record_1478511997919836/1478511997919836.m3u8?uid=0',
        fileBg = 'http://img.meelive.cn/MTQ3NjE3MjYyMTM4MSM3NDEjanBn.jpg',
        fileType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1),
        flashvars = {};
    if (fileUrl.indexOf('?') != -1) {
        fileUrl = fileUrl.substr(0, fileUrl.indexOf('?'));
        fileType = fileType.substr(0, fileType.indexOf('?'));
    }
    //根据不同类型，修改配置
    switch (fileType) {
        case 'm3u8':
            flashvars = {
                f: 'http://static.inke.cn/web/common/ckplayer/m3u8.swf',
                a: fileUrl,
                i: fileBg,
                p: 0,
                s: 4,
                c: 0,
                e: 0,
                h: 3
            };
            break;
        case 'mp4':
            flashvars = {
                f: fileUrl,
                s: 0,
                p: 2,
                i: fileBg,
                c: 0,
                e: 0,
                h: 3
            };
            break;
        default:
            // rtmp格式
            flashvars = {
                f: fileUrl,
                i: fileBg,
                p: 0,
                c: 1,
                e: 0
            };
    }

    showPlayer(fileUrl, 'liveMedia')

    function showPlayer(src, id) {
        var params = {
            bgcolor: '#000',
            allowFullScreen: true,
            allowScriptAccess: 'always',
            wmode: 'transparent'
        };
        var video = [src];
        CKobject.embed('http://static.inke.cn/web/common/ckplayer/ckplayer.swf', id, 'ckplayer_a1', '100%', '100%', false, flashvars, video, params);
    }

    function playerstop() {
        console.log("视频播放完成");
        liveEndFn();
    }
}

newPlayer()