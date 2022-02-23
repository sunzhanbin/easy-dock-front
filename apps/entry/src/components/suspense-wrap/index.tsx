import React, { Suspense } from "react";

const SuspenseWrap = ({ render }: { render: React.ReactNode }) => (
  <React.Fragment>
    <Suspense fallback={null}>{render}</Suspense>
  </React.Fragment>
);

export default SuspenseWrap;
