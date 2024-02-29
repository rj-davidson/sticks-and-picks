"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { UserSerializer } from "@/ts/models";

type RedirectRule = {
  from: string;
  to: string;
  message?: string;
  shouldTrigger: () => boolean;
};

export const RedirectProvider = ({
  user,
  children,
}: PropsWithChildren<{
  user: UserSerializer;
}>) => {
  const pathname = usePathname();

  const [redirectRule, setRedirectRule] = useState<
    RedirectRule | null | undefined
  >(undefined);

  const redirects: RedirectRule[] = [
    {
      from: "/admin/",
      to: "/",
      message: "Your current profile is not allowed to access this page",
      shouldTrigger: () => user.user_type !== "ADMIN",
    },
    {
      from: "/diligence/",
      to: "/",
      message: "Your current profile is not allowed to access this page",
      shouldTrigger: () => user.user_type !== "USER",
    },
  ];

  const isRouteOkay = (path: string) => {
    for (const rule of redirects) {
      if (
        path.slice(0, rule.from.length) === rule.from &&
        (rule.to === "/" ? path !== rule.to : !path.includes(rule.to)) &&
        rule.shouldTrigger()
      ) {
        return rule;
      }
    }
    return null;
  };

  useEffect(() => {
    if (redirectRule !== null && redirectRule !== undefined) {
      redirect(redirectRule.to);
    }
  }, [redirectRule]);

  useEffect(() => {
    let routeOkay: RedirectRule | null = null;
    routeOkay = isRouteOkay(pathname);
    setRedirectRule(routeOkay);
  }, [pathname]);

  const LoadingSessionProvider: React.FC<PropsWithChildren> = ({
    children,
  }) => {
    if (redirectRule === null) {
      return <>{children}</>;
    } else {
      return <></>;
    }
  };

  return <LoadingSessionProvider>{children}</LoadingSessionProvider>;
};
