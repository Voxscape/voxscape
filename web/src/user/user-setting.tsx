import { useSession } from 'next-auth/react';

export function UserSettings(props: { userId: string }) {
  const session = useSession();
  if (session.status === 'authenticated' && session.data.user?.id === props.userId) {
    return (
      <div>
        <div className="my-4">TODO: settings</div>
        <div className="my-4">LOGOUT:</div>
      </div>
    );
  }
  return null;
}
