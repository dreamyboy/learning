void
function(e) {
    var t = {},
    n = {};
    e.startModule = function(e) {
        require(e).start()
    },
    e.define = function(e, n) {
        t[e] = n
    },
    e.require = function(e) {
        return /\.js$/.test(e) || (e += ".js"),
        n[e] ? n[e] : n[e] = t[e]({})
    }
} (this),
define("scripts/timeline.js",
function(e) {
    function i() {
        this.tasks = [],
        this.addingTasks = [],
        this.adding = 0
    }
    var t = require("scripts/lib/ucren"),
    n = {},
    r = {};
    i.prototype.init = function(e) {
        var t = this;
        if (t.inited) return;
        return t.inited = 1,
        t.startTime = s(),
        t.intervalTime = e || 5,
        t.count = 0,
        t.intervalFn = function() {
            t.count++,
            t.update(s())
        },
        t.start(),
        t
    },
    i.prototype.createTask = function(e) {
        var t = o(e);
        return this.addingTasks.unshift(t),
        this.adding = 1,
        e.recycle && this.taskList(e.recycle, t),
        this.start(),
        t
    },
    i.prototype.taskList = function(e, t) {
        return e.clear || (e.clear = function() {
            var e = this.length;
            while (e--) t = this[e],
            t.stop(),
            this.splice(e, 1);
            return this
        }),
        t && e.unshift(t),
        e
    },
    i.prototype.setTimeout = function(e, t) {
        return this.createTask({
            start: t,
            duration: 0,
            onTimeStart: e
        })
    },
    i.prototype.setInterval = function(e, t) {
        var n = setInterval(e, t);
        return {
            stop: function() {
                clearInterval(n)
            }
        }
    },
    i.prototype.getFPS = function() {
        var e = s(),
        t = this.count,
        n = t / (e - this.startTime) * 1e3;
        return t > 1e3 && (this.count = 0, this.startTime = e),
        n
    },
    i.prototype.start = function() {
        clearInterval(this.interval),
        this.interval = setInterval(this.intervalFn, this.intervalTime)
    },
    i.prototype.stop = function() {
        clearInterval(this.interval)
    },
    i.prototype.update = function(e) {
        var t = this.tasks,
        n = this.addingTasks,
        r = this.adding,
        i = t.length,
        s, o, f, l, c;
        while (i--) {
            o = t[i],
            f = o.start,
            l = o.duration;
            if (e >= f) {
                if (o.stopped) {
                    t.splice(i, 1);
                    continue
                }
                a(o),
                (s = e - f) < l ? u(o, s) : (u(o, l), o.onTimeEnd.apply(o.object, o.data.slice(1)), t.splice(i, 1))
            }
        }
        r && (t.unshift.apply(t, n), n.length = r = 0),
        t.length || this.stop()
    },
    r.use = function(e) {
        var t;
        return (t = n[e]) ? t: (t = n[e] = new i, t)
    };
    var s = function() {
        return (new Date).getTime()
    },
    o = function(e) {
        var n = e.object || {};
        return e.start = e.start || 0,
        {
            start: e.start + s(),
            duration: e.duration == -1 ? 864e5: e.duration,
            data: e.data ? [0].concat(e.data) : [0],
            started: 0,
            object: n,
            onTimeStart: e.onTimeStart || n.onTimeStart || t.nul,
            onTimeUpdate: e.onTimeUpdate || n.onTimeUpdate || t.nul,
            onTimeEnd: e.onTimeEnd || n.onTimeEnd || t.nul,
            stop: function() {
                this.stopped = 1
            }
        }
    },
    u = function(e, t) {
        var n = e.data;
        n[0] = t,
        e.onTimeUpdate.apply(e.object, n)
    },
    a = function(e) {
        e.started || (e.started = 1, e.onTimeStart.apply(e.object, e.data.slice(1)), u(e, 0))
    };
    return e = r.use("default").init(10),
    e.use = function(n) {
        return t.isIe && e,
        r.use(n)
    },
    e
}),
define("scripts/lib/ucren.js",
function(exports) {
    var Ucren, blankArray = [],
    slice = blankArray.slice,
    join = blankArray.join;
    String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/, "")
    }),
    String.prototype.format = function(e) {
        var t = this,
        n = {};
        return Ucren.each(e,
        function(e, n) {
            e = e.toString().replace(/\$/g, "$$$$"),
            t = t.replace(RegExp("@{" + n + "}", "g"), e)
        }),
        t.toString()
    },
    String.prototype.htmlEncode = function() {
        var e = document.createElement("div");
        return function() {
            var t;
            return e.appendChild(document.createTextNode(this)),
            t = e.innerHTML,
            e.innerHTML = "",
            t
        }
    } (),
    String.prototype.byteLength = function() {
        return this.replace(/[^\x00-\xff]/g, "  ").length
    },
    String.prototype.subByte = function(e, t) {
        var n = this;
        return n.byteLength() <= e ? n: (t = t || "", e -= t.byteLength(), n = n.slice(0, e).replace(/( [^\x00-\xff] )/g, "$1 ").slice(0, e).replace(/[^\x00-\xff]$/, "").replace(/( [^\x00-\xff] ) /g, "$1") + t)
    },
    Function.prototype.defer = function(e, t) {
        var n = this,
        r = function() {
            n.apply(e, arguments)
        };
        return setTimeout(r, t)
    },
    Function.prototype.bind || (Function.prototype.bind = function(e) {
        var t = this;
        return function() {
            return t.apply(e, arguments)
        }
    }),
    Function.prototype.saturate = function(e) {
        var t = this,
        n = slice.call(arguments, 1);
        return function() {
            return t.apply(e, slice.call(arguments, 0).concat(n))
        }
    },
    Array.prototype.indexOf = function(e, t) {
        var n = this.length;
        t || (t = 0),
        t < 0 && (t = n + t);
        for (; t < n; t++) if (this[t] === e) return t;
        return - 1
    },
    Array.prototype.every = function(e, t) {
        for (var n = 0,
        r = this.length; n < r; n++) if (!e.call(t, this[n], n, this)) return ! 1;
        return ! 0
    },
    Array.prototype.filter = function(e, t) {
        var n = [],
        r;
        for (var i = 0,
        s = this.length; i < s; i++)(r = this[i], e.call(t, r, i, this)) && n.push(r);
        return n
    },
    Array.prototype.forEach = function(e, t) {
        for (var n = 0,
        r = this.length; n < r; n++) e.call(t, this[n], n, this);
        return this
    },
    Array.prototype.map = function(e, t) {
        var n = [];
        for (var r = 0,
        i = this.length; r < i; r++) n[r] = e.call(t, this[r], r, this);
        return n
    },
    Array.prototype.some = function(e, t) {
        for (var n = 0,
        r = this.length; n < r; n++) if (e.call(t, this[n], n, this)) return ! 0;
        return ! 1
    },
    Array.prototype.invoke = function(e) {
        var t = slice.call(arguments, 1);
        return this.forEach(function(n) {
            n instanceof Array ? n[0][e].apply(n[0], n.slice(1)) : n[e].apply(n, t)
        }),
        this
    },
    Array.prototype.random = function() {
        var e = this.slice(0),
        t = [],
        n = e.length;
        while (n--) t.push(e.splice(Ucren.randomNumber(n + 1), 1)[0]);
        return t
    },
    Ucren = {
        isIe: /msie/i.test(navigator.userAgent),
        isIe6: /msie 6/i.test(navigator.userAgent),
        isFirefox: /firefox/i.test(navigator.userAgent),
        isSafari: /version\/[\d\.]+\s+safari/i.test(navigator.userAgent),
        isOpera: /opera/i.test(navigator.userAgent),
        isChrome: /chrome/i.test(navigator.userAgent),
        isStrict: document.compatMode == "CSS1Compat",
        tempDom: document.createElement("div"),
        apply: function(e, t, n) {
            return t || (t = {}),
            n ? Ucren.each(e,
            function(e, r) {
                if (r in n) return;
                t[r] = e
            }) : Ucren.each(e,
            function(e, n) {
                t[n] = e
            }),
            t
        },
        appendStyle: function(e) {
            var t;
            arguments.length > 1 && (e = join.call(arguments, "")),
            document.createStyleSheet ? (t = document.createStyleSheet(), t.cssText = e) : (t = document.createElement("style"), t.type = "text/css", t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t))
        },
        addEvent: function(e, t, n) {
            var r = function() {
                n.apply(e, arguments)
            };
            return e.dom && (e = e.dom),
            window.attachEvent ? e.attachEvent("on" + t, r) : window.addEventListener ? e.addEventListener(t, r, !1) : e["on" + t] = r,
            r
        },
        delEvent: function(e, t, n) {
            window.detachEvent ? e.detachEvent("on" + t, n) : window.removeEventListener ? e.removeEventListener(t, n, !1) : e["on" + t] == n && (e["on" + t] = null)
        },
        Class: function(e, t, n) {
            var r, i;
            return e = e ||
            function() {},
            t = t || {},
            r = n ?
            function(t, r, i, s, o) {
                var u = new n(t, r, i, s, o);
                for (var a in u) this[a] = u[a];
                this.instanceId = Ucren.id(),
                e.apply(this, arguments)
            }: function() {
                this.instanceId = Ucren.id(),
                e.apply(this, arguments)
            },
            Ucren.registerClassEvent.call(i = r.prototype),
            Ucren.each(t,
            function(e, t) {
                i[t] = typeof e == "function" ?
                function() {
                    var n = e.apply(this, arguments);
                    return this.fire(t, slice.call(arguments, 0)),
                    n
                }: e
            }),
            r
        },
        registerClassEvent: function() {
            this.on = function(e, t) {
                return Ucren.dispatch(this.instanceId + e, t.bind(this)),
                this
            },
            this.fire = this.fireEvent = function(e, t) {
                return Ucren.dispatch(this.instanceId + e, t),
                this
            }
        },
        createFuze: function() {
            var e, t, n;
            return e = [],
            t = function(t) {
                n ? t() : e.push(t)
            },
            t.fire = function() {
                while (e.length) e.shift()();
                n = !0
            },
            t.extinguish = function() {
                n = !1
            },
            t.wettish = function() {
                e.length && e.shift()()
            },
            t
        },
        dispatch: function() {
            var e = {},
            t, n, r;
            return t = function(t, n, r) {
                var i; (i = e[t]) && Ucren.each(i,
                function(e) {
                    e.apply(r, n)
                })
            },
            n = function(t, n) {
                var r; (r = e[t]) ? r.push(n) : e[t] = [n]
            },
            r = function(e, r, i) {
                typeof r == "undefined" && (r = []),
                r instanceof Array ? t.apply(this, arguments) : typeof r == "function" && n.apply(this, arguments)
            },
            r.remove = function(t, n) {
                var r, i; (r = e[t]) && ~ (i = r.indexOf(n)) && r.splice(i, 1)
            },
            r
        } (),
        each: function(e, t) {
            if (e instanceof Array || typeof e == "object" && typeof e[0] != "undefined" && e.length) typeof e == "object" && Ucren.isSafari && (e = slice.call(e)),
            e.forEach(t);
            else if (typeof e == "object") {
                var n = {};
                for (var r in e) {
                    if (n[r]) continue;
                    if (t(e[r], r) === !1) break
                }
            } else if (typeof e == "number") {
                for (var r = 0; r < e; r++) if (t(r, r) === !1) break
            } else if (typeof e == "string") for (var r = 0,
            i = e.length; r < i; r++) if (t(e.charAt(r), r) === !1) break
        },
        Element: function(e, t) {
            var n, r;
            return e && e.isUcrenElement ? t ? e.dom: e: (e = typeof e == "string" ? document.getElementById(e) : e, e ? t ? e: (r = e.getAttribute("handleId"), typeof r == "string" ? Ucren.handle(r - 0) : (n = new Ucren.BasicElement(e), r = Ucren.handle(n), e.setAttribute("handleId", r + ""), n)) : null)
        },
        Event: function(e) {
            e = e || window.event;
            if (!e) {
                var t = arguments.callee.caller;
                while (t) {
                    e = t.arguments[0];
                    if (e && typeof e.altKey == "boolean") break;
                    t = t.caller,
                    e = null
                }
            }
            return e
        },
        fixNumber: function(e, t) {
            return typeof e == "number" ? e: t
        },
        fixString: function(e, t) {
            return typeof e == "string" ? e: t
        },
        fixConfig: function(e) {
            var t;
            return t = {},
            typeof e == "undefined" ? t: typeof e == "function" ? new e: e
        },
        handle: function(e) {
            var t, n, r;
            t = arguments.callee,
            t.cache || (t.cache = {}),
            typeof t.number == "undefined" && (t.number = 0),
            n = typeof e;
            if (n == "number") return t.cache[e.toString()];
            if (n == "object" || n == "function") return r = t.number++,
            t.cache[r.toString()] = e,
            r
        },
        id: function() {
            var e = arguments.callee;
            return e.number = ++e.number || 0,
            "_" + e.number
        },
        loadImage: function(e, t) {
            var n = e.length,
            r = 0,
            i = function() {
                r == n && t && t()
            };
            Ucren.each(e,
            function(e) {
                var t = document.createElement("img");
                t.onload = t.onerror = function() {
                    this.onload = this.onerror = null,
                    r++,
                    i()
                },
                Ucren.tempDom.appendChild(t),
                t.src = e
            })
        },
        loadScript: function(src, callback) {
            Ucren.request(src,
            function(text) {
                eval(text),
                callback && callback(text)
            })
        },
        makeElement: function(e, t) {
            var n = document.createElement(e),
            r = function(e) {
                typeof e == "string" ? n.style.cssText = e: Ucren.apply(e, n.style)
            };
            for (var i in t) i === "class" ? n.className = t[i] : i === "for" ? n.htmlFor = t[i] : i === "style" ? r(t[i]) : n.setAttribute(i, t[i]);
            return n
        },
        nul: function() {
            return ! 1
        },
        randomNumber: function(e) {
            return Math.floor(Math.random() * e)
        },
        randomWord: function() {
            var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            return function(t, n) {
                var r, i = [];
                return r = n || e,
                Ucren.each(t,
                function(e) {
                    i[e] = r.charAt(this.randomNumber(r.length))
                }.bind(this)),
                i.join("")
            }
        } (),
        request: function(e, t) {
            var n;
            window.XMLHttpRequest ? n = new XMLHttpRequest: n = new ActiveXObject("Microsoft.XMLHTTP"),
            n.open("GET", e, !0),
            n.onreadystatechange = function() {
                n.readyState == 4 && n.status == 200 && t(n.responseText)
            },
            n.send(null)
        }
    },
    Ucren.BasicDrag = Ucren.Class(function(e) {
        e = Ucren.fixConfig(e),
        this.type = Ucren.fixString(e.type, "normal");
        var t = this.isTouch = "ontouchstart" in window;
        this.TOUCH_START = t ? "touchstart": "mousedown",
        this.TOUCH_MOVE = t ? "touchmove": "mousemove",
        this.TOUCH_END = t ? "touchend": "mouseup"
    },
    {
        bind: function(e, t) {
            e = Ucren.Element(e),
            t = Ucren.Element(t) || e;
            var n = {};
            return n[this.TOUCH_START] = function(e) {
                return e = Ucren.Event(e),
                this.startDrag(),
                e.cancelBubble = !0,
                e.stopPropagation && e.stopPropagation(),
                e.returnValue = !1
            }.bind(this),
            t.addEvents(n),
            this.target = e,
            this
        },
        getCoors: function(e) {
            var t = [];
            if (e.targetTouches && e.targetTouches.length) {
                var n = e.targetTouches[0];
                t[0] = n.clientX,
                t[1] = n.clientY
            } else t[0] = e.clientX,
            t[1] = e.clientY;
            return t
        },
        startDrag: function() {
            var e, t, n;
            e = this.target,
            t = e.draging = {},
            this.isDraging = !0,
            t.x = parseInt(e.style("left"), 10) || 0,
            t.y = parseInt(e.style("top"), 10) || 0,
            n = Ucren.Event();
            var r = this.getCoors(n);
            t.mouseX = r[0],
            t.mouseY = r[1],
            this.registerDocumentEvent()
        },
        endDrag: function() {
            this.isDraging = !1,
            this.unRegisterDocumentEvent()
        },
        registerDocumentEvent: function() {
            var e, t;
            e = this.target,
            t = e.draging,
            t.documentSelectStart = Ucren.addEvent(document, "selectstart",
            function(e) {
                return e = e || event,
                e.stopPropagation && e.stopPropagation(),
                e.cancelBubble = !0,
                e.returnValue = !1
            }),
            t.documentMouseMove = Ucren.addEvent(document, this.TOUCH_MOVE,
            function(e) {
                var n, r;
                e = e || event,
                n = Ucren.isIe && e.button != 1,
                r = !Ucren.isIe && e.button != 0,
                (n || r) && !this.isTouch && this.endDrag();
                var i = this.getCoors(e);
                return t.newMouseX = i[0],
                t.newMouseY = i[1],
                e.stopPropagation && e.stopPropagation(),
                e.returnValue = !1
            }.bind(this)),
            t.documentMouseUp = Ucren.addEvent(document, this.TOUCH_END,
            function() {
                this.endDrag()
            }.bind(this));
            var n, r;
            clearInterval(t.timer),
            t.timer = setInterval(function() {
                var i, s, o, u;
                t.newMouseX != n && t.newMouseY != r && (n = t.newMouseX, r = t.newMouseY, o = t.newMouseX - t.mouseX, u = t.newMouseY - t.mouseY, i = t.x + o, s = t.y + u, this.type == "calc" ? this.returnValue(o, u, t.newMouseX, t.newMouseY) : e.left(i).top(s))
            }.bind(this), 10)
        },
        unRegisterDocumentEvent: function() {
            var e = this.target.draging;
            Ucren.delEvent(document, this.TOUCH_MOVE, e.documentMouseMove),
            Ucren.delEvent(document, this.TOUCH_END, e.documentMouseUp),
            Ucren.delEvent(document, "selectstart", e.documentSelectStart),
            clearInterval(e.timer)
        },
        returnValue: function(e, t, n, r) {}
    }),
    Ucren.Template = Ucren.Class(function() {
        this.string = join.call(arguments, "")
    },
    {
        apply: function(e) {
            return this.string.format(e)
        }
    }),
    Ucren.BasicElement = Ucren.Class(function(e) {
        this.dom = e,
        this.countMapping = {}
    },
    {
        isUcrenElement: !0,
        attr: function(e, t) {
            return typeof t != "string" ? this.dom.getAttribute(e) : (this.dom.setAttribute(e, t), this)
        },
        style: function() {
            var e = Ucren.isIe ?
            function(e) {
                return this.dom.currentStyle[e]
            }: function(e) {
                var t;
                return t = document.defaultView.getComputedStyle(this.dom, null),
                t.getPropertyValue(e)
            };
            return function(t, n) {
                if (typeof t == "object") Ucren.each(t,
                function(e, t) {
                    this[t] = e
                }.bind(this.dom.style));
                else {
                    if (typeof t == "string" && typeof n == "undefined") return e.call(this, t);
                    typeof t == "string" && typeof n != "undefined" && (this.dom.style[t] = n)
                }
                return this
            }
        } (),
        hasClass: function(e) {
            var t = " " + this.dom.className + " ";
            return t.indexOf(" " + e + " ") > -1
        },
        setClass: function(e) {
            return typeof e == "string" && (this.dom.className = e.trim()),
            this
        },
        addClass: function(e) {
            var t, n;
            return t = this.dom,
            n = " " + t.className + " ",
            n.indexOf(" " + e + " ") == -1 && (n += e, n = n.trim(), n = n.replace(/ +/g, " "), t.className = n),
            this
        },
        delClass: function(e) {
            var t, n;
            return t = this.dom,
            n = " " + t.className + " ",
            n.indexOf(" " + e + " ") > -1 && (n = n.replace(" " + e + " ", " "), n = n.trim(), n = n.replace(/ +/g, " "), t.className = n),
            this
        },
        html: function(e) {
            var t = this.dom;
            if (typeof e == "string") t.innerHTML = e;
            else {
                if (! (e instanceof Array)) return t.innerHTML;
                t.innerHTML = e.join("")
            }
            return this
        },
        value: function(e) {
            if (typeof e == "undefined") return this.dom.value;
            this.dom.value = e
        },
        left: function(e) {
            var t = this.dom;
            return typeof e != "number" ? this.getPos().x: (t.style.left = e + "px", this.fire("infect", [{
                left: e
            }]), this)
        },
        top: function(e) {
            var t = this.dom;
            return typeof e != "number" ? this.getPos().y: (t.style.top = e + "px", this.fire("infect", [{
                top: e
            }]), this)
        },
        width: function(e) {
            var t = this.dom;
            if (typeof e == "number") t.style.width = e + "px",
            this.fire("infect", [{
                width: e
            }]);
            else {
                if (typeof e != "string") return this.getSize().width;
                t.style.width = e,
                this.fire("infect", [{
                    width: e
                }])
            }
            return this
        },
        height: function(e) {
            var t = this.dom;
            if (typeof e == "number") t.style.height = e + "px",
            this.fire("infect", [{
                height: e
            }]);
            else {
                if (typeof e != "string") return this.getSize().height;
                t.style.height = e,
                this.fire("infect", [{
                    height: e
                }])
            }
            return this
        },
        count: function(e) {
            return this.countMapping[e] = ++this.countMapping[e] || 1
        },
        display: function(e) {
            var t = this.dom;
            return typeof e != "boolean" ? this.style("display") != "none": (t.style.display = e ? "block": "none", this.fire("infect", [{
                display: e
            }]), this)
        },
        first: function() {
            var e = this.dom.firstChild;
            while (e && !e.tagName && e.nextSibling) e = e.nextSibling;
            return e
        },
        add: function(e) {
            var t;
            return t = Ucren.Element(e),
            this.dom.appendChild(t.dom),
            this
        },
        remove: function(e) {
            var t;
            return e ? (t = Ucren.Element(e), t.html(""), this.dom.removeChild(t.dom)) : (t = Ucren.Element(this.dom.parentNode), t.remove(this)),
            this
        },
        insert: function(e) {
            var t;
            return t = this.dom,
            t.firstChild ? t.insertBefore(e, t.firstChild) : this.add(e),
            this
        },
        addEvents: function(e) {
            var t, n, r;
            return t = {},
            r = {},
            n = this.dom,
            Ucren.each(e,
            function(e, t) {
                r[t] = Ucren.addEvent(n, t, e)
            }),
            r
        },
        removeEvents: function(e) {
            var t, n;
            return t = {},
            n = this.dom,
            Ucren.each(e,
            function(e, t) {
                Ucren.delEvent(n, t, e)
            }),
            this
        },
        getPos: function() {
            var e, t, n, r, i;
            e = this.dom,
            n = {};
            if (e.getBoundingClientRect) {
                r = e.getBoundingClientRect(),
                i = Ucren.isIe ? 2 : 0;
                var s = document,
                o = Math.max(s.documentElement.scrollTop, s.body.scrollTop),
                u = Math.max(s.documentElement.scrollLeft, s.body.scrollLeft);
                return {
                    x: r.left + u - i,
                    y: r.top + o - i
                }
            }
            n = {
                x: e.offsetLeft,
                y: e.offsetTop
            },
            t = e.offsetParent;
            if (t != e) while (t) n.x += t.offsetLeft,
            n.y += t.offsetTop,
            t = t.offsetParent;
            Ucren.isSafari && this.style("position") == "absolute" && (n.x -= document.body.offsetLeft, n.y -= document.body.offsetTop),
            e.parentNode ? t = e.parentNode: t = null;
            while (t && t.tagName.toUpperCase() != "BODY" && t.tagName.toUpperCase() != "HTML") n.x -= t.scrollLeft,
            n.y -= t.scrollTop,
            t.parentNode ? t = t.parentNode: t = null;
            return n
        },
        getSize: function() {
            var e = this.dom,
            t = this.style("display");
            if (t && t !== "none") return {
                width: e.offsetWidth,
                height: e.offsetHeight
            };
            var n = e.style,
            r = {
                visibility: n.visibility,
                position: n.position,
                display: n.display
            },
            i = {
                visibility: "hidden",
                display: "block"
            };
            r.position !== "fixed" && (i.position = "absolute"),
            this.style(i);
            var s = {
                width: e.offsetWidth,
                height: e.offsetHeight
            };
            return this.style(r),
            s
        },
        observe: function(e, t) {
            return e = Ucren.Element(e),
            e.on("infect", t.bind(this)),
            this
        },
        usePNGbackground: function(e) {
            var t;
            return t = this.dom,
            /\.png$/i.test(e) && Ucren.isIe6 ? t.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + e + "',sizingMethod='scale' );": t.style.backgroundImage = "url( " + e + " )",
            this
        },
        setAlpha: function() {
            var e = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/;
            return function(t) {
                var n = this.dom,
                r = n.style;
                return Ucren.isIe ? (n.currentStyle && !n.currentStyle.hasLayout && (r.zoom = 1), e.test(r.filter) ? (t = t >= 99.99 ? "": "alpha( opacity=" + t + " )", r.filter = r.filter.replace(e, t)) : r.filter += " alpha( opacity=" + t + " )") : r.opacity = t / 100,
                this
            }
        } (),
        fadeIn: function(e) {
            typeof this.fadingNumber == "undefined" && (this.fadingNumber = 0),
            this.setAlpha(this.fadingNumber);
            var t = function() {
                this.setAlpha(this.fadingNumber),
                this.fadingNumber == 100 ? (clearInterval(this.fadingInterval), e && e()) : this.fadingNumber += 10
            }.bind(this);
            return this.display(!0),
            clearInterval(this.fadingInterval),
            this.fadingInterval = setInterval(t, Ucren.isIe ? 20 : 30),
            this
        },
        fadeOut: function(e) {
            typeof this.fadingNumber == "undefined" && (this.fadingNumber = 100),
            this.setAlpha(this.fadingNumber);
            var t = function() {
                this.setAlpha(this.fadingNumber),
                this.fadingNumber == 0 ? (clearInterval(this.fadingInterval), this.display(!1), e && e()) : this.fadingNumber -= 10
            }.bind(this);
            return clearInterval(this.fadingInterval),
            this.fadingInterval = setInterval(t, Ucren.isIe ? 20 : 30),
            this
        },
        useMouseAction: function(e, t) {
            return this.MouseAction || (this.MouseAction = new Ucren.MouseAction({
                element: this
            })),
            this.MouseAction.use(e, t),
            this
        }
    }),
    Ucren.isIe && document.execCommand("BackgroundImageCache", !1, !0);
    for (var i in Ucren) exports[i] = Ucren[i];
    return window.Ucren || (window.Ucren = Ucren),
    exports
}),
define("scripts/tools.js",
function(e) {
    return e.unsetObject = function(e) {
        for (var t in e) e.hasOwnProperty(t) && typeof e[t] == "function" && (e[t] = function() {})
    },
    e.getAngleByRadian = function(e) {
        return e * 180 / Math.PI
    },
    e.pointToRadian = function(e, t) {
        var n = Math.PI;
        if (t[0] === e[0]) return t[1] > e[1] ? n * .5 : n * 1.5;
        if (t[1] === e[1]) return t[0] > e[0] ? 0 : n;
        var r = Math.atan((e[1] - t[1]) / (e[0] - t[0]));
        return t[0] > e[0] && t[1] < e[1] ? r + 2 * n: t[0] > e[0] && t[1] > e[1] ? r: r + n
    },
    e
}),
define("scripts/sence.js",
function(e) {
    var t = require("scripts/lib/ucren"),
    n = require("scripts/lib/sound"),
    r = require("scripts/factory/fruit"),
    i = require("scripts/object/flash"),
    s = require("scripts/state"),
    o = require("scripts/message"),
    u = require("scripts/object/background"),
    a = require("scripts/object/fps"),
    f = require("scripts/object/home-mask"),
    l = require("scripts/object/logo"),
    c = require("scripts/object/ninja"),
    h = require("scripts/object/home-desc"),
    p = require("scripts/object/dojo"),
    d = require("scripts/object/new-game"),
    v = require("scripts/object/quit"),
    m = require("scripts/object/new"),
    g,
    y,
    b,
    w = require("scripts/object/score"),
    E = require("scripts/object/lose"),
    S = require("scripts/game"),
    x = require("scripts/object/developing"),
    T = require("scripts/object/game-over"),
    o = require("scripts/message"),
    N = require("scripts/timeline"),
    C = N.setTimeout.bind(N),
    k = N.setInterval.bind(N),
    L,
    A;
    return e.init = function() {
        L = n.create("audio/menu"),
        A = n.create("audio/start"),
        [u, f, l, c, h, p, m, d, v, w, E, x, T, i].invoke("set")
    },
    e.switchSence = function(t) {
        var n = s("sence-name"),
        r = s("sence-state");
        if (n.is(t)) return;
        var i = function() {
            n.set(t),
            r.set("entering");
            switch (t) {
            case "home-menu":
                this.showMenu(o);
                break;
            case "dojo-body":
                this.showDojo(o);
                break;
            case "game-body":
                this.showNewGame(o);
                break;
            case "quit-body":
                this.showQuit(o)
            }
        }.bind(this),
        o = function() {
            r.set("ready"),
            (t == "dojo-body" || t == "quit-body") && e.switchSence("home-menu")
        };
        r.set("exiting"),
        n.isunset() ? i() : n.is("home-menu") ? this.hideMenu(i) : n.is("dojo-body") ? this.hideDojo(i) : n.is("game-body") ? this.hideNewGame(i) : n.is("quit-body") && this.hideQuit(i)
    },
    e.showMenu = function(e) {
        var t = arguments.callee,
        n = t.times = ++t.times || 1;
        g = r.create("peach", 137, 333, !0),
        y = r.create("sandia", 330, 322, !0),
        b = r.create("boom", 552, 367, !0, 2500),
        [g, y, b].forEach(function(e) {
            e.isHomeMenu = 1
        }),
        g.isDojoIcon = y.isNewGameIcon = b.isQuitIcon = 1;
        var i = [[f, 0], [l, 0], [c, 500], [h, 1500], [p, 2e3], [d, 2e3], [v, 2e3], [m, 2e3], [g, 2e3], [y, 2e3], [b, 2e3]];
        i.invoke("show"),
        [g, y].invoke("rotate", 2500),
        L.play(),
        C(e, 2500)
    },
    e.hideMenu = function(e) { [m, p, d, v].invoke("hide"),
        [f, l, c, h].invoke("hide"),
        [g, y, b].invoke("fallOff", 150),
        L.stop(),
        C(e, r.getDropTimeSetting())
    },
    e.showNewGame = function(e) {
        w.show(),
        E.show(),
        S.start(),
        A.play(),
        C(e, 1e3)
    },
    e.hideNewGame = function(e) {
        w.hide(),
        E.hide(),
        A.stop(),
        C(e, 1e3)
    },
    e.showDojo = function(e) {
        x.show(250),
        C(e, 1500)
    },
    e.hideDojo = function(e) {
        C(e, 1e3)
    },
    e.showQuit = function(e) {
        x.show(250),
        C(e, 1500)
    },
    e.hideQuit = function(e) {
        C(e, 1e3)
    },
    o.addEventListener("sence.switchSence",
    function(t) {
        e.switchSence(t)
    }),
    e
}),
define("scripts/lib/sound.js",
function(e) {
    function i(e) {
        this.sound = new t.sound(e, r)
    }
    function s() {}
    var t = require("scripts/lib/buzz"),
    n = t.isSupported(),
    r = {
        formats: ["ogg", "mp3"],
        preload: !0,
        autoload: !0,
        loop: !1
    };
    return i.prototype.play = function(e) {
        e = this.sound,
        e.setPercent(0),
        e.setVolume(100),
        e.play()
    },
    i.prototype.stop = function() {
        this.sound.fadeOut(1e3,
        function() {
            this.pause()
        })
    },
    e.create = function(e) {
        return n ? new i(e) : s
    },
    s.play = s.stop = function() {},
    e
}),
define("scripts/lib/buzz.js",
function(e) {
    var t = {
        defaults: {
            autoplay: !1,
            duration: 5e3,
            formats: [],
            loop: !1,
            placeholder: "--",
            preload: "metadata",
            volume: 80
        },
        types: {
            mp3: "audio/mpeg",
            ogg: "audio/ogg",
            wav: "audio/wav",
            aac: "audio/aac",
            m4a: "audio/x-m4a"
        },
        sounds: [],
        el: document.createElement("audio"),
        sound: function(e, n) {
            function u(e) {
                var t = [],
                n = e.length - 1;
                for (var r = 0; r <= n; r++) t.push({
                    start: e.start(n),
                    end: e.end(n)
                });
                return t
            }
            function a(e) {
                return e.split(".").pop()
            }
            function f(e, n) {
                var r = document.createElement("source");
                r.src = n,
                t.types[a(n)] && (r.type = t.types[a(n)]),
                e.appendChild(r)
            }
            n = n || {};
            var r = 0,
            i = [],
            s = {},
            o = t.isSupported();
            this.load = function() {
                return o ? (this.sound.load(), this) : this
            },
            this.play = function() {
                return o ? (this.sound.play(), this) : this
            },
            this.togglePlay = function() {
                return o ? (this.sound.paused ? this.sound.play() : this.sound.pause(), this) : this
            },
            this.pause = function() {
                return o ? (this.sound.pause(), this) : this
            },
            this.isPaused = function() {
                return o ? this.sound.paused: null
            },
            this.stop = function() {
                return o ? (this.setTime(this.getDuration()), this.sound.pause(), this) : this
            },
            this.isEnded = function() {
                return o ? this.sound.ended: null
            },
            this.loop = function() {
                return o ? (this.sound.loop = "loop", this.bind("ended.buzzloop",
                function() {
                    this.currentTime = 0,
                    this.play()
                }), this) : this
            },
            this.unloop = function() {
                return o ? (this.sound.removeAttribute("loop"), this.unbind("ended.buzzloop"), this) : this
            },
            this.mute = function() {
                return o ? (this.sound.muted = !0, this) : this
            },
            this.unmute = function() {
                return o ? (this.sound.muted = !1, this) : this
            },
            this.toggleMute = function() {
                return o ? (this.sound.muted = !this.sound.muted, this) : this
            },
            this.isMuted = function() {
                return o ? this.sound.muted: null
            },
            this.setVolume = function(e) {
                return o ? (e < 0 && (e = 0), e > 100 && (e = 100), this.volume = e, this.sound.volume = e / 100, this) : this
            },
            this.getVolume = function() {
                return o ? this.volume: this
            },
            this.increaseVolume = function(e) {
                return this.setVolume(this.volume + (e || 1))
            },
            this.decreaseVolume = function(e) {
                return this.setVolume(this.volume - (e || 1))
            },
            this.setTime = function(e) {
                return o ? (this.whenReady(function() {
                    this.sound.currentTime = e
                }), this) : this
            },
            this.getTime = function() {
                if (!o) return null;
                var e = Math.round(this.sound.currentTime * 100) / 100;
                return isNaN(e) ? t.defaults.placeholder: e
            },
            this.setPercent = function(e) {
                return o ? this.setTime(t.fromPercent(e, this.sound.duration)) : this
            },
            this.getPercent = function() {
                if (!o) return null;
                var e = Math.round(t.toPercent(this.sound.currentTime, this.sound.duration));
                return isNaN(e) ? t.defaults.placeholder: e
            },
            this.setSpeed = function(e) {
                if (!o) return this;
                this.sound.playbackRate = e
            },
            this.getSpeed = function() {
                return o ? this.sound.playbackRate: null
            },
            this.getDuration = function() {
                if (!o) return null;
                var e = Math.round(this.sound.duration * 100) / 100;
                return isNaN(e) ? t.defaults.placeholder: e
            },
            this.getPlayed = function() {
                return o ? u(this.sound.played) : null
            },
            this.getBuffered = function() {
                return o ? u(this.sound.buffered) : null
            },
            this.getSeekable = function() {
                return o ? u(this.sound.seekable) : null
            },
            this.getErrorCode = function() {
                return o && this.sound.error ? this.sound.error.code: 0
            },
            this.getErrorMessage = function() {
                if (!o) return null;
                switch (this.getErrorCode()) {
                case 1:
                    return "MEDIA_ERR_ABORTED";
                case 2:
                    return "MEDIA_ERR_NETWORK";
                case 3:
                    return "MEDIA_ERR_DECODE";
                case 4:
                    return "MEDIA_ERR_SRC_NOT_SUPPORTED";
                default:
                    return null
                }
            },
            this.getStateCode = function() {
                return o ? this.sound.readyState: null
            },
            this.getStateMessage = function() {
                if (!o) return null;
                switch (this.getStateCode()) {
                case 0:
                    return "HAVE_NOTHING";
                case 1:
                    return "HAVE_METADATA";
                case 2:
                    return "HAVE_CURRENT_DATA";
                case 3:
                    return "HAVE_FUTURE_DATA";
                case 4:
                    return "HAVE_ENOUGH_DATA";
                default:
                    return null
                }
            },
            this.getNetworkStateCode = function() {
                return o ? this.sound.networkState: null
            },
            this.getNetworkStateMessage = function() {
                if (!o) return null;
                switch (this.getNetworkStateCode()) {
                case 0:
                    return "NETWORK_EMPTY";
                case 1:
                    return "NETWORK_IDLE";
                case 2:
                    return "NETWORK_LOADING";
                case 3:
                    return "NETWORK_NO_SOURCE";
                default:
                    return null
                }
            },
            this.set = function(e, t) {
                return o ? (this.sound[e] = t, this) : this
            },
            this.get = function(e) {
                return o ? e ? this.sound[e] : this.sound: null
            },
            this.bind = function(e, t) {
                if (!o) return this;
                e = e.split(" ");
                var n = this,
                r = function(e) {
                    t.call(n, e)
                };
                for (var s = 0; s < e.length; s++) {
                    var u = e[s],
                    a = u;
                    u = a.split(".")[0],
                    i.push({
                        idx: a,
                        func: r
                    }),
                    this.sound.addEventListener(u, r, !0)
                }
                return this
            },
            this.unbind = function(e) {
                if (!o) return this;
                e = e.split(" ");
                for (var t = 0; t < e.length; t++) {
                    var n = e[t],
                    r = n.split(".")[0];
                    for (var s = 0; s < i.length; s++) {
                        var u = i[s].idx.split(".");
                        if (i[s].idx == n || u[1] && u[1] == n.replace(".", "")) this.sound.removeEventListener(r, i[s].func, !0),
                        i.splice(s, 1)
                    }
                }
                return this
            },
            this.bindOnce = function(e, t) {
                if (!o) return this;
                var n = this;
                s[r++] = !1,
                this.bind(r + e,
                function() {
                    s[r] || (s[r] = !0, t.call(n)),
                    n.unbind(r + e)
                })
            },
            this.trigger = function(e) {
                if (!o) return this;
                e = e.split(" ");
                for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    for (var r = 0; r < i.length; r++) {
                        var s = i[r].idx.split(".");
                        if (i[r].idx == n || s[0] && s[0] == n.replace(".", "")) {
                            var u = document.createEvent("HTMLEvents");
                            u.initEvent(s[0], !1, !0),
                            this.sound.dispatchEvent(u)
                        }
                    }
                }
                return this
            },
            this.fadeTo = function(e, n, r) {
                function a() {
                    setTimeout(function() {
                        i < e && u.volume < e ? (u.setVolume(u.volume += 1), a()) : i > e && u.volume > e ? (u.setVolume(u.volume -= 1), a()) : r instanceof Function && r.apply(u)
                    },
                    s)
                }
                if (!o) return this;
                n instanceof Function ? (r = n, n = t.defaults.duration) : n = n || t.defaults.duration;
                var i = this.volume,
                s = n / Math.abs(i - e),
                u = this;
                return this.play(),
                this.whenReady(function() {
                    a()
                }),
                this
            },
            this.fadeIn = function(e, t) {
                return o ? this.setVolume(0).fadeTo(100, e, t) : this
            },
            this.fadeOut = function(e, t) {
                return o ? this.fadeTo(0, e, t) : this
            },
            this.fadeWith = function(e, t) {
                return o ? (this.fadeOut(t,
                function() {
                    this.stop()
                }), e.play().fadeIn(t), this) : this
            },
            this.whenReady = function(e) {
                if (!o) return null;
                var t = this;
                this.sound.readyState === 0 ? this.bind("canplay.buzzwhenready",
                function() {
                    e.call(t)
                }) : e.call(t)
            };
            if (o && e) {
                for (var l in t.defaults) t.defaults.hasOwnProperty(l) && (n[l] = n[l] || t.defaults[l]);
                this.sound = document.createElement("audio");
                if (e instanceof Array) for (var c in e) e.hasOwnProperty(c) && f(this.sound, e[c]);
                else if (n.formats.length) for (var h in n.formats) n.formats.hasOwnProperty(h) && f(this.sound, e + "." + n.formats[h]);
                else f(this.sound, e);
                n.loop && this.loop(),
                n.autoplay && (this.sound.autoplay = "autoplay"),
                n.preload === !0 ? this.sound.preload = "auto": n.preload === !1 ? this.sound.preload = "none": this.sound.preload = n.preload,
                this.setVolume(n.volume),
                t.sounds.push(this)
            }
        },
        group: function(e) {
            function t() {
                var t = n(null, arguments),
                r = t.shift();
                for (var i = 0; i < e.length; i++) e[i][r].apply(e[i], t)
            }
            function n(e, t) {
                return e instanceof Array ? e: Array.prototype.slice.call(t)
            }
            e = n(e, arguments),
            this.getSounds = function() {
                return e
            },
            this.add = function(t) {
                t = n(t, arguments);
                for (var r = 0; r < t.length; r++) e.push(t[r])
            },
            this.remove = function(t) {
                t = n(t, arguments);
                for (var r = 0; r < t.length; r++) for (var i = 0; i < e.length; i++) if (e[i] == t[r]) {
                    delete e[i];
                    break
                }
            },
            this.load = function() {
                return t("load"),
                this
            },
            this.play = function() {
                return t("play"),
                this
            },
            this.togglePlay = function() {
                return t("togglePlay"),
                this
            },
            this.pause = function(e) {
                return t("pause", e),
                this
            },
            this.stop = function() {
                return t("stop"),
                this
            },
            this.mute = function() {
                return t("mute"),
                this
            },
            this.unmute = function() {
                return t("unmute"),
                this
            },
            this.toggleMute = function() {
                return t("toggleMute"),
                this
            },
            this.setVolume = function(e) {
                return t("setVolume", e),
                this
            },
            this.increaseVolume = function(e) {
                return t("increaseVolume", e),
                this
            },
            this.decreaseVolume = function(e) {
                return t("decreaseVolume", e),
                this
            },
            this.loop = function() {
                return t("loop"),
                this
            },
            this.unloop = function() {
                return t("unloop"),
                this
            },
            this.setTime = function(e) {
                return t("setTime", e),
                this
            },
            this.setduration = function(e) {
                return t("setduration", e),
                this
            },
            this.set = function(e, n) {
                return t("set", e, n),
                this
            },
            this.bind = function(e, n) {
                return t("bind", e, n),
                this
            },
            this.unbind = function(e) {
                return t("unbind", e),
                this
            },
            this.bindOnce = function(e, n) {
                return t("bindOnce", e, n),
                this
            },
            this.trigger = function(e) {
                return t("trigger", e),
                this
            },
            this.fade = function(e, n, r, i) {
                return t("fade", e, n, r, i),
                this
            },
            this.fadeIn = function(e, n) {
                return t("fadeIn", e, n),
                this
            },
            this.fadeOut = function(e, n) {
                return t("fadeOut", e, n),
                this
            }
        },
        all: function() {
            return new t.group(t.sounds)
        },
        isSupported: function() {
            return !! t.el.canPlayType
        },
        isOGGSupported: function() {
            return !! t.el.canPlayType && t.el.canPlayType('audio/ogg; codecs="vorbis"')
        },
        isWAVSupported: function() {
            return !! t.el.canPlayType && t.el.canPlayType('audio/wav; codecs="1"')
        },
        isMP3Supported: function() {
            return !! t.el.canPlayType && t.el.canPlayType("audio/mpeg;")
        },
        isAACSupported: function() {
            return !! t.el.canPlayType && (t.el.canPlayType("audio/x-m4a;") || t.el.canPlayType("audio/aac;"))
        },
        toTimer: function(e, t) {
            var n, r, i;
            return n = Math.floor(e / 3600),
            n = isNaN(n) ? "--": n >= 10 ? n: "0" + n,
            r = t ? Math.floor(e / 60 % 60) : Math.floor(e / 60),
            r = isNaN(r) ? "--": r >= 10 ? r: "0" + r,
            i = Math.floor(e % 60),
            i = isNaN(i) ? "--": i >= 10 ? i: "0" + i,
            t ? n + ":" + r + ":" + i: r + ":" + i
        },
        fromTimer: function(e) {
            var t = e.toString().split(":");
            return t && t.length == 3 && (e = parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60 + parseInt(t[2], 10)),
            t && t.length == 2 && (e = parseInt(t[0], 10) * 60 + parseInt(t[1], 10)),
            e
        },
        toPercent: function(e, t, n) {
            var r = Math.pow(10, n || 0);
            return Math.round(e * 100 / t * r) / r
        },
        fromPercent: function(e, t, n) {
            var r = Math.pow(10, n || 0);
            return Math.round(t / 100 * e * r) / r
        }
    };
    return e = t,
    e
}),
define("scripts/factory/fruit.js",
function(e) {
    function k(e) {
        var t = x[e.type],
        n = t[3];
        this.type = e.type,
        this.originX = e.originX,
        this.originY = e.originY,
        this.radius = n,
        this.startX = e.originX,
        this.startY = e.originY,
        this.radius = n,
        this.anims = [],
        this.type === "boom" && (this.flame = u.create(this.startX - n + 4, this.startY - n + 5, e.flameStart || 0))
    }
    function L() {
        return g(8) == 4 ? "boom": T[g(5)]
    }
    var t = require("scripts/layer"),
    n = require("scripts/lib/ucren"),
    r = require("scripts/timeline").use("fruit").init(1),
    i = require("scripts/timeline").use("fruit-apart").init(1),
    s = require("scripts/lib/tween"),
    o = require("scripts/message"),
    u = require("scripts/object/flame"),
    a = require("scripts/object/flash"),
    f = require("scripts/factory/juice"),
    l = n.isIe,
    c = n.isSafari,
    h = s.exponential.co,
    p = s.circular,
    d = s.linear,
    v = s.quadratic.ci,
    m = s.quadratic.co,
    g = n.randomNumber,
    y = Math.min,
    b = function(e, t) {
        return (e + t) / 2 >> 0
    },
    w = 1200,
    E = 200,
    S = 50,
    x = {
        boom: ["images/boom.png", 66, 68, 26, 0, 0, null],
        peach: ["images/peach.png", 62, 59, 37, -50, 0, "#e6c731"],
        sandia: ["images/sandia.png", 98, 85, 38, -100, 0, "#c00"],
        apple: ["images/apple.png", 66, 66, 31, -54, 0, "#c8e925"],
        banana: ["images/banana.png", 126, 50, 43, 90, 0, null],
        basaha: ["images/basaha.png", 68, 72, 32, -135, 0, "#c00"]
    },
    T = ["peach", "sandia", "apple", "banana", "basaha"],
    N = [60, 50, 40, -40, -50, -60],
    C = [];
    return k.prototype.set = function(e) {
        var n = x[this.type],
        r = this.radius;
        return this.shadow = t.createImage("fruit", "images/shadow.png", this.startX - r, this.startY - r + S, 106, 77),
        this.image = t.createImage("fruit", n[0], this.startX - r, this.startY - r, n[1], n[2]),
        e && (this.image.hide(), this.shadow.hide()),
        this
    },
    k.prototype.pos = function(e, t) {
        if (e == this.originX && t == this.originY) return;
        var n = this.radius;
        this.originX = e,
        this.originY = t,
        this.image.attr({
            x: e -= n,
            y: t -= n
        }),
        this.shadow.attr({
            x: e,
            y: t + S
        }),
        this.type === "boom" && this.flame.pos(e + 4, t + 5)
    },
    k.prototype.show = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [1e-5, 1, "show"],
            object: this,
            onTimeUpdate: this.onScaling,
            onTimeStart: this.onShowStart,
            recycle: this.anims
        })
    },
    k.prototype.hide = function(e) {
        if (this.type !== "boom") return;
        this.anims.clear(),
        this.flame.remove(),
        r.createTask({
            start: e,
            duration: 500,
            data: [1, 1e-5, "hide"],
            object: this,
            onTimeUpdate: this.onScaling,
            onTimeEnd: this.onHideEnd,
            recycle: this.anims
        })
    },
    k.prototype.rotate = function(e, t) {
        this.rotateSpeed = t || N[g(6)],
        this.rotateAnim = r.createTask({
            start: e,
            duration: -1,
            object: this,
            onTimeUpdate: this.onRotating,
            recycle: this.anims
        })
    },
    k.prototype.broken = function(e) {
        if (this.brokend) return;
        this.brokend = !0;
        var t; (t = C.indexOf(this)) > -1 && C.splice(t, 1),
        this.type !== "boom" ? (a.showAt(this.originX, this.originY, e), f.create(this.originX, this.originY, x[this.type][6]), this.apart(e)) : this.hide()
    },
    k.prototype.pause = function() {
        if (this.brokend) return;
        this.anims.clear(),
        this.type == "boom" && this.flame.remove()
    },
    k.prototype.apart = function(e) {
        this.anims.clear(),
        this.image.hide(),
        this.shadow.hide(),
        this.aparted = !0;
        var n = x[this.type],
        r = n[0].replace(".png", ""),
        s = this.radius,
        o = t.createImage.saturate(t, this.startX - s, this.startY - s, n[1], n[2]);
        e = (e % 180 + 360 + n[4]) % 360,
        this.bImage1 = o("fruit", r + "-1.png"),
        this.bImage2 = o("fruit", r + "-2.png"),
        [this.bImage1, this.bImage2].invoke("rotate", e),
        this.apartAngle = e,
        i.createTask({
            start: 0,
            duration: w,
            object: this,
            onTimeUpdate: this.onBrokenDropUpdate,
            onTimeStart: this.onBrokenDropStart,
            onTimeEnd: this.onBrokenDropEnd,
            recycle: this.anims
        })
    },
    k.prototype.shotOut = function() {
        var e = [ - 1, 1];
        return function(t, n) {
            return this.shotOutStartX = this.originX,
            this.shotOutStartY = this.originY,
            this.shotOutEndX = b(this.originX, n),
            this.shotOutEndY = y(this.startY - g(this.startY - 100), 200),
            this.fallOffToX = n,
            r.createTask({
                start: t,
                duration: w,
                object: this,
                onTimeUpdate: this.onShotOuting,
                onTimeStart: this.onShotOutStart,
                onTimeEnd: this.onShotOutEnd,
                recycle: this.anims
            }),
            this.type != "boom" && this.rotate(0, (g(180) + 90) * e[g(2)]),
            this
        }
    } (),
    k.prototype.fallOff = function() {
        var e = [ - 1, 1],
        t = 0;
        return function(n, i) {
            if (this.aparted || this.brokend) return;
            var s = 600;
            typeof i != "number" && (i = this.originX + g(E) * e[t++%2]),
            this.fallTargetX = i,
            this.fallTargetY = s,
            r.createTask({
                start: n,
                duration: w,
                object: this,
                onTimeUpdate: this.onFalling,
                onTimeStart: this.onFallStart,
                onTimeEnd: this.onFallEnd,
                recycle: this.anims
            })
        }
    } (),
    k.prototype.remove = function() {
        var e;
        this.anims.clear(),
        this.image && (this.image.remove(), this.shadow.remove()),
        this.bImage1 && (this.bImage1.remove(), this.bImage2.remove()),
        this.type === "boom" && this.flame.remove(),
        (e = C.indexOf(this)) > -1 && C.splice(e, 1);
        for (var t in this) typeof this[t] == "function" ? this[t] = function(e) {
            return function() {
                throw new Error("method " + e + " has been removed")
            }
        } (t) : delete this[t];
        o.postMessage(this, "fruit.remove")
    },
    k.prototype.onShowStart = function() {
        this.image.show()
    },
    k.prototype.onScaling = function(e, t, n, r) {
        this.image.scale(r = h(e, t, n - t, 500), r),
        this.shadow.scale(r, r)
    },
    k.prototype.onHideEnd = function() {
        this.remove()
    },
    k.prototype.onRotateStart = function() {},
    k.prototype.onRotating = function(e) {
        this.image.rotate(this.rotateSpeed * e / 1e3 % 360, !0)
    },
    k.prototype.onBrokenDropUpdate = function(e) {
        var t = this.radius;
        this.bImage1.attr({
            x: d(e, this.brokenPosX - t, this.brokenTargetX1, w),
            y: v(e, this.brokenPosY - t, this.brokenTargetY1 - this.brokenPosY + t, w)
        }).rotate(d(e, this.apartAngle, this.bImage1RotateAngle, w), !0),
        this.bImage2.attr({
            x: d(e, this.brokenPosX - t, this.brokenTargetX2, w),
            y: v(e, this.brokenPosY - t, this.brokenTargetY2 - this.brokenPosY + t, w)
        }).rotate(d(e, this.apartAngle, this.bImage2RotateAngle, w), !0)
    },
    k.prototype.onBrokenDropStart = function() {
        this.brokenTargetX1 = -(g(E) + 75),
        this.brokenTargetX2 = g(E + 75),
        this.brokenTargetY1 = 600,
        this.brokenTargetY2 = 600,
        this.brokenPosX = this.originX,
        this.brokenPosY = this.originY,
        this.bImage1RotateAngle = -g(150) - 50,
        this.bImage2RotateAngle = g(150) + 50;
        for (var e, t = C.length - 1; t >= 0; t--) C[t] === this && C.splice(t, 1)
    },
    k.prototype.onBrokenDropEnd = function() {
        this.remove()
    },
    k.prototype.onShotOuting = function(e) {
        this.pos(d(e, this.shotOutStartX, this.shotOutEndX - this.shotOutStartX, w), m(e, this.shotOutStartY, this.shotOutEndY - this.shotOutStartY, w))
    },
    k.prototype.onShotOutStart = function() {},
    k.prototype.onShotOutEnd = function() {
        this.fallOff(0, this.fallOffToX)
    },
    k.prototype.onFalling = function(e) {
        var t;
        this.pos(d(e, this.brokenPosX, this.fallTargetX - this.brokenPosX, w), t = v(e, this.brokenPosY, this.fallTargetY - this.brokenPosY, w)),
        this.checkForFallOutOfViewer(t)
    },
    k.prototype.onFallStart = function() {
        this.brokenPosX = this.originX,
        this.brokenPosY = this.originY
    },
    k.prototype.onFallEnd = function() {
        o.postMessage(this, "fruit.fallOff"),
        this.remove()
    },
    k.prototype.checkForFallOutOfViewer = function(e) {
        e > 480 + this.radius && (this.checkForFallOutOfViewer = n.nul, this.rotateAnim && this.rotateAnim.stop(), o.postMessage(this, "fruit.fallOutOfViewer"))
    },
    e.create = function(e, t, n, r, i) {
        typeof e == "number" && (r = n, n = t, t = e, e = L());
        var s = (new k({
            type: e,
            originX: t,
            originY: n,
            flameStart: i
        })).set(r);
        return C.unshift(s),
        s
    },
    e.getFruitInView = function() {
        return C
    },
    e.getDropTimeSetting = function() {
        return w
    },
    e
}),
define("scripts/layer.js",
function(e) {
    function s() {
        return s.num = ++s.num || 2
    }
    var t = require("scripts/lib/raphael"),
    n = require("scripts/lib/ucren"),
    r = {},
    i = {
        "default": s(),
        light: s(),
        knife: s(),
        fruit: s(),
        juice: s(),
        flash: s(),
        mask: s()
    };
    return e.createImage = function(e, t, n, r, i, s) {
        return e = this.getLayer(e),
        e.image(t, n, r, i, s)
    },
    e.createText = function(e, t, r, i, s, o) {
        return e = this.getLayer(e),
        n.isIe && (i += 2),
        e.text(r, i, t).attr({
            fill: s || "#fff",
            "font-size": o || "14px",
            "font-family": "黑体",
            "text-anchor": "start"
        })
    },
    e.getLayer = function(e) {
        var s, o;
        return e = e || "default",
        (s = r[e]) ? s: (o = n.makeElement("div", {
            "class": "layer",
            style: "z-index: " + (i[e] || 0) + ";"
        }), n.Element("extra").add(o), s = r[e] = t(o, 640, 480), s)
    },
    e
}),
define("scripts/lib/raphael.js",
function(e) {
    var t, n = {};
    return function() {
        function e() {
            if (e.is(arguments[0], P)) {
                var t = arguments[0],
                n = Kt[d](e, t.splice(0, 3 + e.is(t[0], _))),
                r = n.set();
                for (var s = 0,
                o = t[T]; s < o; s++) {
                    var a = t[s] || {};
                    i[u](a.type) && r[I](n[a.type]().attr(a))
                }
                return r
            }
            return Kt[d](e, arguments)
        }
        function ft() {
            var e = [],
            t = 0;
            for (; t < 32; t++) e[t] = (~~ (C.random() * 16))[H](16);
            return e[12] = 4,
            e[16] = (e[16] & 3 | 8)[H](16),
            "r-" + e[x]("")
        }
        function dt(e, t, n) {
            function r() {
                var i = Array[o].slice.call(arguments, 0),
                s = i[x]("►"),
                a = r.cache = r.cache || {},
                f = r.count = r.count || [];
                return a[u](s) ? n ? n(a[s]) : a[s] : (f[T] >= 1e3 && delete a[f.shift()], f[I](s), a[s] = e[d](t, i), n ? n(a[s]) : a[s])
            }
            return r
        }
        function gn() {
            return this.x + y + this.y
        }
        function An(t) {
            return function(n, r, i, s) {
                var o = {
                    back: t
                };
                return e.is(i, "function") ? s = i: o.rot = i,
                n && n.constructor == Rt && (n = n.attrs.path),
                n && (o.along = n),
                this.animate(o, r, s)
            }
        }
        function On(e, t, n, r, i, s) {
            function h(e) {
                return ((a * e + u) * e + o) * e
            }
            function p(e, t) {
                var n = d(e, t);
                return ((c * n + l) * n + f) * n
            }
            function d(e, t) {
                var n, r, i, s, f, l;
                for (i = e, l = 0; l < 8; l++) {
                    s = h(i) - e;
                    if (A(s) < t) return i;
                    f = (3 * a * i + 2 * u) * i + o;
                    if (A(f) < 1e-6) break;
                    i -= s / f
                }
                n = 0,
                r = 1,
                i = e;
                if (i < n) return n;
                if (i > r) return r;
                while (n < r) {
                    s = h(i);
                    if (A(s - e) < t) return i;
                    e > s ? n = i: r = i,
                    i = (r - n) / 2 + n
                }
                return i
            }
            var o = 3 * t,
            u = 3 * (r - t) - o,
            a = 1 - o - u,
            f = 3 * n,
            l = 3 * (i - n) - f,
            c = 1 - f - l;
            return p(e, 1 / (200 * s))
        }
        e.version = "1.5.2";
        var r = /[, ]+/,
        i = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        },
        s = /\{(\d+)\}/g,
        o = "prototype",
        u = "hasOwnProperty",
        a = document,
        f = n,
        l = {
            was: Object[o][u].call(f, "Raphael"),
            is: f.Raphael
        },
        c = function() {
            this.customAttributes = {}
        },
        h,
        p = "appendChild",
        d = "apply",
        v = "concat",
        m = "createTouch" in a,
        g = "",
        y = " ",
        b = String,
        w = "split",
        E = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend" [w](y),
        S = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        x = "join",
        T = "length",
        N = b[o].toLowerCase,
        C = Math,
        k = C.max,
        L = C.min,
        A = C.abs,
        O = C.pow,
        M = C.PI,
        _ = "number",
        D = "string",
        P = "array",
        H = "toString",
        B = "fill",
        j = Object[o][H],
        F = {},
        I = "push",
        q = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        R = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        U = {
            NaN: 1,
            Infinity: 1,
            "-Infinity": 1
        },
        z = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        W = C.round,
        X = "setAttribute",
        V = parseFloat,
        $ = parseInt,
        J = " progid:DXImageTransform.Microsoft",
        K = b[o].toUpperCase,
        Q = {
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rotation: 0,
            rx: 0,
            ry: 0,
            scale: "1 1",
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            translation: "0 0",
            width: 0,
            x: 0,
            y: 0
        },
        G = {
            along: "along",
            blur: _,
            "clip-rect": "csv",
            cx: _,
            cy: _,
            fill: "colour",
            "fill-opacity": _,
            "font-size": _,
            height: _,
            opacity: _,
            path: "path",
            r: _,
            rotation: "csv",
            rx: _,
            ry: _,
            scale: "csv",
            stroke: "colour",
            "stroke-opacity": _,
            "stroke-width": _,
            translation: "csv",
            width: _,
            x: _,
            y: _
        },
        Y = "replace",
        Z = /^(from|to|\d+%?)$/,
        et = /\s*,\s*/,
        tt = {
            hs: 1,
            rg: 1
        },
        nt = /,?([achlmqrstvxz]),?/gi,
        rt = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        it = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
        st = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        ot = function(e, t) {
            return e.key - t.key
        };
        e.type = f.SVGAngle || a.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG": "VML";
        if (e.type == "VML") {
            var ut = a.createElement("div"),
            at;
            ut.innerHTML = '<v:shape adj="1"/>',
            at = ut.firstChild,
            at.style.behavior = "url(#default#VML)";
            if (!at || typeof at.adj != "object") return e.type = null;
            ut = null
        }
        e.svg = !(e.vml = e.type == "VML"),
        c[o] = e[o],
        h = c[o],
        e._id = 0,
        e._oid = 0,
        e.fn = {},
        e.is = function(e, t) {
            return t = N.call(t),
            t == "finite" ? !U[u]( + e) : t == "null" && e === null || t == typeof e || t == "object" && e === Object(e) || t == "array" && Array.isArray && Array.isArray(e) || j.call(e).slice(8, -1).toLowerCase() == t
        },
        e.angle = function(t, n, r, i, s, o) {
            if (s == null) {
                var u = t - r,
                a = n - i;
                return ! u && !a ? 0 : ((u < 0) * 180 + C.atan( - a / -u) * 180 / M + 360) % 360
            }
            return e.angle(t, n, s, o) - e.angle(r, i, s, o)
        },
        e.rad = function(e) {
            return e % 360 * M / 180
        },
        e.deg = function(e) {
            return e * 180 / M % 360
        },
        e.snapTo = function(t, n, r) {
            r = e.is(r, "finite") ? r: 10;
            if (e.is(t, P)) {
                var i = t.length;
                while (i--) if (A(t[i] - n) <= r) return t[i]
            } else {
                t = +t;
                var s = n % t;
                if (s < r) return n - s;
                if (s > t - r) return n - s + t
            }
            return n
        },
        e.setWindow = function(e) {
            f = e,
            a = f.document
        };
        var lt = function(e) {
            if (i.vml) {
                var t = /^\s+|\s+$/g,
                n;
                try {
                    var r = new ActiveXObject("htmlfile");
                    r.write("<body>"),
                    r.close(),
                    n = r.body
                } catch(i) {
                    n = createPopup().document.body
                }
                var s = n.createTextRange();
                lt = dt(function(e) {
                    try {
                        n.style.color = b(e)[Y](t, g);
                        var r = s.queryCommandValue("ForeColor");
                        return r = (r & 255) << 16 | r & 65280 | (r & 16711680) >>> 16,
                        "#" + ("000000" + r[H](16)).slice( - 6)
                    } catch(e) {
                        return "none"
                    }
                })
            } else {
                var o = a.createElement("i");
                o.title = "Raphaël Colour Picker",
                o.style.display = "none",
                a.body[p](o),
                lt = dt(function(e) {
                    return o.style.color = e,
                    a.defaultView.getComputedStyle(o, g).getPropertyValue("color")
                })
            }
            return lt(e)
        },
        ct = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")"
        },
        ht = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")"
        },
        pt = function() {
            return this.hex
        };
        e.hsb2rgb = function(t, n, r, i) {
            return e.is(t, "object") && "h" in t && "s" in t && "b" in t && (r = t.b, n = t.s, t = t.h, i = t.o),
            e.hsl2rgb(t, n, r / 2, i)
        },
        e.hsl2rgb = function(t, n, r, i) {
            e.is(t, "object") && "h" in t && "s" in t && "l" in t && (r = t.l, n = t.s, t = t.h);
            if (t > 1 || n > 1 || r > 1) t /= 360,
            n /= 100,
            r /= 100;
            var s = {},
            o = ["r", "g", "b"],
            u,
            a,
            f,
            l,
            c,
            h;
            if (n) {
                r < .5 ? u = r * (1 + n) : u = r + n - r * n,
                a = 2 * r - u;
                for (var p = 0; p < 3; p++) f = t + 1 / 3 * -(p - 1),
                f < 0 && f++,
                f > 1 && f--,
                f * 6 < 1 ? s[o[p]] = a + (u - a) * 6 * f: f * 2 < 1 ? s[o[p]] = u: f * 3 < 2 ? s[o[p]] = a + (u - a) * (2 / 3 - f) * 6 : s[o[p]] = a
            } else s = {
                r: r,
                g: r,
                b: r
            };
            return s.r *= 255,
            s.g *= 255,
            s.b *= 255,
            s.hex = "#" + (16777216 | s.b | s.g << 8 | s.r << 16).toString(16).slice(1),
            e.is(i, "finite") && (s.opacity = i),
            s.toString = pt,
            s
        },
        e.rgb2hsb = function(t, n, r) {
            n == null && e.is(t, "object") && "r" in t && "g" in t && "b" in t && (r = t.b, n = t.g, t = t.r);
            if (n == null && e.is(t, D)) {
                var i = e.getRGB(t);
                t = i.r,
                n = i.g,
                r = i.b
            }
            if (t > 1 || n > 1 || r > 1) t /= 255,
            n /= 255,
            r /= 255;
            var s = k(t, n, r),
            o = L(t, n, r),
            u,
            a,
            f = s;
            if (o == s) return {
                h: 0,
                s: 0,
                b: s,
                toString: ct
            };
            var l = s - o;
            return a = l / s,
            t == s ? u = (n - r) / l: n == s ? u = 2 + (r - t) / l: u = 4 + (t - n) / l,
            u /= 6,
            u < 0 && u++,
            u > 1 && u--,
            {
                h: u,
                s: a,
                b: f,
                toString: ct
            }
        },
        e.rgb2hsl = function(t, n, r) {
            n == null && e.is(t, "object") && "r" in t && "g" in t && "b" in t && (r = t.b, n = t.g, t = t.r);
            if (n == null && e.is(t, D)) {
                var i = e.getRGB(t);
                t = i.r,
                n = i.g,
                r = i.b
            }
            if (t > 1 || n > 1 || r > 1) t /= 255,
            n /= 255,
            r /= 255;
            var s = k(t, n, r),
            o = L(t, n, r),
            u,
            a,
            f = (s + o) / 2,
            l;
            if (o == s) l = {
                h: 0,
                s: 0,
                l: f
            };
            else {
                var c = s - o;
                a = f < .5 ? c / (s + o) : c / (2 - s - o),
                t == s ? u = (n - r) / c: n == s ? u = 2 + (r - t) / c: u = 4 + (t - n) / c,
                u /= 6,
                u < 0 && u++,
                u > 1 && u--,
                l = {
                    h: u,
                    s: a,
                    l: f
                }
            }
            return l.toString = ht,
            l
        },
        e._path2string = function() {
            return this.join(",")[Y](nt, "$1")
        },
        e.getRGB = dt(function(t) {
            if (!t || !!((t = b(t)).indexOf("-") + 1)) return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1
            };
            if (t == "none") return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none"
            }; ! tt[u](t.toLowerCase().substring(0, 2)) && t.charAt() != "#" && (t = lt(t));
            var n, r, i, s, o, a, f, l = t.match(R);
            return l ? (l[2] && (s = $(l[2].substring(5), 16), i = $(l[2].substring(3, 5), 16), r = $(l[2].substring(1, 3), 16)), l[3] && (s = $((a = l[3].charAt(3)) + a, 16), i = $((a = l[3].charAt(2)) + a, 16), r = $((a = l[3].charAt(1)) + a, 16)), l[4] && (f = l[4][w](et), r = V(f[0]), f[0].slice( - 1) == "%" && (r *= 2.55), i = V(f[1]), f[1].slice( - 1) == "%" && (i *= 2.55), s = V(f[2]), f[2].slice( - 1) == "%" && (s *= 2.55), l[1].toLowerCase().slice(0, 4) == "rgba" && (o = V(f[3])), f[3] && f[3].slice( - 1) == "%" && (o /= 100)), l[5] ? (f = l[5][w](et), r = V(f[0]), f[0].slice( - 1) == "%" && (r *= 2.55), i = V(f[1]), f[1].slice( - 1) == "%" && (i *= 2.55), s = V(f[2]), f[2].slice( - 1) == "%" && (s *= 2.55), (f[0].slice( - 3) == "deg" || f[0].slice( - 1) == "°") && (r /= 360), l[1].toLowerCase().slice(0, 4) == "hsba" && (o = V(f[3])), f[3] && f[3].slice( - 1) == "%" && (o /= 100), e.hsb2rgb(r, i, s, o)) : l[6] ? (f = l[6][w](et), r = V(f[0]), f[0].slice( - 1) == "%" && (r *= 2.55), i = V(f[1]), f[1].slice( - 1) == "%" && (i *= 2.55), s = V(f[2]), f[2].slice( - 1) == "%" && (s *= 2.55), (f[0].slice( - 3) == "deg" || f[0].slice( - 1) == "°") && (r /= 360), l[1].toLowerCase().slice(0, 4) == "hsla" && (o = V(f[3])), f[3] && f[3].slice( - 1) == "%" && (o /= 100), e.hsl2rgb(r, i, s, o)) : (l = {
                r: r,
                g: i,
                b: s
            },
            l.hex = "#" + (16777216 | s | i << 8 | r << 16).toString(16).slice(1), e.is(o, "finite") && (l.opacity = o), l)) : {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1
            }
        },
        e),
        e.getColor = function(e) {
            var t = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: e || .75
            },
            n = this.hsb2rgb(t.h, t.s, t.b);
            return t.h += .075,
            t.h > 1 && (t.h = 0, t.s -= .2, t.s <= 0 && (this.getColor.start = {
                h: 0,
                s: 1,
                b: t.b
            })),
            n.hex
        },
        e.getColor.reset = function() {
            delete this.start
        },
        e.parsePathString = dt(function(t) {
            if (!t) return null;
            var n = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0
            },
            r = [];
            return e.is(t, P) && e.is(t[0], P) && (r = mt(t)),
            r[T] || b(t)[Y](rt,
            function(e, t, i) {
                var s = [],
                o = N.call(t);
                i[Y](it,
                function(e, t) {
                    t && s[I]( + t)
                }),
                o == "m" && s[T] > 2 && (r[I]([t][v](s.splice(0, 2))), o = "l", t = t == "m" ? "l": "L");
                while (s[T] >= n[o]) {
                    r[I]([t][v](s.splice(0, n[o])));
                    if (!n[o]) break
                }
            }),
            r[H] = e._path2string,
            r
        }),
        e.findDotsAtSegment = function(e, t, n, r, i, s, o, u, a) {
            var f = 1 - a,
            l = O(f, 3) * e + O(f, 2) * 3 * a * n + f * 3 * a * a * i + O(a, 3) * o,
            c = O(f, 3) * t + O(f, 2) * 3 * a * r + f * 3 * a * a * s + O(a, 3) * u,
            h = e + 2 * a * (n - e) + a * a * (i - 2 * n + e),
            p = t + 2 * a * (r - t) + a * a * (s - 2 * r + t),
            d = n + 2 * a * (i - n) + a * a * (o - 2 * i + n),
            v = r + 2 * a * (s - r) + a * a * (u - 2 * s + r),
            m = (1 - a) * e + a * n,
            g = (1 - a) * t + a * r,
            y = (1 - a) * i + a * o,
            b = (1 - a) * s + a * u,
            w = 90 - C.atan((h - d) / (p - v)) * 180 / M;
            return (h > d || p < v) && (w += 180),
            {
                x: l,
                y: c,
                m: {
                    x: h,
                    y: p
                },
                n: {
                    x: d,
                    y: v
                },
                start: {
                    x: m,
                    y: g
                },
                end: {
                    x: y,
                    y: b
                },
                alpha: w
            }
        };
        var vt = dt(function(e) {
            if (!e) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            e = Tt(e);
            var t = 0,
            n = 0,
            r = [],
            i = [],
            s;
            for (var o = 0,
            u = e[T]; o < u; o++) {
                s = e[o];
                if (s[0] == "M") t = s[1],
                n = s[2],
                r[I](t),
                i[I](n);
                else {
                    var a = xt(t, n, s[1], s[2], s[3], s[4], s[5], s[6]);
                    r = r[v](a.min.x, a.max.x),
                    i = i[v](a.min.y, a.max.y),
                    t = s[5],
                    n = s[6]
                }
            }
            var f = L[d](0, r),
            l = L[d](0, i);
            return {
                x: f,
                y: l,
                width: k[d](0, r) - f,
                height: k[d](0, i) - l
            }
        }),
        mt = function(t) {
            var n = [];
            if (!e.is(t, P) || !e.is(t && t[0], P)) t = e.parsePathString(t);
            for (var r = 0,
            i = t[T]; r < i; r++) {
                n[r] = [];
                for (var s = 0,
                o = t[r][T]; s < o; s++) n[r][s] = t[r][s]
            }
            return n[H] = e._path2string,
            n
        },
        gt = dt(function(t) {
            if (!e.is(t, P) || !e.is(t && t[0], P)) t = e.parsePathString(t);
            var n = [],
            r = 0,
            i = 0,
            s = 0,
            o = 0,
            u = 0;
            t[0][0] == "M" && (r = t[0][1], i = t[0][2], s = r, o = i, u++, n[I](["M", r, i]));
            for (var a = u,
            f = t[T]; a < f; a++) {
                var l = n[a] = [],
                c = t[a];
                if (c[0] != N.call(c[0])) {
                    l[0] = N.call(c[0]);
                    switch (l[0]) {
                    case "a":
                        l[1] = c[1],
                        l[2] = c[2],
                        l[3] = c[3],
                        l[4] = c[4],
                        l[5] = c[5],
                        l[6] = +(c[6] - r).toFixed(3),
                        l[7] = +(c[7] - i).toFixed(3);
                        break;
                    case "v":
                        l[1] = +(c[1] - i).toFixed(3);
                        break;
                    case "m":
                        s = c[1],
                        o = c[2];
                    default:
                        for (var h = 1,
                        p = c[T]; h < p; h++) l[h] = +(c[h] - (h % 2 ? r: i)).toFixed(3)
                    }
                } else {
                    l = n[a] = [],
                    c[0] == "m" && (s = c[1] + r, o = c[2] + i);
                    for (var d = 0,
                    v = c[T]; d < v; d++) n[a][d] = c[d]
                }
                var m = n[a][T];
                switch (n[a][0]) {
                case "z":
                    r = s,
                    i = o;
                    break;
                case "h":
                    r += +n[a][m - 1];
                    break;
                case "v":
                    i += +n[a][m - 1];
                    break;
                default:
                    r += +n[a][m - 2],
                    i += +n[a][m - 1]
                }
            }
            return n[H] = e._path2string,
            n
        },
        0, mt),
        yt = dt(function(t) {
            if (!e.is(t, P) || !e.is(t && t[0], P)) t = e.parsePathString(t);
            var n = [],
            r = 0,
            i = 0,
            s = 0,
            o = 0,
            u = 0;
            t[0][0] == "M" && (r = +t[0][1], i = +t[0][2], s = r, o = i, u++, n[0] = ["M", r, i]);
            for (var a = u,
            f = t[T]; a < f; a++) {
                var l = n[a] = [],
                c = t[a];
                if (c[0] != K.call(c[0])) {
                    l[0] = K.call(c[0]);
                    switch (l[0]) {
                    case "A":
                        l[1] = c[1],
                        l[2] = c[2],
                        l[3] = c[3],
                        l[4] = c[4],
                        l[5] = c[5],
                        l[6] = +(c[6] + r),
                        l[7] = +(c[7] + i);
                        break;
                    case "V":
                        l[1] = +c[1] + i;
                        break;
                    case "H":
                        l[1] = +c[1] + r;
                        break;
                    case "M":
                        s = +c[1] + r,
                        o = +c[2] + i;
                    default:
                        for (var h = 1,
                        p = c[T]; h < p; h++) l[h] = +c[h] + (h % 2 ? r: i)
                    }
                } else for (var d = 0,
                v = c[T]; d < v; d++) n[a][d] = c[d];
                switch (l[0]) {
                case "Z":
                    r = s,
                    i = o;
                    break;
                case "H":
                    r = l[1];
                    break;
                case "V":
                    i = l[1];
                    break;
                case "M":
                    s = n[a][n[a][T] - 2],
                    o = n[a][n[a][T] - 1];
                default:
                    r = n[a][n[a][T] - 2],
                    i = n[a][n[a][T] - 1]
                }
            }
            return n[H] = e._path2string,
            n
        },
        null, mt),
        bt = function(e, t, n, r) {
            return [e, t, n, r, n, r]
        },
        wt = function(e, t, n, r, i, s) {
            var o = 1 / 3,
            u = 2 / 3;
            return [o * e + u * n, o * t + u * r, o * i + u * n, o * s + u * r, i, s]
        },
        Et = function(e, t, n, r, i, s, o, u, a, f) {
            var l = M * 120 / 180,
            c = M / 180 * ( + i || 0),
            h = [],
            p,
            d = dt(function(e, t, n) {
                var r = e * C.cos(n) - t * C.sin(n),
                i = e * C.sin(n) + t * C.cos(n);
                return {
                    x: r,
                    y: i
                }
            });
            if (f) _ = f[0],
            D = f[1],
            L = f[2],
            O = f[3];
            else {
                p = d(e, t, -c),
                e = p.x,
                t = p.y,
                p = d(u, a, -c),
                u = p.x,
                a = p.y;
                var m = C.cos(M / 180 * i),
                g = C.sin(M / 180 * i),
                y = (e - u) / 2,
                b = (t - a) / 2,
                E = y * y / (n * n) + b * b / (r * r);
                E > 1 && (E = C.sqrt(E), n = E * n, r = E * r);
                var S = n * n,
                N = r * r,
                k = (s == o ? -1 : 1) * C.sqrt(A((S * N - S * b * b - N * y * y) / (S * b * b + N * y * y))),
                L = k * n * b / r + (e + u) / 2,
                O = k * -r * y / n + (t + a) / 2,
                _ = C.asin(((t - O) / r).toFixed(9)),
                D = C.asin(((a - O) / r).toFixed(9));
                _ = e < L ? M - _: _,
                D = u < L ? M - D: D,
                _ < 0 && (_ = M * 2 + _),
                D < 0 && (D = M * 2 + D),
                o && _ > D && (_ -= M * 2),
                !o && D > _ && (D -= M * 2)
            }
            var P = D - _;
            if (A(P) > l) {
                var H = D,
                B = u,
                j = a;
                D = _ + l * (o && D > _ ? 1 : -1),
                u = L + n * C.cos(D),
                a = O + r * C.sin(D),
                h = Et(u, a, n, r, i, 0, o, B, j, [D, H, L, O])
            }
            P = D - _;
            var F = C.cos(_),
            I = C.sin(_),
            q = C.cos(D),
            R = C.sin(D),
            U = C.tan(P / 4),
            z = 4 / 3 * n * U,
            W = 4 / 3 * r * U,
            X = [e, t],
            V = [e + z * I, t - W * F],
            $ = [u + z * R, a - W * q],
            J = [u, a];
            V[0] = 2 * X[0] - V[0],
            V[1] = 2 * X[1] - V[1];
            if (f) return [V, $, J][v](h);
            h = [V, $, J][v](h)[x]()[w](",");
            var K = [];
            for (var Q = 0,
            G = h[T]; Q < G; Q++) K[Q] = Q % 2 ? d(h[Q - 1], h[Q], c).y: d(h[Q], h[Q + 1], c).x;
            return K
        },
        St = function(e, t, n, r, i, s, o, u, a) {
            var f = 1 - a;
            return {
                x: O(f, 3) * e + O(f, 2) * 3 * a * n + f * 3 * a * a * i + O(a, 3) * o,
                y: O(f, 3) * t + O(f, 2) * 3 * a * r + f * 3 * a * a * s + O(a, 3) * u
            }
        },
        xt = dt(function(e, t, n, r, i, s, o, u) {
            var a = i - 2 * n + e - (o - 2 * i + n),
            f = 2 * (n - e) - 2 * (i - n),
            l = e - n,
            c = ( - f + C.sqrt(f * f - 4 * a * l)) / 2 / a,
            h = ( - f - C.sqrt(f * f - 4 * a * l)) / 2 / a,
            p = [t, u],
            v = [e, o],
            m;
            return A(c) > "1e12" && (c = .5),
            A(h) > "1e12" && (h = .5),
            c > 0 && c < 1 && (m = St(e, t, n, r, i, s, o, u, c), v[I](m.x), p[I](m.y)),
            h > 0 && h < 1 && (m = St(e, t, n, r, i, s, o, u, h), v[I](m.x), p[I](m.y)),
            a = s - 2 * r + t - (u - 2 * s + r),
            f = 2 * (r - t) - 2 * (s - r),
            l = t - r,
            c = ( - f + C.sqrt(f * f - 4 * a * l)) / 2 / a,
            h = ( - f - C.sqrt(f * f - 4 * a * l)) / 2 / a,
            A(c) > "1e12" && (c = .5),
            A(h) > "1e12" && (h = .5),
            c > 0 && c < 1 && (m = St(e, t, n, r, i, s, o, u, c), v[I](m.x), p[I](m.y)),
            h > 0 && h < 1 && (m = St(e, t, n, r, i, s, o, u, h), v[I](m.x), p[I](m.y)),
            {
                min: {
                    x: L[d](0, v),
                    y: L[d](0, p)
                },
                max: {
                    x: k[d](0, v),
                    y: k[d](0, p)
                }
            }
        }),
        Tt = dt(function(e, t) {
            var n = yt(e),
            r = t && yt(t),
            i = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            },
            s = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            },
            o = function(e, t) {
                var n, r;
                if (!e) return ["C", t.x, t.y, t.x, t.y, t.x, t.y]; ! (e[0] in {
                    T: 1,
                    Q: 1
                }) && (t.qx = t.qy = null);
                switch (e[0]) {
                case "M":
                    t.X = e[1],
                    t.Y = e[2];
                    break;
                case "A":
                    e = ["C"][v](Et[d](0, [t.x, t.y][v](e.slice(1))));
                    break;
                case "S":
                    n = t.x + (t.x - (t.bx || t.x)),
                    r = t.y + (t.y - (t.by || t.y)),
                    e = ["C", n, r][v](e.slice(1));
                    break;
                case "T":
                    t.qx = t.x + (t.x - (t.qx || t.x)),
                    t.qy = t.y + (t.y - (t.qy || t.y)),
                    e = ["C"][v](wt(t.x, t.y, t.qx, t.qy, e[1], e[2]));
                    break;
                case "Q":
                    t.qx = e[1],
                    t.qy = e[2],
                    e = ["C"][v](wt(t.x, t.y, e[1], e[2], e[3], e[4]));
                    break;
                case "L":
                    e = ["C"][v](bt(t.x, t.y, e[1], e[2]));
                    break;
                case "H":
                    e = ["C"][v](bt(t.x, t.y, e[1], t.y));
                    break;
                case "V":
                    e = ["C"][v](bt(t.x, t.y, t.x, e[1]));
                    break;
                case "Z":
                    e = ["C"][v](bt(t.x, t.y, t.X, t.Y))
                }
                return e
            },
            u = function(e, t) {
                if (e[t][T] > 7) {
                    e[t].shift();
                    var i = e[t];
                    while (i[T]) e.splice(t++, 0, ["C"][v](i.splice(0, 6)));
                    e.splice(t, 1),
                    l = k(n[T], r && r[T] || 0)
                }
            },
            a = function(e, t, i, s, o) {
                e && t && e[o][0] == "M" && t[o][0] != "M" && (t.splice(o, 0, ["M", s.x, s.y]), i.bx = 0, i.by = 0, i.x = e[o][1], i.y = e[o][2], l = k(n[T], r && r[T] || 0))
            };
            for (var f = 0,
            l = k(n[T], r && r[T] || 0); f < l; f++) {
                n[f] = o(n[f], i),
                u(n, f),
                r && (r[f] = o(r[f], s)),
                r && u(r, f),
                a(n, r, i, s, f),
                a(r, n, s, i, f);
                var c = n[f],
                h = r && r[f],
                p = c[T],
                m = r && h[T];
                i.x = c[p - 2],
                i.y = c[p - 1],
                i.bx = V(c[p - 4]) || i.x,
                i.by = V(c[p - 3]) || i.y,
                s.bx = r && (V(h[m - 4]) || s.x),
                s.by = r && (V(h[m - 3]) || s.y),
                s.x = r && h[m - 2],
                s.y = r && h[m - 1]
            }
            return r ? [n, r] : n
        },
        null, mt),
        Nt = dt(function(t) {
            var n = [];
            for (var r = 0,
            i = t[T]; r < i; r++) {
                var s = {},
                o = t[r].match(/^([^:]*):?([\d\.]*)/);
                s.color = e.getRGB(o[1]);
                if (s.color.error) return null;
                s.color = s.color.hex,
                o[2] && (s.offset = o[2] + "%"),
                n[I](s)
            }
            for (r = 1, i = n[T] - 1; r < i; r++) if (!n[r].offset) {
                var u = V(n[r - 1].offset || 0),
                a = 0;
                for (var f = r + 1; f < i; f++) if (n[f].offset) {
                    a = n[f].offset;
                    break
                }
                a || (a = 100, f = i),
                a = V(a);
                var l = (a - u) / (f - r + 1);
                for (; r < f; r++) u += l,
                n[r].offset = u + "%"
            }
            return n
        }),
        Ct = function(t, n, r, i) {
            var s;
            if (!e.is(t, D) && !e.is(t, "object")) return {
                container: 1,
                x: t,
                y: n,
                width: r,
                height: i
            };
            s = e.is(t, D) ? a.getElementById(t) : t;
            if (s.tagName) return n == null ? {
                container: s,
                width: s.style.pixelWidth || s.offsetWidth,
                height: s.style.pixelHeight || s.offsetHeight
            }: {
                container: s,
                width: n,
                height: r
            }
        },
        kt = function(e, t) {
            var n = this;
            for (var r in t) if (t[u](r) && !(r in e)) switch (typeof t[r]) {
            case "function":
                (function(t) {
                    e[r] = e === n ? t: function() {
                        return t[d](n, arguments)
                    }
                })(t[r]);
                break;
            case "object":
                e[r] = e[r] || {},
                kt.call(this, e[r], t[r]);
                break;
            default:
                e[r] = t[r]
            }
        },
        Lt = function(e, t) {
            e == t.top && (t.top = e.prev),
            e == t.bottom && (t.bottom = e.next),
            e.next && (e.next.prev = e.prev),
            e.prev && (e.prev.next = e.next)
        },
        At = function(e, t) {
            if (t.top === e) return;
            Lt(e, t),
            e.next = null,
            e.prev = t.top,
            t.top.next = e,
            t.top = e
        },
        Ot = function(e, t) {
            if (t.bottom === e) return;
            Lt(e, t),
            e.next = t.bottom,
            e.prev = null,
            t.bottom.prev = e,
            t.bottom = e
        },
        Mt = function(e, t, n) {
            Lt(e, n),
            t == n.top && (n.top = e),
            t.next && (t.next.prev = e),
            e.next = t.next,
            e.prev = t,
            t.next = e
        },
        _t = function(e, t, n) {
            Lt(e, n),
            t == n.bottom && (n.bottom = e),
            t.prev && (t.prev.next = e),
            e.prev = t.prev,
            t.prev = e,
            e.next = t
        },
        Dt = function(e) {
            return function() {
                throw new Error("Raphaël: you are calling to method " + e + " of removed object")
            }
        };
        e.pathToRelative = gt;
        if (e.svg) {
            h.svgns = "http://www.w3.org/2000/svg",
            h.xlink = "http://www.w3.org/1999/xlink",
            W = function(e) {
                return + e + (~~e === e) * .5
            };
            var Pt = function(e, t) {
                if (!t) return e = a.createElementNS(h.svgns, e),
                e.style.webkitTapHighlightColor = "rgba(0,0,0,0)",
                e;
                for (var n in t) t[u](n) && e[X](n, b(t[n]))
            };
            e[H] = function() {
                return "Your browser supports SVG.\nYou are running Raphaël " + this.version
            };
            var Ht = function(e, t) {
                var n = Pt("path");
                t.canvas && t.canvas[p](n);
                var r = new Rt(n, t);
                return r.type = "path",
                Ft(r, {
                    fill: "none",
                    stroke: "#000",
                    path: e
                }),
                r
            },
            Bt = function(e, t, n) {
                var r = "linear",
                i = .5,
                s = .5,
                o = e.style;
                t = b(t)[Y](st,
                function(e, t, n) {
                    r = "radial";
                    if (t && n) {
                        i = V(t),
                        s = V(n);
                        var o = (s > .5) * 2 - 1;
                        O(i - .5, 2) + O(s - .5, 2) > .25 && (s = C.sqrt(.25 - O(i - .5, 2)) * o + .5) && s != .5 && (s = s.toFixed(5) - 1e-5 * o)
                    }
                    return g
                }),
                t = t[w](/\s*\-\s*/);
                if (r == "linear") {
                    var u = t.shift();
                    u = -V(u);
                    if (isNaN(u)) return null;
                    var f = [0, 0, C.cos(u * M / 180), C.sin(u * M / 180)],
                    l = 1 / (k(A(f[2]), A(f[3])) || 1);
                    f[2] *= l,
                    f[3] *= l,
                    f[2] < 0 && (f[0] = -f[2], f[2] = 0),
                    f[3] < 0 && (f[1] = -f[3], f[3] = 0)
                }
                var c = Nt(t);
                if (!c) return null;
                var h = e.getAttribute(B);
                h = h.match(/^url\(#(.*)\)$/),
                h && n.defs.removeChild(a.getElementById(h[1]));
                var d = Pt(r + "Gradient");
                d.id = ft(),
                Pt(d, r == "radial" ? {
                    fx: i,
                    fy: s
                }: {
                    x1: f[0],
                    y1: f[1],
                    x2: f[2],
                    y2: f[3]
                }),
                n.defs[p](d);
                for (var v = 0,
                m = c[T]; v < m; v++) {
                    var y = Pt("stop");
                    Pt(y, {
                        offset: c[v].offset ? c[v].offset: v ? "100%": "0%",
                        "stop-color": c[v].color || "#fff"
                    }),
                    d[p](y)
                }
                return Pt(e, {
                    fill: "url(#" + d.id + ")",
                    opacity: 1,
                    "fill-opacity": 1
                }),
                o.fill = g,
                o.opacity = 1,
                o.fillOpacity = 1,
                1
            },
            jt = function(t) {
                var n = t.getBBox();
                Pt(t.pattern, {
                    patternTransform: e.format("translate({0},{1})", n.x, n.y)
                })
            },
            Ft = function(t, n) {
                var i = {
                    "": [0],
                    none: [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                s = t.node,
                o = t.attrs,
                f = t.rotate(),
                l = function(e, t) {
                    t = i[N.call(t)];
                    if (t) {
                        var r = e.attrs["stroke-width"] || "1",
                        o = {
                            round: r,
                            square: r,
                            butt: 0
                        } [e.attrs["stroke-linecap"] || n["stroke-linecap"]] || 0,
                        u = [],
                        a = t[T];
                        while (a--) u[a] = t[a] * r + (a % 2 ? 1 : -1) * o;
                        Pt(s, {
                            "stroke-dasharray": u[x](",")
                        })
                    }
                };
                n[u]("rotation") && (f = n.rotation);
                var c = b(f)[w](r);
                c.length - 1 ? (c[1] = +c[1], c[2] = +c[2]) : c = null,
                V(f) && t.rotate(0, !0);
                for (var h in n) if (n[u](h)) {
                    if (!Q[u](h)) continue;
                    var d = n[h];
                    o[h] = d;
                    switch (h) {
                    case "blur":
                        t.blur(d);
                        break;
                    case "rotation":
                        t.rotate(d, !0);
                        break;
                    case "href":
                    case "title":
                    case "target":
                        var v = s.parentNode;
                        if (N.call(v.tagName) != "a") {
                            var m = Pt("a");
                            v.insertBefore(m, s),
                            m[p](s),
                            v = m
                        }
                        h == "target" && d == "blank" ? v.setAttributeNS(t.paper.xlink, "show", "new") : v.setAttributeNS(t.paper.xlink, h, d);
                        break;
                    case "cursor":
                        s.style.cursor = d;
                        break;
                    case "clip-rect":
                        var E = b(d)[w](r);
                        if (E[T] == 4) {
                            t.clip && t.clip.parentNode.parentNode.removeChild(t.clip.parentNode);
                            var S = Pt("clipPath"),
                            C = Pt("rect");
                            S.id = ft(),
                            Pt(C, {
                                x: E[0],
                                y: E[1],
                                width: E[2],
                                height: E[3]
                            }),
                            S[p](C),
                            t.paper.defs[p](S),
                            Pt(s, {
                                "clip-path": "url(#" + S.id + ")"
                            }),
                            t.clip = C
                        }
                        if (!d) {
                            var k = a.getElementById(s.getAttribute("clip-path")[Y](/(^url\(#|\)$)/g, g));
                            k && k.parentNode.removeChild(k),
                            Pt(s, {
                                "clip-path": g
                            }),
                            delete t.clip
                        }
                        break;
                    case "path":
                        t.type == "path" && Pt(s, {
                            d: d ? o.path = yt(d) : "M0,0"
                        });
                        break;
                    case "width":
                        s[X](h, d);
                        if (!o.fx) break;
                        h = "x",
                        d = o.x;
                    case "x":
                        o.fx && (d = -o.x - (o.width || 0));
                    case "rx":
                        if (h == "rx" && t.type == "rect") break;
                    case "cx":
                        c && (h == "x" || h == "cx") && (c[1] += d - o[h]),
                        s[X](h, d),
                        t.pattern && jt(t);
                        break;
                    case "height":
                        s[X](h, d);
                        if (!o.fy) break;
                        h = "y",
                        d = o.y;
                    case "y":
                        o.fy && (d = -o.y - (o.height || 0));
                    case "ry":
                        if (h == "ry" && t.type == "rect") break;
                    case "cy":
                        c && (h == "y" || h == "cy") && (c[2] += d - o[h]),
                        s[X](h, d),
                        t.pattern && jt(t);
                        break;
                    case "r":
                        t.type == "rect" ? Pt(s, {
                            rx: d,
                            ry: d
                        }) : s[X](h, d);
                        break;
                    case "src":
                        t.type == "image" && s.setAttributeNS(t.paper.xlink, "href", d);
                        break;
                    case "stroke-width":
                        s.style.strokeWidth = d,
                        s[X](h, d),
                        o["stroke-dasharray"] && l(t, o["stroke-dasharray"]);
                        break;
                    case "stroke-dasharray":
                        l(t, d);
                        break;
                    case "translation":
                        var L = b(d)[w](r);
                        L[0] = +L[0] || 0,
                        L[1] = +L[1] || 0,
                        c && (c[1] += L[0], c[2] += L[1]),
                        Ln.call(t, L[0], L[1]);
                        break;
                    case "scale":
                        L = b(d)[w](r),
                        t.scale( + L[0] || 1, +L[1] || +L[0] || 1, isNaN(V(L[2])) ? null: +L[2], isNaN(V(L[3])) ? null: +L[3]);
                        break;
                    case B:
                        var A = b(d).match(q);
                        if (A) {
                            S = Pt("pattern");
                            var O = Pt("image");
                            S.id = ft(),
                            Pt(S, {
                                x: 0,
                                y: 0,
                                patternUnits: "userSpaceOnUse",
                                height: 1,
                                width: 1
                            }),
                            Pt(O, {
                                x: 0,
                                y: 0
                            }),
                            O.setAttributeNS(t.paper.xlink, "href", A[1]),
                            S[p](O);
                            var M = a.createElement("img");
                            M.style.cssText = "position:absolute;left:-9999em;top-9999em",
                            M.onload = function() {
                                Pt(S, {
                                    width: this.offsetWidth,
                                    height: this.offsetHeight
                                }),
                                Pt(O, {
                                    width: this.offsetWidth,
                                    height: this.offsetHeight
                                }),
                                a.body.removeChild(this),
                                t.paper.safari()
                            },
                            a.body[p](M),
                            M.src = A[1],
                            t.paper.defs[p](S),
                            s.style.fill = "url(#" + S.id + ")",
                            Pt(s, {
                                fill: "url(#" + S.id + ")"
                            }),
                            t.pattern = S,
                            t.pattern && jt(t);
                            break
                        }
                        var _ = e.getRGB(d);
                        if (_.error) {
                            if (({
                                circle: 1,
                                ellipse: 1
                            } [u](t.type) || b(d).charAt() != "r") && Bt(s, d, t.paper)) {
                                o.gradient = d,
                                o.fill = "none";
                                break
                            }
                            delete n.gradient,
                            delete o.gradient,
                            !e.is(o.opacity, "undefined") && e.is(n.opacity, "undefined") && Pt(s, {
                                opacity: o.opacity
                            }),
                            !e.is(o["fill-opacity"], "undefined") && e.is(n["fill-opacity"], "undefined") && Pt(s, {
                                "fill-opacity": o["fill-opacity"]
                            })
                        }
                        _[u]("opacity") && Pt(s, {
                            "fill-opacity": _.opacity > 1 ? _.opacity / 100 : _.opacity
                        });
                    case "stroke":
                        _ = e.getRGB(d),
                        s[X](h, _.hex),
                        h == "stroke" && _[u]("opacity") && Pt(s, {
                            "stroke-opacity": _.opacity > 1 ? _.opacity / 100 : _.opacity
                        });
                        break;
                    case "gradient":
                        ((({
                            circle:
                            1,
                            ellipse: 1
                        }))[u](t.type) || b(d).charAt() != "r") && Bt(s, d, t.paper);
                        break;
                    case "opacity":
                        o.gradient && !o[u]("stroke-opacity") && Pt(s, {
                            "stroke-opacity": d > 1 ? d / 100 : d
                        });
                    case "fill-opacity":
                        if (o.gradient) {
                            var D = a.getElementById(s.getAttribute(B)[Y](/^url\(#|\)$/g, g));
                            if (D) {
                                var P = D.getElementsByTagName("stop");
                                P[P[T] - 1][X]("stop-opacity", d)
                            }
                            break
                        };
                    default:
                        h == "font-size" && (d = $(d, 10) + "px");
                        var H = h[Y](/(\-.)/g,
                        function(e) {
                            return K.call(e.substring(1))
                        });
                        s.style[H] = d,
                        s[X](h, d)
                    }
                }
                qt(t, n),
                c ? t.rotate(c.join(y)) : V(f) && t.rotate(f, !0)
            },
            It = 1.2,
            qt = function(t, n) {
                if (t.type != "text" || !(n[u]("text") || n[u]("font") || n[u]("font-size") || n[u]("x") || n[u]("y"))) return;
                var r = t.attrs,
                i = t.node,
                s = i.firstChild ? $(a.defaultView.getComputedStyle(i.firstChild, g).getPropertyValue("font-size"), 10) : 10;
                if (n[u]("text")) {
                    r.text = n.text;
                    while (i.firstChild) i.removeChild(i.firstChild);
                    var o = b(n.text)[w]("\n");
                    for (var f = 0,
                    l = o[T]; f < l; f++) if (o[f]) {
                        var c = Pt("tspan");
                        f && Pt(c, {
                            dy: s * It,
                            x: r.x
                        }),
                        c[p](a.createTextNode(o[f])),
                        i[p](c)
                    }
                } else {
                    o = i.getElementsByTagName("tspan");
                    for (f = 0, l = o[T]; f < l; f++) f && Pt(o[f], {
                        dy: s * It,
                        x: r.x
                    })
                }
                Pt(i, {
                    y: r.y
                });
                var h = t.getBBox(),
                d = r.y - (h.y + h.height / 2);
                d && e.is(d, "finite") && Pt(i, {
                    y: r.y + d
                })
            },
            Rt = function(t, n) {
                var r = 0,
                i = 0;
                this[0] = t,
                this.id = e._oid++,
                this.node = t,
                t.raphael = this,
                this.paper = n,
                this.attrs = this.attrs || {},
                this.transformations = [],
                this._ = {
                    tx: 0,
                    ty: 0,
                    rt: {
                        deg: 0,
                        cx: 0,
                        cy: 0
                    },
                    sx: 1,
                    sy: 1
                },
                !n.bottom && (n.bottom = this),
                this.prev = n.top,
                n.top && (n.top.next = this),
                n.top = this,
                this.next = null
            },
            Ut = Rt[o];
            Rt[o].rotate = function(t, n, i) {
                if (this.removed) return this;
                if (t == null) return this._.rt.cx ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][x](y) : this._.rt.deg;
                var s = this.getBBox();
                return t = b(t)[w](r),
                t[T] - 1 && (n = V(t[1]), i = V(t[2])),
                t = V(t[0]),
                n != null && n !== !1 ? this._.rt.deg = t: this._.rt.deg += t,
                i == null && (n = null),
                this._.rt.cx = n,
                this._.rt.cy = i,
                n = n == null ? s.x + s.width / 2 : n,
                i = i == null ? s.y + s.height / 2 : i,
                this._.rt.deg ? (this.transformations[0] = e.format("rotate({0} {1} {2})", this._.rt.deg, n, i), this.clip && Pt(this.clip, {
                    transform: e.format("rotate({0} {1} {2})", -this._.rt.deg, n, i)
                })) : (this.transformations[0] = g, this.clip && Pt(this.clip, {
                    transform: g
                })),
                Pt(this.node, {
                    transform: this.transformations[x](y)
                }),
                this
            },
            Rt[o].hide = function() {
                return ! this.removed && (this.node.style.display = "none"),
                this
            },
            Rt[o].show = function() {
                return ! this.removed && (this.node.style.display = ""),
                this
            },
            Rt[o].remove = function() {
                if (this.removed) return;
                Lt(this, this.paper),
                this.node.parentNode.removeChild(this.node);
                for (var e in this) delete this[e];
                this.removed = !0
            },
            Rt[o].getBBox = function() {
                if (this.removed) return this;
                if (this.type == "path") return vt(this.attrs.path);
                if (this.node.style.display == "none") {
                    this.show();
                    var e = !0
                }
                var t = {};
                try {
                    t = this.node.getBBox()
                } catch(e) {} finally {
                    t = t || {}
                }
                if (this.type == "text") {
                    t = {
                        x: t.x,
                        y: Infinity,
                        width: 0,
                        height: 0
                    };
                    for (var n = 0,
                    r = this.node.getNumberOfChars(); n < r; n++) {
                        var i = this.node.getExtentOfChar(n);
                        i.y < t.y && (t.y = i.y),
                        i.y + i.height - t.y > t.height && (t.height = i.y + i.height - t.y),
                        i.x + i.width - t.x > t.width && (t.width = i.x + i.width - t.x)
                    }
                }
                return e && this.hide(),
                t
            },
            Rt[o].attr = function(t, n) {
                if (this.removed) return this;
                if (t == null) {
                    var r = {};
                    for (var i in this.attrs) this.attrs[u](i) && (r[i] = this.attrs[i]);
                    return this._.rt.deg && (r.rotation = this.rotate()),
                    (this._.sx != 1 || this._.sy != 1) && (r.scale = this.scale()),
                    r.gradient && r.fill == "none" && (r.fill = r.gradient) && delete r.gradient,
                    r
                }
                if (n == null && e.is(t, D)) return t == "translation" ? Ln.call(this) : t == "rotation" ? this.rotate() : t == "scale" ? this.scale() : t == B && this.attrs.fill == "none" && this.attrs.gradient ? this.attrs.gradient: this.attrs[t];
                if (n == null && e.is(t, P)) {
                    var s = {};
                    for (var o = 0,
                    a = t.length; o < a; o++) s[t[o]] = this.attr(t[o]);
                    return s
                }
                if (n != null) {
                    var f = {};
                    f[t] = n
                } else t != null && e.is(t, "object") && (f = t);
                for (var l in this.paper.customAttributes) if (this.paper.customAttributes[u](l) && f[u](l) && e.is(this.paper.customAttributes[l], "function")) {
                    var c = this.paper.customAttributes[l].apply(this, [][v](f[l]));
                    this.attrs[l] = f[l];
                    for (var h in c) c[u](h) && (f[h] = c[h])
                }
                return Ft(this, f),
                this
            },
            Rt[o].toFront = function() {
                if (this.removed) return this;
                this.node.parentNode[p](this.node);
                var e = this.paper;
                return e.top != this && At(this, e),
                this
            },
            Rt[o].toBack = function() {
                if (this.removed) return this;
                if (this.node.parentNode.firstChild != this.node) {
                    this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild),
                    Ot(this, this.paper);
                    var e = this.paper
                }
                return this
            },
            Rt[o].insertAfter = function(e) {
                if (this.removed) return this;
                var t = e.node || e[e.length - 1].node;
                return t.nextSibling ? t.parentNode.insertBefore(this.node, t.nextSibling) : t.parentNode[p](this.node),
                Mt(this, e, this.paper),
                this
            },
            Rt[o].insertBefore = function(e) {
                if (this.removed) return this;
                var t = e.node || e[0].node;
                return t.parentNode.insertBefore(this.node, t),
                _t(this, e, this.paper),
                this
            },
            Rt[o].blur = function(e) {
                var t = this;
                if ( + e !== 0) {
                    var n = Pt("filter"),
                    r = Pt("feGaussianBlur");
                    t.attrs.blur = e,
                    n.id = ft(),
                    Pt(r, {
                        stdDeviation: +e || 1.5
                    }),
                    n.appendChild(r),
                    t.paper.defs.appendChild(n),
                    t._blur = n,
                    Pt(t.node, {
                        filter: "url(#" + n.id + ")"
                    })
                } else t._blur && (t._blur.parentNode.removeChild(t._blur), delete t._blur, delete t.attrs.blur),
                t.node.removeAttribute("filter")
            };
            var zt = function(e, t, n, r) {
                var i = Pt("circle");
                e.canvas && e.canvas[p](i);
                var s = new Rt(i, e);
                return s.attrs = {
                    cx: t,
                    cy: n,
                    r: r,
                    fill: "none",
                    stroke: "#000"
                },
                s.type = "circle",
                Pt(i, s.attrs),
                s
            },
            Wt = function(e, t, n, r, i, s) {
                var o = Pt("rect");
                e.canvas && e.canvas[p](o);
                var u = new Rt(o, e);
                return u.attrs = {
                    x: t,
                    y: n,
                    width: r,
                    height: i,
                    r: s || 0,
                    rx: s || 0,
                    ry: s || 0,
                    fill: "none",
                    stroke: "#000"
                },
                u.type = "rect",
                Pt(o, u.attrs),
                u
            },
            Xt = function(e, t, n, r, i) {
                var s = Pt("ellipse");
                e.canvas && e.canvas[p](s);
                var o = new Rt(s, e);
                return o.attrs = {
                    cx: t,
                    cy: n,
                    rx: r,
                    ry: i,
                    fill: "none",
                    stroke: "#000"
                },
                o.type = "ellipse",
                Pt(s, o.attrs),
                o
            },
            Vt = function(e, t, n, r, i, s) {
                var o = Pt("image");
                Pt(o, {
                    x: n,
                    y: r,
                    width: i,
                    height: s,
                    preserveAspectRatio: "none"
                }),
                o.setAttributeNS(e.xlink, "href", t),
                e.canvas && e.canvas[p](o);
                var u = new Rt(o, e);
                return u.attrs = {
                    x: n,
                    y: r,
                    width: i,
                    height: s,
                    src: t
                },
                u.type = "image",
                u
            },
            $t = function(e, t, n, r) {
                var i = Pt("text");
                Pt(i, {
                    x: t,
                    y: n,
                    "text-anchor": "middle"
                }),
                e.canvas && e.canvas[p](i);
                var s = new Rt(i, e);
                return s.attrs = {
                    x: t,
                    y: n,
                    "text-anchor": "middle",
                    text: r,
                    font: Q.font,
                    stroke: "none",
                    fill: "#000"
                },
                s.type = "text",
                Ft(s, s.attrs),
                s
            },
            Jt = function(e, t) {
                return this.width = e || this.width,
                this.height = t || this.height,
                this.canvas[X]("width", this.width),
                this.canvas[X]("height", this.height),
                this
            },
            Kt = function() {
                var t = Ct[d](0, arguments),
                n = t && t.container,
                r = t.x,
                i = t.y,
                s = t.width,
                o = t.height;
                if (!n) throw new Error("SVG container not found.");
                var u = Pt("svg");
                return r = r || 0,
                i = i || 0,
                s = s || 512,
                o = o || 342,
                Pt(u, {
                    xmlns: "http://www.w3.org/2000/svg",
                    version: 1.1,
                    width: s,
                    height: o
                }),
                n == 1 ? (u.style.cssText = "position:absolute;left:" + r + "px;top:" + i + "px", a.body[p](u)) : n.firstChild ? n.insertBefore(u, n.firstChild) : n[p](u),
                n = new c,
                n.width = s,
                n.height = o,
                n.canvas = u,
                kt.call(n, n, e.fn),
                n.clear(),
                n
            };
            h.clear = function() {
                var e = this.canvas;
                while (e.firstChild) e.removeChild(e.firstChild);
                this.bottom = this.top = null,
                (this.desc = Pt("desc"))[p](a.createTextNode("Created with Raphaël")),
                e[p](this.desc),
                e[p](this.defs = Pt("defs"))
            },
            h.remove = function() {
                this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
                for (var e in this) this[e] = Dt(e)
            }
        }
        if (e.vml) {
            var Qt = {
                M: "m",
                L: "l",
                C: "c",
                Z: "x",
                m: "t",
                l: "r",
                c: "v",
                z: "x"
            },
            Gt = /([clmz]),?([^clmz]*)/gi,
            Yt = / progid:\S+Blur\([^\)]+\)/g,
            Zt = /-?[^,\s-]+/g,
            en = 1e3 + y + 1e3,
            tn = 10,
            nn = {
                path: 1,
                rect: 1
            },
            rn = function(e) {
                var t = /[ahqstv]/ig,
                n = yt;
                b(e).match(t) && (n = Tt),
                t = /[clmz]/g;
                if (n == yt && !b(e).match(t)) {
                    var r = b(e)[Y](Gt,
                    function(e, t, n) {
                        var r = [],
                        i = N.call(t) == "m",
                        s = Qt[t];
                        return n[Y](Zt,
                        function(e) {
                            i && r[T] == 2 && (s += r + Qt[t == "m" ? "l": "L"], r = []),
                            r[I](W(e * tn))
                        }),
                        s + r
                    });
                    return r
                }
                var i = n(e),
                s,
                o;
                r = [];
                for (var u = 0,
                a = i[T]; u < a; u++) {
                    s = i[u],
                    o = N.call(i[u][0]),
                    o == "z" && (o = "x");
                    for (var f = 1,
                    l = s[T]; f < l; f++) o += W(s[f] * tn) + (f != l - 1 ? ",": g);
                    r[I](o)
                }
                return r[x](y)
            };
            e[H] = function() {
                return "Your browser doesn't support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
            },
            Ht = function(e, t) {
                var n = on("group");
                n.style.cssText = "position:absolute;left:0;top:0;width:" + t.width + "px;height:" + t.height + "px",
                n.coordsize = t.coordsize,
                n.coordorigin = t.coordorigin;
                var r = on("shape"),
                i = r.style;
                i.width = t.width + "px",
                i.height = t.height + "px",
                r.coordsize = en,
                r.coordorigin = t.coordorigin,
                n[p](r);
                var s = new Rt(r, n, t),
                o = {
                    fill: "none",
                    stroke: "#000"
                };
                return e && (o.path = e),
                s.type = "path",
                s.path = [],
                s.Path = g,
                Ft(s, o),
                t.canvas[p](n),
                s
            },
            Ft = function(t, n) {
                t.attrs = t.attrs || {};
                var i = t.node,
                s = t.attrs,
                o = i.style,
                f, l = (n.x != s.x || n.y != s.y || n.width != s.width || n.height != s.height || n.r != s.r) && t.type == "rect",
                c = t;
                for (var h in n) n[u](h) && (s[h] = n[h]);
                l && (s.path = sn(s.x, s.y, s.width, s.height, s.r), t.X = s.x, t.Y = s.y, t.W = s.width, t.H = s.height),
                n.href && (i.href = n.href),
                n.title && (i.title = n.title),
                n.target && (i.target = n.target),
                n.cursor && (o.cursor = n.cursor),
                "blur" in n && t.blur(n.blur);
                if (n.path && t.type == "path" || l) i.path = rn(s.path);
                n.rotation != null && t.rotate(n.rotation, !0),
                n.translation && (f = b(n.translation)[w](r), Ln.call(t, f[0], f[1]), t._.rt.cx != null && (t._.rt.cx += +f[0], t._.rt.cy += +f[1], t.setBox(t.attrs, f[0], f[1]))),
                n.scale && (f = b(n.scale)[w](r), t.scale( + f[0] || 1, +f[1] || +f[0] || 1, +f[2] || null, +f[3] || null));
                if ("clip-rect" in n) {
                    var d = b(n["clip-rect"])[w](r);
                    if (d[T] == 4) {
                        d[2] = +d[2] + +d[0],
                        d[3] = +d[3] + +d[1];
                        var v = i.clipRect || a.createElement("div"),
                        m = v.style,
                        y = i.parentNode;
                        m.clip = e.format("rect({1}px {2}px {3}px {0}px)", d),
                        i.clipRect || (m.position = "absolute", m.top = 0, m.left = 0, m.width = t.paper.width + "px", m.height = t.paper.height + "px", y.parentNode.insertBefore(v, y), v[p](y), i.clipRect = v)
                    }
                    n["clip-rect"] || i.clipRect && (i.clipRect.style.clip = g)
                }
                t.type == "image" && n.src && (i.src = n.src),
                t.type == "image" && n.opacity && (i.filterOpacity = J + ".Alpha(opacity=" + n.opacity * 100 + ")", o.filter = (i.filterMatrix || g) + (i.filterOpacity || g)),
                n.font && (o.font = n.font),
                n["font-family"] && (o.fontFamily = '"' + n["font-family"][w](",")[0][Y](/^['"]+|['"]+$/g, g) + '"'),
                n["font-size"] && (o.fontSize = n["font-size"]),
                n["font-weight"] && (o.fontWeight = n["font-weight"]),
                n["font-style"] && (o.fontStyle = n["font-style"]);
                if (n.opacity != null || n["stroke-width"] != null || n.fill != null || n.stroke != null || n["stroke-width"] != null || n["stroke-opacity"] != null || n["fill-opacity"] != null || n["stroke-dasharray"] != null || n["stroke-miterlimit"] != null || n["stroke-linejoin"] != null || n["stroke-linecap"] != null) {
                    i = t.shape || i;
                    var E = i.getElementsByTagName(B) && i.getElementsByTagName(B)[0],
                    S = !1; ! E && (S = E = on(B));
                    if ("fill-opacity" in n || "opacity" in n) {
                        var x = (( + s["fill-opacity"] + 1 || 2) - 1) * (( + s.opacity + 1 || 2) - 1) * (( + e.getRGB(n.fill).o + 1 || 2) - 1);
                        x = L(k(x, 0), 1),
                        E.opacity = x
                    }
                    n.fill && (E.on = !0);
                    if (E.on == null || n.fill == "none") E.on = !1;
                    if (E.on && n.fill) {
                        var N = n.fill.match(q);
                        N ? (E.src = N[1], E.type = "tile") : (E.color = e.getRGB(n.fill).hex, E.src = g, E.type = "solid", e.getRGB(n.fill).error && (c.type in {
                            circle: 1,
                            ellipse: 1
                        } || b(n.fill).charAt() != "r") && Bt(c, n.fill) && (s.fill = "none", s.gradient = n.fill))
                    }
                    S && i[p](E);
                    var C = i.getElementsByTagName("stroke") && i.getElementsByTagName("stroke")[0],
                    A = !1; ! C && (A = C = on("stroke"));
                    if (n.stroke && n.stroke != "none" || n["stroke-width"] || n["stroke-opacity"] != null || n["stroke-dasharray"] || n["stroke-miterlimit"] || n["stroke-linejoin"] || n["stroke-linecap"]) C.on = !0; (n.stroke == "none" || C.on == null || n.stroke == 0 || n["stroke-width"] == 0) && (C.on = !1);
                    var O = e.getRGB(n.stroke);
                    C.on && n.stroke && (C.color = O.hex),
                    x = (( + s["stroke-opacity"] + 1 || 2) - 1) * (( + s.opacity + 1 || 2) - 1) * (( + O.o + 1 || 2) - 1);
                    var M = (V(n["stroke-width"]) || 1) * .75;
                    x = L(k(x, 0), 1),
                    n["stroke-width"] == null && (M = s["stroke-width"]),
                    n["stroke-width"] && (C.weight = M),
                    M && M < 1 && (x *= M) && (C.weight = 1),
                    C.opacity = x,
                    n["stroke-linejoin"] && (C.joinstyle = n["stroke-linejoin"] || "miter"),
                    C.miterlimit = n["stroke-miterlimit"] || 8,
                    n["stroke-linecap"] && (C.endcap = n["stroke-linecap"] == "butt" ? "flat": n["stroke-linecap"] == "square" ? "square": "round");
                    if (n["stroke-dasharray"]) {
                        var _ = {
                            "-": "shortdash",
                            ".": "shortdot",
                            "-.": "shortdashdot",
                            "-..": "shortdashdotdot",
                            ". ": "dot",
                            "- ": "dash",
                            "--": "longdash",
                            "- .": "dashdot",
                            "--.": "longdashdot",
                            "--..": "longdashdotdot"
                        };
                        C.dashstyle = _[u](n["stroke-dasharray"]) ? _[n["stroke-dasharray"]] : g
                    }
                    A && i[p](C)
                }
                if (c.type == "text") {
                    o = c.paper.span.style,
                    s.font && (o.font = s.font),
                    s["font-family"] && (o.fontFamily = s["font-family"]),
                    s["font-size"] && (o.fontSize = s["font-size"]),
                    s["font-weight"] && (o.fontWeight = s["font-weight"]),
                    s["font-style"] && (o.fontStyle = s["font-style"]),
                    c.node.string && (c.paper.span.innerHTML = b(c.node.string)[Y](/</g, "&#60;")[Y](/&/g, "&#38;")[Y](/\n/g, "<br>")),
                    c.W = s.w = c.paper.span.offsetWidth,
                    c.H = s.h = c.paper.span.offsetHeight,
                    c.X = s.x,
                    c.Y = s.y + W(c.H / 2);
                    switch (s["text-anchor"]) {
                    case "start":
                        c.node.style["v-text-align"] = "left",
                        c.bbx = W(c.W / 2);
                        break;
                    case "end":
                        c.node.style["v-text-align"] = "right",
                        c.bbx = -W(c.W / 2);
                        break;
                    default:
                        c.node.style["v-text-align"] = "center"
                    }
                }
            },
            Bt = function(e, t) {
                e.attrs = e.attrs || {};
                var n = e.attrs,
                r, i = "linear",
                s = ".5 .5";
                e.attrs.gradient = t,
                t = b(t)[Y](st,
                function(e, t, n) {
                    return i = "radial",
                    t && n && (t = V(t), n = V(n), O(t - .5, 2) + O(n - .5, 2) > .25 && (n = C.sqrt(.25 - O(t - .5, 2)) * ((n > .5) * 2 - 1) + .5), s = t + y + n),
                    g
                }),
                t = t[w](/\s*\-\s*/);
                if (i == "linear") {
                    var o = t.shift();
                    o = -V(o);
                    if (isNaN(o)) return null
                }
                var u = Nt(t);
                if (!u) return null;
                e = e.shape || e.node,
                r = e.getElementsByTagName(B)[0] || on(B),
                !r.parentNode && e.appendChild(r);
                if (u[T]) {
                    r.on = !0,
                    r.method = "none",
                    r.color = u[0].color,
                    r.color2 = u[u[T] - 1].color;
                    var a = [];
                    for (var f = 0,
                    l = u[T]; f < l; f++) u[f].offset && a[I](u[f].offset + y + u[f].color);
                    r.colors && (r.colors.value = a[T] ? a[x]() : "0% " + r.color),
                    i == "radial" ? (r.type = "gradientradial", r.focus = "100%", r.focussize = s, r.focusposition = s) : (r.type = "gradient", r.angle = (270 - o) % 360)
                }
                return 1
            },
            Rt = function(t, n, r) {
                var i = 0,
                s = 0,
                o = 0,
                u = 1;
                this[0] = t,
                this.id = e._oid++,
                this.node = t,
                t.raphael = this,
                this.X = 0,
                this.Y = 0,
                this.attrs = {},
                this.Group = n,
                this.paper = r,
                this._ = {
                    tx: 0,
                    ty: 0,
                    rt: {
                        deg: 0
                    },
                    sx: 1,
                    sy: 1
                },
                !r.bottom && (r.bottom = this),
                this.prev = r.top,
                r.top && (r.top.next = this),
                r.top = this,
                this.next = null
            },
            Ut = Rt[o],
            Ut.rotate = function(e, t, n) {
                return this.removed ? this: e == null ? this._.rt.cx ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][x](y) : this._.rt.deg: (e = b(e)[w](r), e[T] - 1 && (t = V(e[1]), n = V(e[2])), e = V(e[0]), t != null ? this._.rt.deg = e: this._.rt.deg += e, n == null && (t = null), this._.rt.cx = t, this._.rt.cy = n, this.setBox(this.attrs, t, n), this.Group.style.rotation = this._.rt.deg, this)
            },
            Ut.setBox = function(e, t, n) {
                if (this.removed) return this;
                var r = this.Group.style,
                i = this.shape && this.shape.style || this.node.style;
                e = e || {};
                for (var s in e) e[u](s) && (this.attrs[s] = e[s]);
                t = t || this._.rt.cx,
                n = n || this._.rt.cy;
                var o = this.attrs,
                a, f, l, c;
                switch (this.type) {
                case "circle":
                    a = o.cx - o.r,
                    f = o.cy - o.r,
                    l = c = o.r * 2;
                    break;
                case "ellipse":
                    a = o.cx - o.rx,
                    f = o.cy - o.ry,
                    l = o.rx * 2,
                    c = o.ry * 2;
                    break;
                case "image":
                    a = +o.x,
                    f = +o.y,
                    l = o.width || 0,
                    c = o.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", W(o.x), ", ", W(o.y - 2), "l", W(o.x) + 1, ", ", W(o.y - 2)][x](g),
                    a = o.x - W(this.W / 2),
                    f = o.y - this.H / 2,
                    l = this.W,
                    c = this.H;
                    break;
                case "rect":
                case "path":
                    if (this.attrs.path) {
                        var h = vt(this.attrs.path);
                        a = h.x,
                        f = h.y,
                        l = h.width,
                        c = h.height
                    } else a = 0,
                    f = 0,
                    l = this.paper.width,
                    c = this.paper.height;
                    break;
                default:
                    a = 0,
                    f = 0,
                    l = this.paper.width,
                    c = this.paper.height
                }
                t = t == null ? a + l / 2 : t,
                n = n == null ? f + c / 2 : n;
                var p = t - this.paper.width / 2,
                d = n - this.paper.height / 2,
                v;
                r.left != (v = p + "px") && (r.left = v),
                r.top != (v = d + "px") && (r.top = v),
                this.X = nn[u](this.type) ? -p: a,
                this.Y = nn[u](this.type) ? -d: f,
                this.W = l,
                this.H = c,
                nn[u](this.type) ? (i.left != (v = -p * tn + "px") && (i.left = v), i.top != (v = -d * tn + "px") && (i.top = v)) : this.type == "text" ? (i.left != (v = -p + "px") && (i.left = v), i.top != (v = -d + "px") && (i.top = v)) : (r.width != (v = this.paper.width + "px") && (r.width = v), r.height != (v = this.paper.height + "px") && (r.height = v), i.left != (v = a - p + "px") && (i.left = v), i.top != (v = f - d + "px") && (i.top = v), i.width != (v = l + "px") && (i.width = v), i.height != (v = c + "px") && (i.height = v))
            },
            Ut.hide = function() {
                return ! this.removed && (this.Group.style.display = "none"),
                this
            },
            Ut.show = function() {
                return ! this.removed && (this.Group.style.display = "block"),
                this
            },
            Ut.getBBox = function() {
                return this.removed ? this: nn[u](this.type) ? vt(this.attrs.path) : {
                    x: this.X + (this.bbx || 0),
                    y: this.Y,
                    width: this.W,
                    height: this.H
                }
            },
            Ut.remove = function() {
                if (this.removed) return;
                Lt(this, this.paper),
                this.node.parentNode.removeChild(this.node),
                this.Group.parentNode.removeChild(this.Group),
                this.shape && this.shape.parentNode.removeChild(this.shape);
                for (var e in this) delete this[e];
                this.removed = !0
            },
            Ut.attr = function(t, n) {
                if (this.removed) return this;
                if (t == null) {
                    var r = {};
                    for (var i in this.attrs) this.attrs[u](i) && (r[i] = this.attrs[i]);
                    return this._.rt.deg && (r.rotation = this.rotate()),
                    (this._.sx != 1 || this._.sy != 1) && (r.scale = this.scale()),
                    r.gradient && r.fill == "none" && (r.fill = r.gradient) && delete r.gradient,
                    r
                }
                if (n == null && e.is(t, "string")) return t == "translation" ? Ln.call(this) : t == "rotation" ? this.rotate() : t == "scale" ? this.scale() : t == B && this.attrs.fill == "none" && this.attrs.gradient ? this.attrs.gradient: this.attrs[t];
                if (this.attrs && n == null && e.is(t, P)) {
                    var s, o = {};
                    for (i = 0, s = t[T]; i < s; i++) o[t[i]] = this.attr(t[i]);
                    return o
                }
                var a;
                n != null && (a = {},
                a[t] = n),
                n == null && e.is(t, "object") && (a = t);
                if (a) {
                    for (var f in this.paper.customAttributes) if (this.paper.customAttributes[u](f) && a[u](f) && e.is(this.paper.customAttributes[f], "function")) {
                        var l = this.paper.customAttributes[f].apply(this, [][v](a[f]));
                        this.attrs[f] = a[f];
                        for (var c in l) l[u](c) && (a[c] = l[c])
                    }
                    a.text && this.type == "text" && (this.node.string = a.text),
                    Ft(this, a),
                    a.gradient && ({
                        circle: 1,
                        ellipse: 1
                    } [u](this.type) || b(a.gradient).charAt() != "r") && Bt(this, a.gradient),
                    (!nn[u](this.type) || this._.rt.deg) && this.setBox(this.attrs)
                }
                return this
            },
            Ut.toFront = function() {
                return ! this.removed && this.Group.parentNode[p](this.Group),
                this.paper.top != this && At(this, this.paper),
                this
            },
            Ut.toBack = function() {
                return this.removed ? this: (this.Group.parentNode.firstChild != this.Group && (this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild), Ot(this, this.paper)), this)
            },
            Ut.insertAfter = function(e) {
                return this.removed ? this: (e.constructor == Mn && (e = e[e.length - 1]), e.Group.nextSibling ? e.Group.parentNode.insertBefore(this.Group, e.Group.nextSibling) : e.Group.parentNode[p](this.Group), Mt(this, e, this.paper), this)
            },
            Ut.insertBefore = function(e) {
                return this.removed ? this: (e.constructor == Mn && (e = e[0]), e.Group.parentNode.insertBefore(this.Group, e.Group), _t(this, e, this.paper), this)
            },
            Ut.blur = function(t) {
                var n = this.node.runtimeStyle,
                r = n.filter;
                r = r.replace(Yt, g),
                +t !== 0 ? (this.attrs.blur = t, n.filter = r + y + J + ".Blur(pixelradius=" + ( + t || 1.5) + ")", n.margin = e.format("-{0}px 0 0 -{0}px", W( + t || 1.5))) : (n.filter = r, n.margin = 0, delete this.attrs.blur)
            },
            zt = function(e, t, n, r) {
                var i = on("group"),
                s = on("oval"),
                o = s.style;
                i.style.cssText = "position:absolute;left:0;top:0;width:" + e.width + "px;height:" + e.height + "px",
                i.coordsize = en,
                i.coordorigin = e.coordorigin,
                i[p](s);
                var u = new Rt(s, i, e);
                return u.type = "circle",
                Ft(u, {
                    stroke: "#000",
                    fill: "none"
                }),
                u.attrs.cx = t,
                u.attrs.cy = n,
                u.attrs.r = r,
                u.setBox({
                    x: t - r,
                    y: n - r,
                    width: r * 2,
                    height: r * 2
                }),
                e.canvas[p](i),
                u
            };
            function sn(t, n, r, i, s) {
                return s ? e.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", t + s, n, r - s * 2, s, -s, i - s * 2, s * 2 - r, s * 2 - i) : e.format("M{0},{1}l{2},0,0,{3},{4},0z", t, n, r, i, -r)
            }
            Wt = function(e, t, n, r, i, s) {
                var o = sn(t, n, r, i, s),
                u = e.path(o),
                a = u.attrs;
                return u.X = a.x = t,
                u.Y = a.y = n,
                u.W = a.width = r,
                u.H = a.height = i,
                a.r = s,
                a.path = o,
                u.type = "rect",
                u
            },
            Xt = function(e, t, n, r, i) {
                var s = on("group"),
                o = on("oval"),
                u = o.style;
                s.style.cssText = "position:absolute;left:0;top:0;width:" + e.width + "px;height:" + e.height + "px",
                s.coordsize = en,
                s.coordorigin = e.coordorigin,
                s[p](o);
                var a = new Rt(o, s, e);
                return a.type = "ellipse",
                Ft(a, {
                    stroke: "#000"
                }),
                a.attrs.cx = t,
                a.attrs.cy = n,
                a.attrs.rx = r,
                a.attrs.ry = i,
                a.setBox({
                    x: t - r,
                    y: n - i,
                    width: r * 2,
                    height: i * 2
                }),
                e.canvas[p](s),
                a
            },
            Vt = function(e, t, n, r, i, s) {
                var o = on("group"),
                u = on("image");
                o.style.cssText = "position:absolute;left:0;top:0;width:" + e.width + "px;height:" + e.height + "px",
                o.coordsize = en,
                o.coordorigin = e.coordorigin,
                u.src = t,
                o[p](u);
                var a = new Rt(u, o, e);
                return a.type = "image",
                a.attrs.src = t,
                a.attrs.x = n,
                a.attrs.y = r,
                a.attrs.w = i,
                a.attrs.h = s,
                a.setBox({
                    x: n,
                    y: r,
                    width: i,
                    height: s
                }),
                e.canvas[p](o),
                a
            },
            $t = function(t, n, r, i) {
                var s = on("group"),
                o = on("shape"),
                u = o.style,
                a = on("path"),
                f = a.style,
                l = on("textpath");
                s.style.cssText = "position:absolute;left:0;top:0;width:" + t.width + "px;height:" + t.height + "px",
                s.coordsize = en,
                s.coordorigin = t.coordorigin,
                a.v = e.format("m{0},{1}l{2},{1}", W(n * 10), W(r * 10), W(n * 10) + 1),
                a.textpathok = !0,
                u.width = t.width,
                u.height = t.height,
                l.string = b(i),
                l.on = !0,
                o[p](l),
                o[p](a),
                s[p](o);
                var c = new Rt(l, s, t);
                return c.shape = o,
                c.textpath = a,
                c.type = "text",
                c.attrs.text = i,
                c.attrs.x = n,
                c.attrs.y = r,
                c.attrs.w = 1,
                c.attrs.h = 1,
                Ft(c, {
                    font: Q.font,
                    stroke: "none",
                    fill: "#000"
                }),
                c.setBox(),
                t.canvas[p](s),
                c
            },
            Jt = function(e, t) {
                var n = this.canvas.style;
                return e == +e && (e += "px"),
                t == +t && (t += "px"),
                n.width = e,
                n.height = t,
                n.clip = "rect(0 " + e + " " + t + " 0)",
                this
            };
            var on;
            a.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
            try { ! a.namespaces.rvml && a.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"),
                on = function(e) {
                    return a.createElement("<rvml:" + e + ' class="rvml">')
                }
            } catch(e) {
                on = function(e) {
                    return a.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
                }
            }
            Kt = function() {
                var t = Ct[d](0, arguments),
                n = t.container,
                r = t.height,
                i,
                s = t.width,
                o = t.x,
                u = t.y;
                if (!n) throw new Error("VML container not found.");
                var f = new c,
                l = f.canvas = a.createElement("div"),
                h = l.style;
                return o = o || 0,
                u = u || 0,
                s = s || 512,
                r = r || 342,
                s == +s && (s += "px"),
                r == +r && (r += "px"),
                f.width = 1e3,
                f.height = 1e3,
                f.coordsize = tn * 1e3 + y + tn * 1e3,
                f.coordorigin = "0 0",
                f.span = a.createElement("span"),
                f.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",
                l[p](f.span),
                h.cssText = e.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", s, r),
                n == 1 ? (a.body[p](l), h.left = o + "px", h.top = u + "px", h.position = "absolute") : n.firstChild ? n.insertBefore(l, n.firstChild) : n[p](l),
                kt.call(f, f, e.fn),
                f
            },
            h.clear = function() {
                this.canvas.innerHTML = g,
                this.span = a.createElement("span"),
                this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",
                this.canvas[p](this.span),
                this.bottom = this.top = null
            },
            h.remove = function() {
                this.canvas.parentNode.removeChild(this.canvas);
                for (var e in this) this[e] = Dt(e);
                return ! 0
            }
        }
        var un = navigator.userAgent.match(/Version\\x2f(.*?)\s/);
        navigator.vendor == "Apple Computer, Inc." && (un && un[1] < 4 || navigator.platform.slice(0, 2) == "iP") ? h.safari = function() {
            var e = this.rect( - 99, -99, this.width + 99, this.height + 99).attr({
                stroke: "none"
            });
            f.setTimeout(function() {
                e.remove()
            })
        }: h.safari = function() {};
        var an = function() {
            this.returnValue = !1
        },
        fn = function() {
            return this.originalEvent.preventDefault()
        },
        ln = function() {
            this.cancelBubble = !0
        },
        cn = function() {
            return this.originalEvent.stopPropagation()
        },
        hn = function() {
            if (a.addEventListener) return function(e, t, n, r) {
                var i = m && S[t] ? S[t] : t,
                s = function(i) {
                    if (m && S[u](t)) for (var s = 0,
                    o = i.targetTouches && i.targetTouches.length; s < o; s++) if (i.targetTouches[s].target == e) {
                        var a = i;
                        i = i.targetTouches[s],
                        i.originalEvent = a,
                        i.preventDefault = fn,
                        i.stopPropagation = cn;
                        break
                    }
                    return n.call(r, i)
                };
                return e.addEventListener(i, s, !1),
                function() {
                    return e.removeEventListener(i, s, !1),
                    !0
                }
            };
            if (a.attachEvent) return function(e, t, n, r) {
                var i = function(e) {
                    return e = e || f.event,
                    e.preventDefault = e.preventDefault || an,
                    e.stopPropagation = e.stopPropagation || ln,
                    n.call(r, e)
                };
                e.attachEvent("on" + t, i);
                var s = function() {
                    return e.detachEvent("on" + t, i),
                    !0
                };
                return s
            }
        } (),
        pn = [],
        dn = function(e) {
            var t = e.clientX,
            n = e.clientY,
            r = a.documentElement.scrollTop || a.body.scrollTop,
            i = a.documentElement.scrollLeft || a.body.scrollLeft,
            s, o = pn.length;
            while (o--) {
                s = pn[o];
                if (m) {
                    var u = e.touches.length,
                    f;
                    while (u--) {
                        f = e.touches[u];
                        if (f.identifier == s.el._drag.id) {
                            t = f.clientX,
                            n = f.clientY,
                            (e.originalEvent ? e.originalEvent: e).preventDefault();
                            break
                        }
                    }
                } else e.preventDefault();
                t += i,
                n += r,
                s.move && s.move.call(s.move_scope || s.el, t - s.el._drag.x, n - s.el._drag.y, t, n, e)
            }
        },
        vn = function(t) {
            e.unmousemove(dn).unmouseup(vn);
            var n = pn.length,
            r;
            while (n--) r = pn[n],
            r.el._drag = {},
            r.end && r.end.call(r.end_scope || r.start_scope || r.move_scope || r.el, t);
            pn = []
        };
        for (var mn = E[T]; mn--;)(function(t) {
            e[t] = Rt[o][t] = function(n, r) {
                return e.is(n, "function") && (this.events = this.events || [], this.events.push({
                    name: t,
                    f: n,
                    unbind: hn(this.shape || this.node || a, t, n, r || this)
                })),
                this
            },
            e["un" + t] = Rt[o]["un" + t] = function(e) {
                var n = this.events,
                r = n[T];
                while (r--) if (n[r].name == t && n[r].f == e) return n[r].unbind(),
                n.splice(r, 1),
                !n.length && delete this.events,
                this;
                return this
            }
        })(E[mn]);
        Ut.hover = function(e, t, n, r) {
            return this.mouseover(e, n).mouseout(t, r || n)
        },
        Ut.unhover = function(e, t) {
            return this.unmouseover(e).unmouseout(t)
        },
        Ut.drag = function(t, n, r, i, s, o) {
            return this._drag = {},
            this.mousedown(function(u) { (u.originalEvent || u).preventDefault();
                var f = a.documentElement.scrollTop || a.body.scrollTop,
                l = a.documentElement.scrollLeft || a.body.scrollLeft;
                this._drag.x = u.clientX + l,
                this._drag.y = u.clientY + f,
                this._drag.id = u.identifier,
                n && n.call(s || i || this, u.clientX + l, u.clientY + f, u),
                !pn.length && e.mousemove(dn).mouseup(vn),
                pn.push({
                    el: this,
                    move: t,
                    end: r,
                    move_scope: i,
                    start_scope: s,
                    end_scope: o
                })
            }),
            this
        },
        Ut.undrag = function(t, n, r) {
            var i = pn.length;
            while (i--) pn[i].el == this && pn[i].move == t && pn[i].end == r && pn.splice(i++, 1); ! pn.length && e.unmousemove(dn).unmouseup(vn)
        },
        h.circle = function(e, t, n) {
            return zt(this, e || 0, t || 0, n || 0)
        },
        h.rect = function(e, t, n, r, i) {
            return Wt(this, e || 0, t || 0, n || 0, r || 0, i || 0)
        },
        h.ellipse = function(e, t, n, r) {
            return Xt(this, e || 0, t || 0, n || 0, r || 0)
        },
        h.path = function(t) {
            return t && !e.is(t, D) && !e.is(t[0], P) && (t += g),
            Ht(e.format[d](e, arguments), this)
        },
        h.image = function(e, t, n, r, i) {
            return Vt(this, e || "about:blank", t || 0, n || 0, r || 0, i || 0)
        },
        h.text = function(e, t, n) {
            return $t(this, e || 0, t || 0, b(n))
        },
        h.set = function(e) {
            return arguments[T] > 1 && (e = Array[o].splice.call(arguments, 0, arguments[T])),
            new Mn(e)
        },
        h.setSize = Jt,
        h.top = h.bottom = null,
        h.raphael = e,
        Ut.resetScale = function() {
            if (this.removed) return this;
            this._.sx = 1,
            this._.sy = 1,
            this.attrs.scale = "1 1"
        },
        Ut.scale = function(e, t, n, r) {
            if (this.removed) return this;
            if (e == null && t == null) return {
                x: this._.sx,
                y: this._.sy,
                toString: gn
            };
            t = t || e,
            !+t && (t = e);
            var i, s, o, u, a = this.attrs;
            if (e != 0) {
                var f = this.getBBox(),
                l = f.x + f.width / 2,
                c = f.y + f.height / 2,
                h = A(e / this._.sx),
                p = A(t / this._.sy);
                n = +n || n == 0 ? n: l,
                r = +r || r == 0 ? r: c;
                var d = this._.sx > 0,
                m = this._.sy > 0,
                b = ~~ (e / A(e)),
                w = ~~ (t / A(t)),
                E = h * b,
                S = p * w,
                N = this.node.style,
                C = n + A(l - n) * E * (l > n == d ? 1 : -1),
                k = r + A(c - r) * S * (c > r == m ? 1 : -1),
                L = e * b > t * w ? p: h;
                switch (this.type) {
                case "rect":
                case "image":
                    var O = a.width * h,
                    M = a.height * p;
                    this.attr({
                        height: M,
                        r: a.r * L,
                        width: O,
                        x: C - O / 2,
                        y: k - M / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx:
                        a.rx * h,
                        ry: a.ry * p,
                        r: a.r * L,
                        cx: C,
                        cy: k
                    });
                    break;
                case "text":
                    this.attr({
                        x:
                        C,
                        y: k
                    });
                    break;
                case "path":
                    var _ = gt(a.path),
                    D = !0,
                    P = d ? E: h,
                    H = m ? S: p;
                    for (var B = 0,
                    j = _[T]; B < j; B++) {
                        var F = _[B],
                        I = K.call(F[0]);
                        if (I == "M" && D) continue;
                        D = !1;
                        if (I == "A") F[_[B][T] - 2] *= P,
                        F[_[B][T] - 1] *= H,
                        F[1] *= h,
                        F[2] *= p,
                        F[5] = +(b + w ? !!+F[5] : !+F[5]);
                        else if (I == "H") for (var q = 1,
                        R = F[T]; q < R; q++) F[q] *= P;
                        else if (I == "V") for (q = 1, R = F[T]; q < R; q++) F[q] *= H;
                        else for (q = 1, R = F[T]; q < R; q++) F[q] *= q % 2 ? P: H
                    }
                    var U = vt(_);
                    i = C - U.x - U.width / 2,
                    s = k - U.y - U.height / 2,
                    _[0][1] += i,
                    _[0][2] += s,
                    this.attr({
                        path: _
                    })
                }
                this.type in {
                    text: 1,
                    image: 1
                } && (b != 1 || w != 1) ? this.transformations ? (this.transformations[2] = "scale(" [v](b, ",", w, ")"), this.node[X]("transform", this.transformations[x](y)), i = b == -1 ? -a.x - (O || 0) : a.x, s = w == -1 ? -a.y - (M || 0) : a.y, this.attr({
                    x: i,
                    y: s
                }), a.fx = b - 1, a.fy = w - 1) : (this.node.filterMatrix = J + ".Matrix(M11=" [v](b, ", M12=0, M21=0, M22=", w, ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')"), N.filter = (this.node.filterMatrix || g) + (this.node.filterOpacity || g)) : this.transformations ? (this.transformations[2] = g, this.node[X]("transform", this.transformations[x](y)), a.fx = 0, a.fy = 0) : (this.node.filterMatrix = g, N.filter = (this.node.filterMatrix || g) + (this.node.filterOpacity || g)),
                a.scale = [e, t, n, r][x](y),
                this._.sx = e,
                this._.sy = t
            }
            return this
        },
        Ut.clone = function() {
            if (this.removed) return null;
            var e = this.attr();
            return delete e.scale,
            delete e.translation,
            this.paper[this.type]().attr(e)
        };
        var yn = {},
        bn = function(t, n, r, i, s, o, u, a, f) {
            var l = 0,
            c = 100,
            h = [t, n, r, i, s, o, u, a].join(),
            p = yn[h],
            d,
            v; ! p && (yn[h] = p = {
                data: []
            }),
            p.timer && clearTimeout(p.timer),
            p.timer = setTimeout(function() {
                delete yn[h]
            },
            2e3);
            if (f != null) {
                var m = bn(t, n, r, i, s, o, u, a);
                c = ~~m * 10
            }
            for (var g = 0; g < c + 1; g++) {
                p.data[f] > g ? v = p.data[g * c] : (v = e.findDotsAtSegment(t, n, r, i, s, o, u, a, g / c), p.data[g] = v),
                g && (l += O(O(d.x - v.x, 2) + O(d.y - v.y, 2), .5));
                if (f != null && l >= f) return v;
                d = v
            }
            if (f == null) return l
        },
        wn = function(t, n) {
            return function(r, i, s) {
                r = Tt(r);
                var o, u, a, f, l = "",
                c = {},
                h, p = 0;
                for (var d = 0,
                v = r.length; d < v; d++) {
                    a = r[d];
                    if (a[0] == "M") o = +a[1],
                    u = +a[2];
                    else {
                        f = bn(o, u, a[1], a[2], a[3], a[4], a[5], a[6]);
                        if (p + f > i) {
                            if (n && !c.start) {
                                h = bn(o, u, a[1], a[2], a[3], a[4], a[5], a[6], i - p),
                                l += ["C", h.start.x, h.start.y, h.m.x, h.m.y, h.x, h.y];
                                if (s) return l;
                                c.start = l,
                                l = ["M", h.x, h.y + "C", h.n.x, h.n.y, h.end.x, h.end.y, a[5], a[6]][x](),
                                p += f,
                                o = +a[5],
                                u = +a[6];
                                continue
                            }
                            if (!t && !n) return h = bn(o, u, a[1], a[2], a[3], a[4], a[5], a[6], i - p),
                            {
                                x: h.x,
                                y: h.y,
                                alpha: h.alpha
                            }
                        }
                        p += f,
                        o = +a[5],
                        u = +a[6]
                    }
                    l += a
                }
                return c.end = l,
                h = t ? p: n ? c: e.findDotsAtSegment(o, u, a[1], a[2], a[3], a[4], a[5], a[6], 1),
                h.alpha && (h = {
                    x: h.x,
                    y: h.y,
                    alpha: h.alpha
                }),
                h
            }
        },
        En = wn(1),
        Sn = wn(),
        xn = wn(0, 1);
        Ut.getTotalLength = function() {
            if (this.type != "path") return;
            return this.node.getTotalLength ? this.node.getTotalLength() : En(this.attrs.path)
        },
        Ut.getPointAtLength = function(e) {
            if (this.type != "path") return;
            return Sn(this.attrs.path, e)
        },
        Ut.getSubpath = function(e, t) {
            if (this.type != "path") return;
            if (A(this.getTotalLength() - t) < "1e-6") return xn(this.attrs.path, e).end;
            var n = xn(this.attrs.path, t, 1);
            return e ? xn(n, e).end: n
        },
        e.easing_formulas = {
            linear: function(e) {
                return e
            },
            "<": function(e) {
                return O(e, 3)
            },
            ">": function(e) {
                return O(e - 1, 3) + 1
            },
            "<>": function(e) {
                return e *= 2,
                e < 1 ? O(e, 3) / 2 : (e -= 2, (O(e, 3) + 2) / 2)
            },
            backIn: function(e) {
                var t = 1.70158;
                return e * e * ((t + 1) * e - t)
            },
            backOut: function(e) {
                e -= 1;
                var t = 1.70158;
                return e * e * ((t + 1) * e + t) + 1
            },
            elastic: function(e) {
                if (e == 0 || e == 1) return e;
                var t = .3,
                n = t / 4;
                return O(2, -10 * e) * C.sin((e - n) * 2 * M / t) + 1
            },
            bounce: function(e) {
                var t = 7.5625,
                n = 2.75,
                r;
                return e < 1 / n ? r = t * e * e: e < 2 / n ? (e -= 1.5 / n, r = t * e * e + .75) : e < 2.5 / n ? (e -= 2.25 / n, r = t * e * e + .9375) : (e -= 2.625 / n, r = t * e * e + .984375),
                r
            }
        };
        var Tn = [],
        Nn = function() {
            var t = +(new Date);
            for (var n = 0; n < Tn[T]; n++) {
                var r = Tn[n];
                if (r.stop || r.el.removed) continue;
                var i = t - r.start,
                s = r.ms,
                o = r.easing,
                a = r.from,
                f = r.diff,
                l = r.to,
                c = r.t,
                h = r.el,
                p = {},
                d;
                if (i < s) {
                    var v = o(i / s);
                    for (var m in a) if (a[u](m)) {
                        switch (G[m]) {
                        case "along":
                            d = v * s * f[m],
                            l.back && (d = l.len - d);
                            var b = Sn(l[m], d);
                            h.translate(f.sx - f.x || 0, f.sy - f.y || 0),
                            f.x = b.x,
                            f.y = b.y,
                            h.translate(b.x - f.sx, b.y - f.sy),
                            l.rot && h.rotate(f.r + b.alpha, b.x, b.y);
                            break;
                        case _:
                            d = +a[m] + v * s * f[m];
                            break;
                        case "colour":
                            d = "rgb(" + [kn(W(a[m].r + v * s * f[m].r)), kn(W(a[m].g + v * s * f[m].g)), kn(W(a[m].b + v * s * f[m].b))][x](",") + ")";
                            break;
                        case "path":
                            d = [];
                            for (var w = 0,
                            E = a[m][T]; w < E; w++) {
                                d[w] = [a[m][w][0]];
                                for (var S = 1,
                                N = a[m][w][T]; S < N; S++) d[w][S] = +a[m][w][S] + v * s * f[m][w][S];
                                d[w] = d[w][x](y)
                            }
                            d = d[x](y);
                            break;
                        case "csv":
                            switch (m) {
                            case "translation":
                                var C = v * s * f[m][0] - c.x,
                                k = v * s * f[m][1] - c.y;
                                c.x += C,
                                c.y += k,
                                d = C + y + k;
                                break;
                            case "rotation":
                                d = +a[m][0] + v * s * f[m][0],
                                a[m][1] && (d += "," + a[m][1] + "," + a[m][2]);
                                break;
                            case "scale":
                                d = [ + a[m][0] + v * s * f[m][0], +a[m][1] + v * s * f[m][1], 2 in l[m] ? l[m][2] : g, 3 in l[m] ? l[m][3] : g][x](y);
                                break;
                            case "clip-rect":
                                d = [],
                                w = 4;
                                while (w--) d[w] = +a[m][w] + v * s * f[m][w]
                            }
                            break;
                        default:
                            var L = [].concat(a[m]);
                            d = [],
                            w = h.paper.customAttributes[m].length;
                            while (w--) d[w] = +L[w] + v * s * f[m][w]
                        }
                        p[m] = d
                    }
                    h.attr(p),
                    h._run && h._run.call(h)
                } else l.along && (b = Sn(l.along, l.len * !l.back), h.translate(f.sx - (f.x || 0) + b.x - f.sx, f.sy - (f.y || 0) + b.y - f.sy), l.rot && h.rotate(f.r + b.alpha, b.x, b.y)),
                (c.x || c.y) && h.translate( - c.x, -c.y),
                l.scale && (l.scale += g),
                h.attr(l),
                Tn.splice(n--, 1)
            }
            e.svg && h && h.paper && h.paper.safari(),
            Tn[T] && setTimeout(Nn)
        },
        Cn = function(t, n, r, i, s) {
            var o = r - i;
            n.timeouts.push(setTimeout(function() {
                e.is(s, "function") && s.call(n),
                n.animate(t, o, t.easing)
            },
            i))
        },
        kn = function(e) {
            return k(L(e, 255), 0)
        },
        Ln = function(e, t) {
            if (e == null) return {
                x: this._.tx,
                y: this._.ty,
                toString: gn
            };
            this._.tx += +e,
            this._.ty += +t;
            switch (this.type) {
            case "circle":
            case "ellipse":
                this.attr({
                    cx:
                    +e + this.attrs.cx,
                    cy: +t + this.attrs.cy
                });
                break;
            case "rect":
            case "image":
            case "text":
                this.attr({
                    x:
                    +e + this.attrs.x,
                    y: +t + this.attrs.y
                });
                break;
            case "path":
                var n = gt(this.attrs.path);
                n[0][1] += +e,
                n[0][2] += +t,
                this.attr({
                    path: n
                })
            }
            return this
        };
        Ut.animateWith = function(e, t, n, r, i) {
            for (var s = 0,
            o = Tn.length; s < o; s++) Tn[s].el.id == e.id && (t.start = Tn[s].start);
            return this.animate(t, n, r, i)
        },
        Ut.animateAlong = An(),
        Ut.animateAlongBack = An(1),
        Ut.onAnimation = function(e) {
            return this._run = e || 0,
            this
        },
        Ut.animate = function(t, n, i, s) {
            var o = this;
            o.timeouts = o.timeouts || [];
            if (e.is(i, "function") || !i) s = i || null;
            if (o.removed) return s && s.call(o),
            o;
            var a = {},
            f = {},
            l = !1,
            c = {};
            for (var h in t) if (t[u](h)) if (G[u](h) || o.paper.customAttributes[u](h)) {
                l = !0,
                a[h] = o.attr(h),
                a[h] == null && (a[h] = Q[h]),
                f[h] = t[h];
                switch (G[h]) {
                case "along":
                    var p = En(t[h]),
                    d = Sn(t[h], p * !!t.back),
                    v = o.getBBox();
                    c[h] = p / n,
                    c.tx = v.x,
                    c.ty = v.y,
                    c.sx = d.x,
                    c.sy = d.y,
                    f.rot = t.rot,
                    f.back = t.back,
                    f.len = p,
                    t.rot && (c.r = V(o.rotate()) || 0);
                    break;
                case _:
                    c[h] = (f[h] - a[h]) / n;
                    break;
                case "colour":
                    a[h] = e.getRGB(a[h]);
                    var m = e.getRGB(f[h]);
                    c[h] = {
                        r: (m.r - a[h].r) / n,
                        g: (m.g - a[h].g) / n,
                        b: (m.b - a[h].b) / n
                    };
                    break;
                case "path":
                    var g = Tt(a[h], f[h]);
                    a[h] = g[0];
                    var y = g[1];
                    c[h] = [];
                    for (var E = 0,
                    S = a[h][T]; E < S; E++) {
                        c[h][E] = [0];
                        for (var x = 1,
                        N = a[h][E][T]; x < N; x++) c[h][E][x] = (y[E][x] - a[h][E][x]) / n
                    }
                    break;
                case "csv":
                    var C = b(t[h])[w](r),
                    k = b(a[h])[w](r);
                    switch (h) {
                    case "translation":
                        a[h] = [0, 0],
                        c[h] = [C[0] / n, C[1] / n];
                        break;
                    case "rotation":
                        a[h] = k[1] == C[1] && k[2] == C[2] ? k: [0, C[1], C[2]],
                        c[h] = [(C[0] - a[h][0]) / n, 0, 0];
                        break;
                    case "scale":
                        t[h] = C,
                        a[h] = b(a[h])[w](r),
                        c[h] = [(C[0] - a[h][0]) / n, (C[1] - a[h][1]) / n, 0, 0];
                        break;
                    case "clip-rect":
                        a[h] = b(a[h])[w](r),
                        c[h] = [],
                        E = 4;
                        while (E--) c[h][E] = (C[E] - a[h][E]) / n
                    }
                    f[h] = C;
                    break;
                default:
                    C = [].concat(t[h]),
                    k = [].concat(a[h]),
                    c[h] = [],
                    E = o.paper.customAttributes[h][T];
                    while (E--) c[h][E] = ((C[E] || 0) - (k[E] || 0)) / n
                }
            }
            if (l) {
                var L = e.easing_formulas[i];
                if (!L) {
                    L = b(i).match(z);
                    if (L && L[T] == 5) {
                        var A = L;
                        L = function(e) {
                            return On(e, +A[1], +A[2], +A[3], +A[4], n)
                        }
                    } else L = function(e) {
                        return e
                    }
                }
                Tn.push({
                    start: t.start || +(new Date),
                    ms: n,
                    easing: L,
                    from: a,
                    diff: c,
                    to: f,
                    el: o,
                    t: {
                        x: 0,
                        y: 0
                    }
                }),
                e.is(s, "function") && (o._ac = setTimeout(function() {
                    s.call(o)
                },
                n)),
                Tn[T] == 1 && setTimeout(Nn)
            } else {
                var O = [],
                M;
                for (var D in t) t[u](D) && Z.test(D) && (h = {
                    value: t[D]
                },
                D == "from" && (D = 0), D == "to" && (D = 100), h.key = $(D, 10), O.push(h));
                O.sort(ot),
                O[0].key && O.unshift({
                    key: 0,
                    value: o.attrs
                });
                for (E = 0, S = O[T]; E < S; E++) Cn(O[E].value, o, n / 100 * O[E].key, n / 100 * (O[E - 1] && O[E - 1].key || 0), O[E - 1] && O[E - 1].value.callback);
                M = O[O[T] - 1].value.callback,
                M && o.timeouts.push(setTimeout(function() {
                    M.call(o)
                },
                n))
            }
            return this
        },
        Ut.stop = function() {
            for (var e = 0; e < Tn.length; e++) Tn[e].el.id == this.id && Tn.splice(e--, 1);
            for (e = 0, ii = this.timeouts && this.timeouts.length; e < ii; e++) clearTimeout(this.timeouts[e]);
            return this.timeouts = [],
            clearTimeout(this._ac),
            delete this._ac,
            this
        },
        Ut.translate = function(e, t) {
            return this.attr({
                translation: e + " " + t
            })
        },
        Ut[H] = function() {
            return "Raphaël's object"
        },
        e.ae = Tn;
        var Mn = function(e) {
            this.items = [],
            this[T] = 0,
            this.type = "set";
            if (e) for (var t = 0,
            n = e[T]; t < n; t++) e[t] && (e[t].constructor == Rt || e[t].constructor == Mn) && (this[this.items[T]] = this.items[this.items[T]] = e[t], this[T]++)
        };
        Mn[o][I] = function() {
            var e, t;
            for (var n = 0,
            r = arguments[T]; n < r; n++) e = arguments[n],
            e && (e.constructor == Rt || e.constructor == Mn) && (t = this.items[T], this[t] = this.items[t] = e, this[T]++);
            return this
        },
        Mn[o].pop = function() {
            return delete this[this[T]--],
            this.items.pop()
        };
        for (var _n in Ut) Ut[u](_n) && (Mn[o][_n] = function(e) {
            return function() {
                for (var t = 0,
                n = this.items[T]; t < n; t++) this.items[t][e][d](this.items[t], arguments);
                return this
            }
        } (_n));
        Mn[o].attr = function(t, n) {
            if (t && e.is(t, P) && e.is(t[0], "object")) for (var r = 0,
            i = t[T]; r < i; r++) this.items[r].attr(t[r]);
            else for (var s = 0,
            o = this.items[T]; s < o; s++) this.items[s].attr(t, n);
            return this
        },
        Mn[o].animate = function(t, n, r, i) { (e.is(r, "function") || !r) && (i = r || null);
            var s = this.items[T],
            o = s,
            u,
            a = this,
            f;
            i && (f = function() { ! --s && i.call(a)
            }),
            r = e.is(r, D) ? r: f,
            u = this.items[--o].animate(t, n, r, f);
            while (o--) this.items[o] && !this.items[o].removed && this.items[o].animateWith(u, t, n, r, f);
            return this
        },
        Mn[o].insertAfter = function(e) {
            var t = this.items[T];
            while (t--) this.items[t].insertAfter(e);
            return this
        },
        Mn[o].getBBox = function() {
            var e = [],
            t = [],
            n = [],
            r = [];
            for (var i = this.items[T]; i--;) {
                var s = this.items[i].getBBox();
                e[I](s.x),
                t[I](s.y),
                n[I](s.x + s.width),
                r[I](s.y + s.height)
            }
            return e = L[d](0, e),
            t = L[d](0, t),
            {
                x: e,
                y: t,
                width: k[d](0, n) - e,
                height: k[d](0, r) - t
            }
        },
        Mn[o].clone = function(e) {
            e = new Mn;
            for (var t = 0,
            n = this.items[T]; t < n; t++) e[I](this.items[t].clone());
            return e
        },
        e.registerFont = function(e) {
            if (!e.face) return e;
            this.fonts = this.fonts || {};
            var t = {
                w: e.w,
                face: {},
                glyphs: {}
            },
            n = e.face["font-family"];
            for (var r in e.face) e.face[u](r) && (t.face[r] = e.face[r]);
            this.fonts[n] ? this.fonts[n][I](t) : this.fonts[n] = [t];
            if (!e.svg) {
                t.face["units-per-em"] = $(e.face["units-per-em"], 10);
                for (var i in e.glyphs) if (e.glyphs[u](i)) {
                    var s = e.glyphs[i];
                    t.glyphs[i] = {
                        w: s.w,
                        k: {},
                        d: s.d && "M" + s.d[Y](/[mlcxtrv]/g,
                        function(e) {
                            return {
                                l: "L",
                                c: "C",
                                x: "z",
                                t: "m",
                                r: "l",
                                v: "c"
                            } [e] || "M"
                        }) + "z"
                    };
                    if (s.k) for (var o in s.k) s[u](o) && (t.glyphs[i].k[o] = s.k[o])
                }
            }
            return e
        },
        h.getFont = function(t, n, r, i) {
            i = i || "normal",
            r = r || "normal",
            n = +n || {
                normal: 400,
                bold: 700,
                lighter: 300,
                bolder: 800
            } [n] || 400;
            if (!e.fonts) return;
            var s = e.fonts[t];
            if (!s) {
                var o = new RegExp("(^|\\s)" + t[Y](/[^\w\d\s+!~.:_-]/g, g) + "(\\s|$)", "i");
                for (var a in e.fonts) if (e.fonts[u](a) && o.test(a)) {
                    s = e.fonts[a];
                    break
                }
            }
            var f;
            if (s) for (var l = 0,
            c = s[T]; l < c; l++) {
                f = s[l];
                if (f.face["font-weight"] == n && (f.face["font-style"] == r || !f.face["font-style"]) && f.face["font-stretch"] == i) break
            }
            return f
        },
        h.print = function(t, n, i, s, o, u, a) {
            u = u || "middle",
            a = k(L(a || 0, 1), -1);
            var f = this.set(),
            l = b(i)[w](g),
            c = 0,
            h = g,
            p;
            e.is(s, i) && (s = this.getFont(s));
            if (s) {
                p = (o || 16) / s.face["units-per-em"];
                var d = s.face.bbox.split(r),
                v = +d[0],
                m = +d[1] + (u == "baseline" ? d[3] - d[1] + +s.face.descent: (d[3] - d[1]) / 2);
                for (var y = 0,
                E = l[T]; y < E; y++) {
                    var S = y && s.glyphs[l[y - 1]] || {},
                    x = s.glyphs[l[y]];
                    c += y ? (S.w || s.w) + (S.k && S.k[l[y]] || 0) + s.w * a: 0,
                    x && x.d && f[I](this.path(x.d).attr({
                        fill: "#000",
                        stroke: "none",
                        translation: [c, 0]
                    }))
                }
                f.scale(p, p, v, m).translate(t - v, n - m)
            }
            return f
        },
        e.format = function(t, n) {
            var r = e.is(n, P) ? [0][v](n) : arguments;
            return t && e.is(t, D) && r[T] - 1 && (t = t[Y](s,
            function(e, t) {
                return r[++t] == null ? g: r[t]
            })),
            t || g
        },
        e.ninja = function() {
            return l.was ? f.Raphael = l.is: delete t,
            e
        },
        e.el = Ut,
        e.st = Mn[o],
        l.was ? f.Raphael = e: t = e
    } (),
    e = t,
    e
}),
define("scripts/lib/tween.js",
function(e) {
    return e.exponential = function() {},
    e.exponential.co = function(e, t, n, r) {
        return e == r ? t + n: n * ( - Math.pow(2, -10 * e / r) + 1) + t
    },
    e.bounce = function() {},
    e.bounce.co = function(e, t, n, r) {
        return (e /= r) < 1 / 2.75 ? n * 7.5625 * e * e + t: e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t: e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t: n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t
    },
    e.quadratic = function() {},
    e.quadratic.ci = function(e, t, n, r) {
        return n * (e /= r) * e + t
    },
    e.quadratic.co = function(e, t, n, r) {
        return - n * (e /= r) * (e - 2) + t
    },
    e.quadratic.cio = function(e, t, n, r) {
        return (e /= r / 2) < 1 ? n / 2 * e * e + t: -n / 2 * (--e * (e - 2) - 1) + t
    },
    e.circular = function(e, t, n, r) {
        return (e /= r / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + t: n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t
    },
    e.linear = function(e, t, n, r) {
        return n * e / r + t
    },
    e.back = function() {},
    e.back.ci = function(e, t, n, r, i) {
        return i = 1.70158,
        n * (e /= r) * e * ((i + 1) * e - i) + t
    },
    e.back.co = function(e, t, n, r, i) {
        return i = 1.70158,
        n * ((e = e / r - 1) * e * ((i + 1) * e + i) + 1) + t
    },
    e
}),
define("scripts/message.js",
function(e) {
    var t = require("scripts/lib/ucren");
    return e.postMessage = function(e, n) {
        var r = [].slice.call(arguments, 0),
        i = r.length - 1;
        n = r[i],
        r.slice(0, i),
        t.dispatch(n, r)
    },
    e.addEventListener = function(e, n) {
        t.dispatch(e, n)
    },
    e.removeEventListener = function(e, n) {
        t.dispatch.remove(e, n)
    },
    e
}),
define("scripts/object/flame.js",
function(e) {
    function c(e, n, r, i, s) {
        return s[l] = {
            id: l++,
            birthday: new Date,
            center: e,
            angle: n,
            length: r,
            life: i,
            path: t.path().attr({
                stroke: "none",
                fill: u(n * 180 / f) + "-#fafad9-#f0ef9c"
            })
        }
    }
    function p(e, t) {
        var n = e[t];
        if (!n) return;
        var r, i, a, l, c, p;
        r = 1 - (new Date - n.birthday) / n.life;
        if (r <= 0) {
            n.path.remove(),
            delete e[n.id];
            return
        }
        var d, v, m;
        d = n.angle,
        v = n.center,
        m = n.length,
        i = [u(v[0] + s(d) * m * (1 - r)), u(v[1] + o(d) * m * (1 - r))],
        a = [u(i[0] - s(d) * h * r), u(i[1] - o(d) * h * r)],
        l = [u(i[0] + s(d) * h * r), u(i[1] + o(d) * h * r)],
        c = [u(i[0] - s(d + .5 * f) * h * .4 * r), u(i[1] - o(d + .5 * f) * h * .4 * r)],
        p = [u(i[0] - s(d - .5 * f) * h * .4 * r), u(i[1] - o(d - .5 * f) * h * .4 * r)],
        n.path.attr({
            path: "M" + a + " Q" + [c, l, p, a].join(" ")
        })
    }
    function d(e, t) {
        var n = e[t];
        if (!n) return;
        n.path.remove(),
        delete e[t]
    }
    var t = require("scripts/layer").getLayer("fruit"),
    n = require("scripts/timeline"),
    r = require("scripts/lib/ucren"),
    i = Math,
    s = i.cos,
    o = i.sin,
    u = parseInt,
    a = i.random,
    f = i.PI,
    l = 0,
    h = 15;
    return e.create = function(e, i, s) {
        var o, u, l = {
            pos: function(e, t) {
                h = e,
                v = t,
                m.attr("x", h - 21).attr("y", v - 21)
            },
            remove: function() { [o, u].invoke("stop"),
                m.remove();
                for (var e in g) d(g, e)
            }
        },
        h = e,
        v = i,
        m = t.image("images/smoke.png", h - 21, v - 21, 43, 43).hide(),
        g = {};
        return o = n.setTimeout(function() {
            m.show(),
            u = n.setInterval(function() {
                a() < .9 && c([h, v], f * 2 * a(), 60, 200 + 500 * a(), g);
                for (var e in g) p(g, e)
            },
            r.isIe ? 20 : 40)
        },
        s || 0),
        l
    },
    e
}),
define("scripts/object/flash.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/timeline").use("flash").init(10),
    r = require("scripts/lib/tween"),
    i = require("scripts/lib/sound"),
    s,
    o,
    u = 0,
    a = 0,
    f = r.quadratic.cio,
    l = [],
    c = 100;
    return e.set = function() {
        s = t.createImage("flash", "images/flash.png", 0, 0, 358, 20).hide(),
        o = i.create("audio/splatter")
    },
    e.showAt = function(e, t, r) {
        s.rotate(r, !0).scale(1e-5, 1e-5).attr({
            x: e + u,
            y: t + a
        }).show(),
        l.clear && l.clear(),
        o.play(),
        n.createTask({
            start: 0,
            duration: c,
            data: [1e-5, 1],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            recycle: l
        }),
        n.createTask({
            start: c,
            duration: c,
            data: [1, 1e-5],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            recycle: l
        })
    },
    e.onTimeUpdate = function(e, t, n, r) {
        s.scale(r = f(e, t, n - t, c), r)
    },
    e
}),
define("scripts/factory/juice.js",
function(e) {
    function d(e, t, n) {
        this.originX = e,
        this.originY = t,
        this.color = n,
        this.distance = o(200) + 100,
        this.radius = p,
        this.dir = o(360) * Math.PI / 180
    }
    var t = require("scripts/lib/ucren"),
    n = require("scripts/layer").getLayer("juice"),
    r = require("scripts/timeline").use("juice").init(10),
    i = require("scripts/lib/tween"),
    s = require("scripts/tools"),
    o = t.randomNumber,
    u = 1500,
    a = i.exponential.co,
    f = i.quadratic.co,
    l = Math.sin,
    c = Math.cos,
    h = 10,
    p = 10;
    return d.prototype.render = function() {
        this.circle = n.circle(this.originX, this.originY, this.radius).attr({
            fill: this.color,
            stroke: "none"
        })
    },
    d.prototype.sputter = function() {
        r.createTask({
            start: 0,
            duration: u,
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            onTimeEnd: this.onTimeEnd
        })
    },
    d.prototype.onTimeUpdate = function(e) {
        var t, n, r, i;
        t = a(e, 0, this.distance, u),
        n = this.originX + t * c(this.dir),
        r = this.originY + t * l(this.dir) + f(e, 0, 200, u),
        i = a(e, 1, -1, u),
        this.circle.attr({
            cx: n,
            cy: r
        }).scale(i, i)
    },
    d.prototype.onTimeEnd = function() {
        this.circle.remove(),
        s.unsetObject(this)
    },
    e.create = function(e, t, n) {
        for (var r = 0; r < h; r++) this.createOne(e, t, n)
    },
    e.createOne = function(e, t, n) {
        if (!n) return;
        var r = new d(e, t, n);
        r.render(),
        r.sputter()
    },
    e
}),
define("scripts/state.js",
function(e) {
    var t = require("scripts/lib/ucren"),
    n = require("scripts/timeline"),
    r = {},
    i = {},
    s = {};
    return e = function(e) {
        return i[e] ? i[e] : i[e] = {
            is: function(t) {
                return r[e] === t
            },
            isnot: function(t) {
                return r[e] !== t
            },
            ison: function() {
                return this.is(!0)
            },
            isoff: function() {
                return this.isnot(!0)
            },
            isunset: function() {
                return this.is(undefined)
            },
            set: function() {
                var t = NaN;
                return function(n) {
                    var i;
                    r[e] = n;
                    if (t !== n && (i = s[e])) for (var o = 0,
                    u = i.length; o < u; o++) i[o].call(this, n);
                    t = n
                }
            } (),
            get: function() {
                return r[e]
            },
            on: function() {
                var e = this;
                return e.set(!0),
                {
                    keep: function(t) {
                        n.setTimeout(e.set.saturate(e, !1), t)
                    }
                }
            },
            off: function() {
                var e = this;
                return e.set(!1),
                {
                    keep: function(t) {
                        n.setTimeout(e.set.saturate(e, !0), t)
                    }
                }
            },
            hook: function(t) {
                var n; (n = s[e]) ? n.push(t) : s[e] = [t]
            },
            unhook: function() {}
        }
    },
    e
}),
define("scripts/object/background.js",
function(e) {
    function u() {
        var e, t;
        e = o(12) - 6,
        t = o(12) - 6,
        i.attr({
            x: e,
            y: t
        })
    }
    var t = require("scripts/lib/ucren"),
    n = require("scripts/layer"),
    r = require("scripts/timeline"),
    i,
    s,
    o = t.randomNumber;
    return e.set = function() {
        i = n.createImage("default", "images/background.jpg", 0, 0, 640, 480)
    },
    e.wobble = function() {
        s = r.setInterval(u, 50)
    },
    e.stop = function() {
        s.stop(),
        i.attr({
            x: 0,
            y: 0
        })
    },
    e
}),
define("scripts/object/fps.js",
function(e) {
    return e
}),
define("scripts/object/home-mask.js",
function(e) {
    var t = require("scripts/factory/displacement"),
    n = require("scripts/lib/tween");
    return e = t.create("images/home-mask.png", 640, 183, 0, -183, 0, 0, n.exponential.co, 1e3),
    e
}),
define("scripts/factory/displacement.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/timeline"),
    r = require("scripts/lib/tween");
    return e.create = function(e, r, i, s, o, u, a, f, l) {
        var c = {},
        h, p = {};
        typeof f == "function" ? p.show = p.hide = f: p = f;
        var d = function(e, t, r, i, s, o, u, a) {
            n.createTask({
                start: e,
                duration: t,
                object: c,
                data: [r, i, s, o, u, a],
                onTimeUpdate: c.onTimeUpdate,
                onTimeStart: c.onTimeStart,
                onTimeEnd: c.onTimeEnd,
                recycle: c.anims
            })
        };
        return c.anims = [],
        c.set = function() {
            h = t.createImage("default", e, s, o, r, i)
        },
        c.show = function(e) {
            d(e, l, s, o, u, a, p.show, "show")
        },
        c.hide = function() {
            this.anims.clear(),
            d(0, l, u, a, s, o, p.hide, "hide")
        },
        c.onTimeUpdate = function(e, t, n, r, i, s) {
            h.attr({
                x: s(e, t, r - t, l),
                y: s(e, n, i - n, l)
            })
        },
        c.onTimeStart = function() {},
        c.onTimeEnd = function(e, t, n, r, i) {
            i === "hide" && h.hide()
        },
        c
    },
    e
}),
define("scripts/object/logo.js",
function(e) {
    var t = require("scripts/factory/displacement"),
    n = require("scripts/lib/tween");
    return e = t.create("images/logo.png", 288, 135, 17, -182, 17, 1, n.exponential.co, 1e3),
    e
}),
define("scripts/object/ninja.js",
function(e) {
    var t = require("scripts/factory/displacement"),
    n = require("scripts/lib/tween");
    return e = t.create("images/ninja.png", 244, 81, 315, -140, 315, 43, {
        show: n.bounce.co,
        hide: n.exponential.co
    },
    1e3),
    e
}),
define("scripts/object/home-desc.js",
function(e) {
    var t = require("scripts/factory/displacement"),
    n = require("scripts/lib/tween");
    return e = t.create("images/home-desc.png", 161, 91, -161, 140, 7, 127, n.exponential.co, 500),
    e
}),
define("scripts/object/dojo.js",
function(e) {
    var t = require("scripts/factory/rotate"),
    n = require("scripts/lib/tween");
    return e = t.create("images/dojo.png", 41, 240, 175, 175, 1e-5, n.exponential.co, 500),
    e

}),
define("scripts/factory/rotate.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/timeline"),
    r = require("scripts/lib/ucren");
    return e.create = function(e, i, s, o, u, a, f, l) {
        var c = {},
        h, p = [12, -12][r.randomNumber(2)],
        d = r.randomNumber(360);
        return c.anims = [],
        c.set = function() {
            h = t.createImage("default", e, i, s, o, u).scale(a, a).rotate(d, !0)
        },
        c.show = function(e) {
            n.createTask({
                start: e,
                duration: l,
                object: this,
                data: [a, 1],
                onTimeUpdate: this.onZooming,
                onTimeEnd: this.onShowEnd,
                recycle: this.anims
            })
        },
        c.hide = function(e) {
            this.anims.clear(),
            n.createTask({
                start: e,
                duration: l,
                object: this,
                data: [1, a],
                onTimeUpdate: this.onZooming,
                recycle: this.anims
            })
        },
        c.onShowEnd = function(e) {
            this.anims.clear(),
            n.createTask({
                start: 0,
                duration: -1,
                object: this,
                onTimeUpdate: c.onRotating,
                recycle: this.anims
            })
        },
        c.onZooming = function() {
            var e;
            return function(t, n, r) {
                h.scale(e = f(t, n, r - n, l), e)
            }
        } (),
        c.onRotating = function() {
            var e = 0,
            t = d;
            return function(n, r, i, s) {
                t = (t + (n - e) / 1e3 * p) % 360,
                h.rotate(t, !0),
                e = n
            }
        } (),
        c
    },
    e
}),
define("scripts/object/new-game.js",
function(e) {
    var t = require("scripts/factory/rotate"),
    n = require("scripts/lib/tween");
    return e = t.create("images/new-game.png", 244, 231, 195, 195, 1e-5, n.exponential.co, 500),
    e
}),
define("scripts/object/quit.js",
function(e) {
    var t = require("scripts/factory/rotate"),
    n = require("scripts/lib/tween");
    return e = t.create("images/quit.png", 493, 311, 141, 141, 1e-5, n.exponential.co, 500),
    e
}),
define("scripts/object/new.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/lib/tween"),
    r = require("scripts/timeline"),
    i = require("scripts/lib/ucren"),
    s,
    o = 300,
    u = 129,
    a = 328,
    f = 170,
    l = 221,
    c = 0,
    h = 0,
    p = 70,
    d = 42,
    v = 8,
    m = n.exponential.co,
    g = n.quadratic.ci;
    return e.anims = [],
    e.set = function() {
        s = t.createImage("default", "images/new.png", u, a, c, h)
    },
    e.unset = function() {},
    e.show = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [u, f, a, l, c, p, h, d],
            object: this,
            onTimeUpdate: this.onShowing,
            onTimeStart: this.onShowStart,
            onTimeEnd: this.onShowEnd,
            recycle: this.anims
        })
    },
    e.hide = function(e) {
        this.anims.clear(),
        r.createTask({
            start: e,
            duration: 500,
            data: [f, u, l, a, p, c, d, h],
            object: this,
            onTimeUpdate: this.onShowing,
            recycle: this.anims
        })
    },
    e.jump = function() {
        this.anims.clear(),
        r.createTask({
            start: 0,
            duration: -1,
            object: this,
            onTimeUpdate: this.onJumping,
            recycle: this.anims
        })
    },
    e.onShowStart = function() {},
    e.onShowing = function(e, t, n, r, i, o, u, a, f) {
        s.attr({
            x: m(e, t, n - t, 500),
            y: m(e, r, i - r, 500),
            width: m(e, o, u - o, 500),
            height: m(e, a, f - a, 500)
        })
    },
    e.onShowEnd = function() {
        this.jump()
    },
    e.onJumping = function(e) {
        var t = parseInt(e / o);
        e %= o,
        t % 2 && (e = o - e),
        s.attr("y", g(e, l, v, o))
    },
    e
}),
define("scripts/object/score.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/lib/tween"),
    r = require("scripts/timeline"),
    i = require("scripts/lib/ucren"),
    s = r.setTimeout.bind(r),
    o = n.exponential.co,
    u = require("scripts/message"),
    a,
    f,
    l,
    c = 500,
    h = -94,
    p = 6,
    d = -59,
    v = 41,
    m = -93,
    g = 7;
    return e.anims = [],
    e.set = function() {
        a = t.createImage("default", "images/score.png", h, 8, 29, 31).hide(),
        f = t.createText("default", "0", d, 24, "90-#fc7f0c-#ffec53", "30px").hide(),
        l = t.createText("default", "BEST 999", m, 48, "#af7c05", "14px").hide()
    },
    e.show = function(e) {
        r.createTask({
            start: e,
            duration: c,
            data: ["show", h, p, d, v, m, g],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            onTimeStart: this.onTimeStart,
            onTimeEnd: this.onTimeEnd,
            recycle: this.anims
        })
    },
    e.hide = function(e) {
        r.createTask({
            start: e,
            duration: c,
            data: ["hide", p, h, v, d, g, m],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            onTimeStart: this.onTimeStart,
            onTimeEnd: this.onTimeEnd,
            recycle: this.anims
        })
    },
    e.number = function(e) {
        f.attr("text", e || 0),
        a.scale(1.2, 1.2),
        s(function() {
            a.scale(1, 1)
        },
        60)
    },
    e.onTimeUpdate = function(e, t, n, r, i, s, u, h) {
        a.attr("x", o(e, n, r - n, c)),
        f.attr("x", o(e, i, s - i, c)),
        l.attr("x", o(e, u, h - u, c))
    },
    e.onTimeStart = function(e) {
        e === "show" && [a, f, l].invoke("show")
    },
    e.onTimeEnd = function(e) {
        e === "hide" && ([a, f, l].invoke("hide"), f.attr("text", 0))
    },
    e
}),
define("scripts/object/lose.js",
function(e) {
    function m(e) {
        var i = t.createImage("default", "images/lose.png", e - 27, 406, 54, 50).scale(1e-5, 1e-5),
        s = 500,
        o = {
            show: function(e) {
                r.createTask({
                    start: e,
                    duration: s,
                    data: [n.back.co, 1e-5, 1],
                    object: this,
                    onTimeUpdate: this.onScaling,
                    onTimeEnd: this.onShowEnd
                })
            },
            hide: function(e) {
                r.createTask({
                    start: e,
                    duration: s,
                    data: [n.back.ci, 1, 1e-5],
                    object: this,
                    onTimeUpdate: this.onScaling,
                    onTimeEnd: this.onHideEnd
                })
            },
            onScaling: function(e, t, n, r, o) {
                i.scale(o = t(e, n, r - n, s), o)
            },
            onShowEnd: function() {
                this.hide(1500)
            },
            onHideEnd: function() {
                i.remove()
            }
        };
        o.show(200)
    }
    var t = require("scripts/layer"),
    n = require("scripts/lib/tween"),
    r = require("scripts/timeline"),
    i = require("scripts/lib/ucren"),
    s = require("scripts/message"),
    o = n.exponential.co,
    u = n.back.co,
    a,
    f,
    l,
    c = 500,
    h = {
        src: "images/x.png",
        sx: 650,
        ex: 561,
        y: 5,
        w: 22,
        h: 19
    },
    p = {
        src: "images/xx.png",
        sx: 671,
        ex: 582,
        y: 5,
        w: 27,
        h: 26
    },
    d = {
        src: "images/xxx.png",
        sx: 697,
        ex: 608,
        y: 6,
        w: 31,
        h: 32
    },
    v = 0;
    return e.anims = [],
    e.set = function() {
        a = t.createImage("default", h.src, h.sx, h.y, h.w, h.h).hide(),
        f = t.createImage("default", p.src, p.sx, p.y, p.w, p.h).hide(),
        l = t.createImage("default", d.src, d.sx, d.y, d.w, d.h).hide()
    },
    e.reset = function() {
        v = 0,
        [[a, h], [f, p], [l, d]].forEach(function(e) {
            e[0].attr("src", e[1].src.replace("xf.png", "x.png"))
        })
    },
    e.show = function(e) {
        r.createTask({
            start: e,
            duration: c,
            data: ["show", h.sx, h.ex, p.sx, p.ex, d.sx, d.ex],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            onTimeStart: this.onTimeStart,
            onTimeEnd: this.onTimeEnd,
            recycle: this.anims
        })
    },
    e.hide = function(e) {
        r.createTask({
            start: e,
            duration: c,
            data: ["hide", h.ex, h.sx, p.ex, p.sx, d.ex, d.sx],
            object: this,
            onTimeUpdate: this.onTimeUpdate,
            onTimeStart: this.onTimeStart,
            onTimeEnd: this.onTimeEnd,
            recycle: this.anims
        })
    },
    e.showLoseAt = function(e) {
        var t, n = [[a, h], [f, p], [l, d]];
        m(e),
        t = n[++v - 1],
        t[0].attr("src", t[1].src.replace("x.png", "xf.png")).scale(1e-5, 1e-5),
        this.scaleImage(t[0]),
        v == 3 && s.postMessage("game.over")
    },
    e.scaleImage = function(e) {
        var t = 500;
        e.myOnScaling = e.myOnScaling ||
        function(e, n) {
            this.scale(n = u(e, 1e-5, .99999, t), n)
        },
        e.myOnScaleEnd = e.myOnScaleEnd ||
        function() {
            this.scale(1, 1)
        },
        r.createTask({
            start: 0,
            duration: t,
            object: e,
            onTimeUpdate: e.myOnScaling,
            onTimeEnd: e.myOnScaleEnd,
            recycle: this.anims
        })
    },
    e.onTimeUpdate = function(e, t, n, r, i, s, u, h) {
        a.attr("x", o(e, n, r - n, c)),
        f.attr("x", o(e, i, s - i, c)),
        l.attr("x", o(e, u, h - u, c))
    },
    e.onTimeStart = function(e) {
        e == "show" && [a, f, l].invoke("show")
    },
    e.onTimeEnd = function(e) {
        e == "hide" && ([a, f, l].invoke("hide"), this.reset())
    },
    e
}),
define("scripts/game.js",
function(e) {
    var t = require("scripts/timeline"),
    n = require("scripts/lib/ucren"),
    r = require("scripts/lib/sound"),
    i = require("scripts/factory/fruit"),
    s = require("scripts/object/score"),
    o = require("scripts/message"),
    u = require("scripts/state"),
    a = require("scripts/object/lose"),
    f = require("scripts/object/game-over"),
    l = require("scripts/object/knife"),
    c = require("scripts/object/background"),
    h = require("scripts/object/light"),
    p = 0,
    d = n.randomNumber,
    v = 2,
    m = 5,
    g = [],
    y,
    b,
    w,
    E = function() {
        if (g.length >= v) return;
        var e = d(640),
        t = d(640),
        n = 600,
        r = i.create(e, n).shotOut(0, t);
        g.push(r),
        b.play(),
        E()
    };
    e.start = function() {
        b = r.create("audio/throw"),
        w = r.create("audio/boom"),
        t.setTimeout(function() {
            u("game-state").set("playing"),
            y = t.setInterval(E, 1e3)
        },
        500)
    },
    e.gameOver = function() {
        u("game-state").set("over"),
        y.stop(),
        f.show(),
        p = 0,
        v = 2,
        g.length = 0
    },
    e.applyScore = function(e) {
        e > v * m && (v++, m += 50)
    },
    e.sliceAt = function(e, t) {
        var n;
        if (u("game-state").isnot("playing")) return;
        e.type != "boom" ? (e.broken(t), (n = g.indexOf(e)) && g.splice(n, 1), s.number(++p), this.applyScore(p)) : (w.play(), this.pauseAllFruit(), c.wobble(), h.start(e))
    },
    e.pauseAllFruit = function() {
        y.stop(),
        l.pause(),
        g.invoke("pause")
    },
    o.addEventListener("fruit.remove",
    function(e) {
        var t; (t = g.indexOf(e)) > -1 && g.splice(t, 1)
    });
    var S = function(e) {
        e.type != "boom" && a.showLoseAt(e.originX)
    };
    return u("game-state").hook(function(e) {
        e == "playing" ? o.addEventListener("fruit.fallOutOfViewer", S) : o.removeEventListener("fruit.fallOutOfViewer", S)
    }),
    o.addEventListener("game.over",
    function() {
        e.gameOver(),
        l.switchOn()
    }),
    o.addEventListener("overWhiteLight.show",
    function() {
        l.endAll();
        for (var e = g.length - 1; e >= 0; e--) g[e].remove();
        c.stop()
    }),
    o.addEventListener("click",
    function() {
        u("click-enable").off(),
        f.hide(),
        o.postMessage("home-menu", "sence.switchSence")
    }),
    e
}),
define("scripts/object/game-over.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/lib/tween"),
    r = require("scripts/timeline"),
    i = require("scripts/message"),
    s = require("scripts/state"),
    o = n.exponential.co;
    return e.anims = [],
    e.set = function() {
        this.image = t.createImage("default", "images/game-over.png", 75, 198, 490, 85).hide().scale(1e-5, 1e-5)
    },
    e.show = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [1e-5, 1, "show"],
            object: this,
            onTimeUpdate: this.onZooming,
            onTimeStart: this.onZoomStart,
            onTimeEnd: this.onZoomEnd,
            recycle: this.anims
        })
    },
    e.hide = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [1, 1e-5, "hide"],
            object: this,
            onTimeUpdate: this.onZooming,
            onTimeStart: this.onZoomStart,
            onTimeEnd: this.onZoomEnd,
            recycle: this.anims
        })
    },
    e.onZoomStart = function(e, t, n) {
        n == "show" && this.image.show()
    },
    e.onZooming = function(e, t, n, r) {
        this.image.scale(r = o(e, t, n - t, 500), r)
    },
    e.onZoomEnd = function(e, t, n) {
        n == "show" ? s("click-enable").on() : n === "hide" && this.image.hide()
    },
    e
}),
define("scripts/object/knife.js",
function(e) {
    function p(e) {
        this.sx = e.sx,
        this.sy = e.sy,
        this.ex = e.ex,
        this.ey = e.ey,
        h.push(this)
    }
    var t = require("scripts/timeline"),
    n = require("scripts/layer").getLayer("knife"),
    r = require("scripts/lib/ucren"),
    i = null,
    s = null,
    o = Math.abs,
    u = 200,
    a = 10,
    f = "#cbd3db",
    l = [],
    c = !0,
    h = [];
    return p.prototype.set = function() {
        var e, r, i, s, c, h, p, d;
        return e = this.sx,
        r = this.sy,
        i = this.ex,
        s = this.ey,
        c = e - i,
        h = r - s,
        p = o(c),
        d = o(h),
        p > d ? (e += c < 0 ? -1 : 1, r += h < 0 ? -(1 * d / p) : 1 * d / p) : (e += c < 0 ? -(1 * p / d) : 1 * p / d, r += h < 0 ? -1 : 1),
        this.line = n.path("M" + e + "," + r + "L" + i + "," + s).attr({
            stroke: f,
            "stroke-width": a + "px"
        }),
        t.createTask({
            start: 0,
            duration: u,
            object: this,
            onTimeUpdate: this.update,
            onTimeEnd: this.end,
            recycle: l
        }),
        this
    },
    p.prototype.update = function(e) {
        this.line.attr("stroke-width", a * (1 - e / u) + "px")
    },
    p.prototype.end = function() {
        this.line.remove();
        var e; (e = h.indexOf(this)) && h.splice(e, 1)
    },
    e.newKnife = function() {
        i = s = null
    },
    e.through = function(e, t) {
        if (!c) return;
        var n = null;
        return i !== null && (i != e || s != t) && ((new p({
            sx: i,
            sy: s,
            ex: e,
            ey: t
        })).set(), n = [i, s, e, t]),
        i = e,
        s = t,
        n
    },
    e.pause = function() {
        l.clear(),
        this.switchOff()
    },
    e.switchOff = function() {
        c = !1
    },
    e.switchOn = function() {
        c = !0,
        this.endAll()
    },
    e.endAll = function() {
        for (var e = h.length - 1; e >= 0; e--) h[e].end()
    },
    e
}),
define("scripts/object/light.js",
function(e) {
    function d(e, n, r) {
        var i, s, c, h, p, d;
        i = r * 36 + o(10),
        s = i + 5,
        i = u * i / 180,
        s = u * s / 180,
        c = e + 640 * f(i),
        h = n + 640 * a(i),
        p = e + 640 * f(s),
        d = n + 640 * a(s);
        var v = t.path(["M", e, n, "L", c, h, "L", p, d, "Z"]).attr({
            stroke: "none",
            fill: "#fff"
        });
        l.push(v)
    }
    var t = require("scripts/layer"),
    n = t.getLayer("mask");
    t = t.getLayer("light");
    var r = require("scripts/lib/ucren"),
    i = require("scripts/timeline"),
    s = require("scripts/message"),
    o = r.randomNumber,
    u = Math.PI,
    a = Math.sin,
    f = Math.cos,
    l = [],
    c = [],
    h = 10;
    for (var p = 0; p < h; p++) c[p] = p;
    return e.start = function(e) {
        var t = e.originX,
        n = e.originY,
        r = 0,
        s = c.random(),
        o = h,
        u = function() {
            d(t, n, s[this])
        };
        while (o--) i.setTimeout(u.bind(o), r += 100);
        i.setTimeout(function() {
            this.overWhiteLight()
        }.bind(this), r + 100)
    },
    e.overWhiteLight = function() {
        s.postMessage("overWhiteLight.show"),
        this.removeLights();
        var e = 4e3,
        t = n.rect(0, 0, 640, 480).attr({
            fill: "#fff",
            stroke: "none"
        }),
        r = {
            onTimeUpdate: function(n) {
                t.attr("opacity", 1 - n / e)
            },
            onTimeEnd: function() {
                t.remove(),
                s.postMessage("game.over")
            }
        };
        i.createTask({
            start: 0,
            duration: e,
            object: r,
            onTimeUpdate: r.onTimeUpdate,
            onTimeEnd: r.onTimeEnd
        })
    },
    e.removeLights = function() {
        for (var e = 0,
        t = l.length; e < t; e++) l[e].remove();
        l.length = 0
    },
    e
}),
define("scripts/object/developing.js",
function(e) {
    var t = require("scripts/layer"),
    n = require("scripts/lib/tween"),
    r = require("scripts/timeline"),
    i = require("scripts/message"),
    s = n.exponential.co;
    return e.anims = [],
    e.set = function() {
        this.image = t.createImage("default", "images/developing.png", 103, 218, 429, 53).hide().scale(1e-5, 1e-5)
    },
    e.show = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [1e-5, 1, "show"],
            object: this,
            onTimeUpdate: this.onZooming,
            onTimeStart: this.onZoomStart,
            onTimeEnd: this.onZoomEnd,
            recycle: this.anims
        }),
        this.hide(2e3)
    },
    e.hide = function(e) {
        r.createTask({
            start: e,
            duration: 500,
            data: [1, 1e-5, "hide"],
            object: this,
            onTimeUpdate: this.onZooming,
            onTimeStart: this.onZoomStart,
            onTimeEnd: this.onZoomEnd,
            recycle: this.anims
        })
    },
    e.onZoomStart = function() {
        this.image.show()
    },
    e.onZooming = function(e, t, n, r) {
        this.image.scale(r = s(e, t, n - t, 500), r)
    },
    e.onZoomEnd = function(e, t, n) {
        n === "hide" && this.image.hide()
    },
    e
}),
define("scripts/control.js",
function(e) {
    var t = require("scripts/lib/ucren"),
    n = require("scripts/object/knife"),
    r = require("scripts/message"),
    i = require("scripts/state"),
    s,
    o;
    return s = o = 0,
    e.init = function() {
        this.fixCanvasPos(),
        this.installDragger(),
        this.installClicker()
    },
    e.installDragger = function() {
        var e = new t.BasicDrag({
            type: "calc"
        });
        e.on("returnValue",
        function(e, t, i, u, a) { (a = n.through(i - s, u - o)) && r.postMessage(a, "slice")
        }),
        e.on("startDrag",
        function() {
            n.newKnife()
        }),
        e.bind(document.documentElement)
    },
    e.installClicker = function() {
        t.addEvent(document, "click",
        function() {
            i("click-enable").ison() && r.postMessage("click")
        })
    },
    e.fixCanvasPos = function() {
        var e = document.documentElement,
        n = function(t) {
            s = (e.clientWidth - 640) / 2,
            o = (e.clientHeight - 480) / 2 - 40
        };
        n(),
        t.addEvent(window, "resize", n)
    },
    e
}),
define("scripts/object/console.js",
function(e) {
    var t = require("scripts/layer"),
    n = 16,
    r = 0,
    i = [];
    return e.set = function() {},
    e.clear = function() {
        for (var e = 0,
        t = i.length; e < t; e++) i[e].remove();
        i.length = r = 0
    },
    e.log = function(e) {
        r += 20,
        i.push(t.createText("default", e, n, r))
    },
    e
}),
define("scripts/collide.js",
function(e) {
    function i(e) {
        return e * e
    }
    function s(e) {
        return e < 0 ? -1 : e > 0 ? 1 : 0
    }
    function o(e, t, n) {
        if (e == 0) return;
        var r = t * t - 4 * e * n;
        if (r == 0) return [ - 1 * t / (2 * e), -1 * t / (2 * e)];
        if (r > 0) return [( - 1 * t + Math.sqrt(r)) / (2 * e), ( - 1 * t - Math.sqrt(r)) / (2 * e)]
    }
    function u(e, t, n, r, u) {
        if (r <= 0) return;
        u = u === undefined ? 1 : u;
        var f = r,
        l = r * u,
        c;
        a = i(l) * i(e[0] - t[0]) + i(f) * i(e[1] - t[1]);
        if (a <= 0) return;
        b = 2 * i(l) * (t[0] - e[0]) * (e[0] - n[0]) + 2 * i(f) * (t[1] - e[1]) * (e[1] - n[1]),
        n = i(l) * i(e[0] - n[0]) + i(f) * i(e[1] - n[1]) - i(f) * i(l);
        if (! (c = o(a, b, n, f, l))) return;
        var h = [[e[0] + c[0] * (t[0] - e[0]), e[1] + c[0] * (t[1] - e[1])], [e[0] + c[1] * (t[0] - e[0]), e[1] + c[1] * (t[1] - e[1])]];
        return s(h[0][0] - e[0]) * s(h[0][0] - t[0]) <= 0 && s(h[0][1] - e[1]) * s(h[0][1] - t[1]) <= 0 || (h[0] = null),
        s(h[1][0] - e[0]) * s(h[1][0] - t[0]) <= 0 && s(h[1][1] - e[1]) * s(h[1][1] - t[1]) <= 0 || (h[1] = null),
        h
    }
    function f(e, t, n, r, i) {
        var s = u(e, t, n, r, i);
        return s && (s[0] || s[1])
    }
    var t = require("scripts/factory/fruit"),
    n = require("scripts/lib/ucren"),
    r = t.getFruitInView();
    return e.check = function(e) {
        var t = [],
        n = 0;
        return r.forEach(function(r) {
            var i = f(e.slice(0, 2), e.slice(2, 4), [r.originX, r.originY], r.radius);
            i && (t[n++] = r)
        }),
        t
    },
    e
}),
define("scripts/main.js",
function(e) {
    var t = require("scripts/timeline"),
    n = require("scripts/tools"),
    r = require("scripts/sence"),
    i = require("scripts/lib/ucren"),
    s = require("scripts/lib/buzz"),
    o = require("scripts/control"),
    u = require("scripts/object/console"),
    a = require("scripts/message"),
    f = require("scripts/state"),
    l = require("scripts/game"),
    c = require("scripts/collide"),
    h = t.setTimeout.bind(t),
    p = function() {
        var e = 1e3,
        t = 300,
        n;
        return n = function(n) {
            h(function() {
                u.log(n)
            },
            e),
            e += t
        },
        n.clear = function() {
            h(u.clear.bind(u), e),
            e += t
        },
        n
    } ();
    e.start = function() { [t, r, o].invoke("init"),
        p("正在加载鼠标控制脚本"),
        p("正在加载图像资源"),
        p("正在加载游戏脚本"),
        p("正在加载剧情"),
        p("正在初始化"),
        p("正在启动游戏..."),
        p.clear(),
        h(r.switchSence.saturate(r, "home-menu"), 3e3)
    },
    a.addEventListener("slice",
    function(e) {
        var t = c.check(e),
        r;
        t.length && (r = n.getAngleByRadian(n.pointToRadian(e.slice(0, 2), e.slice(2, 4))), t.forEach(function(e) {
            a.postMessage(e, r, "slice.at")
        }))
    }),
    a.addEventListener("slice.at",
    function(e, t) {
        if (f("sence-state").isnot("ready")) return;
        if (f("sence-name").is("game-body")) {
            l.sliceAt(e, t);
            return
        }
        if (f("sence-name").is("home-menu")) {
            e.broken(t);
            if (e.isHomeMenu) switch (1) {
            case e.isDojoIcon:
                r.switchSence("dojo-body");
                break;
            case e.isNewGameIcon:
                r.switchSence("game-body");
                break;
            case e.isQuitIcon:
                r.switchSence("quit-body")
            }
            return
        }
    });
    var d = "";
    return i.isChrome || (d = "$为了获得最佳流畅度，推荐您使用 <span class='b'>Google Chrome</span> 体验本游戏"),
    s.isSupported() || (d = d.replace("$", "您的浏览器不支持 &lt;audio&gt 播放声效，且")),
    d = d.replace("$", ""),
    i.Element("browser").html(d),
    e
}),
startModule("scripts/main")