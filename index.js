
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const transferButton = document.getElementById('transferButton')
const balanceButton = document.getElementById("balanceButton")
const ownerAddressButton = document.getElementById("ownerAddressButton")
const addressesInput = document.getElementById("addresses");
const amountsInput = document.getElementById("amounts");
const statusDisplay = document.getElementById("status");

connectButton.onclick = connect
transferButton.onclick = transferETH
balanceButton.onclick = getBalance
ownerAddressButton.onclick = getOwner

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}


async function transferETH() {
    const addresses = addressesInput.value.split(",").map(addressesInput => addressesInput.trim());
    const amounts = amountsInput.value.split(",");


    if (addresses.length !== amounts.length) {
        statusDisplay.textContent = "Address and amount count mismatch";
        return;
    }

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const parsedAmounts = amounts.map(amount => ethers.utils.parseEther(amount.trim()))

            const transactionResponse = await contract.multiTransferETH(addresses, parsedAmounts, {
                value: parsedAmounts.reduce((total, amount) => total.add(amount), ethers.BigNumber.from(0))
            })


            await transactionResponse.wait();
            statusDisplay.textContent = "Transactions successful!";
        } catch (error) {
            console.log(error);
            statusDisplay.textContent = "Transaction failed.";
        }
    } else {
        statusDisplay.textContent = "Please Install Metamask!";
    }
}




async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}

async function getOwner() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        try {
            const ownerAddress = await contract.owner();
            console.log("Contract owner:", ownerAddress);
        } catch (error) {
            console.log(error);
        }
    } else {
        ownerAddressButton.innerHTML = "Please install MetaMask"
    }
}

// [0x9d6813f752BFA419259A10649C3EC54De645D0fD, 0x15c241a48ea3D3067407F07e0454A42bA1B0a837]
//[ 100000000000000, 100000000000000]