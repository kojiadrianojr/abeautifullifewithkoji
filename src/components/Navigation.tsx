'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useScrollTrigger,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Registry', href: '#registry' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetHeight;
        setShowNav(window.scrollY > heroBottom * 0.8);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    
    if (element) {
      const navHeight = 80;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {showNav && (
        <motion.div
          key="navigation"
          initial={{ y: -100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100 }}
        >
          <AppBar
            position="static"
        elevation={trigger ? 4 : 0}
        sx={{
          background: trigger 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
          backdropFilter: trigger ? 'blur(10px)' : 'blur(5px)',
          transition: 'all 0.3s ease',
          py: trigger ? 0.5 : 0,
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between', 
            px: { xs: 2, md: 4 },
            minHeight: trigger ? '64px !important' : '80px !important',
            transition: 'min-height 0.3s ease',
          }}
        >
          <Typography
            variant="h5"
            component="div"
            onClick={handleLogoClick}
            sx={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              color: trigger ? 'primary.main' : 'white',
              cursor: 'pointer',
              fontSize: trigger ? '1.5rem' : '1.75rem',
              textShadow: trigger ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
              '&:hover': {
                opacity: 0.8,
              },
              transition: 'all 0.3s ease',
            }}
          >
            K & B
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navItems.map((item) => {
                const sectionId = item.href.slice(1);
                const isActive = activeSection === sectionId;
                
                return (
                  <Button
                    key={item.href}
                    onClick={() => smoothScrollTo(sectionId)}
                    sx={{
                      color: trigger 
                        ? (isActive ? 'primary.main' : 'text.primary')
                        : (isActive ? 'white' : 'rgba(255, 255, 255, 0.9)'),
                      fontWeight: 600,
                      position: 'relative',
                      textShadow: trigger ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                      fontSize: trigger ? '0.875rem' : '1rem',
                      '&:hover': {
                        color: trigger ? 'primary.main' : 'white',
                        backgroundColor: trigger ? 'rgba(212, 102, 140, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '2px',
                        backgroundColor: trigger ? 'primary.main' : 'white',
                        borderRadius: '2px',
                      } : {},
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              sx={{
                color: trigger ? 'primary.main' : 'white',
                transition: 'color 0.3s ease',
              }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            pt: 8,
          },
        }}
      >
        <List>
          {navItems.map((item) => {
            const sectionId = item.href.slice(1);
            const isActive = activeSection === sectionId;
            
            return (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  onClick={() => smoothScrollTo(sectionId)}
                  selected={isActive}
                  sx={{
                    py: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
