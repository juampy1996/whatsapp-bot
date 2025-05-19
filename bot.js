const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const cron = require('node-cron');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async (qr) => {
  // Mostrar QR en consola (opcional)
  qrcodeTerminal.generate(qr, { small: true });
  console.log('QR recibido, generando imagen y enviando...');

  try {
    // Guardar QR en archivo PNG
    await QRCode.toFile('qr.png', qr);
    console.log('QR guardado en qr.png');

    // Esperar que el cliente esté listo para enviar mensajes
    client.once('ready', async () => {
      const media = MessageMedia.fromFilePath('qr.png');
      const myNumber = '59163771073@c.us'; // Tu número con código país y formato correcto
      await client.sendMessage(myNumber, media);
      console.log('QR enviado por WhatsApp a tu número');
    });

  } catch (error) {
    console.error('Error guardando o enviando el QR:', error);
  }
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
