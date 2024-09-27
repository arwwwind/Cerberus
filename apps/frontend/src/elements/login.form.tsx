import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Define the type for form values
interface LoginFormValues {
  email: string;
  password: string;
}

// Define props interface for the LoginForm
interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  cta?: string;
  loading?: boolean;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&#]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
});

export function LoginForm({
  onSubmit,
  cta = 'Submit',
  loading = false,
}: LoginFormProps) {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='bg-gray-900 flex items-center justify-center w-[100%] h-[100%]'
    >
      <Card className='w-full max-w-sm bg-slate-900 text-white py-6 border-transparent'>
        <CardContent className='grid gap-4'>
          {/* Email Field */}
          <div className='grid gap-2'>
            <Label htmlFor='email' className='text-gray-300'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='m@example.com'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-slate-800 text-white border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-slate-400'
              }`}
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-red-500 text-sm mt-1'>
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          {/* Password Field */}
          <div className='grid gap-2'>
            <Label htmlFor='password' className='text-gray-300'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-slate-800 text-white border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-slate-400'
              }`}
              required
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='text-red-500 text-sm mt-1'>
                {formik.errors.password}
              </div>
            ) : null}
          </div>
        </CardContent>

        <CardFooter>
          <Button type='submit' className='w-full bg-indigo-700 text-white font-bold'>
            {cta}
            {loading && <Spinner size={20} />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
