import React, { ReactElement } from 'react';
import Layout from '../components/layout';

const Test = () => {
  return <div>Test</div>;
};

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Test;
