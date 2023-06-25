import useSWR from 'swr/immutable';
import { User } from '../types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
// idにはpost.authorIdが入る
export const useUser = (id?: string) => {
  const { data: user } = useSWR<User>(id && `users/${id}`, async () => {
    console.log('データ取得');
    // documentを確定させ
    const ref = doc(db, `users/${id}`);
    // 取得し
    const snap = await getDoc(ref);
    return snap.data() as User;
  });

  return user;
};
