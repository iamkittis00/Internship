const line = require('@line/bot-sdk')
const express = require('express')
const dotenv = require('dotenv')
const { google } = require('googleapis')

const env = dotenv.config().parsed
const app = express()

const lineConfig = {
    channelAccessToken: env.Channel_access_token,channelSecret: env.Channel_secret
}

const client = new line.Client(lineConfig);

  //Google
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });


app.post('/webhook', line.middleware(lineConfig), async (req,res)=>{
    try{
        const events = req.body.events
        console.log('event=>>>>',events)
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("ok")
    } catch(error){
        res.status(500).end()
    }
});
//คำสั่ง
const prefix = '!';

const handleEvent = async (event) =>{
    
    //Google
    const authclient = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: authclient});
    const spreadsheetId = "1tuqRFGCV3idFmQnQkUSz0KToCTkJ_rlL3ixzcj7KM1s";
    
    //get rows
    const getRows = await googleSheets.spreadsheets.values.get({
auth, spreadsheetId, range:"ชีต1", 
    });

    if(event.type !== 'message' || event.message.type !== 'text' ) return null;
else {   

    //command
    const args = event.message.text.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length).toLowerCase();  
    
    //ข้อความ
    var linetext,sheet ; 
    var z = 0;


    //รูปภาพ
    var image ;
    var check = true;

    for(var x=0; x < getRows.data.values.length; x++){
      if(getRows.data.values[x][0] != args[1]){
        check = false
      }
    }
    for(var x=0; x < getRows.data.values.length; x++){
      if(getRows.data.values[x][0] == args[1]){
        z = getRows.data.values[x][1]
        image = getRows.data.values[x][2]
        check = true
        sheet = x
      }
      console.log(getRows.data.values[x])
    }
    
    //flexbox all
    let flexbox1 =  { 
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": getRows.data.values[1][2],
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": getRows.data.values[1][0],
                  "weight": "bold",
                  "size": "xl",
                  "wrap": true,
                  "contents": []
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": getRows.data.values[1][1],
                      "weight": "bold",
                      "size": "xl",
                      "flex": 0,
                      "wrap": true,
                      "contents": []
                    },
                    {
                      "type": "text",
                      "text": ".00",
                      "weight": "bold",
                      "size": "sm",
                      "flex": 0,
                      "wrap": true,
                      "contents": []
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Add to Cart",
                    "uri": "https://linecorp.com"
                  },
                  "style": "primary"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Add to wishlist",
                    "uri": "https://linecorp.com"
                  }
                }
              ]
            }
          },
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": getRows.data.values[2][2],
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": getRows.data.values[2][0],
                  "weight": "bold",
                  "size": "xl",
                  "wrap": true,
                  "contents": []
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "flex": 1,
                  "contents": [
                    {
                      "type": "text",
                      "text": getRows.data.values[2][1],
                      "weight": "bold",
                      "size": "xl",
                      "flex": 0,
                      "wrap": true,
                      "contents": []
                    },
                    {
                      "type": "text",
                      "text": ".00",
                      "weight": "bold",
                      "size": "sm",
                      "flex": 0,
                      "wrap": true,
                      "contents": []
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Add to Cart",
                    "uri": "https://linecorp.com"
                  },
                  "flex": 2,
                  "color": "#AAAAAA",
                  "style": "primary"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Add to wish list",
                    "uri": "https://linecorp.com"
                  }
                }
              ]
            }
          }
        ]
      }
      }
  //flex ข้อความ
    let flexbox =  { 
            "type": "flex",
            "altText": "this is a flex message",
            "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "สินค้า",
                      "align": "center",
                      "contents": []
                    }
                  ]
                },
                "hero": {
                  "type": "image",
                  "url": image,
                  "size": "full",
                  "aspectRatio": "1.51:1",
                  "aspectMode": "fit"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": z + "  Baht",
                      "align": "center",
                      "contents": []
                    }
                  ]
                }
              }
            }    
      // start command
      if (cmd == "stock") {
        return client.replyMessage(event.replyToken, flexbox1)
    }
    else if (cmd == "update") {
        if (args[1]==null) {
          linetext = {"type":"text","text": "ไม่พบสินค้าในระบบ"}
          return client.replyMessage(event.replyToken,linetext)
        }else if (args[2]==null) {
          linetext = {"type":"text","text": "โปรดกรอกจำนวนสินค้า"}
          return client.replyMessage(event.replyToken,linetext)
        }
        else if (check !== true){
          linetext = {"type":"text","text": "ไม่พบสินค้า"}
          return client.replyMessage(event.replyToken,linetext)
        }
        await googleSheets.spreadsheets.values.update(
          {auth, spreadsheetId, range: `ชีต1!A${sheet+1}:B${sheet+1}`, valueInputOption: "USER_ENTERED", 
          resource:{range: `ชีต1!A${sheet+1}:B${sheet+1}`, majorDimension: "ROWS", values: [[`${args[1]}`, `${args[2]}`]] }
      });
      linetext = {"type":"text","text": "อัพเดตสินค้าแล้ว"}
          return client.replyMessage(event.replyToken,linetext)
    }else if(cmd == "item"){
      if (args[1]==null) {
        linetext = {"type":"text","text": "ไม่พบสินค้าในระบบ"}
        return client.replyMessage(event.replyToken,linetext)
      }
      else if (check !== true){
        linetext = {"type":"text","text": "ไม่พบสินค้า"}
        return client.replyMessage(event.replyToken,linetext)
      }
      linetext = flexbox
      return client.replyMessage(event.replyToken,linetext)
    }
        linetext = {"type":"text","text": "ไม่พบคำสั่งพิม !stock !update เช่น !update สินค้า ราคา !item เช่น !item สินค้า"}
        return client.replyMessage(event.replyToken, linetext)
  /* else if (เพิ่มคำสั่งไปเรื่อยๆ) {
       // ตอบกลับข้อความ หรือให้จะทำอะไรสักอย่าง do something
    } else {
       // ไม่พบคำสั่ง หรือให้จะทำอะไรสักอย่าง do something
    }
    // args จะแบ่ง array ตามการเว้นวรรค เช่น !update สินค้า 10
    // ก็จะมีอยู่ 2 str ใน array เช่น args[0] == "update" ( ที่ไม่มี ! คือตัดออกตรงที่ประกาศตัวแปลบรรทัดที่ 3 )
    // args[1] == "สินค้า" 
    // args[2] == "10"
    // เลยทำดักในคำสั่งไว้ว่า ถ้า args[array] == null คือว่าง ให้ส่งข้อมูลกลับทันทีเหมือนประโยคไม่ครบอ่ะ*/
    
}
}
// app.listen(4000, () =>{
//     console.log('listening on 4000');
// });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(PORT);
    console.log(`listening on Port ${PORT}`);
});

