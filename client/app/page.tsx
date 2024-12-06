'use client'

import { useState } from 'react'
import { Upload, Download, File, ArrowRight } from 'lucide-react'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }

  const features = [
    'File Chunking and Distribution',
    'Concurrency with Goroutines',
    'Node-based Architecture',
    'Efficient Retrieval',
    'Fault Tolerance',
    'Scalability'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Distributed File System
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Section: Project Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Project Overview</h2>
            <p className="text-gray-300 mb-4">
              The Distributed File Storage System is a scalable and efficient platform designed to store, retrieve, and manage large files by distributing them across multiple nodes. This system leverages the principles of distributed computing to ensure reliability, fault tolerance, and high performance.
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

          {/* Right Section: File Upload & Download */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">File Management</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">Upload Files</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1 bg-gray-700 border border-gray-600 text-gray-300 rounded px-3 py-2"
                  />
                  <button 
                    disabled={!selectedFile}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center ${!selectedFile && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">Downloaded Files</h3>
                <ul className="space-y-2">
                  {['File1.txt', 'File2.png', 'File3.pdf'].map((file, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-md"
                    >
                      <span className="flex items-center text-gray-300">
                        <File className="mr-2 h-4 w-4 text-purple-400" />
                        {file}
                      </span>
                      <button className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-3 py-1 rounded flex items-center text-sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

