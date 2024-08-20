const mailjet = require('node-mailjet').apiConnect(
    '883fe9db9269bf5373b4ef1f76145f9a', // API Key pública
    '3fcaf45298c19141d23585203b12f557'  // API Key privada
  );
  
  async function enviarCorreo(destinatario, asunto, mensaje, attachments ) {
    try {
      const response = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: 'dennislrj25@gmail.com', 
                Name: 'Dennis',
              },
              To: [
                {
                  Email: destinatario,
                },
              ],
              Subject: asunto,
              TextPart: mensaje,
              Attachments: attachments,
            },
          ],
        });
      console.log('Correo enviado exitosamente:', response.body);
      return response.body;
    } catch (err) {
      console.error('Error enviando correo:', err);
      throw err;
    }
  }
  
  module.exports = { enviarCorreo };