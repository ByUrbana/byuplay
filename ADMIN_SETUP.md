# 🎬 Sistema de Administração BYUPLAY

## 📋 Visão Geral

Sistema completo de administração para a plataforma BYUPLAY com:
- ✅ Autenticação segura para administradores
- ✅ Upload de vídeos com Cloudinary
- ✅ Dashboard administrativo
- ✅ Proteção de rotas
- ✅ Interface moderna e responsiva

## 🚀 Configuração Rápida

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3011
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui

# Credenciais do Admin
ADMIN_EMAIL=admin@byuplay.com
ADMIN_PASSWORD=teste

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Cloudinary (para upload de vídeos)
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

### 2. Configurar Cloudinary

1. Acesse [Cloudinary](https://cloudinary.com)
2. Crie uma conta gratuita
3. No Dashboard, copie:
   - Cloud Name
   - API Key
   - API Secret
4. Cole nas variáveis de ambiente

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto

```bash
npm run dev
```

## 🔐 Acesso Administrativo

### Login via Credenciais
- **URL**: `http://localhost:3011/auth/signin`
- **Email**: O valor de `ADMIN_EMAIL` no .env
- **Senha**: O valor de `ADMIN_PASSWORD` no .env

### Login via Google (Opcional)
1. Configure o Google OAuth no [Google Cloud Console](https://console.cloud.google.com)
2. Adicione as credenciais no .env
3. Use o botão "Entrar com Google" na página de login

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth API
│   │   └── upload-video/route.ts          # Upload de vídeos
│   ├── auth/signin/page.tsx               # Página de login
│   ├── dashboard/page.tsx                 # Dashboard admin
│   └── upload-video/page.tsx              # Upload de vídeos
├── components/
│   └── SessionProvider.tsx                # Provider de sessão
├── lib/
│   ├── auth.ts                            # Configuração NextAuth
│   └── cloudinary.ts                      # Configuração Cloudinary
└── middleware.ts                          # Proteção de rotas
```

## 🛡️ Segurança

### Rotas Protegidas
- `/dashboard` - Apenas admins
- `/upload-video` - Apenas admins
- `/auth/signin` - Página de login

### Middleware
O middleware verifica automaticamente se o usuário é admin antes de permitir acesso às rotas protegidas.

## 📤 Upload de Vídeos

### Funcionalidades
- ✅ Upload direto para Cloudinary
- ✅ Barra de progresso em tempo real
- ✅ Validação de arquivos
- ✅ Metadados do vídeo
- ✅ Otimização automática

### Formatos Suportados
- MP4, MOV, AVI, MKV, WebM
- Tamanho máximo: 100MB (configurável no Cloudinary)

## 🎨 Interface

### Design System
- **Cores**: Gradientes cyan/blue
- **Tipografia**: Geist Sans
- **Componentes**: Tailwind CSS
- **Animações**: Transições suaves
- **Responsivo**: Mobile-first

### Componentes Principais
- `Header` - Navegação principal
- `StatCard` - Cards de estatísticas
- `SessionProvider` - Gerenciamento de sessão

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

### Estrutura de Dados

#### Video Metadata
```typescript
{
  id: string
  title: string
  description: string
  genre: string
  rating: string
  url: string
  thumbnail: string
  duration: number
  size: number
  createdAt: string
}
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- Netlify
- Railway
- DigitalOcean App Platform

## 📊 Monitoramento

### Métricas Disponíveis
- Total de vídeos
- Visualizações
- Usuários ativos
- Tempo médio de visualização
- Receita (se configurado)

### Logs
- Upload de vídeos
- Acessos admin
- Erros de autenticação

## 🔄 Próximos Passos

### Funcionalidades Futuras
- [ ] Banco de dados para persistência
- [ ] Gerenciamento de vídeos (editar/deletar)
- [ ] Analytics avançados
- [ ] Múltiplos administradores
- [ ] Backup automático

### Integrações Sugeridas
- **Analytics**: Google Analytics 4
- **CDN**: Cloudflare
- **Email**: SendGrid ou Resend
- **Monitoramento**: Sentry

## 🆘 Suporte

### Problemas Comuns

1. **Erro de autenticação**
   - Verifique as variáveis de ambiente
   - Confirme se NEXTAUTH_SECRET está definido

2. **Upload falha**
   - Verifique as credenciais do Cloudinary
   - Confirme se o arquivo é um vídeo válido

3. **Rotas não protegidas**
   - Verifique se o middleware está configurado
   - Confirme se o usuário tem role "admin"

### Logs de Debug
```bash
# Habilitar logs detalhados
DEBUG=nextauth* npm run dev
```

## 📝 Licença

Este projeto é privado e proprietário da BYUPLAY.

---

**Desenvolvido com ❤️ para BYUPLAY**
