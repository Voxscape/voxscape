import { signIn, useSession } from 'next-auth/react';
import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { useModalApi } from '../components/modal/modal-context';
import { useRouter } from 'next/router';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { AuthProviderPicker } from '../components/auth/auth-provider-picker';

export function useRequireLoginModal(): boolean {
  const session = useSession();
  const modalApi = useModalApi();
  const router = useRouter();

  useAsyncEffect(async () => {
    if (!(session?.status === 'unauthenticated' && !modalApi.isShowing)) {
      return;
    }
    const provider = await modalApi.build<string>((handle) => ({
      title: `Login required`,
      body: (
        <>
          {/*<p className="my-2">New user will be automatically created. </p>*/}
          <AuthProviderPicker handle={handle} />
        </>
      ),
    }));

    if (provider.result !== 'complete') {
      await modalApi.alert('Login required', <div>To start again, please refresh the page.</div>, 'OK');
    } else if (provider.result === 'complete' && provider.value) {
      await signIn(provider.value, { callbackUrl: router.asPath });
    }
  }, [modalApi.isShowing, session?.status]);

  return session?.status === 'authenticated';
}

export function WithRequireLoginModal(props: PropsWithChildren): ReactElement {
  const authed = useRequireLoginModal();
  return authed ? (props.children as ReactElement) : null!;
}
