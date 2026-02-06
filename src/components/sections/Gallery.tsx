'use client';

import { useState } from 'react';
import { Box, Container, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { getWeddingConfig } from '@/lib/config';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GalleryLightbox } from '@/components/ui/GalleryLightbox';

export default function Gallery() {
  const config = getWeddingConfig();
  const { gallery } = config.content;
  const [selectedImage, setSelectedImage] = useState<{ src: string; index: number } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage({ src: image, index });
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setSelectedImage(null);
  };

  return (
    <Box id="gallery" as="section" py={{ base: 16, md: 24 }} bg="gray.100">
      <Container maxW="7xl">
        <SectionTitle color="primary.500" mb={16}>
          {gallery.title}
        </SectionTitle>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
          {gallery.images.map((image, index) => (
            <Box
              key={index}
              aspectRatio={1}
              cursor="pointer"
              overflow="hidden"
              borderRadius="2xl"
              boxShadow="md"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: 'xl',
                transform: 'scale(1.05)',
              }}
              onClick={() => handleImageClick(image, index)}
            >
              <Box
                w="full"
                h="full"
                bg="gray.300"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="gray.600"
                fontSize="lg"
              >
                Photo {index + 1}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      <GalleryLightbox
        isOpen={isOpen}
        onClose={handleClose}
        imageSrc={selectedImage?.src || null}
        imageIndex={selectedImage?.index || 0}
      />
    </Box>
  );
}
