#!/usr/bin/env node
require('dotenv').config();
const https = require('https');

const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

if (!APP_ID || !APP_SECRET) {
  console.error('❌ APP_ID ou APP_SECRET não encontrados no arquivo .env');
  process.exit(1);
}

console.log('🔑 Gerando token permanente do WhatsApp...');

const options = {
  hostname: 'graph.facebook.com',
  path: `/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=client_credentials`,
  method: 'GET'
};

const req = https.request(options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.access_token) {
        console.log('\n✅ Token gerado com sucesso!');
        console.log('\n📋 Adicione as seguintes variáveis ao seu .env:');
        console.log(`\nWHATSAPP_ACCESS_TOKEN="${response.access_token}"`);
        console.log('\n🔍 Para obter o PHONE_NUMBER_ID e BUSINESS_ACCOUNT_ID:');
        console.log('1. Acesse https://developers.facebook.com/apps/');
        console.log(`2. Selecione o App ID: ${APP_ID}`);
        console.log('3. Vá para WhatsApp > Configuração');
        console.log('4. Copie o Phone Number ID');
        console.log('5. Copie o WhatsApp Business Account ID\n');
      } else {
        console.error('❌ Erro ao gerar token:', response.error?.message || 'Resposta inválida');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error.message);
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('❌ Erro na requisição:', error.message);
  process.exit(1);
});

req.end();