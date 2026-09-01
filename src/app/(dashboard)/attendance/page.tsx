"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Camera,
  CameraOff,
  UserCheck,
  UserX,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Download,
  Video,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recognizedStudents, setRecognizedStudents] = useState<
    Array<{ name: string; rollNumber: string; confidence: number; status: string }>
  >([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentClass, setCurrentClass] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        toast.success("Camera started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setScanning(false);
      toast.info("Camera stopped");
    }
  };

  const startScanning = () => {
    if (!isStreaming) {
      toast.error("Please start the camera first");
      return;
    }
    setScanning(true);
    toast.info("Scanning for faces...");

    const interval = setInterval(() => {
      const mockStudents = [
        { name: "John Doe", rollNumber: "CS2024001", confidence: 0.95, status: "present" },
        { name: "Jane Smith", rollNumber: "CS2024002", confidence: 0.92, status: "present" },
        { name: "Bob Johnson", rollNumber: "CS2024003", confidence: 0.89, status: "present" },
      ];
      const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];

      setRecognizedStudents((prev) => {
        const exists = prev.find((s) => s.rollNumber === randomStudent.rollNumber);
        if (!exists) {
          toast.success(`${randomStudent.name} — Attendance Marked ✅`);
          return [...prev, randomStudent];
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  };

  const stopScanning = () => {
    setScanning(false);
    toast.info("Scanning stopped");
  };

  const exportAttendance = () => {
    const csv = [
      "Name,Roll Number,Status,Confidence",
      ...recognizedStudents.map(
        (s) => `${s.name},${s.rollNumber},${s.status},${(s.confidence * 100).toFixed(1)}%`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Attendance exported");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance Scanner</h1>
        <p className="text-gray-400 mt-1">
          Start the camera to scan and mark attendance automatically
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isStreaming ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`} />
                <span className="text-sm font-medium text-gray-300">
                  {isStreaming ? "Camera Active" : "Camera Offline"}
                </span>
              </div>
              {scanning && (
                <Badge variant="info" className="bg-violet-500/10 text-violet-300 border-violet-500/20">
                  Scanning...
                </Badge>
              )}
            </div>

            <div className="relative aspect-video bg-gray-950 rounded-2xl overflow-hidden border border-white/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isStreaming ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Video className="h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">Camera not started</p>
                </div>
              )}
              {isStreaming && !scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-violet-500/30 rounded-full animate-pulse" />
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center gap-3 mt-4">
              {!isStreaming ? (
                <Button onClick={startCamera} className="flex-1 flex items-center justify-center gap-2">
                  <Camera className="h-5 w-5" />
                  Start Camera
                </Button>
              ) : (
                <>
                  {!scanning ? (
                    <Button onClick={startScanning} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <UserCheck className="h-5 w-5" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                      <UserX className="h-5 w-5" />
                      Stop Scanning
                    </Button>
                  )}
                  <Button onClick={stopCamera} variant="danger">
                    <CameraOff className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4">Session Details</h3>
            <div className="space-y-4">
              <Input label="Subject" placeholder="e.g., Data Structures" value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} />
              <Input label="Class" placeholder="e.g., CSE A, AIML B" value={currentClass} onChange={(e) => setCurrentClass(e.target.value)} />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-2xl font-bold text-violet-400">{recognizedStudents.length}</p>
                  <p className="text-xs text-gray-500">Scanned</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-400">
                    {recognizedStudents.filter((s) => s.status === "present").length}
                  </p>
                  <p className="text-xs text-gray-500">Present</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
                  <p className="text-2xl font-bold text-gray-400">
                    {recognizedStudents.filter((s) => s.status === "absent").length}
                  </p>
                  <p className="text-xs text-gray-500">Absent</p>
                </div>
              </div>
              <Button onClick={exportAttendance} variant="outline" className="w-full border-white/10 text-gray-300 hover:text-white" disabled={recognizedStudents.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4">Recent Scans</h3>
            <div className="space-y-3">
              {recognizedStudents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No students scanned yet</p>
              ) : (
                recognizedStudents.slice(-5).reverse().map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="font-medium text-sm text-white">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto" />
                      <span className="text-xs text-gray-500">{(student.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}