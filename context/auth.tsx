import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from '../firebase/client';
import { User } from '../types/user';
import { Unsubscribe, doc, onSnapshot } from 'firebase/firestore';

type ContextType = {
  fbUser: FirebaseUser | null | undefined;
  isLoading: boolean;
  user: User | null | undefined;
};

const AuthContext = createContext<ContextType>({
  // 初期状態はundefined。何かわからないから
  // nullは空っぽということがわかっている
  fbUser: undefined,
  isLoading: true,
  user: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>();
  // valueの中身が変化するタイミング
  useEffect(() => {
    let unsubribe: Unsubscribe;

    onAuthStateChanged(auth, (resultUser) => {
      unsubribe?.();

      setFbUser(resultUser);
      if (resultUser) {
        // documentを確定させている
        const ref = doc(db, `users/${resultUser.uid}`);
        // 確定させたdocumentをリアルタイム監視している
        unsubribe = onSnapshot(ref, (snap) => {
          // 常に新しいユーザー情報を取得し続ける
          setUser(snap.data() as User);
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ fbUser, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
