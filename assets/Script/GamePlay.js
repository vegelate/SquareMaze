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

        map:{
            default: null,
            type: cc.TiledMap,
        },

        // 下墙
        wallBottomLayer:{
            default:null,
            type: cc.TiledLayer,
        },

        // 上墙
        wallUpLayer:{
            default:null,
            type: cc.TiledLayer, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this

        // 加载地图
        self.loadMap("map/1") // 不用加扩展名 .tmx
    },

    loadMap(path){
        let self = this

        cc.loader.loadRes(path, function(err, map){
            self.map.tmxAsset = map;
            
            self.wallUpLayer = self.map.getLayer("WallUp")
            self.wallBottomLayer = self.map.getLayer("WallBottom")

            var objects = self.map.getObjectGroup("Object")
            var heroObj = objects.getObject("Hero")
            var m1Obj = objects.getObject("M1")
            var m2Obj = objects.getObject("M2")
            var m3Obj = objects.getObject("M3")

            var heroPos = cc.v2(heroObj.x, heroObj.y)

            var heroCoord = self.getTileCoord(heroPos)

            cc.log("hero pos:", heroPos.toString())
            cc.log("hero coord:", heroCoord.toString())
            
        })
    },
    // update (dt) {},

    // 地图像素坐标转成瓦片单位坐标
    getTileCoord(pos){
        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();

        cc.log("map size:", mapSize.toString())
        cc.log("tile size:", tileSize.toString())

        var x = Math.floor(pos.x / tileSize.width);
        var y = Math.floor((mapSize.height - pos.y) / tileSize.height);

        return cc.v2(x, y);
    },
});
