const express = require("express")
require('dotenv').config();

const path = require("path")
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const bodyParser = require("body-parser")
const multer = require("multer")
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "/tmp")
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.originalname)
//     }
//   })
const storage = multer.memoryStorage();
  const upload = multer({ storage: storage })

// app.get("/",(req,res)=>{
//     res.send("home")
// })

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
   
//     res.send("image uploaded")
//   })
  app.post('*', upload.single('avatar'), async (req, res) => {
    let filename = req.path.slice(1);
    console.log(filename);
    console.log(req.file.buffer);

    try {
        await s3.putObject({
            Body: req.file.buffer,
            Bucket: "cyclic-rich-gray-coypu-kit-eu-west-3",
            Key: filename,
        }).promise();
        res.set('Content-type', req.file.mimetype);
        res.send('ok').end();
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).send('Internal Server Error').end();
    }
});     

app.get('*', async (req,res) => {
    let filename = req.path.slice(1)
  
    try {
      let s3File = await s3.getObject({
        Bucket: process.env.BUCKET,
        Key: filename,
      }).promise()
  
      res.set('Content-type', s3File.ContentType)
      res.send(s3File.Body.toString()).end()
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        console.log(`No such key ${filename}`)
        res.sendStatus(404).end()
      } else {
        console.log(error)
        res.sendStatus(500).end()
      }
    }
  })
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})