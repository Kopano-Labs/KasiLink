import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import HomeFeed from "@/components/HomeFeed";

export default function Home() {
  return (
    <>
      <SignedIn>
        <HomeFeed />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
