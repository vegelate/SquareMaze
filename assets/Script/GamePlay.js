// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Hero = require("Hero")
var GameInfo = require('GameInfo')

var GamePlay = cc.Class({
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

        canvas:{
            default:null,
            typd: cc.Canvas,
        },

        map:{
            default: null,
            type: cc.TiledMap,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GamePlay.instance = this

        let self = this
        this.node.on(cc.Node.EventType.TOUCH_START, function ( event ) {
            console.log('Touch Start');
            self.onTouchStart(event.getLocationX(), event.getLocationY())
          });

        this.node.on(cc.Node.EventType.TOUCH_END, function ( event ) {
            console.log('Touch End');
            self.onTouchEnd(event.getLocationX(), event.getLocationY())
          });

    },

    onDestroy(){
        GamePlay.instance = null;
    },

    start () {
        let self = this

        // 加载地图
        let mapPath = "map/" + GameInfo.instance.levelIndex
        cc.log("mapPath:", mapPath)
        self.loadMap(mapPath) // 不用加扩展名 .tmx
    },

    loadMap(path){
        let self = this

        cc.loader.loadRes(path, function(err, map){
            self.map.tmxAsset = map;
            
            self.wallUpLayer = self.map.getLayer("WallUp")
            self.wallBottomLayer = self.map.getLayer("WallBottom")
            self.playLayer = self.map.getLayer("Play")

            var objects = self.map.getObjectGroup("Object")
            var heroObj = objects.getObject("Hero")
            var m1Obj = objects.getObject("M1")
            var m2Obj = objects.getObject("M2")
            var m3Obj = objects.getObject("M3")

            let heroPos = cc.v2(heroObj.x, heroObj.y)
            let heroCoord = self.posToCoord(heroPos)

            cc.log("hero pos:", heroPos.toString())
            cc.log("hero coord:", heroCoord.toString())
            
            self.spawnHero("prefab/hero", heroCoord)
        })
    },

    // 出生英雄 
    spawnHero(path, coord){
        let self = this;
        cc.loader.loadRes(path, function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            self.playLayer.node.addChild(newNode);

            self.hero = newNode.getComponent(Hero)
            self.hero.setCoord(coord)
        });
    },

    // 触屏开始
    onTouchStart(x, y){
        this.touchStartPos = cc.v2(x, y)
        cc.log("touch start pos:", this.touchStartPos.toString())
    },

    // 触屏结束
    onTouchEnd(x, y){
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
            }else if (d.x < 0){
                cc.log("Move to x-")
            }
        }else if (Math.abs(d.y) > Math.abs(d.x)){
            // y 移动
            if (d.y > 0){
                cc.log("Move to y+")
            }else if (d.y < 0){
                cc.log("Move to y-")
            }
        }

    },

    // update (dt) {},

    // 地图像素坐标转成瓦片单位坐标
    posToCoord(pos){
        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();

        //cc.log("map size:", mapSize.toString())
        //cc.log("tile size:", tileSize.toString())

        var x = Math.floor(pos.x / tileSize.width);
        var y = Math.floor((mapSize.height - pos.y) / tileSize.height);

        return cc.v2(x, y);
    },

    coordToPos(coord){
        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();

        var x = (coord.x+0.5) * tileSize.width;
        var y = mapSize.height - (coord.y+0.5) * tileSize.height;

        return cc.v2(x, y);
    },
});
