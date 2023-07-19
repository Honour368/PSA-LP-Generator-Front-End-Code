// import "../styles/loading.css";
import React from "react";
import { Box, keyframes, usePrefersReducedMotion } from "@chakra-ui/react";

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation1 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot1} infinite 1s linear`;
  const animation2 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot2} infinite 1s linear`;
  const animation3 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot3} infinite 1s linear`;
  return (
    <Box>
      <Box style={styles.dot1} animation={animation1} />
      <Box style={styles.dot2} animation={animation2} />
      <Box style={styles.dot3} animation={animation3} />
    </Box>
  );
}

const keyframe_dot1 = keyframes`
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot2 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot3 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
`;

const styles = {
  dot1: {
    position: "relative",
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    backgroundColor: "#87CEFA",
    color: "blue",
    display: " inline-block",
    margin: "30% 2px 30% 50%"
  },
  dot2: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    backgroundColor: "#87CEFA",
    color: "blue",
    display: "inline-block",
    margin: "30% 2px"
  },

  dot3: {
    width: "20px",
    height: "20px",
    borderRadius: "10px",
    backgroundColor: "#87CEFA",
    display: "inline-block",
    margin: "30% 2px"
  }
};