import { useState } from 'react';

const DownloadByID = ({ contract, account }) => {
    const [uniqueId, setUniqueId] = useState('');
    const [cid, setCid] = useState('');
    const [error, setError] = useState('');

    const handleDownload = async () => {
        try {
            const hasPermission = await contract.hasPermission(uniqueId, account);
            if (!hasPermission) {
                alert("You do not have permission to access this document.");
                return;
            }

            const cid = await contract.getCidByUniqueId(uniqueId);
            setCid(cid);

            const response = await fetch(`http://localhost:3001/retrieve/${cid}`);
            if (!response.ok) {
                throw new Error('Failed to download the document.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document_${uniqueId}.pdf`); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link); 
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Download Document by Unique ID</h2>
                
                <input
                    type="text"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    placeholder="Enter Unique ID"
                    className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                    onClick={handleDownload}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Download Document
                </button>
                
                {cid && <p className="mt-4 text-center text-gray-600">CID: <span className="font-semibold">{cid}</span></p>}
                {error && <p className="mt-4 text-red-500 text-center">Error: {error}</p>}
            </div>
        </div>
    );
};

export default DownloadByID;
