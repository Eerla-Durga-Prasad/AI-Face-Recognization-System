"use client";

import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export interface FaceDetection {
  detection: faceapi.FaceDetection;
  descriptor: Float32Array;
  landmarks: faceapi.FaceLandmarks68;
}

export interface RecognitionResult {
  label: string;
  distance: number;
  confidence: number;
}

export function useFaceRecognition() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setError("Failed to load face recognition models");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  const detectFace = async (imageElement: HTMLImageElement | HTMLVideoElement): Promise<FaceDetection | null> => {
    if (!isModelLoaded) {
      setError("Models not loaded yet");
      return null;
    }

    try {
      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) return null;

      return {
        detection: detection.detection,
        descriptor: detection.descriptor,
        landmarks: detection.landmarks,
      };
    } catch (err) {
      console.error("Face detection error:", err);
      return null;
    }
  };

  const compareFaces = (
    descriptor1: Float32Array,
    descriptor2: Float32Array
  ): number => {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return distance;
  };

  const recognizeFace = async (
    descriptor: Float32Array,
    knownFaces: { name: string; descriptor: Float32Array }[]
  ): Promise<RecognitionResult | null> => {
    if (knownFaces.length === 0) return null;

    let bestMatch: RecognitionResult | null = null;
    let bestDistance = Infinity;

    for (const knownFace of knownFaces) {
      const distance = compareFaces(descriptor, knownFace.descriptor);
      if (distance < bestDistance) {
        bestDistance = distance;
        const confidence = Math.max(0, (1 - distance) * 100);
        bestMatch = {
          label: knownFace.name,
          distance,
          confidence,
        };
      }
    }

    const threshold = 0.6;
    if (bestMatch && bestMatch.distance < threshold) {
      return bestMatch;
    }

    return null;
  };

  const checkLiveness = async (
    videoElement: HTMLVideoElement
  ): Promise<{ isLive: boolean; blinkCount: number }> => {
    if (!isModelLoaded) return { isLive: false, blinkCount: 0 };

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (!detection) {
        return { isLive: false, blinkCount: 0 };
      }

      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();

      const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye);
      const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye);

      const isBlinking = leftEyeAspectRatio < 0.2 && rightEyeAspectRatio < 0.2;

      return {
        isLive: !isBlinking || leftEyeAspectRatio > 0.2,
        blinkCount: isBlinking ? 1 : 0,
      };
    } catch {
      return { isLive: false, blinkCount: 0 };
    }
  };

  return {
    isModelLoaded,
    loading,
    error,
    detectFace,
    recognizeFace,
    checkLiveness,
  };
}

function calculateEyeAspectRatio(eye: faceapi.Point[]): number {
  const verticalDist1 = Math.abs(eye[1].y - eye[5].y);
  const verticalDist2 = Math.abs(eye[2].y - eye[4].y);
  const horizontalDist = Math.abs(eye[0].x - eye[3].x);

  return (verticalDist1 + verticalDist2) / (2 * horizontalDist);
}
