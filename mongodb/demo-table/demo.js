var body = $('body');
var container = $('#container');
var tbody = $('#tbody');
var limit;
var target = 'add';
// template
function template(tpl, data) {
	let content = $('#' + tpl).html();
	let tplStr = '';
	let quotes = '`';
	let arr = content.split('<%');
	tplStr += "let _getHtml = _data => {\n";
	tplStr += "let html='';\n";
	for (let i = 0, len = arr.length; i < len; i++) {
		let item = arr[i].replace(/^\s*/g, '');
		if (!item) {
			continue;
		}
		if (~item.indexOf('%>')) {
			let rightArr = item.split('%>'),
				rightArr0 = rightArr[0].replace(/this/g, '_data'),
				rightArr1 = rightArr[1];
			switch (item.substr(0, 1)) {
				case '=':
					tplStr += "html+=" + rightArr0.substr(1) + "\n";
					break;
				default:
					tplStr += ";" + rightArr0 + "\n";
			}
			tplStr += "html+=" + quotes + rightArr1 + quotes + "\n";
		} else {
			tplStr += "html+=" + quotes + item + quotes + "\n";
		}
	}
	tplStr += "return html;";
	tplStr += "}\n";
	tplStr += "return _getHtml(" + JSON.stringify(data) + ");";
	return new Function(tplStr)();
}


// ajaxFun
function ajaxFun(type, url, data, cbk) {
	$.ajax({
		type: type,
		dataType: 'json',
		url: 'http://127.0.0.1:8087/' + url,
		data: data || {},
		success: function(data) {
			cbk(data);
		},
		error: function(error) {
			console.dir(error)
		}
	});
}
// findAll
function findAll(skip, index) {
	index = index || 1;
	ajaxFun('GET', 'findAll', {
		"skip": skip
	}, function(data) {
		limit = data.limit;
		var html = template('tpl-user', {
			arr: data.arr,
			pages: data.pages,
			index: index,
			limit: limit
		});
		container.html(html);
	})
}
findAll();
// find
$('#findByName').on('input', function() {
	var name = $(this).val();
	if (!name.trim()) {
		findAll();
		return;
	}
	ajaxFun('GET', 'find', {
		"name": name
	}, function(data) {
		var html = template('tpl-user', {
			arr: data
		});
		container.html(html);
	})
});
// del
body.on('click', '.del', function() {
	var self = $(this);
	var tr = self.parents('tr');
	ajaxFun('GET', 'del', {
		"_id": tr.find('._id').html()
	}, function(data) {
		if (data.ok) {
			console.log('删除成功！');
			findAll();
		}
	})
});
// delAll
$('#delAll').on('click', function() {
	ajaxFun('GET', 'delAll', {}, function(data) {
		if (data.ok) {
			console.log('删除成功！');
			findAll();
		}
	})
});
// add
$('#btnAdd').on('click', function() {
	$('#addBox').show();
	target = 'add';
});
// update
body.on('click', '.update', function() {
	var self = $(this);
	target = 'update';
	var tr = self.parents('tr');
	var name = $('#inputName').val(tr.find('.name').html());
	var age = $('#inputAge').val(tr.find('.age').html());
	$('#addBox').show().attr('data-id', tr.find('._id').html());
})

body.on('click', '#sure', function() {
	var name = $('#inputName').val();
	var age = $('#inputAge').val();
	if (!name.trim() || !age.trim() || age.match(/\D/g)) {
		alert('不能为空，且age必须为数字！');
		return;
	}
	// add
	if (target == 'add') {
		ajaxFun('GET', 'add', {
			"name": name,
			"age": age
		}, function(data) {
			if (data._id) {
				console.log('add成功！');
				$('#addBox').hide().find('input').val('');
				findAll();
			}
		})
	}
	// update
	else {
		ajaxFun('GET', 'update', {
			"_id": $('#addBox').data('id'),
			"updateObj": JSON.stringify({
				"name": name,
				"age": age
			})
		}, function(data) {
			if (data.ok) {
				console.log('update成功！');
				$('#addBox').hide().find('input').val('');
				findAll();
			}
		})
	}
});

//page
body.on('click', '.num', function() {
	var self = $(this);
	var index = self.index();
	findAll(index * limit, index + 1);
})