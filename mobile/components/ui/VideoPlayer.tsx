import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/Theme";

interface VideoPlayerProps {
  videoUrl: string;
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const { width } = Dimensions.get("window");

export default function VideoPlayer({
  videoUrl,
  visible,
  onComplete,
  onClose,
}: VideoPlayerProps) {
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(true);

  const videoId = extractYouTubeId(videoUrl);

  const onStateChange = useCallback(
    (state: string) => {
      if (state === "ended") {
        setEnded(true);
        setPlaying(false);
        onComplete();
        onClose();
      }
    },
    [onComplete, onClose]
  );

  if (!videoId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.cream} />
          </TouchableOpacity>
          {ended && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.green} />
              <Text style={styles.completedText}>Tamamlandı</Text>
            </View>
          )}
        </View>

        {/* Video */}
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={width * (9 / 16)}
            width={width}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            webViewProps={{
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
          />
        </View>

        {/* Fallback button */}
        {!ended && (
          <TouchableOpacity
            onPress={() => {
              setEnded(true);
              setPlaying(false);
              onComplete();
              onClose();
            }}
            style={styles.fallbackBtn}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.gold} />
            <Text style={styles.fallbackText}>Videoyu İzledim</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.green + "20",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  completedText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.green,
    marginLeft: 4,
  },
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  fallbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold + "40",
  },
  fallbackText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.gold,
    marginLeft: 8,
  },
});
