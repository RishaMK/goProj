package main

import (
	"path/filepath"

	"github.com/RishaMK/goproj/file_chunks"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New())

	outputDir := "./file_chunks/chunks"
	mergedFile := "./file_chunks/output_file/merged_file"

	app.Post("/upload", func(c *fiber.Ctx) error {
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

		if err := file_chunks.ProcessFile(inputFilePath, outputDir); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to process file into chunks",
			})
		}

		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "File successfully processed into chunks",
		})
	})

	app.Get("/merge", func(c *fiber.Ctx) error {
		if err := file_chunks.MergeChunks(outputDir, mergedFile); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to merge chunks",
			})
		}

		return c.Download(mergedFile)
	})

	app.Listen(":4000")
}
