const fs = require('fs');
const con=require('../config')
const pdf = require('pdf-parse');
const { PDFDocument,rgb } = require('pdf-lib');
const mammoth = require('mammoth');
const path = require('path');


function extractPlaceholdersFromText(text) {
    const regex = /{{(.*?)}}/g; // Regex to find {{placeholder}}
    const placeholders = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        placeholders.push(match[0]); // Add the full match (including the curly braces)
    }
    return placeholders;
}

async function extractFromPdf(filePath) {
    try {
        const pdfBytes = await fs.promises.readFile(filePath);
        //console.log(`PDF bytes length: ${pdfBytes.length}`); // Log length of bytes

        const data = await pdf(pdfBytes);
       // console.log(data);
        
        const text = data.text;
        //console.log('Extracted Text:', text); // Log the extracted text

        return extractPlaceholdersFromText(text);
    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
}

async function extractFromDocx(filePath) {
    const { value: text } = await mammoth.extractRawText({ path: filePath });
    return extractPlaceholdersFromText(text);
}

async function extractPlaceholders(req, res) {
    const filePath = req.body.fp;
    console.log(filePath);
    
    
    if (!filePath) {
        return res.status(400).json({ error: 'Template ID is required' });
    }
    try {
        const ext = filePath.split('.').pop().toLowerCase();
        let placeholders;
       
        
        if (ext === 'pdf') {
            placeholders = await extractFromPdf(filePath);
        } else if (ext === 'docx') {
            placeholders = await extractFromDocx(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are supported.' });
        }
        console.log(placeholders);
        
        return res.json({ placeholders });
    } catch (error) {
        return res.status(503).json({ error: error.message });
    }
}



// async function replacePlaceholders(req, res) {
//     const filePath = req.body.fp;
//     const userid = req.body.userid;
//     const placeholdersWithValues = req.body.placeholder; // e.g., { name: 'John Doe', price: '1000' }
//     console.log(placeholdersWithValues);

//     try {
//         const pdfBytes = await fs.promises.readFile(filePath);
//         const data = await pdf(pdfBytes);
//         let text = data.text;

//         // Replace placeholders with values, adding a space before and after if not already present
//         Object.entries(placeholdersWithValues).forEach(([key, value]) => {
//             const placeholder = `{{${key}}}`;
//             const regex = new RegExp(`(${placeholder})(?!\\s)`, 'g');
//             text = text.replace(regex, ` ${value} `); // Add a trailing space to prevent concatenation
//         });

//         // Create a new PDF document with a blank page
//         const newPdfDoc = await PDFDocument.create();
//         let page = newPdfDoc.addPage([595, 842]); // Standard A4 size

//         // Split text into lines to ensure it fits on the page and avoids word overlap
//         const lines = text.match(/(.{1,90})(\s|$)/g) || []; // Wrap text every 90 characters or at whitespace
//         let yPosition = 750; // Starting Y position near the top of the page

//         // Draw each line on the page, adding new pages if needed
//         lines.forEach((line) => {
//             if (yPosition < 50) { // If Y position is near the bottom of the page
//                 page = newPdfDoc.addPage([595, 842]); // Add a new page
//                 yPosition = 750; // Reset Y position to top of new page
//             }

//             // Draw the text line on the current page
//             page.drawText(line.trim(), {
//                 x: 50,  // X position for the text
//                 y: yPosition,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
//             yPosition -= 15; // Move Y position down for each line
//         });

//         const modifiedPdfBytes = await newPdfDoc.save();

//         // Save the new PDF with a modified filename
//         const fileName = path.basename(filePath);
//         const outputPath = path.join(path.dirname(filePath), `modified_${fileName}`);
//         await fs.promises.writeFile(outputPath, modifiedPdfBytes);

//         // Construct the URL path
//         const urlPath = `http://localhost:4700/${outputPath.substring(outputPath.indexOf('uploads')).replace(/\\/g, '/')}`;
//         const uploadsFolder = 'router\\uploads';

//         // Extract the relative path from the `uploads` directory onward
//         const filename = path.relative(uploadsFolder, outputPath);

//         // Prepare the insert query and use a promise to handle the result
//         const insertQuery = 'INSERT INTO document_info (user_id, filename, filepath, urlpath) VALUES (?, ?, ?, ?)';
//         const values = [userid, filename, outputPath, urlPath];

//         // Create a promise-based wrapper for the MySQL query
//         const insertQueryPromise = new Promise((resolve, reject) => {
//             con.query(insertQuery, values, (err, results) => {
//                 if (err) {
//                     reject('Error inserting into document_info table: ' + err);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });

//         // Wait for the query to finish before sending the response
//         await insertQueryPromise;

//         // Respond with the URL after the DB operation has been completed
//         console.log(urlPath);
//         return res.json({
//             message: 'Placeholders replaced successfully',
//             urlpath: urlPath
//         });

//     } catch (error) {
//         console.error('Error replacing placeholders:', error);
//         return res.status(503).json({ error: 'Failed to replace placeholders in PDF' });
//     }
// }


// async function replacePlaceholders(req, res) {
//     const filePath = req.body.fp;
//     const userid = req.body.userid;
//     const placeholdersWithValues = req.body.placeholder; // e.g., { name: 'John Doe', price: '1000' }
//     console.log(placeholdersWithValues);

//     try {
//         const pdfBuffer = await fs.promises.readFile(filePath);
//         const pdfBytes = new Uint8Array(pdfBuffer); // Convert Buffer to Uint8Array

//         // Import PDF.js
//         const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');

//         // Load the PDF document
//         const pdfDocument = await pdfjsLib.getDocument(pdfBytes).promise;

//         // Extract text from all pages
//         let text = '';
//         for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
//             const page = await pdfDocument.getPage(pageNumber);
//             const content = await page.getTextContent();
//             const pageText = content.items.map(item => item.str).join(' ');
//             text += pageText + '\n'; // Add a newline after each page
//         }

//         // Replace placeholders with values, adding a space before and after if not already present
//         Object.entries(placeholdersWithValues).forEach(([key, value]) => {
//             const placeholder = `{{${key}}}`;
//             const regex = new RegExp(`(${placeholder})(?!\\s)`, 'g');
//             text = text.replace(regex, ` ${value} `); // Add a trailing space to prevent concatenation
//         });

//         // Create a new PDF document with a blank page
//         const newPdfDoc = await PDFDocument.create();
//         let page = newPdfDoc.addPage([595, 842]); // Standard A4 size

//         // Split text into lines to ensure it fits on the page and avoids word overlap
//         const lines = text.match(/(.{1,90})(\s|$)/g) || []; // Wrap text every 90 characters or at whitespace
//         let yPosition = 750; // Starting Y position near the top of the page

//         // Draw each line on the page, adding new pages if needed
//         lines.forEach((line) => {
//             if (yPosition < 50) { // If Y position is near the bottom of the page
//                 page = newPdfDoc.addPage([595, 842]); // Add a new page
//                 yPosition = 750; // Reset Y position to top of new page
//             }

//             // Draw the text line on the current page
//             page.drawText(line.trim(), {
//                 x: 50,  // X position for the text
//                 y: yPosition,
//                 size: 12,
//                 color: rgb(0, 0, 0),
//             });
//             yPosition -= 15; // Move Y position down for each line
//         });

//         const modifiedPdfBytes = await newPdfDoc.save();

//         // Save the new PDF with a modified filename
//         const fileName = path.basename(filePath);
//         const outputPath = path.join(path.dirname(filePath), `modified_${fileName}`);
//         await fs.promises.writeFile(outputPath, modifiedPdfBytes);

//         // Construct the URL path
//         const urlPath = `http://localhost:4700/${outputPath.substring(outputPath.indexOf('uploads')).replace(/\\/g, '/')}`;
//         const uploadsFolder = 'router\\uploads';

//         // Extract the relative path from the `uploads` directory onward
//         const filename = path.relative(uploadsFolder, outputPath);

//         // Prepare the insert query and use a promise to handle the result
//         const insertQuery = 'INSERT INTO document_info (user_id, filename, filepath, urlpath) VALUES (?, ?, ?, ?)';
//         const values = [userid, filename, outputPath, urlPath];

//         // Create a promise-based wrapper for the MySQL query
//         const insertQueryPromise = new Promise((resolve, reject) => {
//             con.query(insertQuery, values, (err, results) => {
//                 if (err) {
//                     reject('Error inserting into document_info table: ' + err);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });

//         // Wait for the query to finish before sending the response
//         await insertQueryPromise;

//         // Respond with the URL after the DB operation has been completed
//         console.log(urlPath);
//         return res.json({
//             message: 'Placeholders replaced successfully',
//             urlpath: urlPath
//         });

//     } catch (error) {
//         console.error('Error replacing placeholders:', error);
//         return res.status(503).json({ error: 'Failed to replace placeholders in PDF' });
//     }
// }

async function replacePlaceholders(req, res) {
    const filePath = req.body.fp;
    const userid = req.body.userid;
    const placeholdersWithValues = req.body.placeholder; // e.g., { name: 'John Doe', price: '1000' }
    console.log(placeholdersWithValues);

    try {
        const pdfBuffer = await fs.promises.readFile(filePath);
        const pdfBytes = new Uint8Array(pdfBuffer); // Convert Buffer to Uint8Array

        // Import PDF.js
        const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');

        // Load the PDF document
        const pdfDocument = await pdfjsLib.getDocument(pdfBytes).promise;

        // Extract text from all pages, preserving positions
        let textItems = [];
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            const page = await pdfDocument.getPage(pageNumber);
            const content = await page.getTextContent();
            
            content.items.forEach(item => {
                // Capture the text content along with its position (x, y)
                textItems.push({
                    text: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                });
            });
        }

        // Replace placeholders with values
        Object.entries(placeholdersWithValues).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            const regex = new RegExp(`(${placeholder})(?!\\s)`, 'g');
            textItems = textItems.map(item => ({
                ...item,
                text: item.text.replace(regex, ` ${value} `)
            }));
        });

        // Create a new PDF document with a blank page
        const newPdfDoc = await PDFDocument.create();
        let page = newPdfDoc.addPage([595, 842]); // Standard A4 size

        // Track the Y-position for drawing
        let yPosition = 750; // Starting Y position near the top of the page
        let xPosition = 50; // Starting X position

        // Draw each word on the page, respecting its spacing and line breaks
        textItems.forEach(item => {
            if (yPosition < 50) { // If Y position is near the bottom of the page, create a new page
                page = newPdfDoc.addPage([595, 842]); // Add a new page
                yPosition = 750; // Reset Y position to top of new page
            }

            // Calculate X position based on the word's spacing
            page.drawText(item.text, {
                x: xPosition,  // X position for the text
                y: yPosition,  // Y position for the text
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Update Y position after each word (with some space between words)
            xPosition += item.text.length * 7;  // Adjust word spacing based on the text length

            // If we go beyond the page width, reset xPosition and update yPosition
            if (xPosition + item.text.length * 7 > 550) {
                xPosition = 50;  // Reset to the left margin
                yPosition -= 15; // Move down by 15 units (line height)
            }
        });

        const modifiedPdfBytes = await newPdfDoc.save();

        // Save the new PDF with a modified filename
        const fileName = path.basename(filePath);
        const outputPath = path.join(path.dirname(filePath), `modified_${fileName}`);
        await fs.promises.writeFile(outputPath, modifiedPdfBytes);

        // Construct the URL path
        const urlPath = `http://localhost:4700/${outputPath.substring(outputPath.indexOf('uploads')).replace(/\\/g, '/')}`;
        const uploadsFolder = 'router\\uploads';

        // Extract the relative path from the `uploads` directory onward
        const filename = path.relative(uploadsFolder, outputPath);

        // Prepare the insert query and use a promise to handle the result
        const insertQuery = 'INSERT INTO document_info (user_id, filename, filepath, urlpath) VALUES (?, ?, ?, ?)';
        const values = [userid, filename, outputPath, urlPath];

        // Create a promise-based wrapper for the MySQL query
        const insertQueryPromise = new Promise((resolve, reject) => {
            con.query(insertQuery, values, (err, results) => {
                if (err) {
                    reject('Error inserting into document_info table: ' + err);
                } else {
                    resolve(results);
                }
            });
        });

        // Wait for the query to finish before sending the response
        await insertQueryPromise;

        // Respond with the URL after the DB operation has been completed
        console.log(urlPath);
        return res.json({
            message: 'Placeholders replaced successfully',
            urlpath: urlPath
        });

    } catch (error) {
        console.error('Error replacing placeholders:', error);
        return res.status(503).json({ error: 'Failed to replace placeholders in PDF' });
    }
}
















module.exports = {
    extractPlaceholders,
    replacePlaceholders,
   
};