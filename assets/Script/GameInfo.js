
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var globalConfig = require('GlobalConfig')

// 全局游戏信息
var GameInfo = cc.Class({
    extends: cc.Component,
    statics:{
        instance: null
    },

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("GameInfo onLoad:", this)

        let self = this;
        if (!GameInfo.instance){
            GameInfo.instance = this;
            cc.game.addPersistRootNode(this.node)
            self.elapsed = 0.0;

            self.AP = 10;   // 体力值
            self.coin = 0;  // 游戏币数量
            self.levelIndex = 1;    // 当前进行的关卡
            self.latestLevel = 0;   // 最近完成的关卡
            self.levelStars = {};   // 每关的通关成绩  
            self.ApRecoverTime = (new Date).getTime() * 0.001 // 上次的恢复时间,1970 秒数
            
            self.loadUserData()
        }else{
            cc.log("already have game info, destroy!")
            self.node.destroy()
        }

    },

    onLevelWin(stars, scores, apRecover){
        let self = this

        if (!self.levelStars[self.levelIndex] || 
            stars > self.levelStars[self.levelIndex]){
                self.levelStars[self.levelIndex] = stars                
        }

        if (self.latestLevel < self.levelIndex){
            self.latestLevel = self.levelIndex; // 设置关卡进度
        }

        if (scores){
            self.coin += scores;    // 加金币
        }

        if (apRecover){
            self.ap += apRecover;   // 加体力
        }
        
        self.saveUserData()
    },


    // 获取通关的星数
    getLevelStar(index){
        let self = this

        if (index > self.latestLevel)
            return -1
        else
            return self.levelStars[index]
    },

    // 读取所有用户数据
    loadUserData(){
        let self = this    
        
        if (CC_WECHATGAME){
            let ap = self.loadData('AP');
            if (ap) self.AP = ap;

            let coin = self.loadData('coin');
            if (coin) self.coin = coin;

            let latest = self.loadData('latestLevel');
            if (latest) self.latestLevel = latest;

            let recoverTime = self.loadData('ApRecoverTime');
            if (recoverTime) {
                self.ApRecoverTime = recoverTime;

                self.tryRecoverAP()
            }

            let strJson = self.loadData('levelStars');
            if (strJson){
                let tmp = JSON.parse(strJson);
                if (tmp){
                    self.levelStars = tmp;
                    cc.log("parse json success!")
                }                
            }

            /*
            wx.getUserCloudStorage({
                keyList: ['levelStars'],
                success(res) {
                    self.levelStars = res.KVDataList[0].value;
                    cc.log("## getUserCloudStorage success!!")
                    for (var key in self.levelStars){
                        cc.log("star:", key, self.levelStars[key])
                    }
                },
                fail(res) {
                    console.error(res)
                }
            })*/            
        }
    },

    // 保存所有用户数据
    saveUserData(){
        let self = this;

        if (CC_WECHATGAME){
            
            self.setData('AP', self.AP);
            self.setData('coin', self.coin);
            self.setData('latestLevel', self.latestLevel);
            self.setData('ApRecoverTime', self.ApRecoverTime);

            let strJson = JSON.stringify(self.levelStars);
            self.setData("levelStars", strJson);

            /*
            let KVDataList =[];
            KVDataList.push(
                {key:"levelStars", value: self.levelStars}
            )

            wx.setUserCloudStorage({
                KVDataList: KVDataList,
                success: function success(res) {
                    cc.log('存储成功', res);
                },
                fail: function fail(res) {
                    cc.log('存储失败', res);
                }
            });
            */  
        }

    },

    // 读取一条数据
    loadData(key){
        try{
            return wx.getStorageSync(key);
        }
        catch(e){
            return null;
        }  
    },

    // 保存一条数据
    saveData(key, value){
        try{
            wx.setStorageSync(key, value)
        } catch(e){}
    },

    // 尝试恢复 AP
    tryRecoverAP(){
        let self = this

        let curr_time = (new Date).getTime() * 0.001
        let pass_sec = curr_time - self.ApRecoverTime;
        let num = Math.floor(pass_sec / globalConfig.ApRecoverTime) // 要恢复的点数

        if (num > 0){
            // 要恢复
            self.AP = Math.min(globalConfig.APMax, self.AP + num)
            self.ApRecoverTime = curr_time
            return true, globalConfig.ApRecoverTime
        }else{
            return false, globalConfig.ApRecoverTime - pass_sec
        }
    },

    start () {

    },

    update (dt) 
    {
        let self = this

        self.elapsed = self.elapsed + dt
        // 每秒尝试恢复一次 ap
        if (self.elapsed > 1.0){
            let recoverd = false
            self.isApRecoverd, self.recoverLeftTime = self.tryRecoverAP()

           // cc.log("is recovered:",self.isApRecoverd,", left time:",self.recoverLeftTime)
            self.elapsed = 0.0
        }
    },


});

module.exports = GameInfo;

