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
        let self = this;
        GamePlayUI.instance = this
        this.pausePanel.active = false
        this.winPanel.active = false

        GameInfo.instance.setCommonTopBar(null)

        this.node.on(cc.Node.EventType.TOUCH_START, function ( event ) {
            cc.log('Touch Start');
            self.onTouchStart(event.getLocationX(), event.getLocationY())
          });

        this.node.on(cc.Node.EventType.TOUCH_END, function ( event ) {
            cc.log('Touch End');
            self.onTouchEnd(event.getLocationX(), event.getLocationY())
          });

    },

    onDestroy(){
        GamePlayUI.instance = null
    },

    start () {
        let self = this;
        let GamePlay = require ('GamePlay')
        let gameNode = self.node.parent.getChildByName('Game')
        self.gamePlay = gameNode.getComponent(GamePlay)
    },

    // 触屏开始
    onTouchStart(x, y){
        this.touchStartPos = cc.v2(x, y)
        cc.log("touch start pos:", this.touchStartPos.toString())
    },

    // 触屏结束
    onTouchEnd(x, y){
        let self = this

        if (this.touchStartPos == null) {
            cc.log("touchStartPos is null")
            return
        }

        let touchEndPos = cc.v2(x, y)

        let d = touchEndPos.sub(this.touchStartPos);
        if (Math.abs(d.x) > Math.abs(d.y)){
            // x 移动
            if (d.x > 0){
                cc.log("Move to x+")
                self.moveHero(1, 0)

            }else if (d.x < 0){
                cc.log("Move to x-")
                self.moveHero(-1, 0)
            }
        }else if (Math.abs(d.y) > Math.abs(d.x)){
            // y 移动
            if (d.y > 0){
                cc.log("Move to screen y+, map y-")
                self.moveHero(0, -1)
            }else if (d.y < 0){
                cc.log("Move to screen y-, map y+")
                self.moveHero(0, 1)
            }
        }

    },

    moveHero(x, y){
        let self = this;
        self.gamePlay.moveHero(x, y);
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
                cc.error("没有下一关了! nextIdx:", nextIdx)
            }            
        });
    },


    // update (dt) {},
});

module.exports = GamePlayUI
