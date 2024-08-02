// src/controllers/fileController.js
const fs = require('fs-extra');
const path = require('path');
const openai = require('../config/openai');

exports.handleRequest = async (req, res) => {
  const { prompt } = req.body;
  let i = 0;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content:
            prompt +
            (i == 0
              ? `
    \nlas respuestas a partir de ahora solo serán en el siguiente formato
        {
          "path": "project/index.js",
          "content": "console.log('Hello, World!');"
        }
    }, salvo se necesite mas contexto. Cuando recibas NEXT continúas con otro archivo. Si envias FIN, terminas de escribir.
    `
              : '')
        }
      ],
      max_tokens: 1000
    });

    const responseText = response.choices[0].message.content.trim();
    if (responseText.includes('path') && responseText.includes('content')) {
      // Parsear la respuesta como JSON
      let fileStructure;
      try {
        fileStructure = JSON.parse(responseText);
      } catch (error) {
        return res
          .status(400)
          .json({ error: 'Respuesta de OpenAI no es un JSON válido' });
      }
      // Crear archivos y carpetas según la estructura
      const filePath = path.join(__dirname, fileStructure.path);
      const dir = path.dirname(filePath);
      await fs.ensureDir(dir); // Asegurarse de que la carpeta exista
      await fs.writeFile(filePath, fileStructure.content); // Escribir el archivo
      console.log(filePath);
      return res.json({ message: 'Archivos escritos con éxito' });
    }
    return res.json({ message: responseText });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
