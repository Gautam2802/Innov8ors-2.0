import React from "react";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const { isMatch, difference } = location.state;

  return (
    <div>
      <h1>KYC FINAL STATUS</h1>
      {isMatch ? (
        <p>KYC DONE SUCCESSFULLY !</p>
      ) : (
        <p>KYC FAILED !</p>
      )}
    </div>
  );
};

export default ResultPage;
