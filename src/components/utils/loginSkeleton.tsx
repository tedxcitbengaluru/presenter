import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function LoginLoader() {
  return (
    <div className="p-8 xs:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl">Presenter</h1>
        <h2 className="ml-2">
          <Skeleton className="w-40 h-4" />
        </h2>
      </div>
      <div>
        <Card className="my-4">
          <CardHeader>
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-60 h-3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 my-2">
              <div>
                <Label>
                  <Skeleton className="w-20 h-4 mb-1" />
                </Label>
                <Input
                  placeholder="჻჻჻჻჻჻჻჻჻჻჻"
                  disabled
                  className="w-full h-10 p-2 border rounded"
                />
              </div>
              <div>
                <Label>
                  <Skeleton className="w-20 h-4 mb-1" />
                </Label>
                <Input
                  placeholder="჻჻჻჻჻჻჻჻჻჻჻"
                  disabled
                  className="w-full h-10 p-2 border rounded"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full flex items-center justify-center">
              {" "}
              <span className="mx-auto">჻჻჻჻჻჻჻჻჻</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
