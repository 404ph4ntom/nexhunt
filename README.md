# NexHunt - Hybrid Bug Bounty Platform

A production-grade, hybrid bug bounty platform supporting both **Web2** and **Web3** projects, combining the best features of HackerOne and Immunefi.

## 🚀 Features

### Core Capabilities
- **Dual Program Types**: Support for both Web2 (APIs, web apps, mobile) and Web3 (smart contracts, DeFi, bridges)
- **Bounty Management**: Dynamic bounty tables with severity-based rewards
- **Submission System**: Comprehensive vulnerability submission with file attachments
- **Triaging Workflow**: Status tracking (New → Triaged → Needs More Info → Resolved)
- **Payout System**: Multiple payment methods (PayPal, Wise, Bank Transfer, Crypto, On-chain)
- **Security First**: Encrypted file storage, virus scanning, rate limiting, audit logging

### Web3 Features
- **SIWE (Sign-In With Ethereum)**: Wallet-based authentication
- **Multi-chain Support**: Support for multiple blockchain networks
- **On-chain Payouts**: Solidity escrow contract for secure payouts
- **Contract Integration**: Direct smart contract interaction fields

### Web2 Features
- **CVSS Calculator**: Built-in CVSS scoring for vulnerabilities
- **Traditional Auth**: Email/password, Magic Link, OAuth2 (Google, GitHub)
- **Standard Scope**: URL/domain-based in-scope/out-of-scope management

### Security Features
- **Encryption at Rest**: All sensitive data encrypted
- **Virus Scanning**: ClamAV integration for file uploads
- **Rate Limiting**: IP and user-based rate limiting
- **Audit Logging**: Complete audit trail for all actions
- **2FA Support**: Two-factor authentication for program owners and admins
- **IDOR Protection**: Comprehensive access control checks

## 📁 Project Structure

```
nexhunt/
├── backend/          # NestJS backend API
├── frontend/         # Next.js 15 frontend
├── contracts/        # Solidity smart contracts
└── docs/            # Documentation
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Cache/Sessions**: Redis
- **Storage**: AWS S3 / Cloudflare R2
- **Auth**: JWT, SIWE, OAuth2
- **File Scanning**: ClamAV

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS, shadcn/ui
- **State**: Zustand, TanStack Query
- **Web3**: Wagmi, Viem, WalletConnect v2
- **i18n**: next-intl (English/Persian RTL)

### Smart Contracts
- **Framework**: Hardhat
- **Language**: Solidity ^0.8.20
- **Security**: OpenZeppelin Contracts

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)
- ClamAV (for virus scanning)

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database**:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

5. **Start backend**:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

4. **Start frontend**:
```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

### Docker Setup

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- ClamAV virus scanner
- Backend API (port 3001)
- Frontend (port 3000)

## 📝 Environment Variables

### Backend (.env)
See `backend/.env.example` for all required variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: S3/R2 credentials
- `REDIS_HOST` / `REDIS_PORT`: Redis connection
- `CLAMAV_HOST` / `CLAMAV_PORT`: ClamAV server
- `OPENAI_API_KEY`: For embedding generation (similarity detection)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

## 🔐 Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Enable 2FA**: For all admin and program owner accounts
3. **Regular updates**: Keep dependencies up to date
4. **Rate limiting**: Configured at 100 req/min per IP
5. **File scanning**: All uploads are scanned with ClamAV
6. **Encryption**: All sensitive data encrypted at rest

## 🧪 Testing

### Backend
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Contracts
```bash
cd contracts
npm run test
```

## 📚 API Documentation

Once the backend is running, Swagger docs are available at:
```
http://localhost:3001/api/docs
```

## 🌐 Deployment

### Backend (Railway/Render)
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

### Frontend (Vercel)
1. Import project from GitHub
2. Set environment variables
3. Deploy automatically

### Database
- Use managed PostgreSQL (Supabase, Railway, Render)
- Configure Prisma Accelerate for connection pooling

### Storage
- AWS S3 or Cloudflare R2
- Configure bucket policies for private access

### Smart Contracts
```bash
cd contracts
npm run deploy:sepolia  # Testnet
npm run deploy:mainnet  # Mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Automated vulnerability scanning integration
- [ ] Mobile app (React Native)
- [ ] Multi-signature wallet support
- [ ] AI-powered duplicate detection improvements
- [ ] Public API for program management
- [ ] Integration with major bug bounty platforms

---

Built with ❤️ by the NexHunt team

