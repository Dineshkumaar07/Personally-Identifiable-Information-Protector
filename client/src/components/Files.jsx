import { useEffect, useState } from 'react';

const Files = ({ contract }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const userDocuments = await contract.getDocumentsByUser();
            setDocuments(userDocuments);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (contract) {
            fetchDocuments();
        }
    }, [contract]);

    const grantPermission = async (uniqueId, userAddress) => {
        try {
            await contract.grantPermission(uniqueId, userAddress);
            alert(`Permission granted to ${userAddress}`);
            fetchDocuments(); 
        } catch (error) {
            console.error('Error granting permission:', error);
            alert('Error granting permission');
        }
    };

    const revokePermission = async (uniqueId, userAddress) => {
        try {
            await contract.revokePermission(uniqueId, userAddress);
            alert(`Permission revoked from ${userAddress}`);
            fetchDocuments(); 
        } catch (error) {
            console.error('Error revoking permission:', error);
            alert('Error revoking permission');
        }
    };

    const showPermissions = async (uniqueId) => {
        try {
            const permissions = await contract.getPermissions(uniqueId);
            if (permissions.length > 0) {
                alert(`Users with permission: ${permissions.join(', ')}`);
            } else {
                alert('No users have permission for this document.');
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
            alert("Failed to fetch permissions.");
        }
    };

    const handleDownload = async (cid) => {
        try {
            const response = await fetch(`http://localhost:3001/retrieve/${cid}`);
            if (!response.ok) {
                throw new Error('Failed to download the document.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document_${cid}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Your Documents</h2>
            {loading ? (
                <p>Loading documents...</p>
            ) : documents.length > 0 ? (
                <ul className="space-y-4">
                    {documents.map((doc) => (
                        <li key={doc.uniqueId.toString()} className="bg-white shadow-md rounded-lg p-4">
                            <p><strong>Unique ID:</strong> {doc.uniqueId.toString()}</p>
                            <p><strong>Name:</strong> {doc.name}</p>
                            <p><strong>CID:</strong> {doc.cid}</p>
                            <button onClick={() => showPermissions(doc.uniqueId)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                                Show Permissions
                            </button>
                            
                            <input 
                                type="text" 
                                placeholder="Enter address to grant permission" 
                                className="border border-gray-300 p-2 rounded mb-2 w-full mt-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        grantPermission(doc.uniqueId, e.target.value);
                                        e.target.value = ''; 
                                    }
                                }} 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Enter address to revoke permission" 
                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        revokePermission(doc.uniqueId, e.target.value);
                                        e.target.value = ''; 
                                    }
                                }} 
                            />
                            
                            <button 
                                onClick={() => handleDownload(doc.cid)} 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2"
                            >
                                Download Document
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No documents uploaded.</p>
            )}
        </div>
    );
};

export default Files;

