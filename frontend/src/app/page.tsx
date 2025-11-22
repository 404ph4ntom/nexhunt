import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NexHunt
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hybrid Bug Bounty Platform for Web2 and Web3 Projects
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/programs"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Programs
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

