'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function TinyAuthErrorPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Erro na Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Falha na Autenticação</AlertTitle>
            <AlertDescription>
              Não foi possível completar o processo de autenticação com o Tiny ERP.
              Por favor, tente novamente.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => window.close()}
            >
              Fechar
            </Button>
            <Button 
              onClick={() => router.push('/auth/tiny')}
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}