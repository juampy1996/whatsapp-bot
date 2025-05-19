const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea este código QR con tu WhatsApp');
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
