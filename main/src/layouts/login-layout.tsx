import React, { Suspense } from "react";
import Loading from "@components/loading";
const LoginPage = React.lazy(() => import(/* webpackChunkName: "login" */ "@routes/login"));

export default function LoginLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  );
}
