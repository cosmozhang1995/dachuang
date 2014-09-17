items = [
{
	title: "全家福",
	desc: "我们的全家福",
	img: "qjf.jpg",
	comments: [
		{
			user: "user1",
			content: "觉得很赞"
		},
		{
			user: "user2",
			content: "拍的很不错嘛！"
		}
	]
},
{
	title: "九寨沟",
	desc: "九寨沟之行",
	img: "jzg.jpg",
	comments: [
		{
			user: "user2",
			content: "拍的很不错嘛！"
		}
	]
},
{
	title: "小宝贝",
	desc: "侄女的小宝贝",
	img: "xbb.png",
	comments: [
		{
			user: "user3",
			content: "侄子好阔耐！"
		},
		{
			user: "user1",
			content: "觉得很赞"
		}
	]
}
];

users = [
{
	name: "user1",
	alias: "爸",
	portrait: "yy.png"
},
{
	name: "user2",
	alias: "大哥",
	portrait: "ss.png"
},
{
	name: "user3",
	alias: "儿子",
	portrait: "ez.png"
}
];

Element.prototype.removeAllChildNodes = function() {
	var childNodes = this.childNodes;
	for (var i = childNodes.length - 1; i >= 0; i--) {
		this.removeChild(childNodes[i]);
	}
}

function getUser(name) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].name === name) return users[i];
	}
	return null;
}

function parseAnchor() {
	var anchor = window.location.hash.replace('#', '');
	var anchorFields = anchor.split('.');
	if (anchorFields[0] === "view") {
		var idx = parseInt(anchorFields[1]);
		loadView(idx);
	} else if (anchorFields[0] === "upload") {
		loadUpload();
	} else {
		loadList();
	}
}

function loadList() {
	document.getElementById('list').style.display = "block";
	document.getElementById('view').style.display = "none";
	document.getElementById('upload').style.display = "none";
	document.getElementById('back-btn').style.display = "none";

	document.getElementById('page-title').innerHTML = "素材管理";

	document.getElementById('list-body').removeAllChildNodes();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		var listItem = document.createElement('a');
		listItem.className = "list-item";
		listItem.id = "item-" + i;
		listItem.href = "#view." + i;
		var thumbnail = document.createElement('img');
		thumbnail.className = "thumbnail";
		thumbnail.src = "img/" + item.img;
		var contentDiv = document.createElement('div');
		contentDiv.className = "content";
		var titleDiv = document.createElement('div');
		titleDiv.className = "title";
		titleDiv.innerHTML = item.title;
		var subtitleDiv = document.createElement('div');
		subtitleDiv.className = "subtitle";
		subtitleDiv.innerHTML = item.desc;

		contentDiv.appendChild(titleDiv);
		contentDiv.appendChild(subtitleDiv);
		listItem.appendChild(thumbnail);
		listItem.appendChild(contentDiv);
		document.getElementById('list-body').appendChild(listItem);
	}
}

function loadView(_idx) {
	document.getElementById('list').style.display = "none";
	document.getElementById('view').style.display = "block";
	document.getElementById('upload').style.display = "none";
	document.getElementById('back-btn').style.display = "inline-block";

	document.getElementById('page-title').innerHTML = "素材反馈";

	var item = items[_idx];
	if (item) {
		document.getElementById('view-preview').src = "img/" + item.img;
		document.getElementById('view-comment-list').removeAllChildNodes();
		for (var i = 0; i < item.comments.length; i++) {
			var comment = item.comments[i];
			var user = getUser(comment.user);

			var listItem = document.createElement('a');
			listItem.className = "list-item";
			listItem.id = "comment-" + i;
			listItem.href = "javacript:void(0);";
			var thumbnail = document.createElement('img');
			thumbnail.className = "thumbnail";
			thumbnail.src = "img/" + user.portrait;
			var contentDiv = document.createElement('div');
			contentDiv.className = "content";
			var titleDiv = document.createElement('div');
			titleDiv.className = "title";
			titleDiv.innerHTML = user.alias;
			var subtitleDiv = document.createElement('div');
			subtitleDiv.className = "desc";
			subtitleDiv.innerHTML = comment.content;

			contentDiv.appendChild(titleDiv);
			contentDiv.appendChild(subtitleDiv);
			listItem.appendChild(thumbnail);
			listItem.appendChild(contentDiv);
			document.getElementById('view-comment-list').appendChild(listItem);
		}
	}
}

function loadUpload() {
	document.getElementById('list').style.display = "none";
	document.getElementById('view').style.display = "none";
	document.getElementById('upload').style.display = "block";
	document.getElementById('back-btn').style.display = "inline-block";

	document.getElementById('page-title').innerHTML = "素材上传";

	document.getElementById('upload-preview').src = "img/" + "upload.png";
	document.getElementById('upload-input-title').value = "";
	document.getElementById('upload-input-subtitle').value = "";
	document.getElementById('upload-input-title').innerHTML = "";
	document.getElementById('upload-input-subtitle').innerHTML = "";
}

function selectUploadFile() {
	document.getElementById('upload-file-select').click();
}

document.getElementById('upload-file-select').onchange = function() {
	var defaultImageReader = new FileReader();
	defaultImageReader.onload = function (e) {
		var imgData = e.target.result;
		document.getElementById('upload-preview').src = imgData;
	}
	defaultImageReader.readAsDataURL(this.files[0]);
}

function progressFunction(e) {
  var prog = parseInt(parseFloat(e.loaded)/parseFloat(e.total)*100);
  var progBar = document.getElementById('prog-bar');
  progBar.style.width = prog+'%';
}
function uploadFile() {
	var form = new FormData();
	var file = document.getElementById('upload-file-select').files[0];
	form.append("file", file);
	form.append("title", document.getElementById('upload-input-title').value);
	form.append("desc", document.getElementById('upload-input-subtitle').value);
	var xhr = new XMLHttpRequest();
	var url = window.location.href;
	// url = "https://github.com/";
	xhr.open('post', url, true);
	xhr.onload = function() {
		document.getElementById('prog-bar-container').style.display = "none";
		document.getElementById('upload-btn').style.display = "block";
		if (xhr.readyState == 4 && xhr.status == 200) {
			alert('上传成功！');
			window.location.hash = "#list";
		} else {
			alert('上传失败：HTTP错误' + xhr.status);
		}
	}
	xhr.onerror = function() {
		alert('上传失败：HTTP错误');
	}
	xhr.upload.addEventListener("progress", progressFunction, false);
	xhr.send(form);
	document.getElementById('prog-bar-container').style.display = "block";
	document.getElementById('upload-btn').style.display = "none";
}

window.onhashchange = function() {
	parseAnchor();
}
parseAnchor();






