import { DocBreadcrumb } from "@/components/docs/doc-breadcrumb"
import { DocToc } from "@/components/docs/doc-toc"
import { ReactNode } from "react"

export function DocPage({ children }: { children: ReactNode }) {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocBreadcrumb />
        <div className="space-y-2">{children}</div>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] pt-10">
          <DocToc />
        </div>
      </div>
    </main>
  )
}
