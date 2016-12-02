//var url = "http://zhushou.360.cn/list/index/cid/101587/order/download/?page=1";
// http://zhushou.360.cn/detail/index/soft_id/3263720
var config = {
	hostname: "zhushou.360.cn",
	path_1: "/list/index/cid/",
	path_2: "/order/download/?page=",
	path_3: "/detail/index/soft_id/",
	cid_classification: {
		"101587": "角色扮演",
		"19": "休闲益智",
		"20": "动作冒险",
		"100451": "网络游戏",
		"51": "体育竞速",
		"52": "飞行射击",
		"53": "经营策略",
		"54": "棋牌天地",
		"102238": "儿童游戏"
	},
	space: " ",
	colon: "：",
	save_path: "./data1202/"
}
module.exports = config;