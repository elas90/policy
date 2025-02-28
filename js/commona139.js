$(function () {
    resetFont(function () {
        $('body').css('opacity', 1)
    })
    $(window).resize(function () {
        resetFont(function () {
            $('body').css('opacity', 1)
        })
    });

    //菜单
    $('.nav-item').hover(function () {
        $(this).children('.sub-nav-area').stop(true)
        $(this).children('.sub-nav-area').slideDown()
    }, function () {
        $(this).children('.sub-nav-area').stop(true)
        $(this).children('.sub-nav-area').slideUp()
    })

    //切换
    $('.sub-nav-list').on('click', '.sub-nav-item', function () {
        $(this).addClass('sub-nav-item-on').siblings('.sub-nav-item-on').removeClass('sub-nav-item-on')
    })

    //返回上一页
    $('.go-back').on('click', function () {
        history.go(-1)
    })

    //倒计时
    //获取当前时间距离截止时间的倒计时
    //参数为截止时间
    var leftTimer = function (date) {
        var leftTime = (new Date(date)) - (new Date());//计算剩余毫秒数
        var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余天数
        var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余小时数
        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩分钟数
        var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余秒数

        days = checkTime(days).toString();
        hours = checkTime(hours).toString();
        minutes = checkTime(minutes).toString();
        seconds = checkTime(seconds).toString();
        $('#day').html(days)
        $('#hour').html(hours)
        $('#minute').html(minutes)
        $('#second').html(seconds)
    }
    var checkTime = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    setInterval(function () {
        leftTimer('2022/04/31 15:00')
    }, 1000)

    //链接分享弹窗
    $('#link-share').on('click', function () {
        $('.share-tips-dialog').show()
    })
    $('.share-tips-dialog img').on('click', function () {
        $('.share-tips-dialog').hide()
    })

    //返回顶部
    $("#goTop").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false;
    });

    // 去除剪切板样式
    $('[contenteditable]').each(function () {
        // 干掉IE http之类地址自动加链接
        try {
            document.execCommand("AutoUrlDetect", false, false);
        } catch (e) { }

        $(this).on('paste', function (e) {
            e.preventDefault();
            var text = null;

            if (window.clipboardData && clipboardData.setData) {
                // IE
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            }
            if (document.body.createTextRange) {
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            } else {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text);
            }
        });
        // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
        $(this).on('keydown', function (e) {
            // e.metaKey for mac
            if (e.ctrlKey || e.metaKey) {
                switch (e.keyCode) {
                    case 66: //ctrl+B or ctrl+b
                    case 98:
                    case 73: //ctrl+I or ctrl+i
                    case 105:
                    case 85: //ctrl+U or ctrl+u
                    case 117: {
                        e.preventDefault();
                        break;
                    }
                }
            }
        });
    });
    var width = document.documentElement.clientWidth;
    if (width < 750) {
        $('.show-mobile-nav').on('click', function (e) {
            e.stopPropagation()
            let hideNav = $('.left-container').css('display') === 'none';
            if (hideNav) {
                $('.left-container').css('display', 'flex')
                setTimeout(function () {
                    $('.left-container').css('margin-left', '0')
                }, 100)
            } else {
                $('.left-container').css('margin-left', '-3.64rem')
                setTimeout(function () {
                    $('.left-container').css('display', 'none')
                }, 300)
            }
        })
        $('body').on('click', function () {
            $('.left-container').css('margin-left', '-3.64rem')
            setTimeout(function () {
                $('.left-container').css('display', 'none')
            }, 300)
        })
        $('.sub-nav-container').on('click', function (e) {
            e.stopPropagation()
        })
    }


    //阻止移动端下拉显示域名
    //该方法用来遍历元素，遍历至根元素，查看每一个元素上的overflow属性是否设置滚动，
    //针对设置了滚动的元素调用overscroll方法
    function toRoot(dom) {
        const isScroll = window.getComputedStyle(dom, null).overflow
        // console.log(isScroll, dom)
        if (dom.className === 'el-table__fixed') {
            return
        }
        if (isScroll.includes('auto') || isScroll.includes('scroll')) {
            overscroll(dom)
            // return
        }
        if (dom.getAttribute('id') === 'app') {
            return
        }
        if (dom.tagName === 'BODY') {
            return
        }
        toRoot(dom.parentNode)
    }
    const overscroll = function (el) {
        //以下属性是用来判断手指滑动的方向，毕竟有的元素只能左右滑，有的元素只能上下滑
        let startX, startY, moveEndX, moveEndY, X, Y
        el.addEventListener('touchstart', function (e) {
            startX = e.touches[0].pageX
            startY = e.touches[0].pageY
            const top = el.scrollTop
            const totalScroll = el.scrollHeight
            const currentScroll = top + el.offsetHeight
            if (top === 0) {
                el.scrollTop = 1
            } else if (currentScroll === totalScroll) {
                el.scrollTop = top - 1
            }
        })
        el.addEventListener('touchend', (e) => {
            moveEndX = 0
            moveEndY = 0
        })
        el.addEventListener('touchmove', function (evt) {
            if (!moveEndX && !moveEndX) {
                moveEndX = evt.changedTouches[0].pageX
                moveEndY = evt.changedTouches[0].pageY
                X = moveEndX - startX
                Y = moveEndY - startY
                //console.log(X, Y, moveEndX, startX, moveEndY, startY)
            }
            if (el.offsetHeight < el.scrollHeight && Math.abs(Y) > Math.abs(X)) {
                evt._isScroller = true
            }
            if (el.offsetWidth < el.scrollWidth && Math.abs(X) > Math.abs(Y)) {
                evt._isScroller = true
            }
        })
    }
    document.addEventListener('touchstart', function (evt) {
        const isScroll = window.getComputedStyle(evt.target, null).overflow
        const dom = evt.target
        if (isScroll.includes('auto') || isScroll.includes('scroll')) {
            overscroll(dom)
            return
        }
        toRoot(dom.parentNode)
    }, { passive: false })
    document.addEventListener('touchmove', function (evt) {
        if (!evt._isScroller) {
            evt.preventDefault()
        }
    }, { passive: false })


});

//页面自适应
function resetFont(callback) {
    var width = window.innerWidth;
    if (width > 1920) {
        console.log((width / 100) + 'rem')
        $('body').css('width', (width / 100) + 'rem')
    }
    width = width > 1920 ? 1920 : width;
    if (width > 720) {
        document.documentElement.style.fontSize = width / 19.2 + 'px';
    } else {
        document.documentElement.style.fontSize = width / 7.2 + 'px';
    }
    callback()
}


function request($url, $data, callback, $method = 'GET', $header = {}) {
    if ($method == 'GET') {
        $.get($url, function (e) {
            callback(e);
        })
    } else if ($method == 'POST') {
        $.post($url, $data, $header, function (e) {
            callback(e);
        })
    }
}