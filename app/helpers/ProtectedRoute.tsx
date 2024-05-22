import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/useAuth";

type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login"); // Navigate to the login page if the user is not logged in
    }
  }, [isLoggedIn, router]);

  return isLoggedIn() ? <>{children}</> : null;
};

export default ProtectedRoute;
