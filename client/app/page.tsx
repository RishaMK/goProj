'use client'

import { useState } from 'react'
import { Upload, ArrowRight, Download } from 'lucide-react'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      if (res.ok) {
        setUploadStatus('File uploaded and chunked successfully.')
      } else {
        setUploadStatus(result.error || 'Upload failed.')
      }
    } catch (err) {
      console.log('Upload failed:', err)
      setUploadStatus('Upload failed due to network error.')
    }
  }

  const handleDownload = async () => {
    try {
      const res = await fetch('http://localhost:4000/merge')
      if (!res.ok) throw new Error('Failed to download merged file.')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged_file'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const features = [
    'File Chunking and Distribution',
    'Concurrency with Goroutines',
    'Node-based Architecture',
    'Efficient Retrieval',
    'Fault Tolerance',
    'Scalability',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Distributed File System
        </h1>
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Project Overview</h2>
            <p className="text-gray-300 mb-4">
              The Distributed File Storage System is a scalable and efficient platform designed to
              store, retrieve, and manage large files by distributing them across multiple nodes.
              This system leverages the principles of distributed computing to ensure reliability,
              fault tolerance, and high performance.
            </p>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Key Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <ArrowRight className="mr-2 h-4 w-4 text-blue-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">File Management</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">Upload File</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1 bg-gray-700 border border-gray-600 text-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center ${
                      !selectedFile && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </button>
                </div>
                {uploadStatus && (
                  <p className="mt-2 text-sm text-gray-400">{uploadStatus}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">Download Merged File</h3>
                <button
                  onClick={handleDownload}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" /> Get File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
