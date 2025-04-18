
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/30 p-4">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-lg bg-background",
          }
        }}
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
