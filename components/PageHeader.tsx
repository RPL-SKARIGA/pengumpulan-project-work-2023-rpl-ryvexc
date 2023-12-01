export function PageHeaderTitle({ children }: { children: any }) {
  return <h1 className="text-3xl font-medium text-white">
    {children}
  </h1>
}

export function PageHeader({ children, className }: { children: any, className?: string }) {
  return <div className={"w-full bg-black flex flex-col justify-center py-[50px] px-7 border-b border-b-neutral-800 " + className}>
    {children}
  </div>
}