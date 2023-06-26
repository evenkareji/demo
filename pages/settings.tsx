import { ReactElement } from 'react';
import Layout from '../components/layout';
import { NextPageWithLayout } from './_app';

const Settings: NextPageWithLayout = () => {
  return (
    <div className="container">
      <h1>設定画面</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati nisi
        aperiam debitis ullam magni dicta aut dolores consequatur distinctio
        architecto doloremque accusamus dolorum voluptatum beatae, error commodi
        deserunt! Rerum, a? Consequuntur, vero hic quisquam doloremque expedita
        aliquid maiores ipsa quidem.
      </p>
    </div>
  );
};
Settings.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Settings;
