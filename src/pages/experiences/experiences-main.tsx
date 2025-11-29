'use client';
import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Leaf, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon, ScrollDownTwo, UpArrowFour, UpArrow } from '@/components/svg';

// image imports
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';
import full_image from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-2.jpg';
import shape from "@/assets/img/home-02/service/Picture ibu bien être.jpg";
import visite_chai from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Visite de Chai.webp';
import plats_priche from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Plats Priche.webp';
import planche_aperitif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Planche apéritif.webp';
import depart_tardif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Départ tardif.webp';
import slider_img_1 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-5.jpg';
import slider_img_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-6.jpg';
import slider_img_3 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-7.jpg';
import slider_img_4 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-8.jpg';

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";

// SVG Icons Components
const CheckInOutIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142.447 142.447">
    <g>
      <path d="M71.224,0C31.951,0,0,31.951,0,71.224s31.951,71.224,71.224,71.224s71.224-31.951,71.224-71.224 S110.496,0,71.224,0z M71.224,127.447C40.222,127.447,15,102.226,15,71.224S40.222,15,71.224,15s56.224,25.222,56.224,56.224 S102.226,127.447,71.224,127.447z"/>
      <path d="M100.923,72.016H71.724V46.724c0-4.143-3.357-7.5-7.5-7.5s-7.5,3.357-7.5,7.5v32.792 c0,4.143,3.357,7.5,7.5,7.5h36.699c4.143,0,7.5-3.357,7.5-7.5S105.065,72.016,100.923,72.016z"/>
    </g>
  </svg>
);

const BouteilleIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <g>
      <g>
        <path d="M322.875,173.756l-27.029-29.221V31.347h7.173V0h-7.173h-79.664h-7.204v31.347h7.203v113.156l-27.059,29.252 
          c-18.959,20.496-29.725,46.921-30.533,74.736h-0.054v3.377v201.376v22.562c0,19.958,16.237,36.193,36.193,36.193h122.541 
          c19.956,0,36.193-16.237,36.193-36.193V251.868C353.463,222.82,342.6,195.079,322.875,173.756z M189.882,279.838h74.476v24.227 
          h-74.476V279.838z M189.882,335.412h74.476v86.485h-74.476V335.412z M322.117,475.807h-0.001c0,2.673-2.174,4.846-4.846,4.846 
          H194.728c-2.672,0-4.846-2.174-4.846-4.846v-22.563h105.823V248.491H189.961c0.795-19.897,8.59-38.766,22.174-53.45l35.395-38.263 
          V31.347h16.97v125.464l35.365,38.231c14.35,15.514,22.252,35.695,22.252,56.827V475.807z"/>
      </g>
    </g>
  </svg>
);

const SaunaIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <g>
      <g>
        <path d="M145.723,122.782c3.167,5.122,8.646,7.94,14.257,7.94c3.004,0,6.047-0.809,8.789-2.505
          c7.865-4.864,10.3-15.182,5.435-23.047c-3.651-5.904-1.881-14.19,1.468-27.134c3.599-13.908,8.077-31.218-1.306-47.048
          c-4.714-7.954-14.981-10.581-22.941-5.867c-7.954,4.715-10.581,14.986-5.866,22.941c2.282,3.85-0.051,12.866-2.306,21.586
          C139.26,85.084,134.29,104.294,145.723,122.782z"/>
        <path d="M199.329,122.782c3.168,5.122,8.648,7.941,14.258,7.941c3.004,0,6.046-0.808,8.789-2.505
          c7.865-4.862,10.3-15.181,5.436-23.046c-3.651-5.905-1.882-14.19,1.467-27.135c3.599-13.909,8.076-31.217-1.305-47.047
          c-4.715-7.956-14.988-10.581-22.941-5.867c-7.956,4.715-10.582,14.986-5.868,22.94c2.283,3.85-0.05,12.867-2.306,21.586
          C192.868,85.084,187.898,104.294,199.329,122.782z"/>
        <path d="M508.918,165.908c-5.345-7.546-15.795-9.328-23.342-3.984c-3.474,2.462-83.264,60.714-112.363,227.314h-43.576
          l7.047-46.256c18.465-0.403,33.365-15.537,33.365-34.096v-34.415c0-13.115-7.442-24.517-18.322-30.226l10.075-66.137
          c0.734-4.826-0.673-9.732-3.853-13.434c-3.181-3.701-7.818-5.832-12.7-5.832H24.799c-4.881,0-9.518,2.13-12.7,5.832
          c-3.181,3.703-4.588,8.609-3.853,13.434l10.076,66.138C7.442,249.955,0,261.358,0,274.471v34.415
          c0,18.558,14.9,33.692,33.364,34.096l12.371,81.199c0.724,35.986,30.224,65.037,66.381,65.037h5.841
          c0.008,0,0.016,0.001,0.023,0.001c0.009,0,0.018-0.001,0.026-0.001h134.038c0.009,0,0.018,0.001,0.026,0.001
          s0.016-0.001,0.023-0.001h5.84c8.99,0,17.568-1.799,25.395-5.051c5.757,0.945,11.647,1.441,17.632,1.441
          c46.692,0,87.742-29.746,102.285-74.063c0.372-1.058,0.641-2.163,0.796-3.306c4.016-26.436,9.387-49.981,15.489-70.819
          c13.464-45.978,30.494-78.768,44.41-100.293c2.72-4.207,5.397-8.108,8-11.714c18.284-25.33,32.895-36.089,32.993-36.163
          C512.479,183.905,514.263,173.454,508.918,165.908z M292.265,192.331h33.496l-7.316,48.023h-30.193L292.265,192.331z
           M201.768,192.331h56.893l-4.013,48.023h-52.88V192.331z M168.28,192.331v48.023h-52.879l-4.013-48.023H168.28z M77.782,192.331
          l4.014,48.023H51.602l-7.316-48.023H77.782z M79.208,422.824c0-0.844-0.065-1.687-0.191-2.522l-11.776-77.3h23.135l9.214,110.246
          C87.64,448.311,79.208,436.535,79.208,422.824z M34.118,309.514c-0.348,0-0.631-0.281-0.631-0.627v-34.415
          c0-0.347,0.284-0.628,0.631-0.628h301.813c0.348,0,0.63,0.282,0.63,0.628v34.415c0,0.346-0.282,0.627-0.63,0.627H34.118z
           M302.808,343.001l-7.044,46.237H275.81l3.864-46.237H302.808z M168.28,455.731h-34.878l-9.421-112.73h44.299V455.731z
           M201.768,343.001h44.302l-3.864,46.237h-27.734c-4.914,0-9.537,2.176-12.703,5.877V343.001z M201.768,455.731v-35.927
          c5.801,13.798,14.273,25.941,24.687,35.927H201.768z M300.96,452.121c-23.792,0-45.457-11.207-59.181-29.395h118.36
          C346.417,440.914,324.753,452.121,300.96,452.121z"/>
      </g>
    </g>
  </svg>
);

const BainNordiqueIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001">
    <g>
      <g>
        <g>
          <path d="M432.959,285.562l0.715-14.753c0.388-7.998-0.766-15.886-3.427-23.428l-0.113-0.324
            c-3.893-11.031-10.812-20.682-20.013-27.908l-64.413-50.589c-4.489-3.506-9.569-6.003-15.107-7.435
            c-2.946-0.905-6.244-1.346-10.045-1.346h-25.613c12.445-9.02,20.562-23.662,20.562-40.173v-17.44
            c0-27.35-22.25-49.599-49.598-49.599h-17.439c-27.348,0-49.599,22.25-49.599,49.599v17.44c0,16.511,8.117,31.153,20.562,40.173
            h-25.612c-3.801,0-7.099,0.441-10.045,1.346c-5.538,1.432-10.619,3.932-15.129,7.453l-63.067,49.408
            c-8.06,6.316-14.468,14.624-18.528,24.016l-1.314,3.043c-3.697,8.569-5.411,18.025-4.959,27.344l0.592,12.208
            c-0.259,0.105-0.522,0.207-0.78,0.314C28.62,306.303,0,336.637,0,370.32c0,33.684,28.62,64.018,80.588,85.414
            c47.134,19.404,109.429,30.091,175.412,30.091s128.28-10.687,175.413-30.091c51.968-21.397,80.587-51.731,80.587-85.414
            C512,336.976,483.938,306.919,432.959,285.562z M233.225,102.166c0-8.405,6.837-15.242,15.242-15.242h17.439
            c8.404,0,15.241,6.837,15.241,15.242v17.44c0,8.404-6.837,15.241-15.241,15.241h-17.439c-8.404,0-15.242-6.837-15.242-15.241
            V102.166z M418.333,423.964c-43.081,17.736-100.732,27.505-162.332,27.505s-119.251-9.768-162.332-27.505
            c-37.139-15.29-59.311-35.344-59.311-53.644c0-16.498,18.028-34.42,48.792-48.993l1.071,22.091
            c0.459,9.475,8.518,16.757,17.989,16.327c9.196-0.447,16.33-8.05,16.325-17.159c0-0.277,0.015-0.552,0.001-0.831l-3.443-71.03
            c-0.199-4.114,0.558-8.288,2.189-12.069l1.303-3.017c1.793-4.152,4.623-7.820,8.182-10.608l63.044-49.390
            c0.783-0.612,1.692-1.044,2.699-1.286c0.262-0.063,0.525-0.132,0.783-0.207c0.126-0.007,0.3-0.011,0.526-0.011h126.737
            c0.226,0,0.4,0.005,0.525,0.011c0.26,0.074,0.521,0.144,0.784,0.207c1.008,0.243,1.916,0.675,2.66,1.256l64.374,50.558
            c4.061,3.191,7.117,7.451,8.809,12.248l0.133,0.377c1.177,3.338,1.687,6.821,1.516,10.352l-3.519,72.608
            c-0.014,0.281,0.002,0.554,0.001,0.831c-0.005,9.109,7.129,16.713,16.325,17.159c0.283,0.014,0.565,0.021,0.845,0.021
            c9.105,0,16.699-7.154,17.144-16.346l1.017-20.975c29.349,14.367,46.473,31.799,46.473,47.878
            C477.643,388.62,455.471,408.674,418.333,423.964z"/>
          <path d="M389.918,152.845c3.249,5.257,8.872,8.147,14.628,8.147c3.082,0,6.204-0.83,9.018-2.569
            c8.069-4.989,10.567-15.576,5.578-23.645c-4.028-6.514-2.126-15.462,1.487-29.424c3.802-14.699,8.535-32.993-1.32-49.622
            c-4.839-8.161-15.376-10.856-23.537-6.018c-8.161,4.838-10.856,15.375-6.019,23.537c2.571,4.337,0.05,14.078-2.386,23.499
            C383.144,113.072,377.889,133.386,389.918,152.845z"/>
          <path d="M447.032,152.845c3.249,5.255,8.872,8.147,14.628,8.147c3.082,0,6.203-0.83,9.018-2.569
            c8.069-4.989,10.567-15.575,5.578-23.645c-4.028-6.514-2.124-15.462,1.487-29.422c3.803-14.7,8.536-32.994-1.32-49.623
            c-4.838-8.161-15.376-10.856-23.537-6.018c-8.161,4.838-10.857,15.375-6.019,23.537c2.571,4.337,0.05,14.078-2.386,23.5
            C440.257,113.072,435.002,133.386,447.032,152.845z"/>
          <path d="M374.967,256.925l-44.785-23.63c-5.324-2.81-11.732-2.626-16.888,0.483c-5.156,3.108-8.308,8.69-8.308,14.711v90.696
            c0,8.544-6.95,15.494-15.495,15.494h-64.611c-8.544,0-15.494-6.95-15.494-15.494v-90.696c0-6.021-3.152-11.602-8.308-14.711
            c-5.155-3.112-11.562-3.291-16.888-0.483l-44.785,23.63c-5.811,3.066-9.365,9.178-9.154,15.744l2.051,63.942
            c0.068,2.119,0.535,4.125,1.298,5.975c2.65,6.429,9.067,10.862,16.423,10.645c6.976-0.223,12.835-4.584,15.329-10.645
            c0.897-2.177,1.37-4.568,1.29-7.074l-1.706-53.21l10.093-5.324v62.21c0,1.144,0.053,2.274,0.129,3.4
            c1.755,25.906,23.378,46.452,49.723,46.452h64.611c26.345,0,47.969-20.544,49.723-46.452c0.077-1.125,0.129-2.256,0.129-3.4
            v-62.21l10.093,5.324l-1.708,53.209c-0.08,2.506,0.393,4.898,1.29,7.075c2.495,6.062,8.353,10.422,15.329,10.645
            c7.37,0.263,13.782-4.198,16.427-10.645c0.759-1.851,1.225-3.857,1.293-5.974l2.051-63.942
            C384.332,266.103,380.779,259.991,374.967,256.925z"/>
          <path d="M69.158,185.349c32.428,0,58.809-26.383,58.809-58.813c0-11.802-3.484-23.166-10.083-32.917L83.906,34.765
            c-3.069-5.315-8.741-8.589-14.878-8.589S57.22,29.45,54.151,34.765L17.931,97.504c-0.35,0.606-0.66,1.229-0.929,1.863
            c-4.361,8.361-6.657,17.712-6.657,27.171C10.346,158.966,36.729,185.349,69.158,185.349z M47.851,114.547
            c0.239-0.424,0.459-0.854,0.659-1.292l20.519-35.541l19.434,33.662c0.242,0.419,0.502,0.829,0.779,1.225
            c2.859,4.106,4.369,8.925,4.369,13.936c0,13.484-10.969,24.455-24.452,24.455c-13.484,0-24.454-10.97-24.454-24.456
            C44.703,122.275,45.763,118.241,47.851,114.547z"/>
        </g>
      </g>
    </g>
  </svg>
);

const KitRelaxationIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.003 512.003">
    <g>
      <g>
        <g>
          <path d="M450.62,126.195L416.238,66.64c-3.53-6.114-10.051-9.878-17.111-9.878c-7.058,0-13.581,3.766-17.109,9.878
            l-36.696,63.561c-0.39,0.676-0.738,1.368-1.041,2.076c-4.558,8.78-6.96,18.592-6.96,28.517c0,34.151,27.784,61.934,61.934,61.934
            c34.15,0,61.934-27.784,61.934-61.934C461.193,148.389,457.539,136.447,450.62,126.195z M399.257,183.215
            c-12.364,0-22.421-10.059-22.421-22.421c0-3.908,0.971-7.606,2.883-10.991c0.259-0.458,0.498-0.925,0.718-1.397l18.69-32.373
            l17.652,30.575c0.279,0.483,0.578,0.955,0.897,1.412c2.618,3.76,4.003,8.178,4.003,12.773
            C421.679,173.156,411.621,183.215,399.257,183.215z"/>
          <path d="M276.034,172.285v-62.235c0-10.911-8.846-19.757-19.757-19.757h-39.493V39.513h182.473
            c10.911,0,19.757-8.846,19.757-19.757S410.168,0,399.257,0H150.286c-10.911,0-19.757,8.846-19.757,19.757
            s8.846,19.757,19.757,19.757h26.985v50.781h-39.492c-10.911,0-19.757,8.846-19.757,19.757v62.235
            c-38.288,7.72-67.211,41.614-67.211,82.143v173.776c0,46.207,37.593,83.798,83.8,83.798h124.834
            c46.208,0,83.8-37.592,83.8-83.798V254.427C343.244,213.899,314.322,180.005,276.034,172.285z M157.535,129.807h78.986v40.822
            h-78.986V129.807z M303.731,428.203c0,24.419-19.866,44.285-44.286,44.285H134.611c-24.42,0-44.286-19.866-44.286-44.285V254.427
            c0-24.419,19.866-44.285,44.286-44.285h3.168h118.499h3.168c24.42,0,44.286,19.866,44.286,44.285V428.203z"/>
        </g>
      </g>
    </g>
  </svg>
);

const PetitDejeunerIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <g>
      <g>
        <path d="M430.435,212.5H167.182c4.547-18.529,6.328-36.447,5.058-52.071c-2.166-26.665-13.091-45.558-30.76-53.198
          c-35.878-15.512-84.3,22.235-112.646,87.791c-0.744,1.717-1.455,3.463-2.163,5.209c-4.238,1.611-8.194,3.894-11.692,6.822
          C5.459,215.018,0,227.115,0,240.239v76.562c-0.002,9.555,2.803,18.352,7.911,25.48c-0.488,2.024-0.837,4.086-1.01,6.177
          c-1.027,12.387,3.691,24.798,12.945,34.055l57.272,57.271c8.437,8.438,19.323,13.084,30.651,13.084
          c3.095,0,6.133-0.36,9.084-1.024c7.627,6.837,17.849,10.786,28.971,10.786h76.567h164.543c7.776,0,14.472-5.489,15.997-13.114
          l14.777-73.887h12.727c44.975,0,81.565-36.59,81.565-81.565C512,249.088,475.411,212.5,430.435,212.5z M128.532,137.176
          c10.869,4.699,16.784,34.961,4.737,75.832l-70.983-12.703C84.616,153.648,115.753,131.657,128.532,137.176z M32.626,240.239
          c0-3.49,1.169-6.39,3.291-8.167c2.121-1.775,5.181-2.415,8.617-1.799l81.762,14.632L32.626,311.76V240.239z M116.065,415.392
          c-2.232,3.126-5.178,4.847-8.298,4.847c-2.651,0-5.273-1.220-7.581-3.528l-57.269-57.266c-2.495-2.495-3.739-5.439-3.502-8.289
          c0.236-2.848,1.947-5.546,4.816-7.594l109.604-78.23c3.166-2.259,7.383-3.504,11.877-3.504c5.896,0,11.563,2.149,15.161,5.747
          l11.178,11.178c3.893,3.893,5.862,9.794,5.76,15.567c-0.009,0.219-0.022,0.437-0.022,0.656c-0.178,3.928-1.313,7.762-3.493,10.816
          L116.065,415.392z M230.558,426.712c-1.777,2.124-4.677,3.292-8.167,3.292h-76.567c-0.033,0-0.063-0.004-0.096-0.004
          l70.965-99.425l15.666,87.522C232.973,421.53,232.335,424.59,230.558,426.712z M249.621,329.365
          c40.869-12.049,71.132-6.133,75.833,4.736c5.518,12.762-16.47,43.912-63.128,66.244L249.621,329.365z M388.368,355.971
          c-0.009,0.042-0.017,0.084-0.025,0.125l-14.782,73.908h-97.604c60.373-28.725,94.284-74.533,79.446-108.854
          c-7.642-17.668-26.534-28.592-53.198-30.759c-18.539-1.507-40.299,1.283-62.482,7.891c-2.685-4.145-5.934-8.001-9.683-11.437
          c-1.449-11.589-6.483-22.727-14.916-31.161l-10.559-10.559h205.973L388.368,355.971z M430.435,343.003h-6.202l19.223-96.104
          c20.683,5.716,35.918,24.688,35.918,47.165C479.374,321.048,457.422,343.003,430.435,343.003z"/>
      </g>
    </g>
    <g>
      <g>
        <path d="M267.963,119.399c-7.998-7.998-11.534-11.92-11.533-21.091c-0.001-9.17,3.536-13.093,11.536-21.089
          c6.372-6.37,6.374-16.698,0.004-23.07s-16.697-6.373-23.069-0.003c-8.905,8.901-21.098,21.091-21.096,44.163
          c-0.002,23.07,12.189,35.26,21.091,44.162c7.998,7.998,11.534,11.92,11.534,21.091c0,9.009,7.304,16.313,16.312,16.313
          c9.01,0,16.313-7.304,16.313-16.313C289.055,140.49,276.865,128.3,267.963,119.399z"/>
      </g>
    </g>
    <g>
      <g>
        <path d="M354.965,119.399c-7.997-7.998-11.533-11.92-11.533-21.091s3.537-13.093,11.537-21.089
          c6.372-6.37,6.374-16.698,0.004-23.070c-6.371-6.372-16.698-6.373-23.07-0.003c-8.905,8.901-21.096,21.091-21.096,44.163
          c-0.002,23.07,12.19,35.26,21.091,44.162c7.999,7.998,11.534,11.92,11.534,21.091c0,9.009,7.305,16.313,16.313,16.313
          c9.01,0,16.313-7.304,16.313-16.313C376.058,140.49,363.868,128.3,354.965,119.399z"/>
      </g>
    </g>
  </svg>
);

// service data for IBU-Bien être
const service_accordion = [
  {
    id: 1,
    icon: <CheckInOutIcon />,
    title: "Check-in, Check-out",
    desc: "Votre séjour commence à 17h00 pour le check-in et se termine à 10h30 pour le check-out, vous offrant ainsi un moment privilégié de détente et de ressourcement.",
  },
  {
    id: 2,
    icon: <BouteilleIcon />,
    title: "Bouteille de bienvenue",
    desc: "Savourez une bouteille de bulles belges dès votre arrivée, ou laissez-vous tenter par une alternative locale sans alcool pour bien démarrer votre séjour.",
  },
  {
    id: 3,
    icon: <SaunaIcon />,
    title: "Sauna",
    desc: "Profitez d'un sauna exclusif pour une expérience de détente profonde. La chaleur du sauna favorise l'élimination des toxines, améliore la circulation sanguine et procure une relaxation musculaire complète dans un environnement intime et serein.",
  },
  {
    id: 4,
    icon: <BainNordiqueIcon />,
    title: "Bain nordique extérieur",
    desc: "Découvrez notre bain nordique extérieur privatif, une expérience unique qui combine les bienfaits de l'eau chaude et de l'air frais dans l'intimité de votre espace. Cette pratique ancestrale stimule le système immunitaire, améliore la circulation et procure une sensation de bien-être profond.",
  },
  {
    id: 5,
    icon: <KitRelaxationIcon />,
    title: "Kit de relaxation",
    desc: "Recevez un kit de relaxation personnalisé comprenant des tisanes apaisantes, des huiles de massage naturelles et d'autres accessoires de bien-être. Chaque élément est soigneusement sélectionné pour vous accompagner dans votre voyage vers la sérénité.",
  },
  {
    id: 6,
    icon: <PetitDejeunerIcon />,
    title: "Petit déjeuner local",
    desc: "Savourez un petit déjeuner local préparé avec des produits frais et de saison.",
  },
];

// slider images
const slider_images = [slider_img_1, slider_img_2, slider_img_3, slider_img_4];


const ExperiencesMain = () => {
  const bienEtreRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Effet de scroll pour mobile sur les photos des formules
  useEffect(() => {
    const handleMobileScroll = () => {
      if (window.innerWidth >= 992) return; // PC seulement
      
      const bienEtreElement = bienEtreRef.current;
      const signatureElement = signatureRef.current;
      
      if (!bienEtreElement || !signatureElement) return;
      
      const bienEtreRect = bienEtreElement.getBoundingClientRect();
      const signatureRect = signatureElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Activer l'effet hover pour IBÙ Bien-être
      if (bienEtreRect.top < windowHeight * 0.8 && bienEtreRect.bottom > windowHeight * 0.2) {
        bienEtreElement.classList.add('mobile-hover-active');
      } else {
        bienEtreElement.classList.remove('mobile-hover-active');
      }
      
      // Activer l'effet hover pour IBÙ Signature
      if (signatureRect.top < windowHeight * 0.8 && signatureRect.bottom > windowHeight * 0.2) {
        signatureElement.classList.add('mobile-hover-active');
      } else {
        signatureElement.classList.remove('mobile-hover-active');
      }
    };

    window.addEventListener('scroll', handleMobileScroll);
    window.addEventListener('resize', handleMobileScroll);
    handleMobileScroll(); // Appel initial
    
    return () => {
      window.removeEventListener('scroll', handleMobileScroll);
      window.removeEventListener('resize', handleMobileScroll);
    };
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      imageRevealAnimation();
      hoverBtn();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper showBackToTop={false}>
      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      {/* header area start */}
      <HeaderVBU />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            
            {/* Section IBU Bien-être - Début */}
            
            {/* Titre IBU Bien-être avec sous-titre et liens */}
            <div id="ibu-bien-etre-titles" className="tp-project-details-3-top tp-project-details-3-ptb">
              <div className="container container-1560">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-title-box">
                      <h2 className="tp-section-title-160 mb-20 tp-char-animation" style={isMobile ? { fontSize: 'clamp(1.8rem, 7vw, 3.2rem)', whiteSpace: 'nowrap', lineHeight: '1.1' } : {}}>IBÙ Bien-être</h2>
                      <h3 className="tp-section-subtitle-3 tp-char-animation" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', fontWeight: '500', color: '#053725', marginTop: '10px', marginBottom: '80px' }}>Harmonie & Sérénité</h3>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-scroll smooth">
                      <a href="/experiences/ibu-bien-etre" className="pointer">
                        <span>
                          <ScrollDownTwo/>
                        </span>
                        DÉCOUVRIR IBÙ BIEN-ÊTRE
                      </a>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-link mt-30 text-start text-md-end">
                      <a href="/reservations">
                        Voir les différents logements
                        <span>
                          <UpArrowFour/>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Photo principale */}
            <div className="tp-project-details-3-full-width-thumb mb-120">
              <Image data-speed=".8" src={full_image} alt="IBÙ Bien-être Experience" style={{ height: 'auto' }}/>
            </div>
            
            {/* Section L'expérience IBU Bien-être */}
            <div className="showcase-details-2-area pb-120">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">L&apos;expérience IBÙ Bien-être</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3">
                    <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Une approche holistique
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-9">
                    <div className="showcase-details-2-content-right tp_title_anim">
                      <p className="pb-25">Niché au cœur de la nature, IBÙ Bien-Être vous invite à une parenthèse de sérénité dans un cocon intimiste. Laissez-vous envelopper par la chaleur des infrastructures privatives, prolongez ce moment avec un kit de relaxation aux notes apaisantes, puis réveillez vos sens avec un petit-déjeuner aux saveurs locales. Ici, chaque détail est pensé pour offrir un voyage sensoriel où détente et harmonie se rencontrent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deuxième photo */}
            <div id="xyz" className="tp-project-details-3-thumb mb-120">
              <div className="container container-1560">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-thumb-box">
                      <Image data-speed=".8" src={full_image_2} alt="IBÙ Bien-être Collection" style={{ height: 'auto' }}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section Ce que comprend IBU bien-être */}
            <div id="services-section" className="tp-service-2-area tp-service-2-pt pb-150 z-index-5" style={{ paddingBottom: '60px' }}>
              <div className="container container-1480">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="tp-service-2-title-box mb-70">
                      <span className="tp-section-subtitle-3" style={{
                        fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '80px',
                        lineHeight: '1.1',
                        whiteSpace: 'nowrap'
                      }}>
                        <span>
                          <Leaf />
                        </span>
                        CE QUE COMPREND IBÙ BIEN-ÊTRE (à pd de 250 €)
                      </span>
                      <h4 className="tp-section-title-40">
                        IBÙ Bien-être, vous invite à vivre un moment de détente profonde en pleine nature.
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-xxl-6 col-xl-4 col-lg-4">
                    <div className="text-center text-lg-start" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={shape} alt="IBÙ Bien-être" style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-8 col-lg-8">
                    <div className="tp-service-2-accordion-box" style={{ minHeight: 'auto', height: 'auto', overflow: 'visible' }}>
                      <div className="accordion" id="accordionExample" style={{ height: 'auto', overflow: 'visible' }}>
                        {service_accordion.map((s) => (
                          <div key={s.id} className="accordion-items" style={{ position: 'relative', zIndex: service_accordion.length - s.id }}>
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-buttons ${(s.id !== 1 || isMobile) ? "collapsed" : ""}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${s.id}`}
                                aria-expanded={s.id === 1 && !isMobile ? "true" : "false"}
                                aria-controls={`collapse-${s.id}`}
                              >
                                <span>
                                  {s.icon}
                                </span>
                                {s.title}
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div
                              id={`collapse-${s.id}`}
                              className={`accordion-collapse collapse ${s.id === 1 && !isMobile ? "show" : ""}`}
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>{s.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section IBU Bien-être - Fin */}
            
            {/* Section Les options */}
            <div className="showcase-details-2-area pb-120 pt-40">
              <div className="container">
                {/* Titre et sous-titre */}
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                        <h4 className="showcase-details-2-section-title tp-char-animation">Les options</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-left">
                        <span className="ab-inner-subtitle mb-25" style={{ whiteSpace: 'nowrap' }}>
                          <Leaf/>
                          Personnalisez votre séjour inoubliable
                        </span>
                    </div>
                  </div>
                </div>
                
                {/* Option 1: Visite de Chai */}
                <div className="row" style={{marginTop: '20px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Visite de Chai (30eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Découvrez les coulisses de la vinification au cœur du chai : fermentation, élevage en cuve ou en barrique, et secrets de production. Une immersion guidée, authentique et sensorielle pour comprendre le savoir-faire du domaine et apprécier les vins autrement.</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Pour réserver la visite du Chai, veuillez le préciser en commentaire lors de votre réservation. Le paiement s&apos;effectue directement sur place.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={visite_chai} alt="Visite de Chai" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>
                
                {/* Option 2: Plats Priche */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={plats_priche} alt="Plats Priche" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Dîner gourmet 3 services (120eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Offrez-vous une parenthèse sans aucun effort : un menu gourmet 3 services, de saison, imaginé par le chef <a href="https://www.priche.be/" target="_blank" rel="noopener noreferrer" style={{color: '#053725', textDecoration: 'underline'}}>@priche</a>.</p>
                        <p>Le dîner vous est livré juste avant votre arrivée. Il ne vous reste qu&apos;à réchauffer et savourer…</p>
                        <p>Une expérience culinaire intime, élégante et sans contraintes, directement dans votre cocon. Option végétarienne disponible</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Vin et soft disponible en option dans votre mini bar (Chardonnay, Pinot gris, Effervescent, Kult Kéfir)
                        </p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '5px',
                          lineHeight: '1.5'
                        }}>
                          * En cas d&apos;allergie, merci de le mentionner en commentaire lors de votre réservation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Option 3: Planche apéritif */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Planche apéritif dinatoire (40eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Une généreuse planche composée exclusivement de produits du terroir : assortiment de fromages locaux, charcuteries artisanales, tapenades maison et autres produits frais 100% belges.</p>
                        <p>Une sélection authentique et gourmande, parfaite pour accompagner un verre de vin et débuter votre expérience IBÙ en douceur.</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Vin et soft disponible en option dans votre mini bar (Chardonnay, Pinot gris, Effervescent, Kult Kéfir)
                        </p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '5px',
                          lineHeight: '1.5'
                        }}>
                          * En cas d&apos;allergie, merci de le mentionner en commentaire lors de votre réservation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_aperitif} alt="Planche apéritif" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>
                
                {/* Option 4: Départ tardif */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={depart_tardif} alt="Départ tardif" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Départ tardif - 13h30 (29eur)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Prolongez votre parenthèse bien-être et profitez encore de nos installations, que ce soit après une douce grasse matinée en toute intimité ou une promenade matinale dans les environs. L&apos;occasion idéale de savourer un peu plus longtemps votre expérience IBÙ après un bon petit-déjeuner.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section fusionnée : NOS COCONS */}
            <div className="showcase-details-2-area pb-120 pt-120">
              <div className="container">
                {/* Section NOS COCONS */}
                <div className="row">
                    <div className="col-xl-8">
                      <div className="showcase-details-2-section-box">
                          <h4 className="showcase-details-2-section-title tp-char-animation">NOS COCONS</h4>
                      </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-3">
                      <div className="showcase-details-2-section-left">
                          <span className="ab-inner-subtitle mb-25">
                            <Leaf/>
                            Immersion naturelle
                          </span>
                      </div>
                    </div>
                    <div className="col-xl-9">
                      <div className="showcase-details-2-content-right tp_title_anim">
                          <p>Conçus dans un esprit minimaliste et chaleureux, nos pods offrent une immersion totale dans la nature sans compromis sur le confort : lit double avec baie vitrée panoramique, douche design, et toilettes sèches de nouvelle génération.</p>
                          <p style={{marginBottom: '50px'}}>Pour prolonger l&apos;expérience, profitez d&apos;options bien-être en extérieur : sauna et bain nordique avec vue imprenable sur le domaine, en toute intimité.</p>
                      </div>
                    </div>
                </div>
                
                {/* Images des cocons - Version PC */}
                <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '40px'}}>
                    <div className="col-xl-3 col-lg-3">
                       <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                           <Image src={cocons_img_1} alt="cocons-img-1" style={{height:'auto'}}/>
                       </div>
                     </div>
                     <div className="col-xl-3 col-lg-3">
                       <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                           <Image src={cocons_img_2} alt="cocons-img-2" style={{height:'auto'}}/>
                       </div>
                     </div>
                     <div className="col-xl-3 col-lg-3">
                       <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                           <Image src={cocons_img_3} alt="cocons-img-3" style={{height:'auto'}}/>
                       </div>
                     </div>
                     <div className="col-xl-3 col-lg-3">
                       <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                           <Image src={cocons_img_4} alt="cocons-img-4" style={{height:'auto'}}/>
                       </div>
                     </div>
                </div>

                {/* Images des cocons - Version Mobile Carrousel */}
                <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '40px'}}>
                  <Swiper
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={20}
                    loop={true}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      bulletClass: 'swiper-pagination-bullet cocons-mobile-bullet',
                      bulletActiveClass: 'swiper-pagination-bullet-active cocons-mobile-bullet-active',
                    }}
                    modules={[Autoplay, Pagination]}
                    className="cocons-mobile-carousel"
                    style={{
                      padding: '0 20px 40px 20px'
                    }}
                  >
                    {[cocons_img_1, cocons_img_2, cocons_img_3, cocons_img_4].map((imgSrc, i) => (
                      <SwiperSlide key={i}>
                        <div className="cocons-mobile-item" style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Image 
                            src={imgSrc} 
                            alt="Nos Cocons IBÙ" 
                            style={{
                              width: '100%',
                              maxWidth: '350px',
                              height: '280px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                </div>
                
                {/* Icônes des cocons - Version PC */}
                <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '60px'}}>
                    <div className="col-xl-3 col-lg-3">
                      <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-20">
                              <LitDoubleIcon />
                          </div>
                          <h6 className="cocon-feature-title">Lit double</h6>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3">
                      <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-20">
                              <BathroomIcon />
                          </div>
                          <h6 className="cocon-feature-title">Salle de bain</h6>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3">
                      <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-20">
                              <KitchenetteIcon />
                          </div>
                          <h6 className="cocon-feature-title">Kitchenette</h6>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3">
                      <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-20">
                              <GardeRobeIcon />
                          </div>
                          <h6 className="cocon-feature-title">Garde robe</h6>
                      </div>
                    </div>
                </div>

                {/* Icônes des cocons - Version Mobile (2x2) */}
                <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '60px'}}>
                  <div className="row">
                    {/* Première ligne : Lit double + Salle de bain */}
                    <div className="col-6">
                      <div className="cocon-feature-item text-center">
                        <div className="cocon-icon-wrapper mb-15">
                          <LitDoubleIcon />
                        </div>
                        <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Lit double</h6>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="cocon-feature-item text-center">
                        <div className="cocon-icon-wrapper mb-15">
                          <BathroomIcon />
                        </div>
                        <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Salle de bain</h6>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row" style={{marginTop: '30px'}}>
                    {/* Deuxième ligne : Kitchenette + Garde robe */}
                    <div className="col-6">
                      <div className="cocon-feature-item text-center">
                        <div className="cocon-icon-wrapper mb-15">
                          <KitchenetteIcon />
                        </div>
                        <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Kitchenette</h6>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="cocon-feature-item text-center">
                        <div className="cocon-icon-wrapper mb-15">
                          <GardeRobeIcon />
                        </div>
                        <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Garde robe</h6>
                      </div>
                    </div>
                  </div>
                </div>
                    </div>
                  </div>
            {/* details title 5 */}

            {/* Bouton Lieux et Disponibilités */}
            <div className="tp-project-details-3-thumb pb-130">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-projct-5-2-btn-box d-flex justify-content-center">
                      <div className="tp-hover-btn-wrapper">
                        <a href="/reservations" className="tp-btn-circle style-2 tp-hover-btn-item tp-hover-btn not-hide-cursor" data-cursor="Lieux et Disponibilités">
                          <span className="tp-btn-circle-text">
                            Lieux et <br /> Disponibilités
                        </span>
                          <span className="tp-btn-circle-icon">
                            <UpArrow />
                            </span>
                          <i className="tp-btn-circle-dot"></i>
                        </a>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carrousel d'images */}
            <div className="pd-visual-slider-wrap pb-120">
              <Swiper
                slidesPerView={3}
                loop={true}
                autoplay={true}
                spaceBetween={20}
                speed={1000}
                breakpoints={{
                  '1400': {
                    slidesPerView: 3,
                  },
                  '1200': {
                    slidesPerView: 3,
                  },
                  '992': {
                    slidesPerView: 2,
                  },
                  '768': {
                    slidesPerView: 2,
                  },
                  '576': {
                    slidesPerView: 1,
                  },
                  '0': {
                    slidesPerView: 1,
                  },
                }}
                modules={[Autoplay]}
                className="swiper-container pd-visual-slider-active"
              >
                {slider_images.map((imgSrc, index) => (
                  <SwiperSlide key={index}>
                    <div className="pd-visual-slider-thumb fix">
                      <Image src={imgSrc} alt="IBÙ Experience Gallery" style={{height:"auto"}}/>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>


            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

      {/* Styles pour l'effet de scroll mobile sur les formules et pagination des cocons */}
      <style jsx>{`
        .tp-section-subtitle-3 {
          font-size: clamp(1.8rem, 4.5vw, 3rem) !important;
          font-weight: 500 !important;
          color: #053725 !important;
          margin-top: 10px !important;
          margin-bottom: 80px !important;
          line-height: 1.1 !important;
          white-space: nowrap !important;
        }
        
        @media (max-width: 991px) {
          .showcase-hover-container.mobile-hover-active .showcase-hover-text {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
          }
          
          .showcase-hover-container.mobile-hover-active .showcase-image-link::before {
            opacity: 0.8 !important;
          }
          
          #ibu-bien-etre-titles .tp-project-details-3-title-box .tp-section-title-160 {
            white-space: nowrap !important;
            font-size: clamp(1.5rem, 6vw, 2.8rem) !important;
            line-height: 1.1 !important;
            word-break: normal !important;
          }
          
          .tp-section-subtitle-3 {
            font-size: clamp(1.2rem, 3.5vw, 1.8rem) !important;
            white-space: nowrap !important;
            margin-top: 10px !important;
            margin-bottom: 80px !important;
            font-weight: 500 !important;
            color: #053725 !important;
            line-height: 1.1 !important;
          }
          
          .tp-project-details-3-thumb-box img {
            height: 60vh !important;
            object-fit: cover !important;
            object-position: center !important;
          }
          
          .showcase-details-2-area.pb-120 {
            padding-bottom: 40px !important;
          }
          
          .tp-project-details-3-thumb.mb-120 {
            margin-top: -20px !important;
            margin-bottom: 60px !important;
          }
          
          .tp-service-2-title-box.mb-70 {
            margin-bottom: 15px !important;
          }
          
          .tp-service-2-area .row.align-items-center {
            margin-top: -30px !important;
          }
          
          .tp-service-2-area.tp-service-2-pt.pb-150 {
            padding-bottom: 30px !important;
          }
          
          /* Réduction des espacements spécifiques sur mobile */
          .tp-project-details-3-full-width-thumb.mb-120 {
            margin-bottom: 40px !important;
          }
          
          .showcase-details-2-area.pb-120 {
            padding-bottom: 60px !important;
          }
          
          #xyz.tp-project-details-3-thumb.mb-120 {
            margin-bottom: 60px !important;
          }
          
          /* Styles pour les titres des options sur mobile */
          .visite-chai-title {
            font-size: clamp(1.5rem, 4vw, 2rem) !important;
            font-weight: 700 !important;
          }
        }
        
        .cocons-mobile-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .cocons-mobile-carousel .swiper-pagination-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default ExperiencesMain;
