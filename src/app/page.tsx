"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Palette,
  Package,
  Calculator,
  User,
  FileSignature,
  CheckCircle
} from "lucide-react";

// Import step components
import DoorStyleSelection from "@/components/DoorStyleSelection";
import CabinetSelection from "@/components/CabinetSelection";
import PricingAndDiscounts from "@/components/PricingAndDiscounts";

const steps = [
  { id: 0, title: "Project Setup", icon: Home },
  { id: 1, title: "Door Style & Finish", icon: Palette },
  { id: 2, title: "Cabinet Selection", icon: Package },
  { id: 3, title: "Pricing & Discounts", icon: Calculator },
  { id: 4, title: "Customer Info", icon: User },
  { id: 5, title: "Agreement & Signatures", icon: FileSignature },
  { id: 6, title: "Complete", icon: CheckCircle },
];

export default function HomePage() {
  const {
    currentStep,
    setCurrentStep,
    jobName,
    setJobName,
    completedSteps,
    markStepCompleted
  } = useAppStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartProject = () => {
    if (jobName.trim()) {
      markStepCompleted(0);
      setCurrentStep(1);
    }
  };

  const progressPercentage = (completedSteps.length / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Cabinet Refacing Pro</h1>
              <p className="text-sm text-zinc-600">Professional Sales Tool</p>
            </div>
            <Badge variant="outline" className="bg-zinc-900 text-white">
              Step {currentStep + 1}/{steps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-zinc-500 mt-1">
              {completedSteps.length} of {steps.length - 1} steps completed
            </p>
          </div>
        </div>
      </header>

      {/* Step Navigation */}
      <nav className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="mx-auto px-2 py-3">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  disabled={index > currentStep && !isCompleted}
                  className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-zinc-900 text-white"
                      : isCompleted
                      ? "text-green-600 hover:bg-green-50"
                      : index <= currentStep
                      ? "text-zinc-600 hover:bg-zinc-50"
                      : "text-zinc-400"
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium truncate">{step.title}</span>
                  {isCompleted && index !== currentStep && (
                    <CheckCircle className="h-3 w-3 mt-1 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4">
        {currentStep === 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Home className="h-6 w-6 text-zinc-700" />
                Project Setup
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Let's start your cabinet refacing project
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobName" className="text-base font-medium">
                  Custom Job Name
                </Label>
                <Input
                  id="jobName"
                  placeholder="Enter project name (e.g., Smith Kitchen Remodel)"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  This will help identify your project in reports and agreements
                </p>
              </div>

              <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-zinc-900">What's included:</h3>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Professional door style selection</li>
                  <li>• Custom finish options</li>
                  <li>• Real-time pricing calculations</li>
                  <li>• Digital agreement & signatures</li>
                  <li>• Automatic email distribution</li>
                </ul>
              </div>

              <Button
                onClick={handleStartProject}
                disabled={!jobName.trim()}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                Start Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Door Style & Finish */}
        {currentStep === 1 && (
          <DoorStyleSelection
            onComplete={() => {
              markStepCompleted(1);
              setCurrentStep(2);
            }}
          />
        )}

        {/* Step 2: Cabinet Selection */}
        {currentStep === 2 && (
          <CabinetSelection
            onComplete={() => {
              markStepCompleted(2);
              setCurrentStep(3);
            }}
          />
        )}

        {/* Step 3: Pricing & Discounts */}
        {currentStep === 3 && (
          <PricingAndDiscounts
            onComplete={() => {
              markStepCompleted(3);
              setCurrentStep(4);
            }}
          />
        )}

        {/* Steps 4+ - Placeholder for future development */}
        {currentStep > 3 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="mb-4">
                    {React.createElement(steps[currentStep].icon, {
                      className: "h-12 w-12 text-zinc-700 mx-auto"
                    })}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    This step is under development. Continue to see the complete app structure.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        markStepCompleted(currentStep);
                        if (currentStep < steps.length - 1) {
                          setCurrentStep(currentStep + 1);
                        }
                      }}
                      className="w-full h-11"
                      disabled={currentStep >= steps.length - 1}
                    >
                      {currentStep >= steps.length - 1 ? "Project Complete" : "Continue to Next Step"}
                    </Button>

                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="w-full h-11"
                      >
                        Go Back
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Project Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Current Project</h3>
                <p className="text-sm text-zinc-600">{jobName}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
