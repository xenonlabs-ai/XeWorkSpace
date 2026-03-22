import { DocHeader } from "@/components/docs/doc-header"
import { DocSidebar } from "@/components/docs/doc-sidebar"
import { DocFooter } from "@/components/docs/doc-footer"
import { DocPage } from "@/components/docs/doc-page"
import { ReactNode } from "react"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <DocHeader />
      <div className="flex-1">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <DocSidebar />
          <DocPage>{children}</DocPage>
        </div>
      </div>
      <DocFooter />
    </div>
  )
}
