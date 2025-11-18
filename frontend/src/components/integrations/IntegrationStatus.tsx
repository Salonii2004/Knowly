// src/components/IntegrationStatus.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { integrationsApi, IntegrationStatus as IIntegrationStatus } from "@/services/integrationsApi";

const IntegrationStatus = () => {
  const [status, setStatus] = useState<IIntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await integrationsApi.getStatus();
        setStatus(response);
      } catch (error) {
        console.error("Error fetching integration status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {status.map((item) => (
        <Card key={item.service} className="shadow rounded-2xl">
          <CardContent className="flex items-center justify-between p-4">
            <span className="font-medium">{item.service}</span>
            {item.connected ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IntegrationStatus;