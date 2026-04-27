"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, role, updateProfile } = useAuth();

  return (
    <>
      <PageHeader title="Settings" description="Profile and organisation preferences (mock)." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                updateProfile({
                  firstName: String(fd.get("firstName") || user?.firstName),
                  lastName: String(fd.get("lastName") || user?.lastName),
                  phone: String(fd.get("phone") || ""),
                });
                toast.success("Profile updated (mock session)");
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user?.firstName}
                    className="min-h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" defaultValue={user?.lastName} className="min-h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={user?.phone} className="min-h-11" />
              </div>
              <Button type="submit" className="min-h-11">
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Light, dark, or match your system. Applies across the app.
            </p>
            <ThemeToggle />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.message("Mock: password change is disabled until Phase 2");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="pw">New password</Label>
                <Input id="pw" type="password" className="min-h-11" />
              </div>
              <Button type="submit" variant="secondary" className="min-h-11">
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {role === "admin" ? (
        <>
          <Separator className="my-8" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input defaultValue="companySYNC Demo Co." className="min-h-11" />
                </div>
                <Button className="min-h-11" onClick={() => toast.success("Saved company (mock)")}>
                  Save
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Engineering, Human Resources, Sales</p>
                <Button variant="outline" className="min-h-11" onClick={() => toast.message("Mock add department")}>
                  Add department
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
}
