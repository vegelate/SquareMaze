// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameInfo = require('GameInfo')
var LevelConfig = require('LevelConfig')

var GamePlayUI = cc.Class({
    extends: cc.Component,
    statics:{
        instance: null
    },

    properties: {
        pausePanel:{
            default:null,
            type:cc.Node,
        },
        winPanel:{
            default:null,
            type:cc.Node,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GamePlayUI.instance = this
        this.pausePanel.active = false
        this.winPanel.active = false
    },

    onDestroy(){
        GamePlayUI.instance = null
    },

    start () {

    },

    onPauseButtonClick(event){
        //cc.director.loadScene('levelSelect')
        this.pausePanel.active = true
    },

    win(stars){
        this.winPanel.active = true
    },

    // 主界面
    onHomeButtonClick(event){

    },

    // 声音
    onSoundButtonClick(event){

    },

    // 关卡选择
    onLevelSelectButtonClick(event){
        cc.director.loadScene('levelSelect')
    },

    // 重玩
    onReplayButtonClick(event){
        cc.director.loadScene('game')
    },

    // 继续
    onContinueButtonClick(event){   
        this.pausePanel.active = false

    },

    // 分享
    onShareButtonClick(event){

    },

    // 下一关
    onNextLevelButtonClick(event){
        if (!GameInfo.instance){
            cc.error("请从关卡选择启动！")
            return;
        }

        let nextIdx = GameInfo.instance.levelIndex + 1
        if (LevelConfig[nextIdx] != null){
            GameInfo.instance.levelIndex = nextIdx;
            cc.director.loadScene('game')
        }
        else{
            cc.error("没有下一关了!")
        }
    },


    // update (dt) {},
});

module.exports = GamePlayUI