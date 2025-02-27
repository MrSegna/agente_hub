'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TinyAuthPage() {
  const handleAuth = async () => {
    try {
      const response = await fetch('/api/auth/tiny', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        console.error('Erro ao obter URL de autenticação:', data.error);
      }
    } catch (error) {
      console.error('Erro ao conectar com API:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Autenticação Tiny ERP</CardTitle>
          <CardDescription>
            Conecte sua conta do Tiny ERP para habilitar as consultas de estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para usar as funcionalidades de consulta de estoque, você precisa autorizar
              o acesso à sua conta do Tiny ERP. Clique no botão abaixo para iniciar o processo.
            </p>
            <Button 
              onClick={handleAuth}
              className="w-full"
            >
              Conectar com Tiny ERP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}