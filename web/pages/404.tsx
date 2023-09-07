import Link from 'next/link';
import { Layout } from '../src/components/layout/layout';
import { Button } from '@chakra-ui/react';

const NotFoundPage = () => {
  return (
    <Layout>
      <h1 className="text-xl text-center">404 - Page Not Found</h1>
      <section className="text-center my-4">
        <Link href="/">
          <Button>Back to site root</Button>
        </Link>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
