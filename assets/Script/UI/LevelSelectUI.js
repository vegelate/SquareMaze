// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameInfo = require("GameInfo")
var LevelConfig = require('LevelConfig')
var Helper = require('Helper')

cc.Class({
    extends: cc.Component,

    properties: {

        labelAP:{
            default:null,
            type: cc.Label,
        },

        labelStarts:{
            default:null,
            type: cc.Label,
        },

        headIcon:{
            default:null,
            type:cc.Sprite,
        },

        nameLabel:{
            default:null,
            type:cc.Label,
        },

        elementRoot:{
            default:null,
            type:cc.Node,
        },

        elementPrefab:{
            default:null,
            type:cc.Prefab,
        },

        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this
        
        // 显示头像
        if (CC_WECHATGAME) {
            cc.log("CC_WECHATGAME")
            if (GameInfo.instance.userInfo){
                cc.log("## Have user info")
                let imgPath = GameInfo.instance.userInfo.headImg
                let name = GameInfo.instance.userInfo.nickName
                cc.log(name, imgPath)

                self.setImage(self.headIcon, imgPath)
                self.nameLabel.string = name
            }else
            {
                cc.log("No userInfo!!")
            }
        }
        else{
            cc.log("## Not wechatgame!")
        }

        cc.log("## len:", LevelConfig.length)
        // 根据关卡配置和通关信息，初始化关卡按钮
        for (let i=1; i<LevelConfig.length; i++){

            // 找到 element
            let element = Helper.getOrCloneElement(
                    self.elementRoot, self.elementPrefab, i);

            let cfg = LevelConfig[i]
            cc.log("##:", cfg.id,",",cfg.path)

            // 填充 element
            let icon = element.getChildByName('icon')
            let label = element.getChildByName('Label')

            icon.on('click', function(){

                // todo 消耗 ap

                GameInfo.instance.levelIndex = cfg.id
                cc.director.loadScene('game', function(err, data){
                })

            }, self);

            // 关卡索引
            label.getComponent(cc.Label).string = cfg.id

            // Star
            let iStar = GameInfo.instance.getLevelStar(i);
            let stars = {}
            stars[0] = element.getChildByName('Star0');
            stars[1] = element.getChildByName('Star1');
            stars[2] = element.getChildByName('Star2');
            stars[3] = element.getChildByName('Star3');
            for (let j=0; j<4; j++){
                stars[j].active = (iStar == j)
            }
        }
    },

    setImage(sprite, url) {
        if (!url) return false;
        if (typeof (wx) == "undefined") return false;
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame();
            sprite.spriteFrame.setTexture(texture);
        };
        image.src = url;
    },

    start () {

    },

    onClickHome(){

    },

    onClickAddAP(){

    },

    // update (dt) {},
});
