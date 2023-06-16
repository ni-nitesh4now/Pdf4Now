import React, { useState, useRef } from "react";
import { PDFDocument, StandardFonts, PageSizes } from "pdf-lib";
import { createCanvas, loadImage } from "canvas";
const buttonStyle = {
  borderRadius: "8px",
  backgroundColor: "#42b983",
  color: "#ffffff",
  padding: "12px 24px",
  margin: "8px",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
};
const MainContainer = {
  background: "#16191b",
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}
const ImageToPdfConverter = () => {
  const [images, setImages] = useState([]);
  const [pdfName, setPdfName] = useState("");

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const addButtonStyle = {
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    backgroundColor: "#42b983",
    color: "#ffffff",
    fontSize: "24px",
    border: "none",
    // cursor: "pointer",
    // position: "fixed",
    // bottom: "20px",
    // left: "50%",
    transform: "translateX(-50%)",
  };

  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const loadedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const image = await loadImage(URL.createObjectURL(file));
        return image;
      })
    );

    setImages((prevImages) => [...prevImages, ...loadedImages]);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handlePDFNameChange = (event) => {
    setPdfName(event.target.value);
  };
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const convertToPDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);

    for (const image of images) {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const pdfImage = await doc.embedPng(canvas.toDataURL());
      const page = doc.addPage(PageSizes.A4);
      const { width, height } = page.getSize();
      const scaleFactor = Math.min(width / image.width, height / image.height);
      const scaledWidth = image.width * scaleFactor;
      const scaledHeight = image.height * scaleFactor;

      page.drawImage(pdfImage, {
        x: (width - scaledWidth) / 2,
        y: (height - scaledHeight) / 2,
        width: scaledWidth,
        height: scaledHeight,
      });

      const pageNumber = doc.getPageCount();
      const text = `Page ${pageNumber}`;
      const textSize = 12; // Adjust the font size as needed
      const textX = width - textSize - 20;
      const textY = height - 20;
      page.drawText(text, { x: textX, y: textY, size: textSize, font });
    }

    const pdfBytes = await doc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfURL = URL.createObjectURL(pdfBlob);

    // Create a link element to download the PDF with the specified name
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfURL;
    downloadLink.download = pdfName || "generated.pdf";
    downloadLink.click();
  };
  const Heading = {
    color: "#ffffff",
    marginBottom: "24px",
    textAlign: "center",
  };
  const Title = {
    color: "#ffffff",
    cursor: 'pointer',
    marginBottom: "24px",
    textAlign: "center",
    position: "absolute",
    top: "50px",
    left: "50%",
    transform: "translateX(-50%)",
  };
  const smallImageStyle = {
    display: "flex",
    maxWidth: "200px",
    maxHeight: "200px",
    marginBottom: "10px",
    flexDirection: "row",
    margin:'5px',
  };
  const smallImagesContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  };
  const smallImageContainerStyle = {
    position: 'relative',
  };
  
  const handleRefresh = (event) => {
    window.location.reload(); 
  };
  const removeButtonStyle = {
    position: 'absolute',
    borderRadius:'15px',
    top: '5px',
    left: '5px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={MainContainer}>
      <h1 style={Title} onClick={handleRefresh}>Pdf4Now</h1>
      <h2 style={Heading}>Image to PDF Converter</h2>
      
      <p style={{ color: "#ffffff", marginBottom: "24px", textAlign: "center" }}>
      The Image to PDF Converter component allows users to convert images into PDF documents. <br/>Users can select multiple image files, and the component will merge them into a single PDF file. <br/>It provides a simple and efficient way to transform a collection of images into a shareable and printable PDF format.
      </p><br/>
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <button style={buttonStyle} onClick={handleOpenFileDialog}>
        Open Image Directory
      </button>

      {images.length > 0 && (
        <div>
          <h2 style={{ color: '#ffffff' }}>Selected Images:</h2>
          <div style={smallImagesContainerStyle}>
            {images.map((image, index) => (
              <div key={index} style={smallImageContainerStyle}>
                <img
                  src={image.src}
                  alt={`Image ${index}`}
                  style={smallImageStyle}
                />
                <button
                  style={removeButtonStyle}
                  onClick={() => removeImage(index)}
                >
                  &#x2715;
                </button>
              </div>
            ))}
            <button style={addButtonStyle} onClick={handleAddImage}>
              +
            </button>
          </div>
          
          <input
            type="text"
            placeholder="PDF Name"
            value={pdfName}
            onChange={handlePDFNameChange}
          />
          <button style={buttonStyle} onClick={convertToPDF}>
            Convert to PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfConverter;
