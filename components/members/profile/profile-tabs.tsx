import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Briefcase, Calendar, CheckCircle2, FileText, MessageSquare, Star, User } from "lucide-react"
import type { Member } from "@/components/members"

interface MemberProfileTabsProps {
	member: Member
}

export function MemberProfileTabs({ member }: MemberProfileTabsProps) {
	// Generate random activity data
	const activities = [
		{
			type: "task",
			action: "completed",
			target: "Update user documentation",
			time: "2 hours ago",
			icon: CheckCircle2,
		},
		{
			type: "comment",
			action: "commented on",
			target: "Website redesign project",
			time: "Yesterday at 4:30 PM",
			icon: MessageSquare,
		},
		{
			type: "project",
			action: "was assigned to",
			target: "Mobile App Development",
			time: "Yesterday at 2:15 PM",
			icon: Briefcase,
		},
		{
			type: "document",
			action: "uploaded",
			target: "Q2 Marketing Plan.pdf",
			time: "2 days ago",
			icon: FileText,
		},
		{
			type: "meeting",
			action: "scheduled a meeting",
			target: "Project Kickoff",
			time: "3 days ago",
			icon: Calendar,
		},
	]

	// Generate random tasks
	const tasks = [
		{
			id: 1,
			title: "Implement new feature",
			project: "Mobile App",
			status: "In Progress",
			dueDate: "May 25, 2025",
			priority: "High",
		},
		{
			id: 2,
			title: "Fix navigation bug",
			project: "Website Redesign",
			status: "In Progress",
			dueDate: "May 20, 2025",
			priority: "Medium",
		},
		{
			id: 3,
			title: "Review design mockups",
			project: "Brand Refresh",
			status: "Completed",
			dueDate: "May 15, 2025",
			priority: "Medium",
		},
		{
			id: 4,
			title: "Update API documentation",
			project: "Backend API",
			status: "Not Started",
			dueDate: "May 30, 2025",
			priority: "Low",
		},
	]

	return (
		<Tabs defaultValue="overview" className="mt-6">
			<TabsList className="grid grid-cols-5 mb-8">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="projects">Projects</TabsTrigger>
				<TabsTrigger value="skills">Skills</TabsTrigger>
				<TabsTrigger value="performance">Performance</TabsTrigger>
			</TabsList>

			{/* Overview Tab */}
			<TabsContent value="overview" className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* About */}
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								About
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
									<p>{member.name}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Email</h3>
									<p>{member.email}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
									<p>{member.phone}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Location</h3>
									<p>{member.location}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Role</h3>
									<p>{member.role}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Access Level</h3>
									<p>{member.accessLevel}</p>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
								<p className="text-sm">{member.bio}</p>
							</div>
						</CardContent>
					</Card>

					{/* Skills Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Star className="h-5 w-5" />
								Skills
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2 mb-4">
								{member.skills.map((skill, index) => (
									<Badge key={index} variant="secondary">
										{skill}
									</Badge>
								))}
							</div>

							<div className="space-y-3 mt-4">
								<h3 className="text-sm font-medium">Top Skills</h3>
								{member.skills.slice(0, 3).map((skill, index) => (
									<div key={index} className="space-y-1">
										<div className="flex justify-between text-sm">
											<span>{skill}</span>
											<span>{85 - index * 5}%</span>
										</div>
										<div className="w-full bg-muted rounded-full h-2">
											<div className="bg-primary rounded-full h-2" style={{ width: `${85 - index * 5}%` }}></div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Current Tasks */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5" />
							Current Tasks
						</CardTitle>
						<CardDescription>Tasks currently assigned to {member.name}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{tasks.slice(0, 3).map((task) => (
								<div key={task.id} className="flex items-center gap-4 p-3 rounded-md border">
									<div
										className={`w-3 h-3 rounded-full ${task.status === "Completed"
												? "bg-green-500"
												: task.status === "In Progress"
													? "bg-blue-500"
													: "bg-gray-300"
											}`}
									></div>
									<div className="flex-1 min-w-0">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
											<div>
												<h4 className="font-medium truncate">{task.title}</h4>
												<div className="text-sm text-muted-foreground">
													{task.project} • Due {task.dueDate}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant={
														task.priority === "High"
															? "destructive"
															: task.priority === "Medium"
																? "secondary"
																: "outline"
													}
													className="text-xs"
												>
													{task.priority}
												</Badge>
												<Badge
													variant={
														task.status === "Completed"
															? "default"
															: task.status === "In Progress"
																? "secondary"
																: "outline"
													}
													className="text-xs"
												>
													{task.status}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							))}

							<Button variant="outline" className="w-full">
								View All Tasks
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Recent Activity
						</CardTitle>
						<CardDescription>Recent actions and updates</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{activities.slice(0, 3).map((activity, index) => (
								<div key={index} className="flex items-start gap-3">
									<div className="mt-0.5 bg-primary/10 p-2 rounded-full">
										<activity.icon className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm">
											<span className="font-medium">{member.name}</span>{" "}
											<span className="text-muted-foreground">{activity.action}</span>{" "}
											<span className="font-medium">{activity.target}</span>
										</p>
										<p className="text-xs text-muted-foreground">{activity.time}</p>
									</div>
								</div>
							))}

							<Button variant="outline" className="w-full">
								View All Activity
							</Button>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Activity Tab */}
			<TabsContent value="activity">
				<Card>
					<CardHeader>
						<CardTitle>Activity Timeline</CardTitle>
						<CardDescription>Recent actions and updates by {member.name}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="relative pl-6 border-l border-muted space-y-8">
							{activities.map((activity, index) => (
								<div key={index} className="relative mb-8">
									<div className="absolute -left-10 mt-1.5 bg-primary/10 p-2 rounded-full border-4 border-background">
										<activity.icon className="h-4 w-4 text-primary" />
									</div>
									<div>
										<p className="text-sm">
											<span className="font-medium">{member.name}</span>{" "}
											<span className="text-muted-foreground">{activity.action}</span>{" "}
											<span className="font-medium">{activity.target}</span>
										</p>
										<p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Projects Tab */}
			<TabsContent value="projects">
				<Card>
					<CardHeader>
						<CardTitle>Projects</CardTitle>
						<CardDescription>Projects {member.name} is involved in</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							{member.projects.map((project, index) => (
								<Card key={index}>
									<CardHeader>
										<CardTitle className="text-lg">{project}</CardTitle>
										<CardDescription>{["Active", "In Progress", "Planning"][index % 3]} project</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">Progress</span>
												<span>{[65, 42, 90, 25][index % 4]}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div
													className="bg-primary rounded-full h-2"
													style={{ width: `${[65, 42, 90, 25][index % 4]}%` }}
												></div>
											</div>

											<div className="flex items-center justify-between mt-4">
												<div className="flex -space-x-2">
													{[...Array(3)].map((_, i) => (
														<Avatar key={i} className="h-6 w-6 border-2 border-background">
															<AvatarFallback className="text-xs">{["TM", "JD", "SK"][i]}</AvatarFallback>
														</Avatar>
													))}
												</div>
												<Button variant="outline" size="sm">
													View Project
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Skills Tab */}
			<TabsContent value="skills">
				<Card>
					<CardHeader>
						<CardTitle>Skills & Expertise</CardTitle>
						<CardDescription>{member.name}'s professional skills and competencies</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h3 className="text-lg font-medium mb-4">Technical Skills</h3>
								<div className="space-y-4">
									{member.skills.map((skill, index) => (
										<div key={index} className="space-y-1">
											<div className="flex justify-between text-sm">
												<span>{skill}</span>
												<span>{90 - index * 7}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-primary rounded-full h-2.5" style={{ width: `${90 - index * 7}%` }}></div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-4">Soft Skills</h3>
								<div className="space-y-4">
									{["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"].map(
										(skill, index) => (
											<div key={index} className="space-y-1">
												<div className="flex justify-between text-sm">
													<span>{skill}</span>
													<span>{85 - index * 5}%</span>
												</div>
												<div className="w-full bg-muted rounded-full h-2.5">
													<div
														className="bg-secondary rounded-full h-2.5"
														style={{ width: `${85 - index * 5}%` }}
													></div>
												</div>
											</div>
										),
									)}
								</div>
							</div>
						</div>

						<div className="mt-8">
							<h3 className="text-lg font-medium mb-4">Certifications & Education</h3>
							<div className="space-y-4">
								<div className="p-4 border rounded-lg">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 p-2 rounded-md">
											<FileText className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h4 className="font-medium">
												{member.role === "Developer"
													? "Full Stack Web Development"
													: member.role === "Designer"
														? "UI/UX Design Certification"
														: "Digital Marketing Certification"}
											</h4>
											<p className="text-sm text-muted-foreground">
												{member.role === "Developer"
													? "Tech University"
													: member.role === "Designer"
														? "Design Academy"
														: "Marketing Institute"}
												{" • "}
												2023
											</p>
										</div>
									</div>
								</div>

								<div className="p-4 border rounded-lg">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 p-2 rounded-md">
											<FileText className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h4 className="font-medium">
												Bachelor's in{" "}
												{member.role === "Developer"
													? "Computer Science"
													: member.role === "Designer"
														? "Graphic Design"
														: "Business Administration"}
											</h4>
											<p className="text-sm text-muted-foreground">
												{member.role === "Developer"
													? "Tech University"
													: member.role === "Designer"
														? "Design Academy"
														: "Business School"}
												{" • "}
												2020
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Performance Tab */}
			<TabsContent value="performance">
				<Card>
					<CardHeader>
						<CardTitle>Performance Metrics</CardTitle>
						<CardDescription>{member.name}'s performance and productivity</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">24</div>
									<p className="text-xs text-muted-foreground">+8 from last month</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">92%</div>
									<p className="text-xs text-muted-foreground">+5% from last month</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">2.4h</div>
									<p className="text-xs text-muted-foreground">-0.5h from last month</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">Projects Contributed</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{member.projects.length}</div>
									<p className="text-xs text-muted-foreground">+1 from last month</p>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-8">
							<div>
								<h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
								<div className="h-[200px] bg-muted/30 rounded-md flex items-end justify-between p-4">
									{[65, 78, 82, 75, 90, 85, 92].map((value, index) => (
										<div key={index} className="flex flex-col items-center gap-2">
											<div className="bg-primary w-8 rounded-t-sm" style={{ height: `${value * 1.5}px` }}></div>
											<div className="text-xs text-muted-foreground">
												{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}
											</div>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-4">Task Distribution</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="p-4 bg-muted/30 rounded-md">
										<h4 className="text-sm font-medium mb-3">By Project</h4>
										<div className="space-y-3">
											{member.projects.map((project, index) => (
												<div key={index} className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>{project}</span>
														<span>{[40, 30, 20, 10][index % 4]}%</span>
													</div>
													<div className="w-full bg-muted rounded-full h-2">
														<div
															className={`rounded-full h-2 ${["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500"][index % 4]
																}`}
															style={{ width: `${[40, 30, 20, 10][index % 4]}%` }}
														></div>
													</div>
												</div>
											))}
										</div>
									</div>

									<div className="p-4 bg-muted/30 rounded-md">
										<h4 className="text-sm font-medium mb-3">By Status</h4>
										<div className="space-y-3">
											{["Completed", "In Progress", "Not Started", "Blocked"].map((status, index) => (
												<div key={index} className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>{status}</span>
														<span>{[60, 25, 10, 5][index]}%</span>
													</div>
													<div className="w-full bg-muted rounded-full h-2">
														<div
															className={`rounded-full h-2 ${["bg-green-500", "bg-blue-500", "bg-gray-400", "bg-red-500"][index]
																}`}
															style={{ width: `${[60, 25, 10, 5][index]}%` }}
														></div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
