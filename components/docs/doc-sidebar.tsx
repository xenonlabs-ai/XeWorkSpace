import { DocSidebarNav } from "@/components/docs/doc-sidebar-nav"

export function DocSidebar() {
  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block lg:w-60">
      <div className="h-full py-6 pl-8 pr-6 lg:pl-10">
        <DocSidebarNav />
      </div>
    </aside>
  )
}
