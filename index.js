var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var config = require('./config/config.js');
// var url = "http://zhushou.360.cn/list/index/cid/101587/order/download/?page=1";
//初始url

var agent = new http.Agent({
  maxSockets: 200
});

function fetchPage(hostname, path1, classification, path2) { //封装了一层函数
  var page = 50;
  var pageOffset = 1;
  while (pageOffset <= page) {
    startRequest(hostname, path1, classification, path2, pageOffset.toString());
    pageOffset++;
  }

}


function startRequest(hostname, path1, classification, path2, pageOffset) {
  //采用http模块向服务器发起一次get请求
  var req = http.request({
    hostname: hostname,
    path: path1 + classification + path2 + pageOffset,
    method: 'GET',
    agent: agent
  }, function(res) {
    var html = ''; //用来存储请求网页的整个html内容
    // var titles = [];
    res.setEncoding('utf-8'); //防止中文乱码
    //监听data事件，每次取一块数据
    res.on('data', function(chunk) {
      html += chunk;
    });
    //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
    res.on('end', function() {
      var $ = cheerio.load(html); //采用cheerio模块解析html

      var sids = [];
      var gameOffset = 0;
      $('ul[id=iconList]').children().each(function(i, elem) {
        sids[gameOffset++] = $(this).children().first().attr('sid');
      });
      // console.log(sids);

      // http://zhushou.360.cn/detail/index/soft_id/3263720
      for (var i = 0; i < sids.length; i++) {
        var req_game = http.request({
          hostname: hostname,
          path: config.path_3 + sids[i].toString(),
          method: 'GET',
          agent: agent
        }, function(res) {
          var game_html = '';
          res.setEncoding('utf-8');
          res.on('data', function(chunk) {
            game_html += chunk;
          });
          res.on('end', function() {
            var $$ = cheerio.load(game_html);
            var game_name = replaceEnter($$("h2[id=app-name]").children().first().text());
            var game_download_count = $$("h2[id=app-name]").parent().children().eq(1).children().eq(2).text();
            var game_size = $$("h2[id=app-name]").parent().children().eq(1).children().eq(3).text();
            var game_download_href_1 = $$("h2[id=app-name]").parent().children().eq(3).attr('href');
            var game_download_href_2 = $$("h2[id=app-name]").parent().children().eq(2).attr('href');
            var game_apk_name;
            if (game_download_href_1) {
              var hrefTemp = game_download_href_1.toString().split("/");
              game_apk_name = hrefTemp[hrefTemp.length - 1];
            } else {
              // game_apk_name = sids[i].toString();
              var hrefTemp = game_download_href_2.toString().split("/");
              game_apk_name = hrefTemp[hrefTemp.length - 1];
            }
            var game_tags = [];
            $$('.app-tags').children().each(function(i, elem) {
              game_tags[i] = replaceEnter($$(this).text());
            })
            var game_tag_string = game_tags.join(config.space);

            var data = game_name + config.space + game_download_count + config.space + game_size + config.space + game_apk_name + config.space + game_tag_string + '\n';
            fs.appendFile(config.save_path + config.cid_classification[classification], data, function(err) {
              if (err) throw err;
              console.log('The data was appended to file!');
            });
          });
        }).on('error', function(err) {
          console.log(err);
        });
        req_game.end();
      };
    });

  }).on('error', function(err) {
    console.log(err);
  });
  req.end();

}

function replaceEnter(str) {
  return str.replace(/[\r\n\s]/g, '');
}

function start() {
  console.log("start");
  // fetchPage(config.hostname, config.path_1, "101587", config.path_2);
  // fetchPage(config.hostname, config.path_1, "19", config.path_2);
  // fetchPage(config.hostname, config.path_1, "20", config.path_2);
  // fetchPage(config.hostname, config.path_1, "100451", config.path_2);
  // fetchPage(config.hostname, config.path_1, "51", config.path_2);
  fetchPage(config.hostname, config.path_1, "52", config.path_2);
  // fetchPage(config.hostname, config.path_1, "53", config.path_2);
  // fetchPage(config.hostname, config.path_1, "54", config.path_2);
  // fetchPage(config.hostname, config.path_1, "102238", config.path_2);
}

start();