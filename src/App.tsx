import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import PostClient from "./PostClient";
import AuthForm from "./AuthForm"; // メールログインフォーム

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const logout = () => auth.signOut();

  if (!user) {
    return (
      <div className="text-center mt-20">
        <AuthForm />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={logout}
        className="absolute top-4 right-4 text-sm text-blue-600"
      >
        ログアウト
      </button>
      <PostClient />
    </>
  );
}
