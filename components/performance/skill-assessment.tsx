"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Skill = {
  name: string;
  score: number;
};

interface SkillData {
  technicalSkills: Skill[];
  softSkills: Skill[];
  technicalAnalysis: string;
  softAnalysis: string;
}

export function SkillAssessment() {
  const { data: session } = useSession();
  const [data, setData] = useState<SkillData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/performance/skills");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSkills();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-teal-400";
    if (score >= 70) return "bg-amber-400";
    if (score >= 60) return "bg-orange-400";
    return "bg-red-400";
  };

  const renderSkillBars = (skills: Skill[], analysis: string) => (
    <div className="space-y-5">
      {skills.map((skill) => (
        <div key={skill.name} className="space-y-1.5 group">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground/90">{skill.name}</span>
            <span className="text-muted-foreground">{skill.score}/100</span>
          </div>

          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full ${getScoreColor(
                skill.score
              )} transition-[width] duration-700 ease-out`}
              style={{ width: `${skill.score}%` }}
              aria-hidden
            />
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
          {analysis}
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="border border-border/50 shadow-none bg-background">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Skill Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || (data.technicalSkills.length === 0 && data.softSkills.length === 0)) {
    return (
      <Card className="border border-border/50 shadow-none bg-background">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Skill Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No skill data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {renderSkillBars(data.technicalSkills, data.technicalAnalysis)}
          </TabsContent>

          <TabsContent value="soft" className="mt-0">
            {renderSkillBars(data.softSkills, data.softAnalysis)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
