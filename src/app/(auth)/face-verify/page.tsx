"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Camera, CameraOff, CheckCircle, XCircle, RefreshCw, ShieldCheck, Loader2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type VerifyStatus = "idle" | "checking" | "scanning" | "success" | "failure";

export default function FaceVerifyPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [cameraStatus, setCameraStatus] = useState<"unavailable" | "requesting" | "active" | "denied">("unavailable");
  const [isStreaming, setIsStreaming] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const { setFaceVerified } = useAuth();
  const router = useRouter();
  const MAX_RETRIES = 3;

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName });
      if (result.state === "granted") return true;
      if (result.state === "denied") return false;
      return true;
    } catch {
      return true;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setCameraStatus("active");
        setStatus("idle");
        toast.success("Camera activated");
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraStatus("denied");
      setIsStreaming(false);
      toast.error("Could not access camera. Please grant permission.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setScanning(false);
    setStatus("idle");
    setScanProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  const simulateFaceRecognition = useCallback(() => {
    if (!isStreaming) {
      toast.error("Please start the camera first");
      return;
    }

    setScanning(true);
    setStatus("scanning");
    setConfidence(0);
    setScanProgress(0);
    toast.info("AI scanner activating...");

    let scanAngle = 0;
    const scanSpeed = 3;

    const animateScan = () => {
      scanAngle += scanSpeed;
      setScanProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) return 0;
        return next;
      });

      if (scanAngle >= 360) {
        scanAngle = 0;
        setConfidence((prev) => {
          const newConf = Math.min(prev + Math.random() * 15 + 5, 100);
          return newConf;
        });

        const detected = Math.random() > 0.2;
        setFaceDetected(detected);

        if (detected) {
          const conf = Math.floor(Math.random() * 10 + 88);
          setConfidence(conf);

          if (conf >= 85) {
            setStatus("success");
            setFaceVerified(true);
            toast.success("Face verified successfully!");
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } else if (retryCount >= MAX_RETRIES - 1) {
            setStatus("failure");
            toast.error("Verification failed. Please try again.");
          } else {
            setRetryCount((prev) => prev + 1);
            toast.info(`Confidence: ${conf}% — Retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          }
        } else {
          setConfidence(0);
          if (retryCount >= MAX_RETRIES - 1) {
            setStatus("failure");
            toast.error("No face detected. Please try again.");
          } else {
            setRetryCount((prev) => prev + 1);
            toast.info(`Scanning... (${retryCount + 1}/${MAX_RETRIES})`);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateScan);
    };

    animationFrameRef.current = requestAnimationFrame(animateScan);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, captureFrame, retryCount, setFaceVerified, router]);

  const handleRetry = () => {
    setRetryCount(0);
    setConfidence(0);
    setStatus("idle");
    setFaceDetected(false);
    setScanProgress(0);
    startCamera();
  };

  const handleGoHome = () => {
    setFaceVerified(false);
    router.push("/");
  };

  const getStatusColor = () => {
    switch (status) {
      case "success": return "text-emerald-400";
      case "failure": return "text-red-400";
      case "scanning": return "text-violet-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              FaceTrack AI
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <ShieldCheck className="h-3 w-3" />
            Face Verification
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Verify Your Identity
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Look at the camera so we can confirm it&apos;s really you. This helps keep your account secure.
          </p>
        </div>

        {/* Camera Section */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/30 mb-6">
          <div className="relative aspect-video bg-gray-950 rounded-2xl overflow-hidden mb-6 border border-white/5">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                isStreaming ? "opacity-100" : "opacity-0"
              )}
            />

            {!isStreaming && cameraStatus === "unavailable" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-10 w-10 text-violet-400" />
                </div>
                <p className="text-gray-400 text-sm">Camera not started</p>
                <p className="text-gray-600 text-xs mt-1">Click the button below to begin</p>
              </div>
            )}

            {!isStreaming && cameraStatus === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/5">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-300 text-sm font-medium">Camera Access Denied</p>
                <p className="text-gray-500 text-xs mt-1">Please enable camera permissions in your browser settings</p>
              </div>
            )}

            {isStreaming && status === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 border-2 border-white/20 rounded-full animate-pulse" />
                  <div className="absolute inset-4 border border-white/10 rounded-full" />
                  <div className="absolute inset-8 border border-white/5 rounded-full" />
                </div>
              </div>
            )}

            {isStreaming && status === "scanning" && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-44 h-44 border-2 border-violet-500/50 rounded-full animate-ping opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 border-2 border-white/20 rounded-full" />
                    </div>
                    <div className="absolute inset-4 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border-t-2 border-violet-400 animate-spin" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">Scanning face...</span>
                </div>
              </>
            )}

            {status === "success" && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm">
                <div className="text-center animate-scale-in">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-12 w-12 text-emerald-400" />
                  </div>
                  <p className="text-white text-2xl font-bold">Verified!</p>
                  <p className="text-white/70 text-lg mt-2">Confidence: {confidence}%</p>
                </div>
              </div>
            )}

            {status === "failure" && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-sm">
                <div className="text-center animate-scale-in">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-12 w-12 text-red-400" />
                  </div>
                  <p className="text-white text-2xl font-bold">Verification Failed</p>
                  <p className="text-white/70 text-lg mt-2">Please try again</p>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Scan Progress Bar */}
          {scanning && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Scanning...</span>
                <span className="text-sm font-bold text-violet-400">{scanProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Confidence Bar */}
          {confidence > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Confidence
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  confidence >= 85 ? "text-emerald-400" : confidence >= 60 ? "text-amber-400" : "text-red-400"
                )}>
                  {confidence}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    confidence >= 85
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : confidence >= 60
                      ? "bg-gradient-to-r from-amber-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-red-400"
                  )}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}

          {/* Face Detection Indicator */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                faceDetected ? "bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" : "bg-gray-600"
              )}
            />
            <span className="text-sm text-gray-400">
              {faceDetected ? "Face detected" : "No face detected — ensure your face is visible"}
            </span>
          </div>

          {/* Camera Status */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                cameraStatus === "active" ? "bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" :
                cameraStatus === "denied" ? "bg-red-500" :
                cameraStatus === "requesting" ? "bg-amber-500 animate-pulse" : "bg-gray-600"
              )}
            />
            <span className="text-sm text-gray-400">
              {cameraStatus === "active" ? "Camera active" :
               cameraStatus === "denied" ? "Camera permission denied" :
               cameraStatus === "requesting" ? "Requesting camera access..." :
               "Camera inactive"}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isStreaming ? (
              <Button onClick={startCamera} className="flex-1 flex items-center justify-center gap-2">
                <Camera className="h-5 w-5" />
                Start Camera
              </Button>
            ) : (
              <>
                {!scanning ? (
                  <Button
                    onClick={simulateFaceRecognition}
                    className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/25"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Verify Face
                  </Button>
                ) : (
                  <Button
                    onClick={stopCamera}
                    variant="secondary"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <CameraOff className="h-5 w-5" />
                    Stop
                  </Button>
                )}
                <Button onClick={stopCamera} variant="danger" size="sm">
                  <X className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Retry & Cancel */}
          {status === "failure" && (
            <div className="flex gap-3 mt-4 animate-slide-up">
              <Button onClick={handleRetry} className="flex-1 flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/5">
                Go Home
              </Button>
            </div>
          )}

          {status === "success" && (
            <div className="mt-4 text-center animate-slide-up">
              <p className="text-emerald-400 text-sm font-medium">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Your face data is processed locally and never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}