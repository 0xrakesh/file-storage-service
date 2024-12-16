import express from 'express';
import multer from 'multer';
import { configDotenv } from 'dotenv';
import authentication from './middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
configDotenv();

const app = express();

// Configuration
app.use(express.json())
app.use(authentication);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8080

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./uploads');
    },
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({storage:storage});

app.get("/v1/api/file/:filename", (req,res) => {
    const filename = req.params.filename;
    if(!filename) return res.status(400).json({message:"Invalid filename"});
    const imagePath = path.join(__dirname,'uploads',filename);
    res.status(200).sendFile(imagePath,(err) => {
        if(err) res.status(500).send("Internal server issue.");
    })
})

app.post("/v1/api/upload",upload.single("image"), (req,res) => {
    if(!req.file) return res.status(400).json({filename:"No file uploaded"});
    return res.status(200).json({filename:req.file.filename});
})

app.listen(port,() => {
    console.log(`Server listening on port ${port}`);
})