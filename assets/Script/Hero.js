// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        sprite:{
            default: null,
            type: cc.Sprite,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.coord = cc.Vec2.ZERO   // 坐标
        this.initScaleX = this.sprite.node.scaleX
        this.initScaleY = this.sprite.node.scaleY
    },

    setCoord(coord){
        this.coord = coord;
        var GamePlay = require("GamePlay")
        this.node.position = GamePlay.instance.coordToPos(coord)
    },

    // 设置面朝向，默认朝左边
    facing(x){
        if (x > 0) {
            this.sprite.node.scaleX = -this.initScaleX
        }
        else if(x < 0){
            this.sprite.node.scaleX = this.initScaleX
        }

    },

    start () {

    },

    // update (dt) {},
});
