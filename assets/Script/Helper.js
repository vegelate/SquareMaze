
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
    },


});

module.exports = Helper;

