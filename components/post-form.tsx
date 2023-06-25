import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Post } from '../types/post';
import classNames from 'classnames';
import Button from '../components/button';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/client';
import { useAuth } from '../context/auth';
import { useRouter } from 'next/router';

const PostForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Post>();
  const { fbUser, isLoading } = useAuth();

  const router = useRouter();
  const editTargetId = router.query.id as string;

  useEffect(() => {
    if (editTargetId) {
      const ref = doc(db, `posts/${editTargetId}`);
      getDoc(ref).then((snap) => {
        const oldPost = snap.data() as Post;
        reset(oldPost);
      });
    }
  }, [editTargetId]);

  if (!fbUser) {
    if (!isLoading) {
      router.push('/login');
    }

    return null;
  }
  const submit = (data: Post) => {
    const ref = isEditMode
      ? doc(db, `posts/${editTargetId}`)
      : doc(collection(db, 'posts'));

    // doc(collectionによって、新しく生成されるpost.idを前もってref.idとして持つことができる
    const post: Post = {
      // documentのidとフィールドのidが一致する
      id: isEditMode ? editTargetId : ref.id,
      title: data.title,
      body: data.body,
      createdAt: isEditMode ? data.createdAt : Date.now(),
      updateAt: isEditMode ? Date.now() : null,
      authorId: fbUser.uid,
    };
    // documentにfieldをsetする
    setDoc(ref, post).then(async () => {
      const path = `/posts/${post.id}`;

      const token = await auth.currentUser?.getIdToken(true);
      fetch(`/api/revalidate?path=${path}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((res) => res.json())
        .then(() => {
          alert(`記事を${isEditMode ? '更新' : '作成'}しました`);
        })
        .catch((e) => {
          console.log(e);
          alert('ページ再生性が失敗しました');
        });
    });
  };

  const deletePost = () => {
    // editTargetIdには形したい投稿のid
    const ref = doc(db, `posts/${editTargetId}`);
    return deleteDoc(ref).then(() => {
      alert('記事を削除しました');
      router.push('/');
    });
  };

  return (
    <div onSubmit={handleSubmit(submit)}>
      <h1>記事 {isEditMode ? '編集' : '投稿'}</h1>
      <form>
        <div>
          <label className="block mb-0.5" htmlFor="title">
            タイトル*
          </label>
          <input
            autoComplete="off"
            className={classNames(
              'rounded border',
              errors.title ? 'border-red-500' : ' border-slate-300',
            )}
            {...register('title', {
              required: '必須入力です',
              maxLength: {
                value: 50,
                message: '最大50文字です',
              },
            })}
            id="title"
            type="text"
          />
          {errors.title && (
            <p className="text-red-500 mt-0.5">{errors.title?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-0.5" htmlFor="body">
            本文*
          </label>
          <textarea
            autoComplete="off"
            className={classNames(
              'rounded border',
              errors.body ? 'border-red-500' : ' border-slate-300',
            )}
            {...register('body', {
              required: '必須入力です',
              maxLength: {
                value: 50,
                message: '最大50文字です',
              },
            })}
            id="body"
          />
          {errors.body && (
            <p className="text-red-500 mt-0.5">{errors.body?.message}</p>
          )}
        </div>
        <Button>{isEditMode ? '保存' : '投稿'}</Button>
        <button type="button" onClick={deletePost}>
          削除
        </button>
      </form>
    </div>
  );
};

export default PostForm;
