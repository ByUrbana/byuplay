# Variáveis de Ambiente para Deploy

Para que o login funcione no deploy, você precisa configurar as seguintes variáveis de ambiente:

## Variáveis Obrigatórias

### NextAuth
```
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui
```

### Credenciais do Admin
```
ADMIN_EMAIL=admin@byuplay.com
ADMIN_PASSWORD=sua-senha-segura
```

### Google OAuth (opcional)
```
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

### Cloudinary (para upload de vídeos)
```
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

## Como configurar no Vercel

1. Acesse o dashboard do Vercel
2. Vá para o seu projeto
3. Clique em "Settings" > "Environment Variables"
4. Adicione cada variável com seus valores

## Como configurar em outros provedores

### Netlify
- Vá para "Site settings" > "Environment variables"

### Railway
- Vá para "Variables" na aba do projeto

### Heroku
- Use o comando: `heroku config:set VARIAVEL=valor`

## Verificação

Após configurar as variáveis, faça o deploy e verifique:
1. Se o login funciona
2. Se os logs aparecem no console do navegador
3. Se os logs aparecem no console do servidor
