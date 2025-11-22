# NexHunt - Complete File Tree

```
nexhunt/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   ├── public.decorator.ts
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── rate-limit.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── validation.pipe.ts
│   │   │   └── utils/
│   │   │       ├── encryption.util.ts
│   │   │       ├── file.util.ts
│   │   │       └── embedding.util.ts
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   ├── s3.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── app.config.ts
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── siwe.strategy.ts
│   │   │   │   └── oauth.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       ├── siwe.dto.ts
│   │   │       └── refresh.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── programs/
│   │   │   ├── programs.module.ts
│   │   │   ├── programs.controller.ts
│   │   │   ├── programs.service.ts
│   │   │   ├── entities/
│   │   │   │   └── program.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-program.dto.ts
│   │   │       ├── update-program.dto.ts
│   │   │       └── program-filter.dto.ts
│   │   ├── reports/
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── entities/
│   │   │   │   └── report.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-report.dto.ts
│   │   │       ├── update-report.dto.ts
│   │   │       └── report-filter.dto.ts
│   │   ├── submissions/
│   │   │   ├── submissions.module.ts
│   │   │   ├── submissions.controller.ts
│   │   │   ├── submissions.service.ts
│   │   │   ├── entities/
│   │   │   │   └── submission.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-submission.dto.ts
│   │   │       └── update-submission.dto.ts
│   │   ├── payouts/
│   │   │   ├── payouts.module.ts
│   │   │   ├── payouts.controller.ts
│   │   │   ├── payouts.service.ts
│   │   │   ├── entities/
│   │   │   │   └── payout.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-payout.dto.ts
│   │   │       └── process-payout.dto.ts
│   │   ├── files/
│   │   │   ├── files.module.ts
│   │   │   ├── files.controller.ts
│   │   │   └── files.service.ts
│   │   ├── audit/
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.service.ts
│   │   │   └── entities/
│   │   │       └── audit-log.entity.ts
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .gitignore
│   ├── .prettierrc
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── programs/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── submit/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leaderboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── programs/
│   │   │   │   │       └── [id]/
│   │   │   │   │           └── page.tsx
│   │   │   │   └── api/
│   │   │   │       └── auth/
│   │   │   │           └── [...nextauth]/
│   │   │   │               └── route.ts
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── textarea.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── program/
│   │   │   │   │   ├── program-card.tsx
│   │   │   │   │   ├── program-filters.tsx
│   │   │   │   │   ├── program-form.tsx
│   │   │   │   │   ├── scope-editor.tsx
│   │   │   │   │   └── bounty-table.tsx
│   │   │   │   ├── report/
│   │   │   │   │   ├── report-form.tsx
│   │   │   │   │   ├── report-card.tsx
│   │   │   │   │   ├── report-details.tsx
│   │   │   │   │   ├── severity-selector.tsx
│   │   │   │   │   └── cvss-calculator.tsx
│   │   │   │   ├── submission/
│   │   │   │   │   ├── submission-form.tsx
│   │   │   │   │   ├── submission-timeline.tsx
│   │   │   │   │   └── file-upload.tsx
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login-form.tsx
│   │   │   │   │   ├── register-form.tsx
│   │   │   │   │   └── siwe-button.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── footer.tsx
│   │   │   │   └── web3/
│   │   │   │       ├── wallet-connect.tsx
│   │   │   │       └── chain-selector.tsx
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── i18n.ts
│   │   │   ├── store/
│   │   │   │   ├── auth-store.ts
│   │   │   │   ├── program-store.ts
│   │   │   │   └── ui-store.ts
│   │   │   └── hooks/
│   │   │       ├── use-auth.ts
│   │   │       ├── use-programs.ts
│   │   │       └── use-submissions.ts
│   │   ├── public/
│   │   │   ├── locales/
│   │   │   │   ├── en/
│   │   │   │   │   └── common.json
│   │   │   │   └── fa/
│   │   │   │       └── common.json
│   │   │   └── images/
│   │   ├── middleware.ts
│   │   └── i18n-config.ts
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
├── contracts/
│   ├── contracts/
│   │   └── BountyEscrow.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── BountyEscrow.test.ts
│   ├── hardhat.config.ts
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .gitignore
├── README.md
└── docs/
    ├── FILE_TREE.md
    ├── API.md
    └── DEPLOYMENT.md
```

