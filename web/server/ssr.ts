import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './next_auth';
import { uniq } from 'lodash-es';

const handlers = {
  session: (ctx: GetServerSidePropsContext) => getServerSession(ctx.req, ctx.res, nextAuthOptions),
} as const;
export function buildSsrHandler(...propNames: (keyof typeof handlers)[]): GetServerSideProps {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    const props = {} as Record<string, any>;
    await Promise.all(
      uniq(propNames).map(async (propName) => {
        props[propName] = await handlers[propName](context);
      }),
    );
    return { props };
  };
}
