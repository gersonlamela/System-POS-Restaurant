import SignInFormWithId from "@/components/form/SignInFormWithId";



export default function SignInPage({ params }: { params: { id: string } }) {
  
  return (
    <div className='w-full'>
      <SignInFormWithId params={params} />
    </div>
  );
};

