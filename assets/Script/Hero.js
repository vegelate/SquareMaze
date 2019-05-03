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
        this.coord = cc.Vec2.ZERO   // 坐标
        this.sprite = this.node.getComponent(cc.Sprite);
        this.initScaleX = this.node.scaleX
        this.initScaleY = this.node.scaleY
    },

    setCoord(coord){
        this.coord = coord;
        var GamePlay = require("GamePlay")
        this.node.position = GamePlay.instance.coordToPos(coord)
    },

    // 设置面朝向，默认朝左边
    facing(x){
        if (x >= 0) {
            this.node.scaleX = -this.initScaleX
        }
        else{
            this.node.scaleX = this.initScaleX
        }

    },

    start () {

    },

    // update (dt) {},
});
