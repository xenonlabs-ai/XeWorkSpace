"use client"

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import defaultConfig from "./default-config"

// Create the context
const ThemeContext = createContext({
  layout: defaultConfig.defaultLayout,
  setLayout: (layout: string) => {},
  direction: defaultConfig.defaultDirection,
  setDirection: (direction: string) => {},
  config: defaultConfig,
})

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext)

// Custom hook that combines theme context with next-themes
export const useTheme = () => {
  const nextTheme = useNextTheme()
  const themeContext = useThemeContext()

  return {
    ...nextTheme,
    ...themeContext,
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Layout and direction state
  const [layout, setLayout] = useState(defaultConfig.defaultLayout)
  const [direction, setDirection] = useState(defaultConfig.defaultDirection)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Load saved preferences from localStorage if available
    try {
      const savedLayout = localStorage.getItem("layout")
      const savedDirection = localStorage.getItem("direction")

      if (savedLayout && defaultConfig.availableLayouts.includes(savedLayout)) {
        setLayout(savedLayout)
      }

      if (savedDirection && defaultConfig.availableDirections.includes(savedDirection)) {
        setDirection(savedDirection)
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error)
    }
  }, [])

  // Handle layout change
  const handleLayoutChange = (newLayout: string) => {
    if (newLayout !== layout) {
      setLayout(newLayout)
    }
  }

  // Handle direction change
  const handleDirectionChange = (newDirection: string) => {
    if (newDirection !== direction) {
      setDirection(newDirection)
    }
  }

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("layout", layout)
        localStorage.setItem("direction", direction)

        // Apply direction to html element
        document.documentElement.dir = direction
      } catch (error) {
        console.error("Error saving theme preferences:", error)
      }
    }
  }, [layout, direction, mounted])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      layout,
      setLayout: handleLayoutChange,
      direction,
      setDirection: handleDirectionChange,
      config: defaultConfig,
    }),
    [layout, direction],
  )

  // If not mounted yet, return null to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={defaultConfig.themeOptions.defaultTheme}
        enableSystem={defaultConfig.themeOptions.enableSystem}
        disableTransitionOnChange={defaultConfig.themeOptions.disableTransitionOnChange}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}
