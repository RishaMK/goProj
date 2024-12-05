// package file_chunks

// import (
// 	"fmt"
// 	"io"
// 	"os"
// 	"path/filepath"
// )

// func processFileIntoThreeChunks(file *os.File, filePath string, outputDir string) error {

// 	stat, err := file.Stat()
// 	if err != nil {
// 		return fmt.Errorf("failed to get file stats: %w", err)
// 	}
// 	fileSize := stat.Size()

// 	chunkSize := fileSize / 3
// 	remainingBytes := fileSize % 3

// 	for i := 0; i < 3; i++ {

// 		size := chunkSize
// 		if i == 2 {
// 			size += remainingBytes
// 		}

// 		buffer := make([]byte, size)

// 		offset := int64(i) * chunkSize
// 		if _, err := file.Seek(offset, 0); err != nil {
// 			return fmt.Errorf("failed to seek file: %w", err)
// 		}

// 		bytesRead, err := file.Read(buffer)
// 		if err != nil && err != io.EOF {
// 			return fmt.Errorf("failed to read chunk: %w", err)
// 		}

// 		chunkPath := filepath.Join(outputDir, fmt.Sprintf("chunk-%d", i))
// 		if err := os.WriteFile(chunkPath, buffer[:bytesRead], os.ModePerm); err != nil {
// 			return fmt.Errorf("failed to write chunk file: %w", err)
// 		}

// 		fmt.Printf("Chunk %d saved to %s\n", i, chunkPath)
// 	}
// 	return nil
// }

// func mergeChunksIntoFile(outputDir, outputFile string) error {

// 	outFile, err := os.Create(outputFile)
// 	if err != nil {
// 		return fmt.Errorf("failed to create output file: %w", err)
// 	}
// 	defer outFile.Close()

// 	for i := 0; i < 3; i++ {

// 		chunkPath := filepath.Join(outputDir, fmt.Sprintf("chunk-%d", i))
// 		chunkFile, err := os.Open(chunkPath)
// 		if err != nil {
// 			return fmt.Errorf("failed to open chunk file: %w", err)
// 		}
// 		defer chunkFile.Close()

// 		if _, err := io.Copy(outFile, chunkFile); err != nil {
// 			return fmt.Errorf("failed to write chunk content to output file: %w", err)
// 		}

// 		fmt.Printf("Chunk %d merged into %s\n", i, outputFile)
// 	}
// 	return nil
// }

// func file_chunk() {
// 	filePath := "cnlab.png"
// 	outputDir := "./chunks"
// 	mergedFile := "mergedfile.png"

// 	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
// 		fmt.Printf("Failed to create output directory: %v\n", err)
// 		return
// 	}

// 	file, err := os.Open(filePath)
// 	if err != nil {
// 		fmt.Printf("Failed to open file: %v\n", err)
// 		return
// 	}
// 	defer file.Close()

// 	fmt.Println("Splitting file into chunks...")
// 	if err := processFileIntoThreeChunks(file, filePath, outputDir); err != nil {
// 		fmt.Printf("Error during chunking: %v\n", err)
// 		return
// 	}

// 	fmt.Println("Merging chunks into file...")
// 	if err := mergeChunksIntoFile(outputDir, mergedFile); err != nil {
// 		fmt.Printf("Error during merging: %v\n", err)
// 		return
// 	}

// 	fmt.Println("File successfully split and merged!")
// }

package file_chunks

import (
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

// Function to process file into three chunks
func processFileIntoThreeChunks(filePath string, outputDir string) error {
	file, err := os.Open(filePath)
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

		fmt.Printf("Chunk %d saved to %s\n", i, chunkPath)
	}
	return nil
}

// Function to merge chunks into a single file
func mergeChunksIntoFile(outputDir, outputFile string) error {
	outFile, err := os.Create(outputFile)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
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

		fmt.Printf("Chunk %d merged into %s\n", i, outputFile)
	}
	return nil
}

// Main Fiber handler
func SetupRoutes(app *fiber.App) {
	outputDir := "./chunks"
	mergedFile := "mergedfile.png"

	// Endpoint to upload and chunk file
	app.Post("/upload", func(c *fiber.Ctx) error {
		// Retrieve file from form data
		fileHeader, err := c.FormFile("file")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "failed to retrieve file",
			})
		}

		// Save uploaded file temporarily
		uploadedFile := filepath.Join(outputDir, "uploaded_file")
		if err := c.SaveFile(fileHeader, uploadedFile); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to save uploaded file",
			})
		}

		// Create output directory
		if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to create output directory",
			})
		}

		// Process file into chunks
		if err := processFileIntoThreeChunks(uploadedFile, outputDir); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("failed to process file into chunks: %v", err),
			})
		}

		return c.JSON(fiber.Map{
			"message": "File successfully uploaded and split into chunks",
			"chunks":  []string{"chunk-0", "chunk-1", "chunk-2"},
		})
	})

	// Endpoint to merge chunks into a single file
	app.Get("/merge", func(c *fiber.Ctx) error {
		if err := mergeChunksIntoFile(outputDir, mergedFile); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("failed to merge chunks: %v", err),
			})
		}
		c.Response().Header.Add("Content-Type", "application/octet-stream")
		c.Response().Header.Add("Content-Disposition", fmt.Sprintf("attachment; filename=%s", mergedFile))

		return c.SendFile(mergedFile)
		// 	return c.JSON(fiber.Map{
		// 		"message":   "Chunks successfully merged",
		// 		"outputFile": mergedFile,
		// 	}
		// )
	})
}

// // Main function to start the Fiber app
// func main() {
// 	app := fiber.New()

// 	// Set up routes
// 	SetupRoutes(app)

// 	// Start the server
// 	fmt.Println("Server is running on http://localhost:3000")
// 	if err := app.Listen(":3000"); err != nil {
// 		fmt.Printf("Error starting server: %v\n", err)
// 	}
// }
