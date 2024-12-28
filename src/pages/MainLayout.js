import React from "react";
import Header from "../components/common/Header";
// import Footer from "../components/common/Footer";
// import Banner from "../components/common/Banner";

const MainLayout = ({ children }) => {
  // const bannerHeight = "60px";

  return (
    <div>
      {/* <div className="fixed top-0 left-0 w-full z-50">
        <Banner />
      </div> */}
      <div>
        <Header />
      </div>

      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
