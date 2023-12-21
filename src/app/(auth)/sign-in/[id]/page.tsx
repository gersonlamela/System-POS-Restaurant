import SignInFormWithId from "@/components/form/SignInFormWithId";



export default function SignInPage({ params }: { params: { id: string } }) {
  
  return (
    <div className='max-w-[450px] flex items-center justify-center'>
      <SignInFormWithId params={params} />
    </div>
  );
};

