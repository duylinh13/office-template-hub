/// <reference types="react" />

declare module "@prisma/client" {
  export * from ".prisma/client";
}

declare module "next" {
  export type Metadata = {
    title?: string | { default: string; template: string };
    description?: string;
    icons?: any;
    [key: string]: any;
  };
}

declare module "next/link" {
  import React from "react";
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/navigation" {
  export function useRouter(): {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T = Record<string, string | string[]>>(): T;
  export function notFound(): never;
  export function redirect(url: string): never;
}

declare module "next/server" {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly ip?: string;
    readonly geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  }

  export class NextResponse<Body = any> extends Response {
    static json<JsonBody>(
      body: JsonBody,
      init?: ResponseInit
    ): NextResponse<JsonBody>;
    static redirect(url: string | URL, status?: number): NextResponse<unknown>;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse<unknown>;
    static next(init?: ResponseInit): NextResponse<unknown>;
  }
}

declare module "next/server.js" {
  export * from "next/server";
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}
