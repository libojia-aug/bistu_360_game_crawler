var fs = require("fs");
var config = require('./config/config.js');

function readAndCount(path, fileName, cb) {
	var count = 0;
	fs.readFile(path + fileName, 'utf-8', function(err, data) {
		if (err) {
			// console.log(data);
			return cb(err, null, null);
		} else {
			var lines = data.split('\n');
			for (var i = 0; i < lines.length - 1; i++) {
				var lineArr = lines[i].split(config.space);
				var arr = lineArr[1].split(config.colon);
				if (arr[1].indexOf("万次") > 0) {
					count += parseInt(arr[1].substring(0, arr[1].length - 2)) * 10000;
				} else {
					count += parseInt(arr[1].substring(0, arr[1].length - 1));
				}
			}
			return cb(null, fileName, count);
		}
	})
}

function readDirFile(readdir){
	fs.readdir(readdir, function(err, files) {
		if (err) {
			console.log(err);
		}
		for (var i = 0; i < files.length; i++) {
			readAndCount(readdir, files[i], function(err, fileName, count) {
				if (err) {
					console.log("err: " + err);
				} else {
					console.log(fileName + " count: " + count);
				}

			});
		}
	})
}
function start() {
	// readDirFile('./data1024/');
	readDirFile('./data1202/');
}

start();