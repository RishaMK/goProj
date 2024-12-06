package main

import (
	"path/filepath"

	"github.com/RishaMK/goproj/file_chunks"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	outputDir := "./file_chunks/chunks"
	mergedFile := "./file_chunks/output_file/merged_file"

	// API ROUTE: accept data from user and break it into chunks
	app.Post("/upload", func(c *fiber.Ctx) error {
		// Retrieve file from form data
		fileHeader, err := c.FormFile("file")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to retrieve file",
			})
		}

		inputFilePath := filepath.Join("./file_chunks/input_file", "uploaded_file")
		if err := c.SaveFile(fileHeader, inputFilePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to save uploaded file",
			})
		}

		// call function to break it into chunks
		if err := file_chunks.ProcessFile(inputFilePath, outputDir); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to process file into chunks",
			})
		}

		// zipFilePath := filepath.Join(outputDir, "chunks.zip")
		// if err := file_chunks.CreateZip(outputDir, zipFilePath); err != nil {
		// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		// 		"error": "Failed to create ZIP file",
		// 	})
		// }

		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "File successfully processed into chunks",
		})
	})

	// API ROUTE: merge the chunks and return to user
	app.Get("/merge", func(c *fiber.Ctx) error {

		if err := file_chunks.MergeChunks(outputDir, mergedFile); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to merge chunks",
			})
		}

		// send the merged file to user
		return c.SendFile(mergedFile)
	})

	app.Listen(":3000")
}
