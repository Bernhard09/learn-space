'use server';

import {
    PDFExporter,
    pdfDefaultSchemaMappings,
} from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";


export const handleExportToPDF = async (editor) => {
    try {
        const pdfExporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);
        // Convert the blocks to a react-pdf document
        const pdfDocument = await pdfExporter.toReactPDFDocument(editor.document);
        // Use react-pdf to write to file:
        await ReactPDF.render(pdfDocument, `filename.pdf`);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
    }
}