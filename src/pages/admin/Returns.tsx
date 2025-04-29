
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminReturns = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Returns Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Returns & Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Returns Yet</h3>
            <p className="mt-2 text-muted-foreground">
              Returns and exchanges will appear here when customers initiate them.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReturns;
