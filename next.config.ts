import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://m.media-amazon.com/**"),
      new URL("https://ae-pic-a1.aliexpress-media.com/**"),
      new URL("https://http2.mlstatic.com/**"),
      new URL("https://vasorama.com.br/**"),
      new URL("https://static.estantevirtual.com.br/**"),
      new URL("https://basico.com/**"),
      new URL("https://product-data.raiadrogasil.io/**"),
      new URL("https://images.tcdn.com.br/**"),
      new URL("https://img.ltwebstatic.com/**"),
      new URL("https://zaffari.vtexassets.com/**"),
      new URL("https://images.unsplash.com/**"),
      // new URL("/**"),
    ]
  }
};

export default nextConfig;
