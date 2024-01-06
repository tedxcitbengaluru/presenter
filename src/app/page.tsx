import { SampleServerComponent } from "@/sample/sampleAsync";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <SampleServerComponent />
      </Suspense>
    </main>
  );
}
