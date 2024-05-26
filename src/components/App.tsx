import { Box, Container, Group, MantineProvider, Stack } from '@mantine/core';
import React, { lazy } from 'react';

import { initIcons } from '../modules/helpers';

import '@mantine/core/styles.css';

const BackgroundImage = lazy(() => import('./BackgroundImage'));
const Clock = lazy(() => import('./Clock'));
const ContentPopup = lazy(() => import('./ContentPopup'));
const Quote = lazy(() => import('./Quote'));
const TitleAndLinks = lazy(() => import('./TitleAndLinks'));
const Weather = lazy(() => import('./Weather'));

initIcons();

export const App = () => (
  <>
    <MantineProvider defaultColorScheme="auto">
      <Stack w="100%" h="100vh" gap="md">
        <Group align="start" ta="start" w="100%" grow>
          <Box p="xs">
            <TitleAndLinks />
          </Box>
          <Box p="xs" ta="right" style={{ justifyContent: 'right' }}>
            <Weather />
          </Box>
        </Group>
        <Group justify="center" h="100%" align="normal">
          <Container fluid>
            <Clock />
            <Quote />
          </Container>
        </Group>
        <Group justify="center" align="end">
          <Container size="xl">
            <BackgroundImage />
          </Container>
          <Container size="xl">
            <Group gap="sm">
              <ContentPopup contentType="github" />
              <ContentPopup contentType="devTo" />
              <ContentPopup contentType="hackerNews" />
              <ContentPopup contentType="productHunt" />
              <ContentPopup contentType="reddit" />
            </Group>
          </Container>
        </Group>
      </Stack>
    </MantineProvider>
  </>
);

export default App;
