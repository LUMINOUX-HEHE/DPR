package com.mdoner.backend.service;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class PdfExtractionService {

    /**
     * Extracts raw text from a PDF file using Apache Tika.
     * 
     * @param pdfPath Absolute path to the PDF file
     * @return Extracted raw text string
     * @throws IOException   If file reading fails
     * @throws TikaException If parsing fails
     */
    public String extractText(Path pdfPath) throws IOException, TikaException {
        try (InputStream stream = Files.newInputStream(pdfPath)) {
            // Handler to store the extracted text (limit set to -1 for unlimited)
            BodyContentHandler handler = new BodyContentHandler(-1);
            AutoDetectParser parser = new AutoDetectParser();
            Metadata metadata = new Metadata();
            ParseContext context = new ParseContext();

            try {
                parser.parse(stream, handler, metadata, context);
                return handler.toString();
            } catch (SAXException e) {
                throw new TikaException("XML Processing Error during PDF parsing", e);
            }
        }
    }
}
