import { siteConfig } from "@/config/site";
import { renderSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

export const alt = `${siteConfig.name}, ${siteConfig.roles[0]}`;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderSocialImage();
}
