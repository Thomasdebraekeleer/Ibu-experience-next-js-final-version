'use client';
import dynamic from "next/dynamic";

const ThemeSetting = () => null;

export default dynamic(() => Promise.resolve(ThemeSetting), {
  ssr: false
})
