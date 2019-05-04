// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var GamePlayUI = cc.Class({
    extends: cc.Component,
    statics:{
        instance: null
    },

    properties: {
        pausePanel:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.instance = this
        this.pausePanel.active = false
    },

    onDestroy(){
        this.instance = null
    },

    start () {

    },

    onPauseButtonClick(event){
        //cc.director.loadScene('levelSelect')
        this.pausePanel.active = true
    },

    onHomeButtonClick(event){

    },

    onSoundButtonClick(event){

    },

    onLevelSelectButtonClick(event){
        cc.director.loadScene('levelSelect')
    },

    onReplayButtonClick(event){
        cc.director.loadScene('game')
    },

    onContinueButtonClick(event){   
        this.pausePanel.active = false

    },



    // update (dt) {},
});

module.exports = GamePlayUI
