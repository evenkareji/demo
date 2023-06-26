import { auth } from '../firebase/client';

export const revalidate = async (path: string) => {
  const token = await auth.currentUser?.getIdToken(true);

  fetch(`/api/revalidate?path=${path}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
