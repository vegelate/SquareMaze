
var Helper = cc.Class({

    statics:{
        // 在这里定义辅助函数

        // 从 root 下取第 index 个结点。如果不存在就用 prefab 克隆
        getOrCloneElement(root, prefab, index){
            // 找到 element
            let element = null
            if (root.childrenCount >= index){
                element = root.children[index-1]
            }else{
                element =cc.instantiate(prefab);
                root.addChild(element);
            }
            return element;
        },

        // 从 root 中找到 path 描述的结点 比如 'Panel/Button/text'
        find(root, path){
            let sep = path.split('/');
            let child = root;
            for (var i=0; i<sep.length; i++){
                child = child.getChildByName(sep[i])
                if (!child){
                    cc.error("Failed to find path:"+path);
                    return null                    
                }
            }

            return child
        },

        setWXImage(sprite, url) {
            if (!url) return false;
            if (typeof (wx) == "undefined") return false;
            let image = wx.createImage();
            image.onload = function () {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                sprite.spriteFrame = new cc.SpriteFrame();
                sprite.spriteFrame.setTexture(texture);
            };
            image.src = url;
        },

        // 设置通用顶部信息条 
        fillCommonTopBar(root){
            // home button
            let gameInfo = require('GameInfo').instance
            let GlobalConfig = require('GlobalConfig')

            let homeButton = root.getChildByName('HomeButton');
            homeButton.on('click', function(){
                cc.director.loadScene('main')

            }, root);

            // ap
            let apLabel = Helper.find(root, 'ActionPointPanel/Label').getComponent(cc.Label);
            apLabel.string = "" + gameInfo.AP + "/" + GlobalConfig.ApMax

            // add ap button
            let addApButton = Helper.find(root, 'ActionPointPanel/main_button_002')
            addApButton.on('click', function(){
                // todo: 加 ap 逻辑
                gameInfo.ap++
            }, root);

            if (CC_WECHATGAME) {
                cc.log("CC_WECHATGAME")
                if (gameInfo.userInfo){
                    cc.log("## Have user info")
                    let imgPath = gameInfo.userInfo.headImg
                    let name = gameInfo.userInfo.nickName
                    cc.log(name, imgPath)
    
                    let headIcon = root.getChildByName('HeadIcon').getComponent(cc.Sprite);
                    Helper.setWXImage(headIcon, imgPath)

                    let nameLabel = root.getChildByName('NameLabel').getComponent(cc.Label);
                    nameLabel.string = name
                }else
                {
                    cc.log("No userInfo!!")
                }
            }
            else{
                cc.log("## Not wechatgame!")
            }
        },


    },


});

module.exports = Helper;

