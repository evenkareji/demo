import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { ReactElement } from 'react';
import Layout from '../../../components/layout';
import { useAuth } from '../../../context/auth';
import { adminDB } from '../../../firebase/server';
import { useUser } from '../../../lib/user';
import { Post } from '../../../types/post';
import { NextPageWithLayout } from '../../_app';

export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  conetxt,
) => {
  // urlのidを取得
  const snap = await adminDB.doc(`posts/${conetxt.params?.id}`).get();

  const post = snap.data() as Post;
  return {
    props: {
      post,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const PostDetailPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ post }) => {
  const user = useUser(post?.authorId);
  const { fbUser } = useAuth();
  const isAuthor = fbUser?.uid === post?.authorId;
  if (!post) {
    return <p>記事が存在しません</p>;
  }

  return (
    <div className="container">
      <p>
        <Link href="/search">
          <a>Search</a>
        </Link>
      </p>
      <div className="aspect-video rounded-md bg-slate-200 mb-4"></div>
      <h1 className="font-bold  text-lg mb-4">{post.title}</h1>
      {user && (
        <div className="flex mb-4">
          <div className="w-10 h-10 bg-slate-400 rounded-full"></div>
          <div className="flex-1">
            <p>{user.name}</p>
            <p className="ext-slate-500">
              {format(post.createdAt, 'yyyy/MM/dd')}
            </p>
          </div>
        </div>
      )}
      <p>{post.body}</p>
      {isAuthor && (
        <Link href={`/posts/${post.id}/edit`}>
          <a className="text-slate-500">編集</a>
        </Link>
      )}
    </div>
  );
};
PostDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PostDetailPage;
