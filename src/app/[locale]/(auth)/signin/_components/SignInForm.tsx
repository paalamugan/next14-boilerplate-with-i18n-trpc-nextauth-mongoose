'use client';

import { useToast } from '@paalan/react-ui';
import { type FC, type FormEventHandler } from 'react';

import { useSession } from '@/stores/session-store';
import { api } from '@/trpc/client';

type SignInFormProps = {};
export const SignInForm: FC<SignInFormProps> = _props => {
  const session = useSession();
  const toast = useToast();

  const signInMutation = api.auth.signIn.useMutation({
    onSuccess(data) {
      if (!data) {
        toast.error('Failed to sign in');
        return;
      }
      session.update(data);
      toast.success('Signed in successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to sign in');
      session.update(null);
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    const email = (body.get('email') || '').toString();
    const password = (body.get('password') || '').toString();

    signInMutation.mutate({ credentials: { email, password } });
  };

  const isLoading = signInMutation.isPending || session.status === 'loading';
  return (
    <form className="space-y-4" method="POST" onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">
          <div className="block text-sm font-medium leading-6 text-gray-900">Email</div>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              placeholder="Enter Email Address"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </label>
      </div>

      <div>
        <label htmlFor="password">
          <div className="block text-sm font-medium leading-6 text-gray-900">Password</div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter Password"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </label>
      </div>

      <div className={isLoading ? 'cursor-not-allowed' : ''}>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isLoading ? 'pointer-events-none disabled:opacity-50' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};
