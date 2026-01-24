import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right?: ReactNode;
  illustrationSrc?: string;
};

export function AuthLayout({ left, right, illustrationSrc }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-6 py-10 bg-white">
          <div className="w-full max-w-md">{left}</div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden lg:block bg-slate-50">
          {/* top right small brand/button area */}
          <div className="absolute right-6 top-6 flex items-center gap-2">
            <span className="rounded-full bg-slate-900/70 px-4 py-2 text-base font-semibold text-white shadow-lg backdrop-blur-sm">
              Kraken Academy
            </span>
          </div>

          <div className="flex h-full w-full items-stretch justify-stretch">
            {right ? (
              right
            ) : illustrationSrc ? (
              <img
                src={illustrationSrc}
                alt="Auth illustration"
                className="h-full w-full select-none object-cover"
                draggable={false}
              />
            ) : (
              <div className="text-slate-400">No illustration</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
