import React, { Suspense } from "react";
import GoogleSuccess from "../../components/googleSuccess/GoogleSuccess";

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<p>Signing you in with Google...</p>}>
      <GoogleSuccess />
    </Suspense>
  );
}
