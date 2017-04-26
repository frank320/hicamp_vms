歌华儿童TV后端 vms调用API
=======================

>Version: 1.0.1
>Update: 2016.04.21

> 请使用api服务器的实际部署地址替换 `API_DEPLOYMENT_URL`，如 `http://gehua-children.limijiaoyin.com/api/backend/vms`


### 头信息，操作状态，数据格式 ###
+ 所有请求 **必须** 含有 `Content-Type:application/json;charset=UTF-8` 头.
+ 所有request及response的body部分， **必须** 采用 JSON。
+ 成功操作返回:

        {
            //< integer of 0> 成功指示
            "code": 0
        }
  失败操作返回:
        {
            //< string > 错误描述
            "errorMsg": "internal server error"
            //< integer > 出错指示。目前: 400 - 参数错；500 - 服务器内部错
            "errorCode": 400
        }



### status code ###
+ 200 成功操作

+ 400 请求地址或请求参数有误

+ 500 api服务器内部状态错

-----------------------------

### 图片同步接口 ###
+ Usage
  图片资源的CRUD

+ Request
  POST API_DEPLOYMENT_URL/image

        {
            //< array of dict > 待同步图片集
            images: [{
                //< integer of 0/1/2 > 操作类型：0 添加，1 更新，2 删除
                protocaltype: 0,
                //< string of url > 资源对应的七牛url。 **可空**
                resourceId: 'http://pic.address.jpg',
                //< string > 版权信息
                copyright: 'xxx...',
                //< string of id > 资源id
                id: 'xxx...',
                //< string > 名称
                name: 'xxx...',
                //< integer of unix timestamp > 资源创建时间
                createdTime: 189899000,
                //< integer of unix timestamp > 资源更新时间
                updateTime: 189899000,
                //< string of url > 资源url
                url: 'http://address.of.resource..'
            }, ]
        }





### 视频同步接口 ###
+ Usage
  视频资源的CRUD

+ Request
  POST API_DEPLOYMENT_URL/video

        {
            //< array of dict > 待同步视频
            videos: [{
                //< integer of 0/1/2 > 操作类型：0 添加，1 更新，2 删除
                protocaltype: 0,
                //< string of url > 资源对应的七牛url。 **可空**
                resourceId: 'http://pic.address.jpg',
                //< string > 版权信息
                copyright: 'xxx...',
                //< string of id > 资源id
                id: 'xxx...',
                //< string > 名称
                name: 'xxx...',
                //< string > 视频摘要
                summary: 'xxx...',
                //< array of string > 视频标签数组
                tags: ['自信', '音乐', ]
                //< float of 0~10 > 视频评分
                score: 7.5,
                //< integer > 视频最小年龄
                minAge: 3,
                //< integer > 视频最大年龄
                maxAge: 7,
                //< integer of millisecond > 视频时长，毫秒单位
                duration: 1878000,
                //< integer of unix timestamp > 资源创建时间
                createdTime: 189899000,
                //< integer of unix timestamp > 资源更新时间
                updateTime: 189899000,
                //< string of url > 大尺寸海报
                posterLarge: 'http://pic.address.jpg',
                //< string of url > 小尺寸海报
                posterSmall: 'http://pic.address.jpg',
                //< string of url > 思迁 Asset 的 localEntryUID
                assetUid: 'xxx...'
            }, ]
        }



### 剧集同步接口 ###
+ Usage
  剧集资源的CRUD

+ Request
  POST API_DEPLOYMENT_URL/bundle

        {
            //< array of dict > 待同步剧集集合
            series: [{
                //< integer of 0/1/2 > 操作类型：0 添加，1 更新，2 删除
                protocaltype: 0,
                //< string of url > 资源对应的七牛url。 **可空**
                resourceId: 'http://pic.address.jpg',
                //< string > 版权信息
                copyright: 'xxx...',
                //< string of id > 资源id
                id: 'xxx...',
                //< string > 名称
                name: 'xxx...',
                //< string > 视频摘要
                summary: 'xxx...',
                //< array of string > 视频标签数组
                tags: ['自信', '音乐', ]
                //< float of 0~10 > 视频评分
                score: 7.5,
                //< integer > 视频最小年龄
                minAge: 3,
                //< integer > 视频最大年龄
                maxAge: 7,
                //< integer of unix timestamp > 资源创建时间
                createdTime: 189899000,
                //< integer of unix timestamp > 资源更新时间
                updateTime: 189899000,
                //< string of url > 大尺寸海报
                posterLarge: 'http://pic.address.jpg',
                //< string of url > 小尺寸海报
                posterSmall: 'http://pic.address.jpg',
                //< string of id > 视频资源id
                videos: ['xxx..', ]
            }, ]
        }
