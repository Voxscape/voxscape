import type { NextPage } from 'next';
import { Layout } from '../src/components/layout/layout';
import { EmailSignupForm } from '../src/components/auth/email_auth';
import { TwitterAuthForm } from '../src/components/auth/twitter_auth';

const SignUpPage: NextPage = () => (
  <Layout>
    <EmailSignupForm />
    <TwitterAuthForm />
  </Layout>
);

export default SignUpPage;
