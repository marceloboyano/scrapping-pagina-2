const cheerio = require('cheerio');
const axios = require('axios');

async function main() {
    try {
        let response = await axios.get('https://www.therundown.ai/');
        let $ = cheerio.load(response.data);

          // Access the first news article on the main page
          let firstArticleLink = 'https://www.therundown.ai' + $('a.group.flex').first().attr('href');
          console.log('First Article Link:', firstArticleLink);
  
          // Process all news articles on the first article's page
          await procesarNoticia(firstArticleLink);
     
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}



async function procesarNoticia(enlace) {
    try {
        let noticiasResponse = await axios.get(enlace);
        let noticiasHtml = noticiasResponse.data;
        let noticias$ = cheerio.load(noticiasHtml);

           // Encuentra todos los elementos que representan noticias, empezando desde el segundo elemento
           let noticias = noticias$('div[style="background-color:#FFFFFF;border-color:#000000;border-radius:10px;border-style:solid;border-width:2px;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;"]').slice(1);


        noticias.each((indiceNoticia, elementoNoticia) => {
            let tituloNoticia = noticias$(elementoNoticia).find('div h4 span[style="text-decoration:underline;"] a b').text().trim();
           

       
            let descripcionNoticias = [];
              // Agregar el texto adicional a la descripción
                let textoAdicional = noticias$(elementoNoticia).find('div[style="padding-bottom:12px;padding-left:15px;padding-right:15px;padding-top:12px;"] p').text().trim();
                descripcionNoticias.push(textoAdicional);

                // Buscar la lista desordenada (ul) dentro de la noticia
                let listaDesordenada = noticias$(elementoNoticia).find('div[style="padding-bottom:12px;padding-left:37px;padding-right:27px;padding-top:0px;"] ul');

                if (listaDesordenada.length > 0) {
                    // Iterar sobre los elementos de la lista (li) y agregarlos a la descripción
                    listaDesordenada.find('li').each((indiceLista, itemLista) => {
                        descripcionNoticias.push(noticias$(itemLista).text().trim());
                    });
                }

                // Concatenar todo el texto en una descripción
                let descripcionCompleta = descripcionNoticias.join('\n');

                // Estructura de datos para la noticia
                let noticia = {
                    Titulo: tituloNoticia,
                    Descripcion: descripcionCompleta
                };
            // Imprimir la estructura de datos o realizar otras operaciones según sea necesario
            console.log('Noticia:', noticia);
        });
    } catch (error) {
        console.error('Error al procesar las noticias:', error.message);
    }
}



main();