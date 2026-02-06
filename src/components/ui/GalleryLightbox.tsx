'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  imageIndex: number;
}

export function GalleryLightbox({ isOpen, onClose, imageSrc, imageIndex }: GalleryLightboxProps) {
  if (!imageSrc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalCloseButton
          color="white"
          fontSize="xl"
          top={-12}
          right={0}
          _hover={{ bg: 'whiteAlpha.200' }}
        />
        <ModalBody p={0}>
          <Box
            bg="gray.200"
            w="full"
            h="600px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            boxShadow="2xl"
          >
            Photo {imageIndex + 1}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
