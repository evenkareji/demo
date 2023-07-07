import { ReactElement, useEffect, useState } from 'react';
import Button from '../components/button';
import Layout from '../components/layout';
import { login, logout } from '../lib/auth';
import { NextPageWithLayout } from './_app';

const LoginPage: NextPageWithLayout = () => {
  const [test, setTest] = useState('before');
  useEffect(() => {
    // console.log(test, 'beforekehrjk;gewh');
    setTest('after');
    // console.log(test, 'afterewkjhelwj');
  }, []);

  return (
    <div>
      <h1>ログイン</h1>
      <Button type="button" onClick={login}>
        ログインする
      </Button>
      <h1>useStateの値は「{test}」</h1>
    </div>
  );
};
LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default LoginPage;
