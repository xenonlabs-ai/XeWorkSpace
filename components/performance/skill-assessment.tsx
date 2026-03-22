
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Skill = {
  name: string;
  score: number;
};

export function SkillAssessment() {
  const technicalSkills: Skill[] = [
    { name: "JavaScript", score: 85 },
    { name: "React", score: 90 },
    { name: "Node.js", score: 75 },
    { name: "TypeScript", score: 80 },
    { name: "CSS/SCSS", score: 88 },
  ];

  const softSkills: Skill[] = [
    { name: "Communication", score: 92 },
    { name: "Teamwork", score: 88 },
    { name: "Problem Solving", score: 85 },
    { name: "Time Management", score: 78 },
    { name: "Leadership", score: 82 },
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-teal-400";
    if (score >= 70) return "bg-amber-400";
    if (score >= 60) return "bg-orange-400";
    return "bg-red-400";
  };

  const renderSkillBars = (skills: Skill[], type: "technical" | "soft") => (
    <div className="space-y-5">
      {skills.map((skill) => (
        <div key={skill.name} className="space-y-1.5 group">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground/90">{skill.name}</span>
            <span className="text-muted-foreground">{skill.score}/100</span>
          </div>

          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
            {/* Animated width using CSS transition */}
            <div
              className={`h-3 rounded-full ${getScoreColor(
                skill.score
              )} transition-[width] duration-700 ease-out`}
              style={{ width: `${skill.score}%` }}
              aria-hidden
            />
            {/* Tooltip bubble on hover */}
            <div className="absolute inset-0 flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-0.5 border border-border/50">
                {skill.score}%
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/40">
        <h4 className="text-sm font-semibold mb-2 text-foreground/90">
          Skill Gap Analysis
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {type === "technical"
            ? "The team shows strong proficiency in React and CSS/SCSS. Consider additional training in Node.js to enhance backend capabilities."
            : "The team excels in communication and teamwork. Time management can be improved through workshops and structured project planning."}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="border border-border/50 shadow-none bg-background">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Skill Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full bg-muted/30 rounded-lg p-1">
            <TabsTrigger
              value="technical"
              className="text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              Technical Skills
            </TabsTrigger>
            <TabsTrigger
              value="soft"
              className="text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              Soft Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="mt-0">
            {renderSkillBars(technicalSkills, "technical")}
          </TabsContent>

          <TabsContent value="soft" className="mt-0">
            {renderSkillBars(softSkills, "soft")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
