import { create } from 'ipfs-http-client';
import express from 'express';
import fileUpload from 'express-fileupload';
import mime from 'mime-types';
import cors from 'cors';
const app = express();
const port = 3001;

const ipfs = create({ url: 'http://localhost:5001' });

app.use(fileUpload());
app.use(cors());
//upload a document
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  try {
    const result = await ipfs.add(file.data);
    console.log(result.path);
    res.send({ cid: result.path });
    
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

//retrieve a document
app.get('/retrieve/:hash', async (req, res) => {
  const { hash } = req.params;
  try {
    const stream = ipfs.cat(hash);  
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);  
    }

    const fileBuffer = Buffer.concat(chunks);  

    const fileName = 'document.pdf'; 
    const mimeType = mime.lookup(fileName) || 'application/octet-stream';  

    //headers to force download
    res.set({
      'Content-Type': mimeType,  
      'Content-Disposition': `attachment; filename="${fileName}"`,  
      'Content-Length': fileBuffer.length
    });

    // Send the file buffer as the response
    res.send(fileBuffer);

  } catch (error) {
    console.error('Error retrieving file:', error);  // Log error
    res.status(500).send('Error retrieving file: ' + error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

