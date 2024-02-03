const express = require("express")

const app = express();

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


app.listen(8080,()=>{
    console.log("Server running at http://localhost:8080")
})