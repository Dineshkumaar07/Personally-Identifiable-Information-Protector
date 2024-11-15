import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Upload from './components/Upload';
import Files from './components/Files';
import DownloadByID from './components/DownloadByID';
import artifact from "../../build/contracts/DocumentStorage.json";
import { ethers } from 'ethers';

const Navbar = () => (
  <nav className='font-bold flex gap-9'>
    <Link to="/upload"><button className='px-3 py-2 border rounded-md flex gap-9 border-black'>Upload</button></Link>
    <Link to="/files"><button className='px-3 py-2 border rounded-md border-black'>See Files</button></Link>
    <Link to="/download"><button className='px-3 py-2 border rounded-md border-black'>Download Document</button></Link>
  </nav>
);

function App() {
  const [account, setAccount] = useState(null);
  const [provider, SetProvider] = useState(null);
  const [signer, SetSigner] = useState(null);
  const [contract, SetContract] = useState(null);
  const contractAddress = "0x5276DACa5E24C40122288f725091BEe49C7E1CC6";
  const abi = artifact.abi;

  async function connectMetamask() {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        SetProvider(provider);
        SetSigner(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer);
        SetContract(contract);
      });
    }
  }

  return (
    <Router>
      <div className='flex flex-col items-center pt-24 gap-9'>
        {account && <Navbar />}
        
        <div className='flex flex-col items-center justify-center gap-9'>
          {account ? 
            <p className=" ">Account Connected Successfully {account} </p> :
            <button onClick={connectMetamask} className="bg-blue-500 text-white p-2 rounded-md">Connect</button>}
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/upload" element={<Upload contract={contract} />} />
            <Route path="/files" element={<Files contract={contract} />} />
            <Route path="/download" element={<DownloadByID contract={contract} account={account} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
