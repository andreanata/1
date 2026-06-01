type SocialIconsProps = {
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  shareUrl?: string;
  shareText?: string;
};

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.544l-5.126-6.71L5.21 22H1.95l7.604-8.69L1.5 2h6.71l4.634 6.13L18.244 2Zm-1.148 18h1.803L7.228 3.894H5.294L17.096 20Z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5ZM17.2 6.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 22v-8.2h2.77l.41-3.2H13.5V8.56c0-.93.27-1.56 1.6-1.56h1.7V4.14c-.3-.04-1.3-.14-2.46-.14-2.43 0-4.1 1.48-4.1 4.22v2.37H7.5v3.2h2.74V22h3.26Z" />
    </svg>
  );
}

function TelegramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.83 11.83 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.12.56 4.2 1.62 6.04L0 24l6.15-1.61A11.9 11.9 0 0 0 12.04 24h.01C18.67 24 24 18.62 24 12c0-3.2-1.25-6.2-3.48-8.52ZM12.05 21.98h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.65.96.97-3.56-.24-.37A9.94 9.94 0 0 1 2.06 12c0-5.5 4.48-9.98 9.99-9.98 2.67 0 5.18 1.04 7.06 2.93A9.92 9.92 0 0 1 22 12c0 5.5-4.47 9.98-9.95 9.98Zm5.47-7.44c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.47a8.86 8.86 0 0 1-1.64-2.04c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.53.08-.8.38-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.06 2.88 1.2 3.08.15.2 2.1 3.21 5.1 4.5.71.31 1.26.49 1.69.62.71.22 1.36.19 1.87.11.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.943v5.663H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

// Auto-detect device to provide native app URL or fallback to web URL
const getDeviceLinks = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  return {
    whatsapp: 'https://wa.me/',
    telegram: isMobile ? 'tg://resolve?domain=integritypost' : 'https://t.me/integritypost',
    x: isMobile
      ? (isIOS ? 'twitter://user?screen_name=integritypost' : 'https://x.com/integritypost')
      : 'https://x.com/integritypost',
    instagram: isMobile
      ? (isAndroid ? 'intent://instagram.com/integritypost/#Intent;package=com.instagram.android;scheme=https;end'
          : 'instagram://user?username=integritypost')
      : 'https://instagram.com/integritypost',
    facebook: isMobile
      ? (isIOS ? 'fb://profile/integritypost' : 'https://m.facebook.com/integritypost')
      : 'https://facebook.com/integritypost',
  };
};

export default function SocialIcons({
  className = 'flex items-center gap-3',
  itemClassName = 'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
  iconClassName = 'w-4 h-4',
  shareUrl,
  shareText = 'Integrity Post - Tajam, Investigatif, & Terpercaya',
}: SocialIconsProps) {
  const links = getDeviceLinks();
  const currentUrl = encodeURIComponent(shareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://integritypost.id'));
  const currentText = encodeURIComponent(shareText);

  const socialItems = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${currentText}%20${currentUrl}`, Icon: WhatsAppIcon, hoverColor: 'hover:bg-[#25D366] hover:text-white' },
    { label: 'Telegram', href: `https://t.me/share/url?url=${currentUrl}&text=${currentText}`, Icon: TelegramIcon, hoverColor: 'hover:bg-[#0088cc] hover:text-white' },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentText}`, Icon: XIcon, hoverColor: 'hover:bg-black hover:text-white' },
    { label: 'Instagram', href: links.instagram, Icon: InstagramIcon, hoverColor: 'hover:bg-[#E4405F] hover:text-white' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, Icon: FacebookIcon, hoverColor: 'hover:bg-[#1877F2] hover:text-white' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`, Icon: LinkedInIcon, hoverColor: 'hover:bg-[#0A66C2] hover:text-white' },
  ];

  return (
    <div className={className}>
      {socialItems.map(({ label, href, Icon, hoverColor }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`${itemClassName} text-gray-400 transition-all duration-200 ${hoverColor}`}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
