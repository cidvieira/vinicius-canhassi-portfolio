"use client"

import { useState, useEffect } from "react"
import DOMPurify from 'dompurify';
import { Button } from "@/components/Dashboard/ui/button"
import { Textarea } from "@/components/Dashboard/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { Alert, AlertDescription } from "@/components/Dashboard/ui/alert"
import { Save, CheckCircle } from "lucide-react"
import { SkeletonAbout } from "@/components/Dashboard/ui/skeleton-about"
import { SkeletonCardHeader } from "@/components/Dashboard/ui/skeleton-card-header"

export default function SobreMimPage() {
  const [content, setContent] = useState("")
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false) 
  const [isLoading, setIsLoading] = useState(true) 
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const [response] = await Promise.all([
          fetch('/api/admin/about')
        ]);
        if (!response.ok) throw new Error("Falha ao buscar o conteúdo.");
        const data = await response.json();
        setContent(data.content || "");
        setUpdatedAt(data.updatedAt || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Falha ao salvar as alterações.");

      const updatedData = await response.json();
      setUpdatedAt(updatedData.updatedAt);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  const renderHtmlText = (text: string) => {
    const cleanHtml = DOMPurify.sanitize(text);
    const finalHtml = cleanHtml.replace(/\n/g, "<br>");
    return { __html: finalHtml };
  }

  const formattedDate = updatedAt
    ? `Última atualização: ${new Date(updatedAt).toLocaleDateString('pt-BR')}`: null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCardHeader backToProjectsBtn="hidden" addNewBtn="hidden"/>
        <SkeletonAbout />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Gerenciar Sobre Mim</h1>
          <p className="text-muted-foreground">Edite o texto da seção "Sobre Mim" do seu portfólo</p>
        </div>
      </div>

      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Texto salvo com sucesso!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Texto Principal</CardTitle>
          <CardDescription>
            Escreva sobre você, sua experiência e o que faz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Conte sua história..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none font-mono text-sm"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{content.length} caracteres</p>
            <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
          <CardFooter className="text-xs text-muted-foreground px-0 justify-end">
              {formattedDate && (
                <p>
                  {formattedDate}
                </p>
              )}
          </CardFooter>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização</CardTitle>
          <CardDescription>Veja como o texto aparecerá no seu portfólio</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={renderHtmlText(content)}
          />
        </CardContent>
      </Card>
    </div>
  )
}