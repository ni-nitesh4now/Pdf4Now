import React from "react";

const smallImageStyle = {
  display: "flex",
  maxWidth: "200px",
  maxHeight: "200px",
  marginBottom: "10px",
  flexDirection: "row",
  margin: "5px",
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

class ImageConverterComponent extends React.Component {
  fileInputRef = React.createRef(); // Reference to the file input element

  state = {
    selectedImage: null,
    selectedResolution: "unchanged",
    qualityReduction: 0,
    convertedImage: null,
    convertedImageBlob: null, // Store the converted image as a Blob
  };

  handleImageSelect = () => {
    // Trigger file input click event
    this.fileInputRef.current.click();
  };

  handleFileInputChange = (event) => {
    const file = event.target.files[0];
    this.setState({ selectedImage: file });
  };

  handleResolutionChange = (event) => {
    this.setState({ selectedResolution: event.target.value });
  };

  handleQualityReductionChange = (event) => {
    this.setState({ qualityReduction: Number(event.target.value) });
  };

  handleConvertImage = () => {
    const { selectedImage, selectedResolution, qualityReduction } = this.state;
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        let width, height;
        if (selectedResolution === "unchanged") {
          width = img.width;
          height = img.height;
        } else {
          [width, height] = selectedResolution.split("x").map(Number);
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const convertedImage = URL.createObjectURL(blob);
            this.setState({ convertedImage, convertedImageBlob: blob }); // Save the converted image Blob
          },
          "image/jpeg",
          1 - qualityReduction / 100
        ); // Adjust compression quality based on user input
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(selectedImage);
  };

  handleSaveImage = () => {
    const { convertedImageBlob } = this.state;
    if (!convertedImageBlob) {
      alert("No image to save.");
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(convertedImageBlob);
    link.download = "converted_image.jpg";
    link.click();
  };

  handleRefresh = () => {
    window.location.reload(); 
  };

  render() {
    const {
      selectedImage,
      selectedResolution,
      qualityReduction,
      convertedImage,
      convertedImageBlob,
    } = this.state;

    return (
      <div>
        

        <h1 style={Title}  onClick={this.handleRefresh}>Pdf4Now</h1>

        <h2 style={{ color: "#ffffff" }}>Image Converter</h2>
        <button style={buttonStyle} onClick={this.handleImageSelect}>
          Select Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={this.fileInputRef}
          style={{ display: "none" }}
          onChange={this.handleFileInputChange}
        />
        <div style={{ display: "flex" }}>
          {selectedImage && (
            <div style={{ color: "#ffffff" }}>
              <h3 style={{ color: "#ffffff" }}>Selected Image</h3>
              <div style={{ display: "flex" }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  style={smallImageStyle}
                  alt="Selected Image Preview"
                />
                <div style={{ marginLeft: "20px" }}>
                  <p>File Size: {Math.round(selectedImage.size / 1024)} KB</p>
                </div>
              </div>
            </div>
          )}

          {convertedImage && (
            <div style={{ color: "#ffffff", marginLeft: "20px" }}>
              <h3>Converted Image</h3>
              <div style={{ display: "flex" }}>
                <img
                  src={convertedImage}
                  style={smallImageStyle}
                  alt="Converted Image"
                />
                <div style={{ marginLeft: "20px" }}>
                  <p>Resolution: {selectedResolution}</p>
                  <p>Quality Reduction: {qualityReduction}%</p>
                  {convertedImageBlob && (
                    <>
                      <p>
                        File Size: {Math.round(convertedImageBlob.size / 1024)}{" "}
                        KB
                      </p>
                      <button
                        style={buttonStyle}
                        onClick={this.handleSaveImage}
                      >
                        Save Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <select
          style={buttonStyle}
          value={selectedResolution}
          onChange={this.handleResolutionChange}
        >
          <option value="unchanged">Unchanged</option>
          <option value="640x480">640x480</option>
          <option value="1280x720">1280x720</option>
          <option value="1920x1080">1920x1080</option>
        </select>

        <label style={buttonStyle}>
          Quality Reduction (%):
          <input
            type="number"
            min="0"
            max="100"
            value={qualityReduction}
            onChange={this.handleQualityReductionChange}
          />
        </label>

        <button style={buttonStyle} onClick={this.handleConvertImage}>
          Convert Image
        </button>

      </div>
    );
  }
}

export default ImageConverterComponent;
