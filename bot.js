const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  // QR en consola pequeño
  qrcode.generate(qr, { small: true });
  console.log('Escanea este código QR con tu WhatsApp');
  console.log('Si no puedes escanear el QR en consola, abre este enlace en tu navegador:');
  console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`);
});

client.on('ready', () => {
  console.log('Bot listo y conectado a WhatsApp');
});

const grupoPermitido = 'Prueba bot';

client.on('message', async (message) => {
  const chat = await message.getChat();

  const contactName = chat.contact && chat.contact.name ? chat.contact.name : chat.name || chat.id.user;

  console.log(`Mensaje de: ${contactName}`);
  console.log(`Contenido: ${message.body}`);

  const now = new Date();
  const hour = now.getHours();

  if (contactName === grupoPermitido && message.body.toLowerCase().includes('hola')) {
    if (hour >= 22 && hour < 23) {
      client.sendMessage(message.from, '¡Hola! Este es un mensaje automático solo para este grupo o contacto dentro de la ventana horaria 🤖');

      const media = MessageMedia.fromFilePath('./img.png');
      await client.sendMessage(message.from, media);
    } else {
      console.log('Mensaje fuera de ventana horaria, no se responde.');
    }
  }
});

client.initialize();
