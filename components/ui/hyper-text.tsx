"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type CharacterSet = string[] | readonly string[]

interface HyperTextProps {
  children: string
  className?: string
  duration?: number
  delay?: number
  startOnView?: boolean
  animateOnHover?: boolean
  characterSet?: CharacterSet
  stableCharacters?: boolean
}

const DEFAULT_CHARACTER_SET = Object.freeze("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) as readonly string[]

const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  stableCharacters = false,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() => children.split(""))
  const [isAnimating, setIsAnimating] = useState(false)
  const iterationCount = useRef(0)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setDisplayText(children.split(""))
    iterationCount.current = 0
    setIsAnimating(true)
  }, [children])

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0
      setIsAnimating(true)
    }
  }

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = window.setTimeout(() => {
        setIsAnimating(true)
      }, delay)
      return () => window.clearTimeout(startTimeout)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => {
            setIsAnimating(true)
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    )

    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [delay, startOnView])

  useEffect(() => {
    let animationFrameId: number | null = null

    if (isAnimating) {
      const maxIterations = children.length
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        iterationCount.current = progress * maxIterations

        setDisplayText((currentText) =>
          currentText.map((letter, index) =>
            letter === " " || letter === "\n"
              ? letter
              : index <= iterationCount.current
                ? children[index]
                : characterSet[getRandomInt(characterSet.length)]
          )
        )

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
    }
  }, [children, duration, isAnimating, characterSet])

  return (
    <div
      ref={elementRef}
      className={cn("relative overflow-hidden py-2 font-bold", className)}
      onMouseEnter={handleAnimationTrigger}
    >
      {stableCharacters && (
        <span aria-hidden="true" className="invisible block select-none whitespace-pre-line">
          {children}
        </span>
      )}
      <span className={cn(stableCharacters ? "absolute inset-0 block whitespace-pre-line" : "block")}>
        {displayText.map((letter, index) => {
          if (letter === "\n") return <br key={`break-${index}`} />
          return (
            <span key={`char-${index}`} className={cn("font-inherit", letter === " " ? "w-3 inline-block" : "")}>
              {letter}
            </span>
          )
        })}
      </span>
    </div>
  )
}

