package file_chunks

import (
	// "archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// split the file into chunks
func ProcessFile(inputFilePath, outputDir string) error {

	file, err := os.Open(inputFilePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// file stats - contains metadata of the file -including file size
	stat, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to get file stats: %w", err)
	}
	fileSize := stat.Size()

	chunkSize := fileSize / 3
	remainingBytes := fileSize % 3

	//create output directory and all parent directories necessary for the output directory
	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	//create three chunks and store in chunks folder
	for i := 0; i < 3; i++ {
		size := chunkSize
		if i == 2 {
			size += remainingBytes
		}

		buffer := make([]byte, size)
		offset := int64(i) * chunkSize
		if _, err := file.Seek(offset, 0); err != nil {
			return fmt.Errorf("failed to seek file: %w", err)
		}

		bytesRead, err := file.Read(buffer)
		if err != nil && err != io.EOF {
			return fmt.Errorf("failed to read chunk: %w", err)
		}

		chunkPath := filepath.Join(outputDir, fmt.Sprintf("chunk-%d", i))
		if err := os.WriteFile(chunkPath, buffer[:bytesRead], os.ModePerm); err != nil {
			return fmt.Errorf("failed to write chunk file: %w", err)
		}
	}

	return nil
}

// combine the chunks
func MergeChunks(outputDir, mergedFile string) error {
	outFile, err := os.Create(mergedFile)
	if err != nil {
		return fmt.Errorf("failed to create merged file: %w", err)
	}
	defer outFile.Close()

	for i := 0; i < 3; i++ {
		chunkPath := filepath.Join(outputDir, fmt.Sprintf("chunk-%d", i))
		chunkFile, err := os.Open(chunkPath)
		if err != nil {
			return fmt.Errorf("failed to open chunk file: %w", err)
		}
		defer chunkFile.Close()

		//copy onto the output file by iterating through the chunks
		if _, err := io.Copy(outFile, chunkFile); err != nil {
			return fmt.Errorf("failed to write chunk content to output file: %w", err)
		}
	}

	return nil
}

// create a zip file to compress the data - currently not needed but may be useful in the future
// func CreateZip(sourceDir, zipFilePath string) error {
// 	zipFile, err := os.Create(zipFilePath)
// 	if err != nil {
// 		return fmt.Errorf("failed to create zip file: %w", err)
// 	}
// 	defer zipFile.Close()

// 	zipWriter := zip.NewWriter(zipFile)
// 	defer zipWriter.Close()

// 	files, err := os.ReadDir(sourceDir)
// 	if err != nil {
// 		return fmt.Errorf("failed to read source directory: %w", err)
// 	}

// 	for _, file := range files {
// 		if file.IsDir() {
// 			continue
// 		}

// 		filePath := filepath.Join(sourceDir, file.Name())
// 		fileInZip, err := zipWriter.Create(file.Name())
// 		if err != nil {
// 			return fmt.Errorf("failed to add file to zip: %w", err)
// 		}

// 		fileContent, err := os.ReadFile(filePath)
// 		if err != nil {
// 			return fmt.Errorf("failed to read file: %w", err)
// 		}

// 		if _, err := fileInZip.Write(fileContent); err != nil {
// 			return fmt.Errorf("failed to write file content to zip: %w", err)
// 		}
// 	}

// 	return nil
// }
