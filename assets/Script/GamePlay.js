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
var Hero = require("Hero")
var Pickable = require("Pickable")
var LevelConfig = require('LevelConfig')

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
        effectCamera:{
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
        self.MOVING_SPEED = 0.0333  // 移动速度
        self.pickables = {} // 可拾取物， coord_idx - item

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
        GamePlay.instance = null;
    },

    start () {
        let self = this

        // 加载地图
        if (GameInfo.instance != null && GameInfo.instance.levelIndex != null){
            let levelCfg = LevelConfig[GameInfo.instance.levelIndex]
            let mapPath = levelCfg.path
            cc.log("mapPath:", mapPath)
            self.loadMap(mapPath) // 不用加扩展名 .tmx
        }else if (self.map != null){
            self.onMapLoaded()
        }

        // 初始化得分
        self.stars = 0;
        self.scores = 0;
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
        if (!self.bgLayer || !self.playLayer){
            cc.error("地图不正确，找不到 BG 层或者 Play 层")
            return
        }

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
        self.effectCamera.zoomRatio = zoom
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
        
        if (endObj != null){
            let endPos = cc.v2(endObj.x, endObj.y)
            self.endCoord = self.posToCoord(endPos)
        }else{
            cc.error("map has no End point!")
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

            // 设置英雄初始面朝方向
            let right = cc.v2(coord.x+1, coord.y)
            let left = cc.v2(coord.x-1, coord.y)
            let rightType = self.getTileType(self.bgLayer, right)
            let leftType = self.getTileType(self.bgLayer, left)
            if (leftType == "wall"){
                self.hero.facing(1)
            }else if(rightType == "wall"){
                self.hero.facing(-1)
            }
            else{
                self.hero.facing(1)
            }

        });

        
    },

    // 出生一种可收集物
    spawnOneKindPickables(prefabPath, objs, callback){
        let self = this

        cc.loader.loadRes(prefabPath, function (err, prefab) {

            // 遍历 coin 配置
            for (var i=0; i<objs.length; i++){
                let obj = objs[i]
                cc.log('coin:', obj.toString(), obj.x, obj.y, obj.width, obj.height);
    
                // 判断是横向还是纵向
                let offset = null
                let num = 0 // 出生的 coin 数量
                if (obj.width > obj.height){
                    offset = cc.v2(1, 0)
                    num = Math.ceil(obj.width / self.tileSize.width)
                }else{
                    offset = cc.v2(0, 1)
                    num = Math.ceil(obj.height / self.tileSize.height)
                }
    
                // 出生一排对象
                let startCoord = self.posToCoord(cc.v2(obj.x, obj.y))
                for (var j=0; j<num; j++){
                    let coord = startCoord.add(offset.mul(j))     
                    let coordIdx = self.coordToIndex(coord)                    
                    
                    if (self.pickables[coordIdx] == null){
                        var newNode = cc.instantiate(prefab);

                        newNode.position = self.coordToPos(coord)
                        self.playLayer.node.addChild(newNode);
    
                        self.pickables[coordIdx] = newNode.getComponent(Pickable)                        
                    }
                }
            }
    
            if (callback)
            {
                callback();
            }
        });
    },

    // 出生可收集物
    spawnPickable(){
        let self = this

        // 出生 star
        self.starGroup = self.map.getObjectGroup("Star")
        var objs = self.starGroup.getObjects()

        self.spawnOneKindPickables("prefab/star", objs, function(){
        // 出生 coin
            self.coinGroup = self.map.getObjectGroup("Coin")   // TiledObjectGroup
            objs = self.coinGroup.getObjects()    

            self.spawnOneKindPickables("prefab/coin", objs)
        })
    },

    moveHero(x, y){
        var self = this     
        if (self.isHeroMoving) return   // 移动状态
        self.isHeroMoving = true     
        
        let tileSize = self.map.getTileSize()
        let offset = cc.v2(x, y)
        let movingSpeed = self.MOVING_SPEED   // 每多久经过一个 tile

        // 向 offset 方向遍历，找到落脚点
        let coord = self.hero.coord
        cc.log("hero coord:", coord.toString())
        let coords = [] // 记录经过的坐标

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
            coords.push(nextPos)
        }

        let numTiles = coords.length;    // 这次移动经过的 tile 数量
        // 按照间隔依次拾取
        for (let i=0; i<numTiles; i++)
        {
            let c = coords[i]
            let coordIdx = self.coordToIndex(c)
            
            if (self.pickables[coordIdx]){
                let pickable = self.pickables[coordIdx]
                self.pickables[coordIdx] = false

                let seq = cc.sequence(
                    cc.delayTime((i+1)*movingSpeed),
                    cc.callFunc(function(){
                        self.stars += pickable.star
                        self.scores += pickable.score

                        cc.log("stars:",self.stars," , scores:", self.scores)
                        pickable.node.destroy();
                    })
                )
                pickable.node.runAction(seq)

            }      
         }

        // 英雄移动
        cc.log('moving hero')
        self.hero.facing(x)
        let totalTime = (numTiles)*movingSpeed;
        let seq = cc.sequence(
            cc.moveTo(totalTime, self.coordToPos(coord)),
            cc.callFunc(function(){

                self.isHeroMoving = false
                self.hero.setCoord(coord)

                // 判断关卡结束
                if (coord.equals(self.endCoord)){
                    var GamePlayUI = require('GamePlayUI');
                    
                    if (GameInfo.instance){
                        GameInfo.instance.onLevelWin(self.stars, self.scores)                       
                    }
                    GamePlayUI.instance.win(self.stars, self.scores)
                    //cc.director.loadScene('levelSelect')
                }
            }))
        self.hero.node.runAction(seq)

        // 播放特效
        cc.log('play effect')
        cc.loader.loadRes("prefab/HeroRush", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            self.hero.node.addChild(newNode);
            // 设置朝向
            if (x < 0) newNode.rotation = 180
            else if (y > 0) newNode.rotation = 90
            else if (y < 0) newNode.rotation = 270

            var HeroRush = require('HeroRush')
            let rush = newNode.getComponent(HeroRush)
            rush.run(totalTime)
        });
        
    },

    // 获取 tile 类型 wall / floor
    getTileType(layer, coord){
        // 越界检查
        if (coord.x < 0 || coord.x >= this.mapSize.x ||
            coord.y < 0 || coord.y >= this.mapSize.y){
                return "wall"
        }

        let gid = layer.getTileGIDAt(coord)
        if (gid != null){
            var prop = this.map.getPropertiesForGID(gid)
            if (prop != null){
                return prop.type
            }
        }

        return "wall"
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
        var tileSize = this.tileSize;

        //cc.log("map size:", mapSize.toString())
        //cc.log("tile size:", tileSize.toString())

        var x = Math.floor(pos.x / tileSize.width);
        var y = Math.floor((mapSize.height - pos.y) / tileSize.height);

        return cc.v2(x, y);
    },

    coordToPos(coord){
        var mapSize = this.mapTotalSize;
        var tileSize = this.tileSize;

        var x = (coord.x+0.5) * tileSize.width;
        var y = mapSize.height - (coord.y+0.5) * tileSize.height;

        return cc.v2(x, y);
    },

     // 将位置标准化到格子中心
    posToTileCenter(pos){
        let coord = this.posToCoord(pos)
        return this.coordToPos(coord)
    },

    // 获取坐标的 索引
    coordToIndex(coord){
        return coord.y * this.mapSize.width + coord.x;
    },
});

module.exports = GamePlay;
