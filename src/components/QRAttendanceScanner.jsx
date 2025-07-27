import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { attendanceAPI } from '@/lib/api';

const QRAttendanceScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (data) => {
    if (data && !isProcessing) {
      setIsProcessing(true);
      
      try {
        const response = await attendanceAPI.markByQR(data);
        
        setLastScanResult({
          success: true,
          studentName: response.data.student_name,
          studentId: response.data.student_id,
          status: response.data.status,
          message: response.data.message
        });

        toast({
          title: "Attendance Marked",
          description: `${response.data.student_name} marked as ${response.data.status}`,
        });
        
        // Stop scanning after successful scan
        stopCamera();
        
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to mark attendance';
        
        setLastScanResult({
          success: false,
          message: message
        });

        toast({
          title: "Scan Error",
          description: message,
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleError = (error) => {
    console.error('QR Scanner error:', error);
    toast({
      title: "Scanner Error",
      description: "Error reading QR code. Please try again.",
      variant: "destructive"
    });
  };

  // Simple QR code detection (for demo purposes)
  const detectQRFromVideo = () => {
    if (!videoRef.current || !isScanning || isProcessing) return;

    // This is a simplified version - in production, you'd use a proper QR detection library
    // For demo, we'll simulate a scan after clicking the video
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    
    // Simulate QR detection with a demo QR code data
    // In real implementation, use libraries like qr-scanner or jsQR
  };

  const simulateQRScan = () => {
    // Demo QR codes for testing
    const demoQRCodes = [
      'student:1:STU000001',
      'student:2:STU000002',
      'student:3:STU000003'
    ];
    
    const randomQR = demoQRCodes[Math.floor(Math.random() * demoQRCodes.length)];
    handleScan(randomQR);
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR Code for Attendance
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Attendance Scanner</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {!isScanning ? (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the button below to start scanning QR codes for attendance
                </p>
                <Button onClick={startCamera} size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover rounded-lg bg-black"
                    onClick={detectQRFromVideo}
                  />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                  </div>
                  
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                  <Button onClick={simulateQRScan} variant="default" className="flex-1">
                    <QrCode className="mr-2 h-4 w-4" />
                    Demo Scan
                  </Button>
                </div>
                
                <p className="text-xs text-center text-muted-foreground">
                  Point the camera at a student's QR code to mark attendance
                </p>
              </div>
            )}
            
            {lastScanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Card className={lastScanResult.success ? 'border-green-200' : 'border-red-200'}>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      {lastScanResult.success ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <div className="flex-1">
                        {lastScanResult.success ? (
                          <div>
                            <p className="font-medium">{lastScanResult.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {lastScanResult.studentId}
                            </p>
                            <Badge variant="success" className="mt-1">
                              {lastScanResult.status}
                            </Badge>
                          </div>
                        ) : (
                          <p className="text-sm text-red-600">{lastScanResult.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRAttendanceScanner;