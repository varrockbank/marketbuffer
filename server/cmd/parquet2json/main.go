package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/parquet-go/parquet-go"
)

type StockRecord struct {
	Ticker     string  `parquet:"ticker" json:"ticker"`
	DateKey    int32   `parquet:"date_key" json:"date_key"`
	StockOpen  float64 `parquet:"stock_open" json:"stock_open"`
	StockHigh  float64 `parquet:"stock_high" json:"stock_high"`
	StockLow   float64 `parquet:"stock_low" json:"stock_low"`
	StockClose float64 `parquet:"stock_close" json:"stock_close"`
	Volume     int64   `parquet:"volume" json:"volume"`
}

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: parquet2json <input-dir> <output-file>")
		os.Exit(1)
	}

	inputDir := os.Args[1]
	outputFile := os.Args[2]

	var allRecords []StockRecord

	entries, err := os.ReadDir(inputDir)
	if err != nil {
		log.Fatalf("Failed to read input directory: %v", err)
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".parquet") {
			continue
		}

		filePath := filepath.Join(inputDir, entry.Name())
		log.Printf("Reading: %s", filePath)

		file, err := os.Open(filePath)
		if err != nil {
			log.Fatalf("Failed to open file: %v", err)
		}

		reader := parquet.NewGenericReader[StockRecord](file)
		records := make([]StockRecord, reader.NumRows())
		n, err := reader.Read(records)
		if err != nil && err != io.EOF {
			log.Fatalf("Failed to read records: %v", err)
		}

		allRecords = append(allRecords, records[:n]...)
		log.Printf("Read %d records", n)

		reader.Close()
		file.Close()
	}

	log.Printf("Total records: %d", len(allRecords))

	output, err := os.Create(outputFile)
	if err != nil {
		log.Fatalf("Failed to create output file: %v", err)
	}
	defer output.Close()

	encoder := json.NewEncoder(output)
	if err := encoder.Encode(allRecords); err != nil {
		log.Fatalf("Failed to encode JSON: %v", err)
	}

	log.Printf("Wrote to: %s", outputFile)
}
