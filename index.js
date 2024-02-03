const express = require("express")
require('dotenv').config();
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const bodyParser = require("body-parser")
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

app.get("/",(req,res)=>{
    res.send("home")
})

app.post('/profile', upload.single('avatar'), function (req, res, next) {
   
    res.send("image uploaded")
  })
app.put('*',upload.single('avatar'), async (req,res) => {
    let filename = req.path.slice(1)
    console.log(filename)
    console.log(typeof req.body)
  
    try {
        await s3.putObject({
          Body: req.file,
          Bucket: process.env.BUCKET,
          Key: filename,
        }).promise();
        res.set('Content-type', req.file.mimetype);
        res.send('ok').end();
      } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).send('Internal Server Error').end();
      }
    })      
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})