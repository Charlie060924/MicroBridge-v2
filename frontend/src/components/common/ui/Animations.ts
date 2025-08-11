// Centralized animation presets for consistent micro-interactions
export const animations = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Card animations
  card: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Staggered children animations
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Button interactions
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Input focus
  input: {
    focus: { scale: 1.01 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Modal animations
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Loading spinner
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },

  // Fade in/out
  fade: {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0 },
      transition: { duration: 0.15, ease: "easeIn" }
    }
  },

  // Slide animations
  slide: {
    up: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    down: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    left: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    right: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Scale animations
  scale: {
    in: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.2, ease: "easeOut" }
    },
    out: {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 0, scale: 1.1 },
      transition: { duration: 0.15, ease: "easeIn" }
    }
  },

  // Notification animations
  notification: {
    in: {
      initial: { opacity: 0, x: 300, scale: 0.8 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.8 },
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Skeleton loading
  skeleton: {
    animate: {
      background: [
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
      ]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Common transition presets
export const transitions = {
  fast: { duration: 0.15, ease: "easeOut" },
  normal: { duration: 0.2, ease: "easeOut" },
  slow: { duration: 0.3, ease: "easeOut" },
  bounce: { duration: 0.2, ease: "easeInOut" }
};

// Easing functions
export const easing = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1]
};
