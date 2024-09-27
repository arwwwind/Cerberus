import { LoginForm } from '@/elements/login.form';
import useAxios from '@/api';
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

type values = {
  email: string;
  password: string;
};

const Signup = () => {
  const authApi = useAxios();
  const [err, setErr] = React.useState('');
  const navigate = useNavigate();

  const signup = async (values: values) => {
    try {
      const { data } = await authApi.post('/auth/signup', values);
      Cookies.set('auth-token', data.data.token);
      navigate('/');
      // eslint-disable-next-line
    } catch (error: any) {
      if (error.status === 401 || error.status === '400') {
        setErr('Invalid username or password');
      } else {
        setErr('Unable to login. Please try later.');
        console.error('Error fetching data:', error);
      }

      setTimeout(() => {
        setErr('');
      }, 3000);
    }
  };

  return (
    <div className='min-h-screen flex-col flex items-center justify-center w-[100vw] m-auto'>
      <div className='w-full max-w-md min-w-[50vw] p-8 bg-slate-900 rounded-lg shadow-lg flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>
          Create an account
        </h1>

        <p className='text-center text-slate-400 mb-10'>
          Please create an account to access the application.
        </p>

        <LoginForm cta='Sign up' onSubmit={signup} />

        {err && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}

        <div className='mt-6 text-center'>
          <p className='text-slate-400'>
            Already have an account?{' '}
            <a href='/login' className='text-slate-300 hover:underline'>
              Login here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
