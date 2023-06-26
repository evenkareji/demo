import classNames from 'classnames';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '../components/button';
import { useAuth } from '../context/auth';
import { db, storage } from '../firebase/client';
import { User } from '../types/user';
import ImageSelector from './image-selector';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

const UserForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const { isLoading, fbUser, user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<User>();

  useEffect(() => {
    if (isEditMode && user) {
      reset(user);
    }
  }, [isEditMode, user]);

  if (isLoading) {
    return;
  }
  if (!fbUser) {
    router.push('/login');
    return null;
  }

  const submit = async (data: User) => {
    console.log(data);
    if (data.avatarURL?.match(/^data:/)) {
      const imageRef = ref(storage, `users/${fbUser.uid}/avatar`);
      await uploadString(imageRef, data.avatarURL, 'data_url');
      data.avatarURL = await getDownloadURL(imageRef);
    }

    if (!data.avatarURL && user?.avatarURL) {
      const imageRef = ref(storage, `users/${fbUser.uid}/avatar`);
      await deleteObject(imageRef);
    }
    // users collectionのmynumberにdocumentを作成
    const documentRef = doc(db, `users/${fbUser.uid}`);
    return setDoc(documentRef, data).then(() => {
      alert(isEditMode ? '更新しました' : 'ユーザーを作成しました');
      if (!isEditMode) {
        router.push('/');
      }
    });
  };
  return (
    <div className="container">
      {isEditMode ? <h1>プロフィール編集</h1> : <h1>アカウント作成</h1>}
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <div>
          <h2>プロフィール画像</h2>
          <ImageSelector name="avatarURL" control={control} />
        </div>
        <div>
          <label className="block mb-0.5" htmlFor="name">
            名前*
          </label>
          <input
            autoComplete="name"
            className={classNames(
              'rounded border',
              errors.name ? 'border-red-500' : ' border-slate-300',
            )}
            {...register('name', {
              required: '必須入力です',
              maxLength: {
                value: 50,
                message: '最大50文字です',
              },
            })}
            id="name"
            name="name"
            type="text"
          />
          {errors.name && (
            <p className="text-red-500 mt-0.5">{errors.name?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-0.5" htmlFor="nicname">
            ニックネーム*
          </label>
          <input
            autoComplete="off"
            className={classNames(
              'rounded border',
              errors.nicname ? 'border-red-500' : ' border-slate-300',
            )}
            {...register('nicname', {
              required: '必須入力です',
              maxLength: {
                value: 50,
                message: '最大50文字です',
              },
            })}
            id="nicname"
            name="nicname"
            type="text"
          />
          {errors.nicname && (
            <p className="text-red-500 mt-0.5">{errors.nicname?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-0.5" htmlFor="profile">
            プロフィール*
          </label>
          <textarea
            className={classNames(
              'rounded border',
              errors.profile ? 'border-red-500' : ' border-slate-300',
            )}
            defaultValue=""
            {...register('profile', {
              required: '必須入力です',
              maxLength: {
                value: 255,
                message: '最大255です',
              },
            })}
            id="profile"
            name="profile"
          />
          <p className="text-sm text-slate-400 leading-none">
            {watch('profile')?.length}/255
          </p>
          {errors.profile && (
            <p className="text-red-500 mt-0.5">{errors.profile?.message}</p>
          )}
        </div>

        <Button disabled={isSubmitting}>
          {isEditMode ? '更新' : 'アカウント作成'}
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
