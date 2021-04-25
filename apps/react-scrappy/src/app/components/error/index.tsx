import React from 'react';
import errorImg from './../../../assets/images/error.svg'; // Tell webpack this JS file uses this image

export default function Error() {
  return (
    <div>
      <div className="d-flex justify-content-center mt-5">
        <img src={errorImg} alt="error-icon" style={{width: 290, height: 290}}/>
      </div>

      <div className="text-center text-dark blockquote mt-4">
        <p>We're still ironing out some issues. 🛠</p>
        <p>Please check again abit later.</p>
      </div>

    </div>
  );
}
