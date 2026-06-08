"use client";

import { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import type { ImageMetadata } from "@/types/imageProvider";

const MotionBox = motion.create(Box);
const MotionImage = motion.create(Image);

interface DressCodeCategory {
  key: string;
  label: string;
  main: ImageMetadata | null;
  detailed: ImageMetadata | null;
}

interface DressCodeCarouselProps {
  images: ImageMetadata[];
}

function groupByCategory(images: ImageMetadata[]): DressCodeCategory[] {
  const map = new Map<string, DressCodeCategory>();

  for (const img of images) {
    const rawName = img.name?.toLowerCase().replace(/\.[^.]+$/, "") ?? "";
    const isDetailed = rawName.includes("detailed");
    const key = isDetailed
      ? rawName
        .replace(/[\s_-]?detailed[\s_-]?/g, "")
        .replace(/^[\s_-]+|[\s_-]+$/g, "")
        .trim() || rawName
      : rawName;

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        main: null,
        detailed: null,
      });
    }

    const cat = map.get(key)!;
    if (isDetailed) cat.detailed = img;
    else cat.main = img;
  }

  const ORDER = ["couple", "men", "women"];
  return Array.from(map.values()).sort((a, b) => {
    const ai = ORDER.indexOf(a.key);
    const bi = ORDER.indexOf(b.key);
    if (ai === -1 && bi === -1) return a.key.localeCompare(b.key);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function DressCodeCarousel({ images }: DressCodeCarouselProps) {
  const categories = groupByCategory(images);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxStartIdx, setLightboxStartIdx] = useState(0);

  if (categories.length === 0) return null;

  const active = categories[activeIdx];

  const selectCategory = (i: number) => {
    if (i === activeIdx) return;
    setDirection(i > activeIdx ? 1 : -1);
    setActiveIdx(i);
  };

  const openLightbox = (imgs: (ImageMetadata | null)[], startIdx = 0) => {
    const urls = imgs.filter(Boolean).map((img) => img!.url);
    setLightboxImages(urls);
    setLightboxStartIdx(startIdx);
    setLightboxOpen(true);
  };

  return (
    <Box w="full">
      {/* Main display area */}
      <Box mb={6}>
        {/* Badge in normal flow above the image */}
        <Box px={1} mb={3}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={active.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 } as never}
              display="inline-block"
              bg="whiteAlpha.900"
              backdropFilter="blur(6px)"
              px={4}
              py={1}
              borderRadius="full"
              boxShadow="sm"
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="primary.500"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                {active.label}
              </Text>
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Image card */}
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          bg="accent.50"
          boxShadow="lg"
          cursor="pointer"
          onClick={() => openLightbox([active.main], 0)}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <MotionBox
              key={activeIdx}
              custom={direction}
              initial={{ x: direction * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -60, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {active.main && (
                <MotionImage
                  src={active.main.url}
                  alt={active.label}
                  w="full"
                  h="auto"
                  maxH={{ base: "80vw", md: "600px" }}
                  objectFit="contain"
                  display="block"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: "easeOut" } as never}
                />
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Category thumbnails */}
      <Flex justify="center" gap={{ base: 3, md: 5 }} wrap="wrap">
        {categories.map((cat, i) => (
          <MotionBox
            key={cat.key}
            as="button"
            onClick={() => selectCategory(i)}
            textAlign="center"
            flex="1"
            minW="80px"
            maxW="160px"
            whileHover="hovered"
            initial="idle"
            animate="idle"
          >
            <MotionBox
              borderRadius="xl"
              overflow="hidden"
              boxShadow={i === activeIdx ? "md" : "sm"}
              mb={2}
              style={{
                border: "2px solid",
                borderColor:
                  i === activeIdx
                    ? "var(--chakra-colors-primary-400)"
                    : "transparent",
              }}
              variants={{
                idle: { scale: 1 },
                hovered: { scale: 1.06 },
              }}
              transition={{ duration: 0.2 } as never}
            >
              {cat.main ? (
                <Image
                  src={cat.main.url}
                  alt={cat.label}
                  w="full"
                  h={{ base: "80px", md: "110px" }}
                  objectFit="cover"
                />
              ) : (
                <Box h={{ base: "80px", md: "110px" }} bg="accent.100" />
              )}
            </MotionBox>
            <Text
              fontSize="xs"
              fontWeight={i === activeIdx ? "bold" : "medium"}
              color={i === activeIdx ? "primary.500" : "gray.500"}
              letterSpacing="widest"
              textTransform="uppercase"
              transition="color 0.2s"
            >
              {cat.label}
            </Text>
          </MotionBox>
        ))}
      </Flex>

      <GalleryLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxStartIdx}
      />
    </Box>
  );
}
