// src/pages/HomePage.js
import CaptureImage from "../components/CaptureImage";
import UploadFiles from "../components/UploadFiles";

const HomePage = () => {
  return (
    <div>
      <h1>KYC Verification Platform</h1>
      <CaptureImage />
      <UploadFiles />
    </div>
  );
};

export default HomePage;
