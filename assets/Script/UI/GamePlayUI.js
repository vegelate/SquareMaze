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
var Helper = require ('Helper')

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
        starSpriteFrame:{
            default:null,
            type:cc.SpriteFrame,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GamePlayUI.instance = this
        this.pausePanel.active = false
        this.winPanel.active = false

        GameInfo.instance.setCommonTopBar(null)
    },

    onDestroy(){
        GamePlayUI.instance = null
    },

    start () {

    },

    win(stars, scores, apRecover){
        let self = this;

        this.winPanel.active = true

        // 设置星
        let frameRoot = self.winPanel.getChildByName('Frame')
        let starRoot = frameRoot.getChildByName('stars')

        for (let i=0; i<stars; i++){
            let sprite = starRoot.children[i].getComponent(cc.Sprite);
            sprite.spriteFrame = self.starSpriteFrame
           
            if (i>=2)
                break;
        }

        // 设置分数
        let scoreLabel = Helper.find(this.winPanel, "Frame/AddCoinPanel/Label").getComponent(cc.Label);
        scoreLabel.string = "+" +scores

        // 增加的体力
        let apLabel =  Helper.find(this.winPanel, "Frame/AddAPPanel/Label").getComponent(cc.Label);
        apLabel.string = "+" +apRecover
    },
    
    onPauseButtonClick(event){
        let self = this

        Helper.buttonClickEffect(Helper.find(self.node, 'PauseButton'), function(){
            self.pausePanel.active = true
        });
    },

    // 主界面
    onHomeButtonClick(event){
        let self = this;
        Helper.buttonClickEffect(Helper.find(self.pausePanel, 'HomeButton'), function(){
            cc.director.loadScene('main')
        });
    },

    // 声音
    onSoundButtonClick(event){

    },

    // 关卡选择
    onLevelSelectButtonClick(event){

        let self = this;

        if (self.pausePanel.active){
            Helper.buttonClickEffect(Helper.find(self.pausePanel, 'LevelSelectButton'), function(){
                cc.director.loadScene('levelSelect')
            }); 
        }
        else if (self.winPanel.active){
            Helper.buttonClickEffect(Helper.find(self.winPanel, 'Frame/bottom/settlement_button_001'), function(){
                cc.director.loadScene('levelSelect')
            }); 
        }



    },

    // 重玩
    onReplayButtonClick(event){
        let self = this;

        if (self.pausePanel.active){
            Helper.buttonClickEffect(Helper.find(self.pausePanel, 'ReplayButton'), function(){
                cc.director.loadScene('game')
            }); 
        }
        else if (self.winPanel.active){
            Helper.buttonClickEffect(Helper.find(self.winPanel, 'Frame/bottom/settlement_button_002'), function(){
                cc.director.loadScene('game')
            }); 
        }
    },

    // 继续
    onContinueButtonClick(event){   
        let self = this;
        Helper.buttonClickEffect(Helper.find(self.pausePanel, 'ContinueButton'), function(){
            self.pausePanel.active = false
        });
    },

    // 分享
    onShareButtonClick(event){

    },

    // 下一关
    onNextLevelButtonClick(event){
        let self = this;
        Helper.buttonClickEffect(Helper.find(self.winPanel, 'NextLevelButton'), function(){
            if (!GameInfo.instance){
                cc.error("请从关卡选择启动！")
                return;
            }

            let nextIdx = GameInfo.instance.levelIndex + 1
            if (LevelConfig[nextIdx] != null){
                Helper.gotoLevel(nextIdx);
            }
            else{
                cc.error("没有下一关了!")
            }            
        });
    },


    // update (dt) {},
});

module.exports = GamePlayUI
