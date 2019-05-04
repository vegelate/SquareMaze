
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 全局游戏信息
var GameInfo = cc.Class({
    extends: cc.Component,
    statics:{
        instance: null
    },

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("GameInfo onLoad:", this)

        let self = this;
        if (!GameInfo.instance){
            GameInfo.instance = this;
            cc.game.addPersistRootNode(this.node)

            self.AP = 10;  // 体力值
            self.levelIndex = 1;    // 当前进行的关卡
            self.levelStars = {};   // 每关的通关成绩            
        }else{
            cc.log("already have game info, destroy!")
            self.node.destroy()
        }

    },

    onLevelWin(stars){
        let self = this
        self.levelStars[self.levelIndex] = stars
    },

    loadUserData(){

        wx.getFriendCloudStorage()
    },

    saveUserData(){
        let KVDataList = new Array();

        wx.setUserCloudStroage(Object)
    },

    start () {

    },

    // update (dt) {},
});

module.exports = GameInfo;

