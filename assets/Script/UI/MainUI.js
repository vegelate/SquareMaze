// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start () {

        if (CC_WECHATGAME )
        {
          this.getUserInfoBtn()
        }

    },

    // 微信授权，获取用户信息
    getUserInfoBtn: function () {
        if (this.userInfo) {
            return;
        }

        var self = this;
        wx.login({
            success: function (res1) {
                console.error(res1)
                wx.getSetting({
                    success(res) {
                        console.log('这是res', res);
                        if (!res.authSetting['scope.userInfo']) {
                            if (self.loginbtn) {
                                self.loginbtn.destroy();
                            }
                            // let width=window["canvas"].width*442/1080;
                            // let height=window["canvas"].width*124/1080;
                            // let left=window["canvas"].width/2-width/2;
                            // let top=window["canvas"].height/2-height/2+(window["canvas"].width*136/1080);
                            //let width=window["canvas"].width;
                            //let height=window["canvas"].height;
                            let canvasSize = self.node.getContentSize()
                            let width = canvasSize.width
                            let height = canvasSize.height

                            let left=0;
                            let top=0;
                            self.loginbtn = wx.createUserInfoButton({
                                type: 'image',
                                image: 'https://xcx.lequ.com/new/shouquan.png',
                                style: {
                                    left: left,
                                    top: top,
                                    width: width,
                                    height: height,
                                    
                                }
                            })
                            self.loginbtn.onTap((res) => {
                                console.log(res)
                                if(res.errMsg!="getUserInfo:ok"){//拒绝授权；
                                    console.error('拒绝授权');
                                    return;
                                }
                                let userdata = res.userInfo;
                                console.log('用户昵称', userdata.nickName, '用户头像', userdata.avatarUrl);
                                self.userInfo = {};
                                self.userInfo.nickname = userdata.nickName;
                                self.userInfo.headerimg = userdata.avatarUrl;
                                res.code = res1.code;
                                self.login(res);
                            })
                        }
                        else {
                            wx.getUserInfo({
                                success: function (res) {
                                    console.log('获取用户信息成功', res.userInfo);
                                    let userdata = res.userInfo;
                                    console.log('用户昵称', userdata.nickName, '用户头像', userdata.avatarUrl);
                                    self.userInfo = {};
                                    self.userInfo.nickname = userdata.nickName;
                                    self.userInfo.headerimg = userdata.avatarUrl;
                                    res.code = res1.code;
                                    self.login(res);
                                }
                            })
                        }
                    }
                })
            },
            fail: function () {
                wx.showLoading({
                    title: '授权登录失败'
                })
                self.getUserInfoBtn();
            }
        })
    },

    login(){
        cc.director.loadScene('levelSelect')
    },

    onClickLogin(){
        let self = this

        self.login()
    },

    // update (dt) {},
});
