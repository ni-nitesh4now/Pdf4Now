import React from "react";
import { PDFDocument } from "pdf-lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

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
  borderRadius: "8px",
  backgroundColor: "#42b983",
  color: "#ffffff",
  padding: "12px 24px",
  margin: "8px",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
};

const Heading = {
  color: "#ffffff",
  marginBottom: "24px",
  textAlign: "center",
};
const Title = {
  color: "#ffffff",
  marginBottom: "24px",
  cursor: 'pointer',
  textAlign: "center",
  position: "absolute",
  top: "50px",
  left: "50%",
  transform: "translateX(-50%)",
};

class PDFMergeComponent extends React.Component {
  state = {
    selectedFiles: [],
    numPages: 0,
  };

  handleFileSelect = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files);
    this.setState((prevState) => ({
      selectedFiles: [...prevState.selectedFiles, ...selectedFiles],
    }));
  };
  
  handleRefresh = () => {
    window.location.reload(); 
  };
  mergePDFs = async () => {
    const { selectedFiles, mergedFileName } = this.state;

    if (selectedFiles.length < 2) {
      alert("Please select at least 2 PDF files.");
      return;
    }

    const mergedPDF = await PDFDocument.create();

    for (const file of selectedFiles) {
      const fileData = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileData);
      const pages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPDF.addPage(page));
    }

    const mergedBytes = await mergedPDF.save();

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(
      new Blob([mergedBytes], { type: "application/pdf" })
    );
    downloadLink.download = mergedFileName;
    downloadLink.click();
  };

  handleAddPDFClick = () => {
    const fileInput = document.getElementById("pdf-input");
    fileInput.click();
  };

  handleRemovePDF = (index) => {
    this.setState((prevState) => {
      const updatedFiles = [...prevState.selectedFiles];
      updatedFiles.splice(index, 1);
      return {
        selectedFiles: updatedFiles,
      };
    });
  };

  handleFileNameChange = (event) => {
    this.setState({ mergedFileName: event.target.value });
  };

  render() {
    const { selectedFiles, numPages, mergedFileName } = this.state;

    return (
      <div style={MainContainer}>
        <h1 style={Title} onClick={this.handleRefresh}>Pdf4Now</h1>
        <h2 style={Heading}>Merge PDFs</h2>
      <p style={{ color: "#ffffff", marginBottom: "24px", textAlign: "center" }}>
      The PDF Merge Component is a React component that allows users to select multiple PDF files and merge them into a single PDF document.<br/>With just a few clicks, users can combine their PDF files effortlessly, making it convenient for tasks such as merging PDF reports, documents, or presentations.
      </p><br/>
        <label htmlFor="pdf-input" style={buttonStyle}>
          Select files
        </label>
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          multiple
          onChange={this.handleFileSelect}
          style={{ display: "none" }}
        />

        {selectedFiles.length > 0 && (
          <div>
            <h3 style={{ color: "#ffffff", display: "flex", alignItems: "center" }}>
              Selected Files:
            </h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{ color: "#ffffff", display: "flex", alignItems: "center" }}
                >
                  <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: "8px" }} />
                  <span>{file.name}</span>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() => this.handleRemovePDF(index)}
                  />
                </li>
              ))}
            </ul>
            {selectedFiles.length > 0 && (
              <button
                style={{
                  borderRadius: "50px",
                  backgroundColor: "#42b983",
                  color: "#ffffff",
                  padding: "12px 24px",
                  margin: "8px",
                  fontSize: "24px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={this.handleAddPDFClick}
              >
                +
              </button>
            )}
            <button style={buttonStyle} onClick={this.mergePDFs}>
              Merge PDFs
            </button>
          </div>
        )}

        {numPages > 0 && <p>Total pages in merged PDF: {numPages}</p>}
      </div>
    );
  }
}

export default PDFMergeComponent;
