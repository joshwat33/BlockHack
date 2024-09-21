import { useState } from 'react';
import { ethers } from 'ethers';
import { Contract, BrowserProvider } from "ethers";
import { contractAddress } from "./deployed_addresses.json"; // Update with your contract address
import { abi } from "./IHive.json"; // ABI of your IHive contract

// Initialize provider
const provider = new BrowserProvider(window.ethereum);

function App() {
  // State for form input
  const [formData, setFormData] = useState({
    idea: '',
  });

  const [output, setOutput] = useState("");
  const [checkIdea, setCheckIdea] = useState('');

  // Connect MetaMask
  async function connectMetaMask() {
    const signer = await provider.getSigner();
    alert(`Successfully Connected ${await signer.getAddress()}`);
  }

  // Handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Submit the idea to the blockchain
  const handleSubmit = async (event) => {
    event.preventDefault();
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    // Submitting the idea along with some Ether (for example, 0.01 ETH)
    const trx = await instance.addIdea(formData.idea, {
      value: ethers.parseEther("0.01"),
    });
    console.log('Transaction Hash:', trx.hash);

    resetForm();
  };

  // Reset the form after submission
  const resetForm = () => {
    setFormData({ idea: '' });
  };

  // Check if the idea exists in the blockchain
  const checkIfIdeaExists = async () => {
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    const exists = await instance.ideaExists(checkIdea);
    setOutput(exists ? "Idea already exists!" : "No similar idea found.");
  };

  return (
    <>
      <h1>IHive - Submit Your Unique Idea</h1>
      <button onClick={connectMetaMask}>Connect MetaMask</button>
      
      {/* Form to submit idea */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label htmlFor="idea">Your Idea:</label>
          <input
            type="text"
            id="idea"
            name="idea"
            value={formData.idea}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <button type="submit">Submit Idea</button>
          <button type="button" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>

      <br />
      <br />

      {/* Section to check if idea exists */}
      <div>
        <label htmlFor="checkIdea">Check Idea:</label>
        <input
          type="text"
          id="checkIdea"
          value={checkIdea}
          onChange={(e) => setCheckIdea(e.target.value)}
          required
        />
      </div>
      <br />
      <button onClick={checkIfIdeaExists}>Check Idea</button>
      <p>{output}</p>
    </>
  );
}

export default App;
