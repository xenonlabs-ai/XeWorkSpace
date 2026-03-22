import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileImage,
  FileJson,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  Mail,
} from "lucide-react";

export function ReportExportOptions() {
  // Sample export options
  const exportOptions = [
    {
      format: "PDF",
      description: "Portable Document Format",
      icon: FilePdf,
      color: "bg-red-100 text-red-700",
    },
    {
      format: "Excel",
      description: "Microsoft Excel Spreadsheet",
      icon: FileSpreadsheet,
      color: "bg-green-100 text-green-700",
    },
    {
      format: "CSV",
      description: "Comma Separated Values",
      icon: FileText,
      color: "bg-blue-100 text-blue-700",
    },
    {
      format: "Image",
      description: "PNG or JPEG format",
      icon: FileImage,
      color: "bg-purple-100 text-purple-700",
    },
    {
      format: "JSON",
      description: "JavaScript Object Notation",
      icon: FileJson,
      color: "bg-amber-100 text-amber-700",
    },
    {
      format: "Distribution chain updated",
      description: "JavaScript Object Notation",
      icon: FileJson,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          {exportOptions.map((option) => (
            <div
              key={option.format}
              className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-md ${option.color}`}>
                <option.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{option.format}</h4>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          ))}

          <div className="pt-2 lg:col-span-2 flex justify-center">
            <Button variant="outline" className="w-1/2" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
