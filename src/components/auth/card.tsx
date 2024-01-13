"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabaseClient } from "@/utils/supabaseClient";

export const AuthCard: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [disableForm, setDisableForm] = useState(false);

  const handleSignIn = async () => {
    setDisableForm(true);
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!username) {
      toast.error("Please enter your username");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const signInResponse = await supabaseClient.auth.signInWithPassword({
      email: username + "@tedxcitbengaluru.presenter",
      password,
    });

    setDisableForm(false);
    if (!signInResponse.data.session) {
      toast.error(
        "Login unsuccessful : " + signInResponse.error?.message ?? "",
      );
    }
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Request an admin to create account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 my-2">
          <div>
            <Label htmlFor="username-input">Username</Label>
            <Input
              ref={usernameRef}
              type="text"
              id="username-input"
              placeholder="Username"
              disabled={disableForm}
            />
          </div>
          <div>
            <Label htmlFor="password-input">Password</Label>
            <Input
              ref={passwordRef}
              type="password"
              id="password-input"
              placeholder="Password"
              disabled={disableForm}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSignIn}
          disabled={disableForm}
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};
