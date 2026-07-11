
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiYoutube,
  FiInstagram,
  FiTwitter,
  FiGlobe,
  FiLink
} from 'react-icons/fi';
import {
  FaTelegram,
  FaWhatsapp,
  FaFacebook,
  FaTiktok,
  FaDiscord,
  FaTwitch
} from 'react-icons/fa';

const iconMap = {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiYoutube,
  FiInstagram,
  FiTwitter,
  FiGlobe,
  FiLink,
  FaTelegram,
  FaWhatsapp,
  FaFacebook,
  FaTiktok,
  FaDiscord,
  FaTwitch
};

export const getIcon = (iconName) => {
  return iconMap[iconName] || FiLink;
};
