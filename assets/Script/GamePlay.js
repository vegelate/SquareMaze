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
        camera:{
            default: null,
            type: cc.Camera,
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
        if (GameInfo.instance != null && GameInfo.instance.levelIndex != null){
            let mapPath = "map/" + GameInfo.instance.levelIndex
            cc.log("mapPath:", mapPath)
            self.loadMap(mapPath) // 不用加扩展名 .tmx
        }else if (self.map != null){
            self.onMapLoaded()
        }

    },

    loadMap(path){
        let self = this

        cc.loader.loadRes(path, function(err, map){
            self.map.tmxAsset = map;
            self.onMapLoaded()
        })
    },

    onMapLoaded(){
        let self = this
        // 解析地图
        self.mapSize = self.map.getMapSize()
        self.tileSize = self.map.getTileSize()
        self.mapTotalSize = cc.size(self.mapSize.width*self.tileSize.width, self.mapSize.height*self.tileSize.height)    

        self.bgLayer = self.map.getLayer("BG")
        self.wallUpLayer = self.map.getLayer("WallUp")
        self.wallBottomLayer = self.map.getLayer("WallBottom")
        self.playLayer = self.map.getLayer("Play")

        // 地图初始化
        self.setupCamera()
        self.spawnActor()
        self.spawnPickable()
    },

    // 设置相机的位置和缩放
    setupCamera(){
        let self = this
        // 将主相机放置到地图中心点
        let offset = cc.v2(self.mapTotalSize.width*0.5, self.mapTotalSize.height*0.5)
        self.camera.node.position = self.map.node.position.add(offset)

        let canvasSize = self.node.getContentSize()
        let zoom = Math.min(canvasSize.width/self.mapTotalSize.width, canvasSize.height/self.mapTotalSize.height)
        cc.log("zoom:", zoom)
        self.camera.zoomRatio = zoom
    },

    // 出生角色
    spawnActor(){
        let self = this
        let actorGroup = self.map.getObjectGroup("Actor")
        let heroObj = actorGroup.getObject("Hero") // 英雄出生点
        let endObj = actorGroup.getObject("End")   // 结束点

        if (heroObj != null){
            let heroPos = cc.v2(heroObj.x, heroObj.y)
            let heroCoord = self.posToCoord(heroPos)

            cc.log("hero pos:", heroPos.toString())
            cc.log("hero coord:", heroCoord.toString())
            
            self.spawnHero("prefab/hero", heroCoord)
        }else{
            cc.error("map has no Hero spawn point!")
        }       
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

    // 出生可收集物
    spawnPickable(){
        let self = this

        // 出生 coin
        self.coinGroup = self.map.getObjectGroup("Coin")   // TiledObjectGroup
        var objs = self.coinGroup.getObjects()       

        cc.loader.loadRes('prefab/coin', function (err, prefab) {

            // 遍历 coin 配置
            for (var i=0; i<objs.length; i++){
                let obj = objs[i]
                cc.log('11 coin:', obj.toString(), obj.x, obj.y, obj.width, obj.height);

                var newNode = cc.instantiate(prefab);
                newNode.position = cc.p(obj.x, obj.y)
                self.playLayer.node.addChild(newNode);
            }




        });

    },

    moveHero(x, y){
        let self = this
        let tileSize = self.map.getTileSize()
        let offset = cc.v2(x, y)

        // 向 offset 方向遍历，找到落脚点
        let coord = self.hero.coord
        cc.log("hero coord:", coord.toString())
        while(true){
            let nextPos = coord.add(offset)
            let tileType = self.getTileType(self.bgLayer, nextPos)
            cc.log(nextPos.toString(), " type:", tileType)
            if (tileType == null || tileType == 'wall')
            {
                break
            }
            else{
                coord = cc.v2(nextPos.x, nextPos.y);
            }
        }

        self.hero.setCoord(coord)
    },

    getTileType(layer, coord){
        let gid = layer.getTileGIDAt(coord)
        if (gid != null){
            var prop = this.map.getPropertiesForGID(gid)
            if (prop != null){
                return prop.type
            }
        }
        return null
        
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

    // update (dt) {},

    // 地图像素坐标转成瓦片单位坐标
    posToCoord(pos){
        var mapSize = this.mapTotalSize;
        var tileSize = this.map.getTileSize();

        //cc.log("map size:", mapSize.toString())
        //cc.log("tile size:", tileSize.toString())

        var x = Math.floor(pos.x / tileSize.width);
        var y = Math.floor((mapSize.height - pos.y) / tileSize.height);

        return cc.v2(x, y);
    },

    coordToPos(coord){
        var mapSize = this.mapTotalSize;
        var tileSize = this.map.getTileSize();

        var x = (coord.x+0.5) * tileSize.width;
        var y = mapSize.height - (coord.y+0.5) * tileSize.height;

        return cc.v2(x, y);
    },
});
