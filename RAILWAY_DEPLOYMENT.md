# Railway Deployment Guide

## Environment Variables Required

Set these in your Railway dashboard:

```
REACT_APP_API_URL=https://your-backend-api.railway.app
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
REACT_APP_CONTACT_EMAIL=alan.kalbermatter.dev@gmail.com
NODE_ENV=production
```

## Custom Domain Setup

1. In Railway dashboard, go to Settings > Domains
2. Add custom domain: alan-kalbermatter.com
3. Update DNS records as shown in Railway dashboard

## Deployment Commands

Local build test:
```bash
npm run build
npm run serve
```

Railway will automatically run:
```bash
npm run build && npx serve -s build -l 3000
```
