export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Registry', href: '#registry' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'FAQ', href: '#faq' },
];

export function smoothScrollTo(targetId: string, offset = 80) {
  const element = document.getElementById(targetId);
  
  if (element) {
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
