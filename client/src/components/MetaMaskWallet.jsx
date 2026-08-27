/**
 * MetaMask Wallet Component for GrievanceIQ
 * Handles Web3 wallet connections and blockchain interactions
 */

import React, { useState, useEffect, useCallback } from 'react';
import './MetaMaskWallet.css';

const MetaMaskWallet = ({ onWalletConnect, onWalletDisconnect }) => {
    const [wallet, setWallet] = useState({
        connected: false,
        address: null,
        chainId: null,
        balance: null,
        network: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [networkStatus, setNetworkStatus] = useState(null);

    // Check if MetaMask is installed
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    };

    // Get wallet accounts
    const getAccounts = useCallback(async () => {
        try {
            if (!isMetaMaskInstalled()) {
                throw new Error('MetaMask is not installed');
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            return accounts;
        } catch (error) {
            console.error('❌ Failed to get accounts:', error);
            throw error;
        }
    }, []);

    // Get network information
    const getNetworkInfo = useCallback(async () => {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const networkId = parseInt(chainId, 16);
            
            const networks = {
                1: 'Ethereum Mainnet',
                31337: 'Hardhat Local',
                11155111: 'Sepolia Testnet'
            };

            return {
                chainId,
                networkId,
                name: networks[networkId] || `Unknown (${networkId})`
            };
        } catch (error) {
            console.error('❌ Failed to get network info:', error);
            return null;
        }
    }, []);

    // Get wallet balance
    const getBalance = useCallback(async (address) => {
        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            });

            // Convert from wei to ETH
            const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
            return ethBalance.toFixed(4);
        } catch (error) {
            console.error('❌ Failed to get balance:', error);
            return '0.0000';
        }
    }, []);

    // Connect wallet
    const connectWallet = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isMetaMaskInstalled()) {
                throw new Error('Please install MetaMask to connect your wallet');
            }

            const accounts = await getAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found in MetaMask');
            }

            const address = accounts[0];
            const networkInfo = await getNetworkInfo();
            const balance = await getBalance(address);

            const walletData = {
                connected: true,
                address,
                chainId: networkInfo?.chainId,
                networkId: networkInfo?.networkId,
                network: networkInfo?.name,
                balance
            };

            setWallet(walletData);

            // Notify backend about wallet connection
            try {
                const response = await fetch('/api/web3/wallet-connect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address,
                        chainId: networkInfo?.chainId
                    })
                });

                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('GrievanceIQ_wallet_session', result.data.sessionToken);
                }
            } catch (backendError) {
                console.warn('⚠️ Backend wallet connection failed:', backendError);
                // Continue with frontend connection even if backend fails
            }

            if (onWalletConnect) {
                onWalletConnect(walletData);
            }

        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Disconnect wallet
    const disconnectWallet = () => {
        setWallet({
            connected: false,
            address: null,
            chainId: null,
            balance: null,
            network: null
        });

        localStorage.removeItem('GrievanceIQ_wallet_session');

        if (onWalletDisconnect) {
            onWalletDisconnect();
        }
    };

    // Switch to Hardhat local network
    const switchToHardhat = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7A69' }], // 31337 in hex
            });
        } catch (switchError) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x7A69',
                            chainName: 'Hardhat Local',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['http://127.0.0.1:8545'],
                            blockExplorerUrls: ['http://localhost:8545']
                        }]
                    });
                } catch (addError) {
                    console.error('❌ Failed to add Hardhat network:', addError);
                    setError('Failed to add Hardhat network to MetaMask');
                }
            } else {
                console.error('❌ Failed to switch network:', switchError);
                setError('Failed to switch to Hardhat network');
            }
        }
    };

    // Get network status from backend
    const fetchNetworkStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/web3/network-status');
            const result = await response.json();
            
            if (result.success) {
                setNetworkStatus(result.data);
            }
        } catch (error) {
            console.error('❌ Failed to fetch network status:', error);
        }
    }, []);

    // Handle account changes
    useEffect(() => {
        if (isMetaMaskInstalled()) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else if (accounts[0] !== wallet.address && wallet.connected) {
                    // Account changed, reconnect with new account
                    connectWallet();
                }
            };

            const handleChainChanged = (chainId) => {
                if (wallet.connected) {
                    // Network changed, update wallet info
                    connectWallet();
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [wallet.address, wallet.connected, connectWallet]);

    // Fetch network status on mount
    useEffect(() => {
        fetchNetworkStatus();
    }, [fetchNetworkStatus]);

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Get network color
    const getNetworkColor = (networkId) => {
        const colors = {
            1: '#627EEA', // Ethereum blue
            31337: '#FFA500', // Orange for Hardhat
            11155111: '#FF6B35' // Red for Sepolia
        };
        return colors[networkId] || '#999999';
    };

    return (
        <div className="metamask-wallet">
            <div className="wallet-header">
                <h3>🦊 MetaMask Wallet</h3>
                {networkStatus && (
                    <div className="network-status">
                        <span className={`status-dot ${networkStatus.connected ? 'connected' : 'disconnected'}`}></span>
                        <span className="network-name">{networkStatus.network}</span>
                        <span className="block-number">Block: {networkStatus.blockNumber}</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="close-error">×</button>
                </div>
            )}

            {!isMetaMaskInstalled() ? (
                <div className="metamask-install">
                    <div className="install-message">
                        <h4>MetaMask Required</h4>
                        <p>Please install MetaMask browser extension to use blockchain features.</p>
                        <a
                            href="https://metamask.io/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="install-button"
                        >
                            Install MetaMask
                        </a>
                    </div>
                </div>
            ) : !wallet.connected ? (
                <div className="wallet-connect">
                    <p>Connect your MetaMask wallet to access blockchain features</p>
                    <button
                        onClick={connectWallet}
                        disabled={loading}
                        className="connect-button"
                    >
                        {loading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
                    </button>
                </div>
            ) : (
                <div className="wallet-info">
                    <div className="wallet-details">
                        <div className="detail-row">
                            <span className="label">Address:</span>
                            <span className="value address" title={wallet.address}>
                                {formatAddress(wallet.address)}
                            </span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Network:</span>
                            <span className="value network" style={{ color: getNetworkColor(wallet.networkId) }}>
                                {wallet.network}
                            </span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Balance:</span>
                            <span className="value balance">
                                {wallet.balance} ETH
                            </span>
                        </div>
                    </div>

                    <div className="wallet-actions">
                        {wallet.networkId !== 31337 && (
                            <button onClick={switchToHardhat} className="network-button">
                                Switch to Hardhat
                            </button>
                        )}
                        <button onClick={disconnectWallet} className="disconnect-button">
                            Disconnect
                        </button>
                    </div>
                </div>
            )}

            {wallet.connected && (
                <div className="blockchain-features">
                    <h4>🔗 Blockchain Features</h4>
                    <div className="features-list">
                        <div className="feature">✅ Citizen Registration</div>
                        <div className="feature">✅ Document Storage</div>
                        <div className="feature">✅ Grievance Submission</div>
                        <div className="feature">✅ Document Verification</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetaMaskWallet;
