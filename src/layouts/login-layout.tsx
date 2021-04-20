import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import(/* webpackChunkName: "login" */ '@routes/login'));

export default function LoginLayout() {
  return (
    <Suspense fallback={<div>loading</div>}>
      <LoginPage />
    </Suspense>
  );
}
