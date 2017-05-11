$(function() {
    var lotteryBtn = $('#lotteryBtn');
    var rotateFunc = function(awards, angle, text) {
        //awards:奖项，angle:奖项对应的角度
        lotteryBtn.stopRotate();
        lotteryBtn.rotate({
            angle: 0,
            duration: 10000,
            animateTo: angle + 2880,
            //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
            callback: function() {
                alert(text)
            }
        });
    };

    lotteryBtn.rotate({
        bind: {
            click: function() {
                //这个随机可以通过后端返回的数据替代
                var data = [1, 2, 3, 0];
                data = data[Math.floor(Math.random() * data.length)];
                switch(data) {
                    case 1:
                        rotateFunc(1, 157, '恭喜您抽中的一等奖');
                        break;
                    case 2:
                        rotateFunc(2, 247, '恭喜您抽中的二等奖');
                        break;
                    case 3:
                        rotateFunc(3, 22, '恭喜您抽中的三等奖');
                        break;
                    case 0:
                        var angle = [67, 112, 202, 292, 337];
                        angle = angle[Math.floor(Math.random() * angle.length)]
                        rotateFunc(0, angle, '很遗憾，这次您未抽中奖')
                        break;
                }
            }
        }
    });
})