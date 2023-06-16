import React, { useState } from 'react';
import ImageToPdfConverter from './imgTopdf';
import PDFMergeComponent from './mergePDF';
import ImageConverterComponent from './compressImg';

const MainContainer = {
  background: "#16191b",
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

const buttonStyle = {
  borderRadius: '8px',
  backgroundColor: '#42b983',
  color: '#ffffff',
  padding: '12px 24px',
  margin: '8px',
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
}

const MainComponent = () => {
  const [showImageToPdf, setShowImageToPdf] = useState(false);
  const [showPdfMerge, setShowPdfMerge] = useState(false);
  const [showComp, setComp] = useState(false);

  const handleImageToPdfButtonClick = () => {
    setShowImageToPdf(true);
    setShowPdfMerge(false);
    setComp(false);
  };

  const handlePdfMergeButtonClick = () => {
    setShowImageToPdf(false);
    setShowPdfMerge(true);
    setComp(false);
  };
  const handleComp = () => {
    setShowImageToPdf(false);
    setShowPdfMerge(false);
    setComp(true);
  };

  return (
    <div style={MainContainer}>
      {!showImageToPdf && !showPdfMerge && !showComp && (
        <>
          <h1 style={{ color: "#ffffff", marginBottom: "24px", textAlign: "center" }}>Pdf4Now</h1>
          <p style={{ color: "#ffffff", marginBottom: "24px", textAlign: "center" }}>
            Pdf4Now is a versatile tool that allows you to convert images to PDFs and merge multiple PDFs into a single document. Choose an option below to get started:
          </p>
          <div>
            <button style={buttonStyle} onClick={handleImageToPdfButtonClick}>
              Image2Pdf Converter
            </button>
            <button style={buttonStyle} onClick={handlePdfMergeButtonClick}>
              Merge PDFs
            </button>
            <button style={buttonStyle} onClick={handleComp}>
              Compress Image
            </button>
          </div>
        </>
      )}
      {showImageToPdf && <ImageToPdfConverter />}
      {showPdfMerge && <PDFMergeComponent />}
      {showComp && <ImageConverterComponent/>}
    </div>
  );
};

export default MainComponent;
