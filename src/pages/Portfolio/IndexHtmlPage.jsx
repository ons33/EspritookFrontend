import React from 'react';

const IndexHtmlPage = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Portfolio</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="./main.jsx"></script>
      </body>
    </html>
  `;

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export default IndexHtmlPage;
