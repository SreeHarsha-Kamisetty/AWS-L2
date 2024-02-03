const express = require('express')
const app = express()
const multer = require('multer');
const AWS = require('aws-sdk');

require('dotenv').config()
const s3 = new AWS.S3()
const bodyParser = require('body-parser');

app.use(bodyParser.json())


// using multer memoryStorage
const upload = multer({storage:multer.memoryStorage()})


app.get('/image/:key', (req, res) => {
    const key = req.params.key;
  
    // Generate a pre-signed URL for the image
    const params = {
      Bucket: "cyclic-rich-gray-coypu-kit-eu-west-3",
      Key: key,
      Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
    };
  
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating pre-signed URL');
      }
      res.setHeader('Content-Disposition', 'inline');
      // Redirect the client to the pre-signed URL
      res.send(url);
    });
  });


app.put('/image/:filename', upload.single('file'), async (req, res) => {
  let filename = req.params.filename;

  if (!req.file) {
    res.status(400).send('No file uploaded').end();
    return;
  }

  try {

      await s3.putObject({
    Body: req.file.buffer,
    Bucket: "cyclic-rich-gray-coypu-kit-eu-west-3",
    Key: filename,
  }).promise()

  res.set('Content-type', 'multipart/form-data')
  res.send('ok').end()
  } catch (error) {
    console.log(error);
    res.sendStatus(500).end();
  }
});




// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening at http://localhost:${port}`)
})