
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var levelConfig = [
    {   
        id: 0, // 用来占位，保证下标与 id 一致
        path: null,
    },
    {
        id: 1,
        path : "map/1",
    },

    {
        id: 2,
        path : "map/2_test",
    },

    {
        id: 3,
        path : "map/3",
    },
];


module.exports = levelConfig;
