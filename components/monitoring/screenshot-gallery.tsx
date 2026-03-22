"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, ChevronLeft, ChevronRight, Download, X, ZoomIn } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface Screenshot {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  capturedAt: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  isLoading?: boolean;
  title?: string;
}

export function ScreenshotGallery({
  screenshots,
  isLoading,
  title = "Recent Screenshots",
}: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < screenshots.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (screenshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Camera className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No screenshots captured yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({screenshots.length} total)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className="group relative aspect-video rounded-lg overflow-hidden border bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={screenshot.thumbnailUrl || screenshot.imageUrl}
                  alt={`Screenshot from ${format(new Date(screenshot.capturedAt), "PPp")}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-xs text-white">
                    {format(new Date(screenshot.capturedAt), "h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl p-0 gap-0 bg-black/95">
          <DialogTitle className="sr-only">Screenshot Viewer</DialogTitle>

          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                if (selectedIndex !== null) {
                  window.open(screenshots[selectedIndex].imageUrl, "_blank");
                }
              }}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {selectedIndex !== null && (
            <>
              <div className="relative flex items-center justify-center min-h-[60vh]">
                <img
                  src={screenshots[selectedIndex].imageUrl}
                  alt="Screenshot"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 text-white hover:bg-white/20 disabled:opacity-30"
                  onClick={handlePrevious}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 text-white hover:bg-white/20 disabled:opacity-30"
                  onClick={handleNext}
                  disabled={selectedIndex === screenshots.length - 1}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>

              <div className="p-4 bg-black/80 border-t border-white/10">
                <p className="text-white text-center">
                  {format(new Date(screenshots[selectedIndex].capturedAt), "PPpp")}
                  <span className="text-white/60 ml-4">
                    {selectedIndex + 1} of {screenshots.length}
                  </span>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
