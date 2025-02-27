/* eslint-disable prettier/prettier */
import { getUserById } from '@/components/UserById';
import SignInForm from '@/components/form/SignInForm';

export default async function SignInPage({ params }: { params: { id: string } }) {
  const { user } = await getUserById({ userId: params.id });

  const handleCloseModal = () => {
    console.log('close');
  };

  const handleClearSelectedUser = () => {
    console.log('clear user');
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignInForm
        user={user}
        handleCloseModal={handleCloseModal}
        handleClearSelectedUser={handleClearSelectedUser}
      />
    </div>
  );
}
