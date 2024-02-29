import { PropsWithChildren } from "react";
import ClientProviders from "@/providers/client-provders";
import { ClerkProvider } from "@clerk/nextjs";

export default async function Providers({ children }: PropsWithChildren) {
  // const makeServerReq = makeServerRequest();
  //
  // const user: UserSerializer = await makeServerReq.get({
  //   url: `/api/users/${encodedUserSub}/`,
  // });

  return (
    <ClerkProvider>
      <ClientProviders>
        {children}
        {/*<RedirectProvider user={user}>{children}</RedirectProvider>*/}
      </ClientProviders>
    </ClerkProvider>
  );
}
