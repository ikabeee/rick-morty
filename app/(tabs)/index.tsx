"use client"

import React, { useEffect, useState, useRef } from "react"
import { Image, StyleSheet, View, Dimensions, Animated, Text, TouchableOpacity } from "react-native"
import axios from "axios"
import { Card, Divider, Paragraph, Title } from "react-native-paper"
import { ThemedText } from "@/components/ThemedText"
import ParallaxScrollView from "@/components/ParallaxScrollView"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.5
const SPACING = 10

export default function HomeScreen() {
  const [characters, setCharacters] = useState<
    { id: number; name: string; status: string; species: string; image: string }[]
  >([])
  const scrollX = useRef(new Animated.Value(0)).current
  const [episodes, setEpisodes] = useState<{ id: number; name: string; episode: string; air_date: string }[]>([])

  const [page, setPage] = React.useState<number>(0)
  const [itemsPerPage] = React.useState(5)

  const from = page * itemsPerPage
  const to = Math.min((page + 1) * itemsPerPage, episodes.length)

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then((response) => {
        setCharacters(response.data.results)
      })
      .catch((error) => {
        console.error(error)
      })

    axios
      .get("https://rickandmortyapi.com/api/episode")
      .then((response) => {
        setEpisodes(response.data.results)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#97ce4c", dark: "#44281d" }}
      headerImage={<Image source={require("@/assets/images/rickMorty/mainImage.jpg")} style={styles.main} />}
    >
          <ThemedText style={styles.title}>Rick and Morty Wiki</ThemedText>
          <Text style={styles.text}>
            Rick and Morty is an animated science fiction sitcom about a mad scientist and his grandson who travel to
            other dimensions. The show premiered on Adult Swim in 2013.
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Characters</ThemedText>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              snapToInterval={CARD_WIDTH + SPACING * 2}
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
              scrollEventThrottle={16}
            >
              {characters.map((item, index) => {
                const inputRange = [
                  (index - 1) * (CARD_WIDTH + SPACING * 2),
                  index * (CARD_WIDTH + SPACING * 2),
                  (index + 1) * (CARD_WIDTH + SPACING * 2),
                ]
                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.9, 1, 0.9],
                  extrapolate: "clamp",
                })
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.7, 1, 0.7],
                  extrapolate: "clamp",
                })
                return (
                  <Animated.View key={item.id} style={[styles.cardContainer, { transform: [{ scale }], opacity }]}>
                    <Card style={styles.card}>
                      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
                      <Card.Content style={styles.cardContent}>
                        <Title style={styles.cardTitle}>{item.name}</Title>
                        <Paragraph style={styles.cardParagraph}>Status: {item.status}</Paragraph>
                        <Paragraph style={styles.cardParagraph}>Species: {item.species}</Paragraph>
                      </Card.Content>
                    </Card>
                  </Animated.View>
                )
              })}
            </Animated.ScrollView>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Episodes</ThemedText>
            <View style={styles.table}>
              {episodes.slice(from, to).map((episode) => (
                <View key={episode.id} style={styles.tableRow}>
                  <Text style={styles.episodeName}>{episode.name}</Text>
                  <Text style={styles.episodeDetails}>
                    {episode.episode} • {episode.air_date}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.pagination}>
              <TouchableOpacity onPress={() => setPage(page - 1)} disabled={page === 0}>
                <Text style={[styles.paginationText, page === 0 && styles.disabledText]}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageNumber}>{page + 1}</Text>
              <TouchableOpacity onPress={() => setPage(page + 1)} disabled={to >= episodes.length}>
                <Text style={[styles.paginationText, to >= episodes.length && styles.disabledText]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
    </ParallaxScrollView>
  )
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 1,
  },
  main: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: "left",
    color: "#fff",
    lineHeight: 24,
  },
  divider: {
    backgroundColor: "#fff",
    height: 2,
    marginVertical: 10,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  carouselContainer: {
    paddingLeft: (width - CARD_WIDTH) / 2,
    paddingRight: (width - CARD_WIDTH) / 2 - SPACING * 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 350,  // Establece un alto fijo para las tarjetas
    marginRight: SPACING,
    marginLeft: SPACING,
  },
  card: {
    borderRadius: 15,
    backgroundColor: "#44281d",
    height: '100%',  // Asegúrate de que la tarjeta ocupe todo el alto disponible
  },
  cardImage: {
    height: 200, // Fija el alto de la imagen
    width: '100%', // Asegúrate de que la imagen ocupe todo el ancho disponible
  },
  cardContent: {
    padding: 15,
    height: '50%',  // Ajusta la altura del contenido para que ocupe el espacio restante
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  cardParagraph: {
    color: "#fff",
    fontWeight: 'medium',
    marginBottom: 3,
  },
  table: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
  },
  tableRow: {
    marginBottom: 15,
  },
  episodeName: {
    color: "#97ce4c",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  episodeDetails: {
    color: "#fff",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationText: {
    fontSize: 16,
    color: "#97ce4c",
    paddingHorizontal: 10,
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  pageNumber: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 10,
  },
})


