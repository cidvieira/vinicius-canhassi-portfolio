"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/Dashboard/auth-guard"
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout"
import { Button } from "@/components/Dashboard/ui/button"
import { Textarea } from "@/components/Dashboard/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { Alert, AlertDescription } from "@/components/Dashboard/ui/alert"
import { Save, CheckCircle } from "lucide-react"

export default function SobreMimPage() {
  const [aboutText, setAboutText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Carregar texto salvo do localStorage
  useEffect(() => {
    const savedText = localStorage.getItem("aboutMeText")
    if (savedText) {
      setAboutText(savedText)
    } else {
      // Texto padrão como exemplo
      setAboutText(`Olá! Sou um artista e criador de conteúdo apaixonado por explorar diferentes formas de expressão visual.

Minha jornada começou há mais de 10 anos, quando descobri minha paixão pela arte digital e fotografia. Desde então, tenho me dedicado a criar projetos que combinam técnica e criatividade.

Especializo-me em:
• Arte digital e ilustração
• Fotografia conceitual
• Produção de vídeo
• Design gráfico

Cada projeto é uma oportunidade de contar uma história única e conectar com as pessoas através da arte. Acredito que a criatividade não tem limites e estou sempre buscando novas formas de inovar.

Entre em contato comigo para colaborações ou apenas para conversar sobre arte!`)
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)

    // Simular salvamento - em produção, enviar para API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("aboutMeText", aboutText)
    setIsLoading(false)
    setShowSuccess(true)

    // Esconder mensagem de sucesso após 3 segundos
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const renderHtmlText = (text: string) => {
    return { __html: text.replace(/\n/g, "<br>") }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Gerenciar Sobre Mim</h1>
            <p className="text-muted-foreground">Edite o texto da seção "Sobre Mim" do seu portfólio</p>
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
                Escreva sobre você, sua experiência e o que faz. Você pode usar tags HTML como &lt;strong&gt;,
                &lt;em&gt;, &lt;u&gt;, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Conte sua história... Você pode usar <strong>negrito</strong>, <em>itálico</em>, <u>sublinhado</u>, etc."
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="min-h-[400px] resize-none font-mono text-sm"
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{aboutText.length} caracteres</p>

                <Button onClick={handleSave} disabled={isLoading || !aboutText.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>Veja como o texto aparecerá no seu portfólio com formatação HTML</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                dangerouslySetInnerHTML={renderHtmlText(aboutText)}
              />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
