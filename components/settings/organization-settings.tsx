

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertCircle,
    AlertTriangle,
    Facebook,
    Globe,
    Instagram,
    Linkedin,
    Loader2,
    Twitter,
    Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OrganizationSettings() {
  const [profileCompletion, setProfileCompletion] = useState<number>(65);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetOrganization = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetDialogOpen(false);
      toast.success("Organization reset successfully", {
        description: "All settings have been restored to default.",
      });
    }, 2000);
  };

  const handleDeleteOrganization = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      toast.success("Organization deleted successfully", {
        description: "Your organization has been permanently deleted.",
      });
    }, 2000);
  };

  interface OrgField {
    id: string;
    label: string;
    def: string;
    options: string[];
  }

  const organizationFields: OrgField[] = [
    {
      id: "org-industry",
      label: "Industry",
      def: "technology",
      options: [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Retail",
        "Manufacturing",
        "Other",
      ],
    },
    {
      id: "org-size",
      label: "Company Size",
      def: "51-200",
      options: [
        "1-50 employees",
        "51-200 employees",
        "201-1000 employees",
        "1000+ employees",
      ],
    },
    {
      id: "org-timezone",
      label: "Timezone",
      def: "utc",
      options: [
        "Pacific (UTC-8)",
        "Eastern (UTC-5)",
        "UTC",
        "CET (UTC+1)",
        "CST (UTC+8)",
      ],
    },
    {
      id: "org-language",
      label: "Default Language",
      def: "english",
      options: [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* --- Organization Profile --- */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
            Organization Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Logo and Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-md">
                <AvatarImage src="/images/users/1.jpg" alt="Company logo" />
                <AvatarFallback>CO</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-primary/10"
              >
                <Upload className="h-4 w-4" />
                Change Logo
              </Button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    defaultValue="Acme Inc."
                    className=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain">Domain</Label>
                  <Input id="org-domain" defaultValue="acme.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-description">Description</Label>
                <Textarea
                  id="org-description"
                  className="resize-none"
                  rows={3}
                  defaultValue="Acme Inc. is a leading provider of innovative solutions for businesses of all sizes."
                />
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizationFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Select defaultValue={field.def}>
                  <SelectTrigger id={field.id}>
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={opt.toLowerCase().split(" ")[0]}
                      >
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "org-email",
                  label: "Email",
                  type: "email",
                  val: "contact@acme.com",
                },
                {
                  id: "org-phone",
                  label: "Phone",
                  type: "tel",
                  val: "+1 (555) 123-4567",
                },
                {
                  id: "org-website",
                  label: "Website",
                  type: "text",
                  val: "https://acme.com",
                  icon: Globe,
                },
              ].map(({ id, label, type, val, icon: Icon }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <div className="flex">
                    {Icon && (
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <Input
                      id={id}
                      type={type}
                      defaultValue={val}
                      className={Icon ? "rounded-l-none" : ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Twitter", Icon: Twitter, value: "@acmeinc" },
                { name: "LinkedIn", Icon: Linkedin, value: "acme-inc" },
                { name: "Facebook", Icon: Facebook, value: "acmeinc" },
                { name: "Instagram", Icon: Instagram, value: "acmeinc" },
              ].map(({ name, Icon, value }) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={`org-${name.toLowerCase()}`}>{name}</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id={`org-${name.toLowerCase()}`}
                      className="rounded-l-none"
                      defaultValue={value}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Profile Completion</h3>
              <span className="text-sm text-muted-foreground">
                {profileCompletion}%
              </span>
            </div>
            <Progress value={profileCompletion} className="h-2 bg-muted" />
            {profileCompletion < 100 && (
              <Alert className="bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle>Complete your profile</AlertTitle>
                <AlertDescription>
                  Add missing details to make your organization profile look
                  more professional.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* --- Danger Zone --- */}
      <Card className="border-destructive/20 bg-linear-to-b from-destructive/5 to-background backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-destructive font-semibold">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Destructive actions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="shadow-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              These actions are irreversible and may result in data loss.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-destructive/30 shadow-none bg-background/40">
              <CardHeader>
                <CardTitle className="text-base">Reset Organization</CardTitle>
                <CardDescription>Reset all data and settings</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => setResetDialogOpen(true)}
                >
                  Reset Organization
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-destructive/30 shadow-none bg-background/40">
              <CardHeader>
                <CardTitle className="text-base">Delete Organization</CardTitle>
                <CardDescription>
                  Permanently delete this organization
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Organization
                </Button>
              </CardFooter>
            </Card>
          </div>

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently reset all
                  organization data and settings to default.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleResetOrganization();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isResetting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Organization
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  organization and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteOrganization();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete Organization
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
