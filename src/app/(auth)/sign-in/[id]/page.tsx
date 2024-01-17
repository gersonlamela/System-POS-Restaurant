import { getUserById } from '@/components/UserById'
import SignInForm from '@/components/form/SignInForm'

export default async function SignInPage({
  params,
}: {
  params: { id: string }
}) {
  const { user } = await getUserById({ userId: params.id })

  return (
    <div className=" flex h-full w-full items-center justify-center">
      <SignInForm params={params} user={user} />
    </div>
  )
}
