// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BountyEscrow
 * @notice Escrow contract for managing bug bounty payouts on-chain
 * @dev Supports both ETH and ERC20 token payouts with multi-sig controls
 */
contract BountyEscrow is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAYOUT_ROLE = keccak256("PAYOUT_ROLE");

    struct Payout {
        address hunter;
        address token; // address(0) for ETH
        uint256 amount;
        string reportId;
        uint256 createdAt;
        uint256 executedAt;
        bool executed;
        bool cancelled;
    }

    mapping(uint256 => Payout) public payouts;
    mapping(address => uint256) public pendingAmounts; // token => amount
    mapping(address => uint256) public totalPaid; // hunter => total amount

    uint256 public payoutCount;
    uint256 public totalEthDeposited;
    mapping(address => uint256) public totalTokenDeposited; // token => amount

    event PayoutCreated(
        uint256 indexed payoutId,
        address indexed hunter,
        address indexed token,
        uint256 amount,
        string reportId
    );

    event PayoutExecuted(
        uint256 indexed payoutId,
        address indexed hunter,
        address indexed token,
        uint256 amount,
        string reportId
    );

    event PayoutCancelled(
        uint256 indexed payoutId,
        string reason
    );

    event Deposit(address indexed token, uint256 amount, address indexed depositor);
    event Withdrawal(address indexed token, uint256 amount, address indexed to);

    modifier validPayout(uint256 payoutId) {
        require(payoutId < payoutCount, "Invalid payout ID");
        require(!payouts[payoutId].executed, "Payout already executed");
        require(!payouts[payoutId].cancelled, "Payout cancelled");
        _;
    }

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(PAYOUT_ROLE, admin);
    }

    /**
     * @notice Create a new payout
     * @param hunter Address of the bounty hunter
     * @param token ERC20 token address (address(0) for ETH)
     * @param amount Amount to pay out
     * @param reportId Report ID for tracking
     * @return payoutId The ID of the created payout
     */
    function createPayout(
        address hunter,
        address token,
        uint256 amount,
        string calldata reportId
    ) external onlyRole(PAYOUT_ROLE) nonReentrant returns (uint256) {
        require(hunter != address(0), "Invalid hunter address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Check sufficient balance
        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient ETH balance");
        } else {
            require(
                IERC20(token).balanceOf(address(this)) >= amount,
                "Insufficient token balance"
            );
        }

        uint256 payoutId = payoutCount++;
        payouts[payoutId] = Payout({
            hunter: hunter,
            token: token,
            amount: amount,
            reportId: reportId,
            createdAt: block.timestamp,
            executedAt: 0,
            executed: false,
            cancelled: false
        });

        if (token == address(0)) {
            pendingAmounts[address(0)] += amount;
        } else {
            pendingAmounts[token] += amount;
        }

        emit PayoutCreated(payoutId, hunter, token, amount, reportId);
        return payoutId;
    }

    /**
     * @notice Execute a payout
     * @param payoutId ID of the payout to execute
     */
    function executePayout(uint256 payoutId) external onlyRole(PAYOUT_ROLE) validPayout(payoutId) nonReentrant {
        Payout storage payout = payouts[payoutId];

        if (payout.token == address(0)) {
            // ETH payout
            require(address(this).balance >= payout.amount, "Insufficient ETH balance");
            pendingAmounts[address(0)] -= payout.amount;
            
            (bool success, ) = payout.hunter.call{value: payout.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 payout
            IERC20 token = IERC20(payout.token);
            require(
                token.balanceOf(address(this)) >= payout.amount,
                "Insufficient token balance"
            );
            pendingAmounts[payout.token] -= payout.amount;
            
            token.safeTransfer(payout.hunter, payout.amount);
        }

        payout.executed = true;
        payout.executedAt = block.timestamp;
        totalPaid[payout.hunter] += payout.amount;

        emit PayoutExecuted(
            payoutId,
            payout.hunter,
            payout.token,
            payout.amount,
            payout.reportId
        );
    }

    /**
     * @notice Cancel a payout
     * @param payoutId ID of the payout to cancel
     * @param reason Reason for cancellation
     */
    function cancelPayout(uint256 payoutId, string calldata reason) external onlyRole(ADMIN_ROLE) validPayout(payoutId) {
        Payout storage payout = payouts[payoutId];
        
        payout.cancelled = true;
        
        if (payout.token == address(0)) {
            pendingAmounts[address(0)] -= payout.amount;
        } else {
            pendingAmounts[payout.token] -= payout.amount;
        }

        emit PayoutCancelled(payoutId, reason);
    }

    /**
     * @notice Deposit ETH to the escrow
     */
    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        totalEthDeposited += msg.value;
        emit Deposit(address(0), msg.value, msg.sender);
    }

    /**
     * @notice Deposit ERC20 tokens to the escrow
     * @param token Token address
     * @param amount Amount to deposit
     */
    function depositToken(address token, uint256 amount) external {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        totalTokenDeposited[token] += amount;
        
        emit Deposit(token, amount, msg.sender);
    }

    /**
     * @notice Withdraw excess funds (admin only)
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     * @param to Recipient address
     */
    function withdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        require(to != address(0), "Invalid recipient");
        
        if (token == address(0)) {
            uint256 available = address(this).balance - pendingAmounts[address(0)];
            require(available >= amount, "Insufficient available ETH");
            
            (bool success, ) = to.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            uint256 available = IERC20(token).balanceOf(address(this)) - pendingAmounts[token];
            require(available >= amount, "Insufficient available tokens");
            
            IERC20(token).safeTransfer(to, amount);
        }

        emit Withdrawal(token, amount, to);
    }

    /**
     * @notice Get payout details
     * @param payoutId Payout ID
     * @return payout Payout struct
     */
    function getPayout(uint256 payoutId) external view returns (Payout memory) {
        require(payoutId < payoutCount, "Invalid payout ID");
        return payouts[payoutId];
    }

    /**
     * @notice Get available balance (total - pending)
     * @param token Token address (address(0) for ETH)
     * @return available Available amount
     */
    function getAvailableBalance(address token) external view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance - pendingAmounts[address(0)];
        } else {
            return IERC20(token).balanceOf(address(this)) - pendingAmounts[token];
        }
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        totalEthDeposited += msg.value;
        emit Deposit(address(0), msg.value, msg.sender);
    }
}

