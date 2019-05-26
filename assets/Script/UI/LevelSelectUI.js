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

        labelStarts:{
            default:null,
            type: cc.Label,
        },

        elementRoot:{
            default:null,
            type:cc.Node,
        },

        elementPrefab:{
            default:null,
            type:cc.Prefab,
        },

        spriteLevelLocked:{
            default:null,
            type:cc.SpriteFrame,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this
        
        // 填充顶部条
        let topBarRoot = Helper.find(self.node, 'Layout/Top')
        Helper.fillCommonTopBar(topBarRoot)
        let gameInfo = GameInfo.instance

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

            // 按钮
            if (i - gameInfo.latestLevel > 1){
                // 未解锁关卡
                icon.getComponent(cc.Sprite).spriteFrame = self.spriteLevelLocked;
            }
            else{
                icon.on('click', function(){
                    Helper.buttonClickEffect(icon, function(){
                        if (!Helper.gotoLevel(cfg.id)){
                            // todo 提示 ap 不足
                        }
                    })
                }, self);

                // 关卡索引
                label.getComponent(cc.Label).string = cfg.id                
            }

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



    start () {

    },

    // update (dt) {},
});
