"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Upload, ArrowRight, Download, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [blobs, setBlobs] = useState<{ width: number; height: number; left: number; top: number; x: number; y: number; duration: number }[]>([])

  useEffect(() => {
    const newBlobs = [...Array(6)].map(() => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      x: Math.random() * 50 - 25,
      y: Math.random() * 50 - 25,
      duration: Math.random() * 10 + 10,
    }))
    setBlobs(newBlobs)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setUploadStatus(null)
    setUploadSuccess(false)
    setUploadProgress(0)
  }

  const simulateProgress = useCallback(() => {
    // Simulate progress for better UX
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadSuccess(false)
    setUploadStatus(null)

    const cleanup = simulateProgress()

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()
      if (res.ok) {
        setUploadProgress(100)
        setUploadSuccess(true)
        setUploadStatus("File uploaded and chunked successfully.")
      } else {
        setUploadStatus(result.error || "Upload failed.")
        setUploadSuccess(false)
      }
    } catch (err) {
      console.log("Upload failed:", err)
      setUploadStatus("Upload failed due to network error.")
      setUploadSuccess(false)
    } finally {
      setIsUploading(false)
      cleanup()
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const res = await fetch("http://localhost:4000/merge")
      if (!res.ok) throw new Error("Failed to download merged file.")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "merged_file"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const features = [
    "File Chunking and Distribution",
    "Concurrency with Goroutines",
    "Node-based Architecture",
    "Efficient Retrieval",
    "Fault Tolerance",
    "Scalability",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob, i) => (
  <motion.div
    key={i}
    className="absolute rounded-full bg-blue-500/10"
    style={{
      width: `${blob.width}px`,
      height: `${blob.height}px`,
      left: `${blob.left}%`,
      top: `${blob.top}%`,
    }}
    animate={{
      x: [0, blob.x],
      y: [0, blob.y],
    }}
    transition={{
      duration: blob.duration,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    }}
  />
))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-4xl font-bold mb-6 md:mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Distributed File System
            </span>
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6">
                  The Distributed File Storage System is a scalable and efficient platform designed to store, retrieve,
                  and manage large files by distributing them across multiple nodes. 
                </p>
                <h3 className="text-xl font-semibold text-purple-400 mb-3">Key Features:</h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-slate-300 bg-slate-700/40 rounded-lg p-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Badge variant="outline" className="mr-3 bg-blue-500/20 text-blue-300 border-blue-500/50">
                        <ArrowRight className="mr-1 h-3 w-3" />
                        {index + 1}
                      </Badge>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">File Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Upload and download files from the distributed system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-200">Upload File</h3>

                  <div className="relative">
                    <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:bg-slate-700/70 transition-colors"
                    >
                      {selectedFile ? (
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <p className="text-slate-200 font-medium">{selectedFile.name}</p>
                          <p className="text-slate-400 text-sm mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-300">Drag and drop or click to select a file</p>
                          <p className="text-slate-400 text-sm mt-1">Any file type supported</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="space-y-3">
                      {uploadProgress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Upload progress</span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      <Button
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload to Distributed System
                          </>
                        )}
                      </Button>

                      {uploadStatus && (
                        <div
                          className={`flex items-center p-3 rounded-lg ${
                            uploadSuccess ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {uploadSuccess ? (
                            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          )}
                          <p className="text-sm">{uploadStatus}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-slate-200">Download Merged File</h3>
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Retrieve Merged File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
