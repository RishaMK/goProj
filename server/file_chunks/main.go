package file_chunks

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func ProcessFile(inputFilePath, outputDir string) error {

	file, err := os.Open(inputFilePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to get file stats: %w", err)
	}
	fileSize := stat.Size()

	chunkSize := fileSize / 3
	remainingBytes := fileSize % 3

	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

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

		if _, err := io.Copy(outFile, chunkFile); err != nil {
			return fmt.Errorf("failed to write chunk content to output file: %w", err)
		}
	}

	return nil
}