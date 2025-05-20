const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const cron = require('node-cron');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`;
  console.log('Escanea el QR en este enlace desde tu navegador:');
  console.log(qrUrl);
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

  // Verificar si estamos dentro de la ventana horaria
  const now = new Date();
  const hour = now.getHours();

  if (contactName === grupoPermitido && message.body.toLowerCase().includes('hola')) {
    if (hour >= 15 && hour < 16) {  // Ventana de 15:00 a 16:00
      client.sendMessage(message.from, '¡Hola! Este es un mensaje automático solo para este grupo o contacto dentro de la ventana horaria 🤖');

      const media = MessageMedia.fromFilePath('./img.png'); // Cambia la ruta a tu imagen
      await client.sendMessage(message.from, media);
    } else {
      console.log('Mensaje fuera de ventana horaria, no se responde.');
    }
  }
});

client.initialize();
