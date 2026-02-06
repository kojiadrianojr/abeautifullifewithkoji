'use client';

import { Card, CardBody, Text, Heading } from '@chakra-ui/react';

interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
}

export function TimelineCard({ year, title, description }: TimelineCardProps) {
  return (
    <Card
      boxShadow="md"
      transition="all 0.3s"
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-4px)',
      }}
      borderRadius="xl"
    >
      <CardBody>
        <Heading
          as="h3"
          size="2xl"
          fontWeight="bold"
          color="orange.500"
          mb={2}
        >
          {year}
        </Heading>
        <Heading
          as="h4"
          size="lg"
          fontWeight="semibold"
          mb={4}
          color="primary.500"
        >
          {title}
        </Heading>
        <Text color="gray.600" fontSize="md">
          {description}
        </Text>
      </CardBody>
    </Card>
  );
}
