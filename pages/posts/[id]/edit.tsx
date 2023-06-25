import React, { ReactElement } from 'react';
import PostForm from '../../../components/post-form';
import Layout from '../../../components/layout';
import { NextPageWithLayout } from '../../_app';

const EditPage: NextPageWithLayout = () => {
  return (
    <div className="container">
      <PostForm isEditMode />
    </div>
  );
};
EditPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditPage;
