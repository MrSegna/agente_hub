import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function TinyCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let status = 'pending';
  let message = '';

  try {
    if (!searchParams.code) {
      status = 'error';
      message = 'Código de autorização não fornecido';
    } else {
      const response = await fetch(`/api/auth/tiny/callback?code=${searchParams.code}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success) {
        status = 'success';
        message = 'Autenticação realizada com sucesso!';
      } else {
        status = 'error';
        message = data.error || 'Erro ao processar autenticação';
      }
    }
  } catch (error) {
    status = 'error';
    message = 'Erro ao processar callback';
    console.error('Erro no callback:', error);
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Status da Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>
                {message}
                <br />
                Você já pode fechar esta janela e voltar ao bot.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}