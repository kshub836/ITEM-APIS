const express = require("express");
const app = express();
const mongoose = require("mongoose")
require("./db/dbconnection");
const puppeteer = require ('puppeteer');
//const sharp = require('sharp');
const userRouter = require("./routes/userRouter");
const staticRouter = require("./routes/staticRouter");
// const productRouter = require("./routes/productRoutes");
// const categoryRouter = require("./routes/categoryRouter");
const storeRouter = require("./routes/storeRouter");
const itemRouter = require("./routes/itemRouter");
// const http = require('http');
// const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "Api Deployment",
    version: "2.0.0",
    description: "Swagger API Docs .This is a sample  Open API 2.0.0 specification. You can find out more about Swagger at https://swagger.io ."


  },
  url: `localhost:7000/`,

};
 const options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./routes/userRouter.js"],
};
 const swaggerSpec = swaggerJSDoc(options);
 app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
 
 //Router listener
//app.use("/app/v1/user",swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//User Route
app.use("/app/v1/user", userRouter);

//Static Route
app.use("/static", staticRouter);

//Store Route
app.use("/store", storeRouter);

//Item Router
app.use("/item", itemRouter);

//Product Route
// app.use("/product", productRouter);


//Category Route
// app.use("/category", categoryRouter);



// Sharp image convertor

// sharp("image1.jpg")
// .rotate()
// .resize(100)
// .toFile("image1.webp")
// .then(data=> console.log(data))
// .catch(err=>console.log(err))


// (async () => {
// await sharp( "/image1.jpg",{
//   create: {
//     width: 48,
//     height: 48,
//     channels: 4,
//     background: { r: 255, g: 0, b: 0, alpha: 0.5 }
//   }
// })
//   .jpeg()
//   .toBuffer();
// })();

// Puppeteer 

// (async () => {
//   const browser = await puppeteer.launch({
//     headless:false,
//     defaultViewport:false,
//     slowMo:200,
//   });
//   const page = await browser.newPage();
  
//   const website_url= 'https://www.flipkart.com/'

//   //const website_url = 'https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/';

//   // Open URL in current page
//   await page.goto(website_url, { waitUntil: 'networkidle0' });

//   //To reflect CSS used for screens instead of print
//   await page.emulateMediaType('screen');

//   // Downlaod the PDF
//   const pdf = await page.pdf({
//   path: 'result.pdf',
//   margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
//   printBackground: true,
//   format: 'A4',
// });

// await browser.close();
// })();

  //await page.goto('https://google.com/');
  //await page.keyboard.type("flipkart");  
 // await page.keyboard.press("Enter");   

  // const searchResultSelector = 'h3';
  // await page.waitForSelector(searchResultSelector);
  // await page.click("h3.LC20lb.MBeuO.DKV0Md");  
  // await page.waitForSelector(searchResultSelector); 
  // await page.click("._1_3w1N");
  // await page.waitForSelector("._1_3w1N"); 
  // await page.type("7985919618");  

  // await page.click("._2KpZ6l._2doB4z"); 
  
  // await page.screenshot("example.png")
  

  // await page.press("h3.LC20lb.MBeuO.DKV0Md");  

  // Set screen size
  //await page.setViewport({width: 800, height: 800});

  // Type into search box

  // await page.type('.search-box__input', 'automate beyond recorder');

  // Wait and click on first result

  
 
  // await page.click(searchResultSelector);

  // Locate the full title with a unique string
  //const textSelector = await page.waitForSelector(
  //  'text/Customize and automate'
 // );
//  const fullTitle = await textSelector.evaluate(el => el.textContent);

  // Print the full title
  //console.log('The title of this blog post is "%s".', fullTitle);

 // await browser.close();
//})();


app.listen(7000, () => {
  console.log("Server is Running on 7000............................");
});
