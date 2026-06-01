import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#09090B] via-[#111827] to-[#09090B]">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
