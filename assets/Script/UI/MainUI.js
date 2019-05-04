// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var GameInfo = require("GameInfo")

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let self = this

        if (CC_WECHATGAME) {
            if (!GameInfo.instance.userInfo && !GameInfo.instance.wx_code)
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
                //console.error(res1)
                wx.getSetting({
                    success(res) {
                        console.log('这是res', res);
                        if (!res.authSetting['scope.userInfo']) {
                            if (self.loginbtn) {
                                self.loginbtn.destroy();
                            }
                            let canvasSize = self.node.getContentSize()
                            let width = canvasSize.width
                            let height = canvasSize.height

                            let left = 0;
                            let top = 0;
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
                                if (res.errMsg != "getUserInfo:ok") {//拒绝授权；
                                    console.error('拒绝授权');
                                    return;
                                }
                                let userdata = res.userInfo;
                                console.log('用户昵称', userdata.nickName, '用户头像', userdata.avatarUrl);
                                var userInfo = {};
                                userInfo.nickName = userdata.nickName;
                                userInfo.headImg = userdata.avatarUrl;
                                GameInfo.instance.userInfo = userInfo;
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
                                    var userInfo = {}
                                    userInfo.nickName = userdata.nickName;
                                    userInfo.headImg = userdata.avatarUrl;
                                    GameInfo.instance.userInfo = userInfo;

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

    login() {
        let self = this
        if (CC_WECHATGAME) {
            wx.login({
                success(res) {
                    if (res.code) {
                        GameInfo.instance.wx_code = res.code
                        // 登陆成功，进游戏
                        cc.director.loadScene('levelSelect')
                        // 发起网络请求
                        /*
                        wx.request({
                          url: 'https://test.com/onLogin',
                          data: {
                            code: res.code
                          }
                        })*/
                    } else {
                        console.log('微信登录失败！' + res.errMsg)
                    }
                }
            })
        }
        else {
            cc.log("跳过微信登陆，单机模式。无排行榜")
            cc.director.loadScene('levelSelect')
        }
    },

    onClickLogin() {
        let self = this

        self.login()
    },

    // update (dt) {},
});
