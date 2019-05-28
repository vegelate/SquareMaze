
var globalConfig = {
    ApMax : 100,            // 体力最大值
    ApRecoverTime : 5,      // 多少秒恢复一点
    ApConsume : 20,         // 进关卡消耗
    LevelReward : [         // 通关奖励
        {
            Stars : 0,      // 0 星通关
            ApRecover : 0,
            Coin : 0,    
        },
        {
            Stars : 1,      // 1 星通关
            ApRecover : 1,
            Coin : 10,    
        },
        {
            Stars : 2,      // 2 星通关
            ApRecover : 2,
            Coin : 50,    
        },
        {
            Stars : 3,      // 3 星通关
            ApRecover : 4,
            Coin : 100,    
        },
        // 如果超过 3 星可以继续往下配
    ],

};


module.exports = globalConfig;