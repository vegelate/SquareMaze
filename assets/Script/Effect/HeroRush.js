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
        time:{
            default: 1.0,
            type: Number,
        },

        sprite:{
            default: null,
            type: cc.Sprite,
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         cc.log("rush loaded!!")
     },

    onDestroy(){
        cc.log("rush destroy!!")
    },

    start () {
        let self = this
        cc.log('## before !!!!')
        let seq = cc.sequence(
            cc.fadeIn(self.time*0.1),
            cc.delayTime(self.time*0.9),
            cc.fadeOut(0.1),
            cc.callFunc(
                function(){
                    self.node.destroy()                   
                }
            )
        )
        cc.log('## after !!!!')
        self.node.runAction(seq)
    },

    // update (dt) {},
});
