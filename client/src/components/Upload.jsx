import React, { useState } from 'react';

const Upload = ({ contract }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [cid, setCid] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setCid(data.cid);


    await contract.uploadDocument(name, data.cid);
    alert('Document uploaded successfully!');
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
      <input
        type="text"
        placeholder="Document Name"
        className="border p-2 mb-4 w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="file"
        className="border p-2 mb-4"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Upload
      </button>
      {cid && <p className="mt-4">Uploaded to IPFS with CID: {cid}</p>}
    </div>
  );
};

export default Upload;
