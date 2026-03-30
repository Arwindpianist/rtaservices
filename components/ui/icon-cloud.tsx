'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Icon {
  x: number;
  y: number;
  z: number;
  id: number;
}

interface IconCloudProps {
  images?: string[];
  size?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ images, size = 420 }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    startTime: number;
    duration: number;
  } | null>(null);

  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) return;

    imagesLoadedRef.current = new Array(images.length).fill(false);
    const newIconCanvases = images.map((src, index) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
          offCtx.beginPath();
          offCtx.arc(20, 20, 20, 0, Math.PI * 2);
          offCtx.closePath();
          offCtx.clip();
          offCtx.drawImage(img, 0, 0, 40, 40);
          imagesLoadedRef.current[index] = true;
        };
      }

      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [images]);

  useEffect(() => {
    const total = images?.length || 0;
    if (!total) return;

    const nextIcons: Icon[] = [];
    const offset = 2 / total;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < total; i += 1) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      nextIcons.push({
        x: Math.cos(phi) * r * 100,
        y: y * 100,
        z: Math.sin(phi) * r * 100,
        id: i,
      });
    }

    setIconPositions(nextIcons);
  }, [images]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    rotationRef.current = {
      x: rotationRef.current.x + deltaY * 0.002,
      y: rotationRef.current.y + deltaX * 0.002,
    };
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || iconPositions.length === 0) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.003 + (distance / maxDistance) * 0.01;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const eased = easeOutCubic(progress);
        rotationRef.current = {
          x: targetRotation.startX + (targetRotation.x - targetRotation.startX) * eased,
          y: targetRotation.startY + (targetRotation.y - targetRotation.startY) * eased,
        };
        if (progress >= 1) setTargetRotation(null);
      } else if (!isDragging) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;
        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

        ctx.save();
        ctx.translate(canvas.width / 2 + rotatedX, canvas.height / 2 + rotatedY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (images && iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(iconCanvasesRef.current[index], -20, -20, 40, 40);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#1A3D6E';
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '14px sans-serif';
          ctx.fillText(`${icon.id + 1}`, 0, 0);
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [images, iconPositions, isDragging, mousePos, targetRotation]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="rounded-full"
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}

