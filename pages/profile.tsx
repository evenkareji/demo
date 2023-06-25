import { ReactElement } from 'react';
import Layout from '../components/layout';
import { NextPageWithLayout } from './_app';
import UserForm from '../components/user-form';

const Profile: NextPageWithLayout = () => {
  return <UserForm isEditMode />;
};
Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Profile;
