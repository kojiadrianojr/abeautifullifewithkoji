"use client";

import { useState } from "react";
import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LuZoomIn } from "react-icons/lu";
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
  const [detailedHovered, setDetailedHovered] = useState(false);

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
      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        bg="pink.50"
        boxShadow="lg"
        mb={6}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <MotionBox
            key={activeIdx}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            position="relative"
          >
            {/* Main image with hover zoom */}
            {active.main && (
              <Box overflow="hidden" cursor="pointer">
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
                  onClick={() =>
                    openLightbox([active.main, active.detailed], 0)
                  }
                />
              </Box>
            )}

            {/* Detailed image — always-visible inset overlay with clear indicator */}
            {active.detailed && (
              <MotionBox
                position="absolute"
                top={4}
                right={4}
                borderRadius="xl"
                overflow="visible"
                cursor="pointer"
                animate={{
                  width: detailedHovered ? "44%" : "30%",
                }}
                transition={{ duration: 0.3, ease: "easeOut" } as never}
                style={{ maxWidth: "320px" }}
                onHoverStart={() => setDetailedHovered(true)}
                onHoverEnd={() => setDetailedHovered(false)}
                onClick={() =>
                  openLightbox([active.main, active.detailed], 1)
                }
              >
                {/* Pulsing ring to draw attention */}
                {!detailedHovered && (
                  <MotionBox
                    position="absolute"
                    inset="-4px"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="primary.300"
                    animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.03, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    } as never}
                    pointerEvents="none"
                    zIndex={2}
                  />
                )}

                {/* Image container */}
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="xl"
                  border="2px solid"
                  borderColor={detailedHovered ? "primary.400" : "primary.200"}
                  transition="border-color 0.2s"
                >
                  <MotionImage
                    src={active.detailed.url}
                    alt={`${active.label} detailed`}
                    w="full"
                    h="auto"
                    objectFit="contain"
                    display="block"
                    animate={{ scale: detailedHovered ? 1.04 : 1 }}
                    transition={{ duration: 0.3 } as never}
                  />
                </Box>

                {/* "Detail" badge pinned to top-left corner of overlay */}
                <Box
                  position="absolute"
                  bottom="-10px"
                  left="50%"
                  transform="translateX(-50%)"
                  bg="primary.400"
                  px={3}
                  py={0.5}
                  borderRadius="full"
                  boxShadow="md"
                  zIndex={3}
                  pointerEvents="none"
                >
                  <Text
                    fontSize="2xs"
                    color="white"
                    fontWeight="bold"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    whiteSpace="nowrap"
                  >
                    View Detail
                  </Text>
                </Box>
              </MotionBox>
            )}
          </MotionBox>
        </AnimatePresence>

        {/* Category label badge */}
        <Box
          position="absolute"
          top={4}
          left={4}
          bg="whiteAlpha.900"
          backdropFilter="blur(6px)"
          px={4}
          py={1}
          borderRadius="full"
          boxShadow="sm"
          zIndex={1}
          pointerEvents="none"
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
                <Box h={{ base: "80px", md: "110px" }} bg="pink.100" />
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
