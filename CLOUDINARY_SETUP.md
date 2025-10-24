# Configuração do Cloudinary para Upload Direto

## 1. Configurar Upload Preset

Para permitir uploads diretos do cliente para o Cloudinary, você precisa configurar um **Upload Preset** no seu painel do Cloudinary.

### Passos:

1. **Acesse o Cloudinary Console**: https://console.cloudinary.com/
2. **Vá para Settings > Upload**
3. **Clique em "Add upload preset"**
4. **Configure o preset:**

```
Preset name: byuplay-direct-upload
Signing Mode: Unsigned (para uploads diretos)
Folder: byuplay/videos
Resource Type: Video
Transformation: f_auto,q_auto
Tags: byuplay,video
Context: title,description,genre,rating,releaseDate,duration,language,contentType,tags
```

### Configurações Avançadas:

```json
{
  "name": "byuplay-direct-upload",
  "unsigned": true,
  "folder": "byuplay/videos",
  "resource_type": "video",
  "transformation": {
    "fetch_format": "auto",
    "quality": "auto"
  },
  "tags": ["byuplay", "video"],
  "context": {
    "title": "",
    "description": "",
    "genre": "",
    "rating": "",
    "releaseDate": "",
    "duration": "",
    "language": "",
    "contentType": "",
    "tags": ""
  },
  "eager": [
    {
      "fetch_format": "auto",
      "quality": "auto",
      "width": 1280,
      "height": 720,
      "crop": "scale"
    }
  ]
}
```

## 2. Configurar Webhook (Opcional)

Para processar uploads automaticamente, configure um webhook:

1. **Vá para Settings > Webhooks**
2. **Adicione novo webhook:**
   - **URL**: `https://seu-dominio.com/api/cloudinary-webhook`
   - **Events**: `Upload`
   - **Resource Type**: `Video`

## 3. Variáveis de Ambiente

Certifique-se de que suas variáveis de ambiente estão configuradas:

```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

## 4. Limites por Plano

### Plano Gratuito:
- **Tamanho máximo**: 100MB por vídeo
- **Armazenamento**: 25GB total
- **Transformações**: 25.000 por mês
- **Bandwidth**: 25GB por mês

### Plano Plus ($89/mês):
- **Tamanho máximo**: 2GB por vídeo
- **Armazenamento**: 100GB total
- **Transformações**: 100.000 por mês
- **Bandwidth**: 100GB por mês

## 5. Otimizações Recomendadas

### Para Vídeos Grandes:
```javascript
// Upload com chunking automático
const uploadOptions = {
  resource_type: 'video',
  chunk_size: 6000000, // 6MB chunks
  eager: [
    { fetch_format: 'auto', quality: 'auto' },
    { fetch_format: 'mp4', quality: 'auto', width: 1280, height: 720 }
  ]
};
```

### Para Melhor Performance:
```javascript
// URLs otimizadas
const optimizedUrl = videoUrl.replace('/upload/', '/upload/f_auto,q_auto,w_auto/');
```

## 6. Monitoramento

### Métricas Importantes:
- **Upload success rate**
- **Tempo médio de upload**
- **Uso de bandwidth**
- **Transformações utilizadas**

### Logs de Debug:
```javascript
// Adicione logs para debug
console.log('Upload progress:', progress);
console.log('Cloudinary response:', result);
```

## 7. Troubleshooting

### Erro 413 (Payload Too Large):
- Verifique se está usando upload direto (não via API route)
- Confirme que o preset está configurado corretamente

### Erro de Assinatura:
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o timestamp está sendo gerado corretamente

### Vídeo não reproduz:
- Verifique se o formato é suportado (MP4, MOV, AVI)
- Confirme se a URL está acessível
- Teste com diferentes navegadores

## 8. Segurança

### Upload Preset Seguro:
- Use **unsigned** apenas para uploads públicos
- Para uploads privados, use **signed** com autenticação
- Configure **allowed_formats** para limitar tipos de arquivo
- Use **max_file_size** para limitar tamanho

### Exemplo de Preset Seguro:
```json
{
  "unsigned": false,
  "max_file_size": 104857600,
  "allowed_formats": ["mp4", "mov", "avi", "webm"],
  "moderation": ["aws_rek_video"]
}
```
