import SignInFormWithSlug from '@/components/form/SignInFormWithSlug';


export default function SignInPage({ params }: { params: { slug: string } }) {
  
  return (
    <div className='w-full'>
      <SignInFormWithSlug params={params} />
    </div>
  );
};

