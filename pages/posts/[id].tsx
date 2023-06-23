import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/client';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import useSWR from 'swr/immutable';
const PostDetailPage = () => {
  const [post, setPost] = useState<Post>();
  const router = useRouter();
  // urlのidにあたる部分を取得
  const postId = router.query.id;

  const { data: user } = useSWR<User>(
    post?.authorId && `users/${post?.authorId}`,
    async () => {
      console.log('データ取得');
      // documentを確定させ
      const ref = doc(db, `users/${post?.authorId}`);
      // 取得し
      const snap = await getDoc(ref);
      return snap.data() as User;
    },
  );

  useEffect(() => {
    // documentを確定させる
    const ref = doc(db, `posts/${postId}`);
    // documentを取得
    getDoc(ref).then((snap) => {
      setPost(snap.data() as Post);
    });
  }, [postId]);

  if (!post) {
    return null;
  }

  return (
    <div className="container">
      <h1 className="font-bold  text-lg mb-6">{post.title}</h1>
      {user && (
        <div className="flex">
          <p>{user?.name}</p>
        </div>
      )}
      <p>{post.body}</p>
    </div>
  );
};

export default PostDetailPage;
