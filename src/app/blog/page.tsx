import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IBÙ - Blog",
  description: "Découvrez nos articles et actualités",
};

const BlogPage = () => {
  return (
    <div className="tp-hero-area p-relative fix tp-gx-6">
      <div className="tp-hero-wrapper p-relative">
        <div className="tp-hero-shape">
          <div className="tp-hero-shape-1"></div>
          <div className="tp-hero-shape-2"></div>
          <div className="tp-hero-shape-3"></div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tp-hero-title-box text-center">
                <h1 className="tp-hero-title">Blog</h1>
                <p className="tp-hero-subtitle">Page en construction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
