"use client"

import { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const morphTime = 1.5
const cooldownTime = 0.5

function useMorphingText(
  texts: string[],
  onTextIndexChange?: (index: number) => void
) {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())
  const visualIndexRef = useRef(0)

  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)

  const setStyles = useCallback(
    (fraction: number) => {
      const current1 = text1Ref.current
      const current2 = text2Ref.current
      if (!current1 || !current2 || texts.length === 0) return

      current2.style.filter = `blur(${Math.min(2.5 / Math.max(fraction, 0.001) - 2.5, 100)}px)`
      current2.style.opacity = `${Math.pow(fraction, 0.55) * 100}%`

      const invertedFraction = 1 - fraction
      current1.style.filter = `blur(${Math.min(2.5 / Math.max(invertedFraction, 0.001) - 2.5, 100)}px)`
      current1.style.opacity = `${Math.pow(invertedFraction, 0.55) * 100}%`

      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]

      // Sync color with whichever phrase is visually dominant during morph.
      const dominantIndex =
        fraction >= 0.5
          ? (textIndexRef.current + 1) % texts.length
          : textIndexRef.current % texts.length
      if (dominantIndex !== visualIndexRef.current) {
        visualIndexRef.current = dominantIndex
        onTextIndexChange?.(dominantIndex)
      }
    },
    [onTextIndexChange, texts]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / morphTime

    if (fraction > 1) {
      cooldownRef.current = cooldownTime
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1) {
      textIndexRef.current++
    }
  }, [setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const current1 = text1Ref.current
    const current2 = text2Ref.current
    if (current1 && current2) {
      current2.style.filter = "none"
      current2.style.opacity = "100%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime

      cooldownRef.current -= dt

      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }

    animate()
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown])

  useEffect(() => {
    if (texts.length > 0) {
      visualIndexRef.current = 0
      onTextIndexChange?.(0)
    }
  }, [onTextIndexChange, texts.length])

  return { text1Ref, text2Ref }
}

function Texts({
  texts,
  textClassName,
  onTextIndexChange,
}: {
  texts: string[]
  textClassName?: string
  onTextIndexChange?: (index: number) => void
}) {
  const { text1Ref, text2Ref } = useMorphingText(texts, onTextIndexChange)
  return (
    <>
      <span className={cn("absolute inset-x-0 top-0 m-auto inline-block w-full", textClassName)} ref={text1Ref} />
      <span className={cn("absolute inset-x-0 top-0 m-auto inline-block w-full", textClassName)} ref={text2Ref} />
    </>
  )
}

interface MorphingTextProps {
  className?: string
  textClassName?: string
  texts: string[]
  onTextIndexChange?: (index: number) => void
  minHeightClassName?: string
}

export function MorphingText({
  texts,
  className,
  textClassName,
  onTextIndexChange,
  minHeightClassName = "min-h-[2.8em] md:min-h-[2.6em]",
}: MorphingTextProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full text-center leading-none font-bold",
        minHeightClassName,
        className
      )}
    >
      <Texts texts={texts} textClassName={textClassName} onTextIndexChange={onTextIndexChange} />
    </div>
  )
}

