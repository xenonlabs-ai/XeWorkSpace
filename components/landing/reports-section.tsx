"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Clock,
  Monitor,
  Globe,
  TrendingUp,
  Coffee,
  Calendar,
  ArrowRight,
  Zap,
  PieChart,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const sampleApps = [
  { name: "VS Code", duration: "3h 45m", percentage: 45, category: "development", color: "bg-blue-500" },
  { name: "Chrome", duration: "2h 30m", percentage: 30, category: "browser", color: "bg-yellow-500" },
  { name: "Slack", duration: "1h 15m", percentage: 15, category: "productive", color: "bg-green-500" },
  { name: "Figma", duration: "45m", percentage: 10, category: "productive", color: "bg-purple-500" },
]

const sampleWebsites = [
  { name: "GitHub", visits: 45, duration: "1h 20m" },
  { name: "Stack Overflow", visits: 23, duration: "45m" },
  { name: "Notion", visits: 18, duration: "35m" },
  { name: "Vercel", visits: 12, duration: "25m" },
]

const reportFeatures = [
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Detailed breakdown of active vs idle time for each employee",
  },
  {
    icon: Monitor,
    title: "App Usage",
    description: "See which applications employees use most during work hours",
  },
  {
    icon: Globe,
    title: "Website Tracking",
    description: "Monitor websites visited through browser window analysis",
  },
  {
    icon: TrendingUp,
    title: "Productivity Score",
    description: "AI-calculated scores based on app categories and focus time",
  },
]

export function ReportsSection() {
  return (
    <section className="py-24 bg-muted/30" id="reports">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 border-purple-500/30 text-purple-600">
            <BarChart3 className="w-3 h-3 mr-1.5" />
            Analytics & Reports
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Daily Activity{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Reports
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Get comprehensive daily reports showing exactly how your team spends their time.
            Track applications, websites, and productivity metrics automatically.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Report Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Employee Card Preview */}
            <Card className="overflow-hidden border-2">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      JD
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">John Developer</h3>
                      <p className="text-sm text-muted-foreground">Senior Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Today</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-600">7h 45m</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10">
                    <Coffee className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-600">45m</p>
                    <p className="text-xs text-muted-foreground">Idle</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <PieChart className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-600">156</p>
                    <p className="text-xs text-muted-foreground">Screenshots</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-500/10">
                    <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-purple-600">87%</p>
                    <p className="text-xs text-muted-foreground">Productive</p>
                  </div>
                </div>

                {/* Productivity Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Productivity Score</span>
                    <span className="text-sm font-bold text-green-600">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                {/* Application Usage */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Top Applications
                  </h4>
                  <div className="space-y-3">
                    {sampleApps.map((app) => (
                      <div key={app.name} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${app.color}`} />
                        <span className="flex-1 text-sm">{app.name}</span>
                        <span className="text-sm text-muted-foreground">{app.duration}</span>
                        <div className="w-20">
                          <Progress value={app.percentage} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Website Usage Preview */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website Usage
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {sampleWebsites.map((site) => (
                    <div key={site.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{site.name}</p>
                        <p className="text-xs text-muted-foreground">{site.visits} visits</p>
                      </div>
                      <span className="text-sm font-medium">{site.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {reportFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all group"
                >
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors h-fit">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Why Daily Reports Matter
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    <span>Identify productivity patterns and optimize workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    <span>Track time spent on projects without manual timesheets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    <span>Ensure remote team engagement and accountability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                    <span>Generate compliance reports for billing and audits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Link
              href="/auth/register"
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Start Tracking Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
