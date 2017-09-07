(function(){

  const Album=require('../model/album')
  const fs=require('fs')
  const path=require('path')

  let jsonArr=null

  try{
    jsonArr=JSON.parse(fs.readFileSync(path.join(__dirname,'./getJson.json')))
    console.log('parse over')
  }catch(e){
    console.log('err:')
    console.log(e.message)
    return
  }
  Album.create(jsonArr).then(r=>{
    console.log('插入数据成功')
  }).catch(e=>{
    console.log(e.message)
  })

})()