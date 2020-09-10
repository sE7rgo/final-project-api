const router = require("express").Router();
require('dotenv').config();
const bodyParser = require('body-parser');


const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
 
const client = require('twilio')(accountSid, authToken, { 
    lazyLoading: true 
});

confirmationText = (times) => {
    let number = '';
    let num = 1;
    while (num < times) {
      const randomNumber = Math.floor(Math.random() * Math.floor(9));
      number += Number(randomNumber);
      num++;
    }
    return number;
  }

module.exports = () => {
  const text = confirmationText(6)
  router.post("/confirmation", (req,res) => {
    client.messages
      .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: req.body.to,
        body: `confirmation text from BC Parks: ${text}`,
        mediaUrl: ['https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg']
      })
      .then(() => {
        res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
    });

    router.post("/verification", (req, res) => {
      if (req.body.code === text) {
        res.send(JSON.stringify({ success: true }));
      } else {
        console.log('error')
        res.send(JSON.stringify({ success: false }));
      }
    })

    router.post("/success", (req,res) => {
      client.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: req.body.to,
          body: `You've received the day pass for ${req.body.trail}.
                  Lets go for a hike!`
        })
        .then(() => {
          res.send(JSON.stringify({ success: true }));
        })
        .catch(err => {
          console.log(err);
          res.send(JSON.stringify({ success: false }));
        });
      });

      router.post("/declined", (req,res) => {
        client.messages
          .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.to,
            body: `Your Day Pass for ${req.body.trail} was declined.
                    Try another trail.`
          })
          .then(() => {
            res.send(JSON.stringify({ success: true }));
          })
          .catch(err => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
          });
        });
  return router
}