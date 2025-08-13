import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  expectedFeatures?: string[];
}

export default function PlaceholderPage({
  title,
  description,
  expectedFeatures = [],
}: PlaceholderPageProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-aml-blue/5 p-4">
      <div className="max-w-4xl mx-auto pt-16">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="mx-auto w-16 h-16 bg-aml-blue/10 rounded-full flex items-center justify-center mb-4">
              <Construction className="h-8 w-8 text-aml-blue" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {expectedFeatures.length > 0 && (
              <div className="text-left max-w-md mx-auto">
                <h3 className="font-semibold text-foreground mb-3">
                  Planned Features:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {expectedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-aml-blue rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                This page is currently under development. Continue prompting to
                help build out this section.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/dashboard">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
                <Button className="bg-aml-blue hover:bg-aml-blue/90">
                  Request Development
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Current path: {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
}
