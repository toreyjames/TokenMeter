import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-zinc-900 hover:bg-zinc-800',
            footerActionLink: 'text-zinc-900 hover:text-zinc-700',
          }
        }}
      />
    </div>
  );
}
