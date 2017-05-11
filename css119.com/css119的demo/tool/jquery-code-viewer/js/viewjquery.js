(function(){

var jQuery, $;

jQuery = $ = this.jQuery;
    
this.app = new (jQuery.extend(
    
    function() {
        
        this.curTheme = 'kwrite';
        
        this.curState;
        this.version;
        this.fn;
        this.pre;
        this.shStyle;
        this.sourceWrap;
        this.loader;
        
        this.updateState();
        
        this.versions = {};
        this.iframes = {};
        
        $(jQuery.proxy(function(){
            
            this.pre = $('#source').click(function(e){
                var anchor = $(e.target).closest('a')[0];
                if ( anchor ) {
                    
                }
            });
            
            this.shStyle = $('#sh-style');
            this.sourceWrap = $('#source-wrap');
            this.loader = $('<span class="status"/>').appendTo('#status');
            
            this.setupFunctionFinder();
            this.setupThemeSwitcher();
            this.highlight();
            
            $(window).bind('hashchange', jQuery.proxy(function(){
                if (this.updateState()) {
                    this.loadVersion(this.getFn);
                } else {
                    this.loadVersion(function(j){
                        this.loader.html(j.fn.jquery + ' loaded');
                    });
                    this.pre.html(
                        'Type a jQuery function/method into the box above! E.g. "<a href="#v='+this.version+'&fn=css">css</a>"'
                    );
                }
            }, this)).trigger('hashchange');
        
        }, this));
        
    },
    
    {
        prototype: {
            
            updateState: function() {
                this.curState = jQuery.bbq.getState();
                this.version = this.curState.v || '1.6.2';
                this.fn = this.curState.fn;
                return !!this.fn;
            },
            
            log: function() {
                window.console && console.log && console.log.apply(console, arguments);
            },
            
            loadVersion: function(callback) {
				
				this.isGit = this.version === 'git';
                
                window.jq_eval = null;
                
                this.log('Loading version ' + this.version);
                this.loader.html('Loading version ' + this.version + '...');
                
                this.fnInput.val( this.fn );
                
                if (this.versions[this.version]) {
                    return callback.call(this, this.versions[this.version]);
                }
                
                var slf = this,
                    head = document.getElementsByTagName('head')[0],
                    script = $('<script/>', {
                        src: this.isGit ? 
							'jqs/' + 'git.js' :
							'jqs/' + 'jquery-' + this.version + '.js'
                    })[0],
                    done = false;
                
                script.onload = script.onreadystatechange = function() {
                    
                    if ( !done && (!this.readyState ||
                        this.readyState === "loaded" || this.readyState === "complete") ) {
                        
                        slf.log('Script (%v) loaded', slf.version);
                        
                        done  = true;
                        
                        window.jQuery._eval = window.jq_eval;
                        
                        slf.fillMethods( window.jQuery );
                        
                        callback && callback.call(slf,
                            slf.versions[slf.version] = window.jQuery
                        );
                    
                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }
                        
                    }
                };
                
                head.appendChild(script);
                
            },
            
            getFn: function() {
                
                var _jQuery = this.versions[this.version],
                    fn = this.fn;
					
				this.loader.html(_jQuery.fn.jquery + ' loaded');
                    
                this.log('Getting fn (%f)', this.fn);
                
                this.cleanFn = this.cleanName(fn);
                
                return this.code(
                    (
                        /^(?:_|jQuery\.)/.test(fn) ?
                            _jQuery._eval && _jQuery._eval(fn.replace(/^_/,''))
                            : _jQuery.fn[fn]
                    )
                    || (
                        fn in _jQuery ? _jQuery[fn] : _jQuery._eval && _jQuery._eval(fn)
                    )
                );
                
            },
            
            cleanName: function(name) {
                
                var _jQuery = this.versions[this.version];
                
                if (/^_/.test(name)) {
                    return name.substring(1) + ' [internal]';
                }
                
                if (/^jQuery./.test(name)) {
                    return name;
                }
                
                if (name in _jQuery.fn) {
                    return 'jQuery.fn.' + name;
                }
                
                if (name in _jQuery) {
                    return 'jQuery.' + name;
                }
                
                return name;
                
            },
            
            stringify: function(c) {
                return jQuery.isPlainObject(c)
                    && window.JSON && JSON.stringify
                    && JSON.stringify(c) || c.toString();
            },
            
            code: function(code) {
                
                var v = this.version,
                    _jQuery = this.versions[v],
                    oCurlies = /(\n|^)(\s+).+?{(?!\s*?(?:}|\n))/g,
                    cCurlies = /(\n|^)(\s+)(.*?[;}])}/g,
                    m,
                    slf = this,
                    excludeFromVarRun = {
                        'true':1, 'false':1, 'null':1, 'nbsp':1, 'this':1, 'arguments':1
                    },
                    replacements = [];
                
                if (!code) {
                    this.pre.html('I can\'t find that one, sorry!');
                    return;
                }
                
                code = entitify(js_beautify(
                        this.stringify(code),
                        {
                            indent_size: 4,
                            indent_char: ' ',
                            preserve_newlines: true,
                            space_after_anon_function: true
                        }
                    ))
                
                    .replace(/\n/g, '<br/>')
                    .replace(/\s/g, '&nbsp;')
                    
                    // Replace fns with links
                    .replace(/(\WjQuery\.)((\w+?))(?=\()/g, function($0, $1, $2, $3){
                        
                        return $3 in _jQuery ?
                            '|||' + (replacements.push(
                                $1 + '<a href="#v=' + v + '&fn=jQuery.' + $2 + '">' + $2 + '</a>'
                            ) - 1) + '|||'
                            : $0;
                    })
                    .replace(/(this\.|jQuery\.fn\.|\)\.)(\w+?)(?=\)?\()/g, function($0, $1, $2){
                        return $2 in _jQuery.fn ?
                            '|||' + (replacements.push(
                                $1 + '<a href="#v=' + v + '&fn=' + $2 + '">' + $2 + '</a>'
                            ) - 1) + '|||'
                            : $0;
                    })
                    // Replace any vars with links
                    .replace(/([^\w\.])([a-z_]\w*?)(?=\W)/gi, function($0, $1, $2){ // s/$/(?=\()
                        
                        var jqEvaled = _jQuery._eval && _jQuery._eval($2);
                        
                        return !($2 in window) && !($2 in excludeFromVarRun) && jqEvaled ?
                            '|||' + (replacements.push(
                                $1 + '<a title="' +
                                    (
                                        // Produce title if not a function (regex, numbers, strings etc.)
                                        jQuery.isFunction(jqEvaled) ?
                                        '' :
                                        entitify(
                                            slf.stringify(jqEvaled).replace(/\n/g,'').substring(0,50)
                                        )
                                    )
                                + '" href="#v=' + v + '&amp;fn=_' + $2 + '">' + $2 + '</a>'
                            ) - 1) + '|||'
                            : $0;
                        
                    })
                    .replace(/jQuery\(/g, '<a href="#v=' + v + '&fn=jQuery">jQuery</a>(')
                    // Lastly, actually replace our |||n||| anchors with real replacements (<A/>)
                    .replace(/\|{3}(\d+?)\|{3}/g, function($0, n){
                        return replacements[n];
                    });
                
                setTimeout(function(){
                    slf.loader.text(
						'Showing `' + slf.cleanFn + '` from ' + _jQuery.fn.jquery
					);
                }, 300);
                
                this.pre.html(code);
                this.highlight();
                
            },
            
            highlight: function(theme) {
                
                theme = theme || this.curTheme;
                
                this.shStyle.attr('href', 'themes/sh_' + theme + '.min.css');
                sh_highlightDocument();
                
            },
            
            setupThemeSwitcher: function() {
                
                this.log('Setting up theme switcher');
                
                var themes = [
                        'acid', 'berries', 'bipolar', 'blacknblue', 'bright',
                        'darkblue', 'darkness', 'desert', 'dull', 'easter',
                        'emacs', 'golden', 'greenlcd', 'navy', 'neon', 'vim',
                        'night', 'nedit', 'matlab', 'print', 'vampire',
                        'kwrite', 'ide-codewarrior'
                        
                    ],
                    slf = this,
                    select = $('<select/>', {
                        html: $(
                            '<option>' + themes.join('</option><option>') + '</option>'
                        ),
                        change: function() {
                            slf.highlight(slf.curTheme = this.value);
                        }
                    }).appendTo('<span id="theme-switcher"/>')
					.parent().appendTo('#status');
                
                select.find('option').each(function(){
                    this.selected = $(this).val() === slf.curTheme;
                });
                
            },
            
            methods: [],
            fillMethods: function(jQ) {
                
                var i, v = jQ.fn.jquery, methods = this.methods, c = 0, length = methods.length;
                
                for (i in jQ) {
                    if (typeof jQ[i] === 'function') {
                        methods[c++] = 'jQuery.' + i;
                    }
                }
                
                for (i in jQ.fn) {
                    if (typeof jQ.fn[i] === 'function') {
                        methods[c++] = 'jQuery.fn.' + i;
                    }
                }
                
                methods.splice(c);
                
            },
            
            setupFunctionFinder: function() {
                
                var slf = this,
                    timer,
                    vSelect = this.vSelect = $('<select/>'),
                    fnInput = this.fnInput = $('<input/>', {
                        value: this.fn,
                        keyup: function() {
                            clearTimeout(timer);
                            timer = setTimeout(function(){
                                form.trigger('submit');
                            }, 500);
                        }
                    }),
                    form = this.fnForm = $('<form/>', {
                        id: 'fn-finder',
                        html: [
                            vSelect[0],
                            fnInput[0]
                        ],
                        submit: function() {
                            
                            var v = slf.version = vSelect.val(),
                                fn = $.trim(fnInput.val());
                                
                            if (v) {
                                window.location.hash = 'v=' + v + '&fn=' + fn;
                            }
                            
                            return false;
                        }
                    }).insertAfter('h3');
					
				vSelect.html([
					'<option>1.2.6</option>',
					'<option>1.3.2</option>',
					'<option>1.4.1</option>',
					'<option>1.4.2</option>',
					'<option>1.4.3</option>',
					'<option>1.5</option>',
					'<option>1.5.0</option>',
					'<option>1.6.0</option>',
					'<option>1.6.1</option>',
					'<option selected="selected">1.6.2</option>',
					'<option value="git">Git (latest)</option>'
                ].join(''));
				
				vSelect.change(function() {
                    form.trigger('submit');
				});
                    
                vSelect.find('option').each(function(){
                    this.selected = $(this).val() === slf.version;
                });
                
                fnInput.autoSuggest({
                    list: this.methods,
                    attrs: {
                        className: 'methods'
                    }
                });
                
            }
            
        }
    }
    
));

$.fn.autoSuggest = (function(){
    
    var doc = $(document);
    
    function _suggest(val, list, suggestBox) {
        
        var arr = [];
        
        if (val) {
        
            $.each(list, function(i, m){
                if (m.replace(/^.+?\./).toLowerCase().indexOf( val.toLowerCase() ) > -1) {
                    arr.push(m);
                }
            });
            
            arr = arr.slice(0,10).sort(function(a,b){
                var aI = a.toLowerCase().indexOf( val.toLowerCase() ),
                    bI = b.toLowerCase().indexOf( val.toLowerCase() );
                return a.charAt(aI-1) === '.' ? -1 : aI < bI ? -1 : 1;
            });
            
        } else  {
            
            arr = list.slice().sort(function(a,b){
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            }).slice(0,10);
            
        }
        
        if (arr.length) {
            suggestBox.html(
                '<span>' +
                arr.join('</span><span>')
                + '</span>'
            ).show();
        } else {
            suggestBox.empty().hide();
        }
        
    }
    
    return function(o) {
        
        o = $.extend({
            list: {},
            attrs: {}
        }, o);
    
        return this.each(function(){
            
            var input = $(this),
                form = input.closest('form'),
                pos = input.position(),
                box = $('<div/>', o.attrs).hide().css({
                    left: pos.left,
                    top: pos.top + input.outerHeight() - 1,
                    cursor: 'default'
                }).insertAfter(input),
                historyVal = '',
                val = input.val(),
                suggest = function() {
                    return _suggest(input.val(), o.list, box);
                },
                select = function(span, fillInput) {
                    
                    span = $(span);
                    
                    box.find('span').removeClass('selected');
                    
                    if (span[0]) {
                       span.addClass('selected');
                       fillInput && input.val(span.text());
                    }
                    
                };
        
            doc.bind('keydown.autoSuggest', function(e){
                
                var active = box.find('.selected');
                    
                if ( /38|40/.test(e.keyCode) ) {
                    if (active[0]) {
                        if ( !active.prev('span')[0] && e.keyCode === 38 ) {
                            select();
                            input.val( historyVal );
                        } else {
                            select(
                                active[e.keyCode === 38 ? 'prev' : 'next']()
                            );
                        }
                    } else if (document.activeElement === input[0]) {
                        historyVal = input.val();
                        if ( !box.is(':hidden') ) {
                            suggest();
                        }
                        select(
                            box.children('span:first')
                        );
                    }
                }
                
                if ( e.keyCode === 13 && active[0] ) {
                    input.val( active.text() );
                    form.submit();
                }
                
            });
            
            box.delegate('span', 'mousedown', function(){
                input.val( $(this).text() );
                form.submit();
                box.empty().hide();
                return false;
            });
            
            box.delegate('span', 'mouseover', function(){
                select(this);
            });
            
            box.delegate('span', 'mouseout', function(){
                $(this).removeClass('selected');
            });
            
            input.attr('autocomplete', 'off');
            
            input.bind({
                focus: function() {
                    suggest();
                },
                blur: function() {
                    box.empty().hide();
                },
                keyup: function() {
                    if (val !== (val=input.val())) {
                        suggest();
                    }
                }
            });
            
        });
        
    };
    
})();

function entitify(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

})();